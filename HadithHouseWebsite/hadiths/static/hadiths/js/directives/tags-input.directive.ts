/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Rafid Khalid Al-Humaimidi
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/// <reference path="../../../../../TypeScriptDefs/angularjs/angular.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/angularjs/angular-resource.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/lodash/lodash.d.ts" />
/// <reference path="../services/services.ts" />
/// <reference path="../resources/resources.ts" />


module HadithHouse.Directives {
  import IScope = angular.IScope;

  export class TagsInputCtrl {
    public onAdd: any;
    public text: string;
    public labels: string[];

    constructor(private $scope: IScope) {

    }

    public $onInit() {
      this.labels = ['Label 1', 'Label 2'];
    }

    public onKey($event) {
      switch ($event.which) {
        case 8:
          this.onBackspace();
          break;

        case 13:
          this.onEnter();
          break;
      }
    }

    public deleteLabel(index:number) {
      if (typeof(index) !== 'number') {
        throw 'Index must be a number.';
      }
      if (index < 0) {
        throw 'Index must not be negative.';
      }
      if (index >= this.labels.length) {
        throw 'Index out of range.';
      }
      this.labels.splice(index, 1);
    }

    private isInputEmpty(): boolean {
      return typeof(this.text) === 'undefined' || this.text === null || this.text === '';
    }

    private onBackspace() {
      if (this.isInputEmpty() && this.labels.length > 0) {
        this.labels.pop();
      }
    }

    private onEnter() {
      if (typeof(this.text) !== 'undefined' && this.text !== null && this.text !== '') {
        this.labels.push(this.text);
        this.text = '';
      }
    }
  }

  HadithHouseApp.controller('TagsInputCtrl',
    ['$scope', '$location', 'PersonResource', 'BookResource', 'HadithTagResource', 'UserResource',
      TagsInputCtrl]);

  // TODO: Consider creating a class for this.
  HadithHouseApp.directive('hhTagsInput', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: getHtmlBasePath() + 'directives/tags-input.directive.html',
      controller: 'TagsInputCtrl',
      controllerAs: 'ctrl',
      bindToController: true,
      scope: {
        onAdd: '&?',
      }
    };
  });
}
