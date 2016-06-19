/// <reference path="../../../../../TypeScriptDefs/d3/d3.d.ts" />
/// <reference path="../app.ts" />

module HadithHouse.Directives {
  import IScope = angular.IScope;
  import IAugmentedJQuery = angular.IAugmentedJQuery;
  import IAttributes = angular.IAttributes;

  export interface ITreeNode extends d3.layout.tree.Node {
    id: string;
    name: string;
    _children: ITreeNode[];
    children?: ITreeNode[];
    x0?: number;
    y0?: number;
  }

  class Tree {
    public margin:any;
    public width:number;
    public height:number;
    public root:ITreeNode;
    public tree:d3.layout.Tree<ITreeNode>;
    public diagonal:d3.svg.Diagonal<d3.svg.diagonal.Link<ITreeNode>, ITreeNode>;
    public svg:d3.Selection<any>;
    public duration:number;
    private _currentId:number = 0;


    constructor(elem:any, width:number, height:number) {
      this.margin = {top: 50, right: 50, bottom: 50, left: 150};
      this.width = width - this.margin.right - this.margin.left;
      this.height = height - this.margin.top - this.margin.bottom;
      this.duration = 750;

      this.tree = d3.layout.tree<ITreeNode>().size([this.height, this.width]);

      this.diagonal = d3.svg.diagonal<ITreeNode>().projection((node) => {
        return [node.y, node.x];
      });

      this.svg = d3.select(elem).append('svg')
        .attr('width', this.width + this.margin.right + this.margin.left)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

      d3.select(self.frameElement).style('height', '800px');
    }

    public setRoot(root:ITreeNode) {
      this.root = root;
      this.root.x0 = this.height / 2;
      this.root.y0 = 0;

      function removeIdField(node) {
        delete node.id;
        if (node.children) {
          node.children.forEach(removeIdField);
        }
      }

      function collapse(node) {
        if (node.children) {
          node._children = node.children;
          node._children.forEach(collapse);
          node.children = null;
        }
      }

      // Remove the id field from the tree entities as it is set by the tree directive.
      removeIdField(this.root);

      // Collapse all nodes after the first level.
      this.root.children.forEach(collapse);

      this.update(this.root);
    }

    /**
     * Called when a node is clicked.
     * @param node The node which was clicked.
     */
    public onClick(node:ITreeNode) {
      if (node.children) {
        // Collapse children
        node._children = node.children;
        node.children = null;
      } else {
        // Expand children
        node.children = node._children;
        node._children = null;
      }
      this.update(node);
    }

    /**
     * Generates a unique ID.
     * @returns {number} The unique ID.
     */
    public getUniqueId() {
      return ++this._currentId;
    }

    public update(source:ITreeNode) {
      // Compute the new tree layout.
      let nodes = this.tree.nodes(this.root).reverse(),
        links = this.tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(function (node) {
        node.y = node.depth * 180;
      });

      // Update the nodes.
      let node = this.svg.selectAll('g.tree_node')
        .data<ITreeNode>(nodes, (n) => {
          return n.id || (n.id = this.getUniqueId().toString());
        });

      // Enter any new nodes at the parent's previous position.
      let nodeEnter = node.enter().append('g')
        .attr('class', 'tree_node')
        .attr('transform', function () {
          return 'translate(' + source.y0 + ',' + source.x0 + ')';
        })
        .on('click', (n) => {
          this.onClick(n);
        });

      nodeEnter.append('circle')
        .attr('r', 1e-6)
        .style('fill', function (n) {
          return n._children ? 'lightsteelblue' : '#fff';
        });

      nodeEnter.append('text')
        .attr('x', function (n) {
          return n.children || n._children ? -10 : 10;
        })
        .attr('dy', '.35em')
        .attr('text-anchor', function (n) {
          return n.children || n._children ? 'end' : 'start';
        })
        .text((n) => {
          return n.name;
        })
        .style('fill-opacity', 1e-6);

      // Transition nodes to their new position.
      let nodeUpdate = node.transition()
        .duration(this.duration)
        .attr('transform', function (n) {
          return 'translate(' + n.y + ',' + n.x + ')';
        });

      nodeUpdate.select('circle')
        .attr('r', 4.5)
        .style('fill', function (n) {
          return n._children ? 'lightsteelblue' : '#fff';
        });

      nodeUpdate.select('text')
        .style('fill-opacity', 1);

      // Transition exiting nodes to the parent's new position.
      let nodeExit = node.exit().transition()
        .duration(this.duration)
        .attr('transform', function () {
          return 'translate(' + source.y + ',' + source.x + ')';
        })
        .remove();

      nodeExit.select('circle')
        .attr('r', 1e-6);

      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      // Update the links…
      let link = this.svg.selectAll('path.tree_link')
        .data(links, function (n) {
          return n.target.id;
        });

      // Enter any new links at the parent's previous position.
      link.enter().insert('path', 'g')
        .attr('class', 'tree_link')
        .attr('d', () => {
          let o = {id:null, name:null, _children:null, x: source.x0, y: source.y0};
          return this.diagonal({source: o, target: o});
        });

      // Transition links to their new position.
      link.transition()
        .duration(this.duration)
        .attr('d', this.diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(this.duration)
        .attr('d', () => {
          let o = {id:null, name:null, _children:null, x: source.x, y: source.y};
          return this.diagonal({source: o, target: o});
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(function (n) {
        n.x0 = n.x;
        n.y0 = n.y;
      });
    }
  }

  HadithHouseApp.directive('hhTree', function () {
    return {
      replace: true,
      restrict: 'E',
      scope: {
        root: '=',
        width: '@?',
        height: '@?'
      },
      link: function (scope:IScope, elem:IAugmentedJQuery, attrs:IAttributes) {
        let width = 800;
        let height = 600;
        if (attrs['width']) {
          width = parseInt(attrs['width']);
        }
        if (attrs['height']) {
          height = parseInt(attrs['height']);
        }
        let tree = new Tree(elem[0], width, height);

        scope.$watch('root', function (newValue:ITreeNode) {
          if (newValue) {
            tree.setRoot(newValue);
          }
        });
      }
    };
  });
}

