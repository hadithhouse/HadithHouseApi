/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Rafid Khalid Al-Humaimidi
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
var HadithHouse;
(function (HadithHouse) {
    var Directives;
    (function (Directives) {
        var SelectorCtrl = (function () {
            function SelectorCtrl($scope, PersonResource, BookResource, HadithTagResource, UserResource) {
                var _this = this;
                this.$scope = $scope;
                this.PersonResource = PersonResource;
                this.BookResource = BookResource;
                this.HadithTagResource = HadithTagResource;
                this.UserResource = UserResource;
                this.firstLoad = true;
                this.onIdsChanged = function (newValue, oldValue) {
                    if (newValue && _this.firstLoad) {
                        // An ID(s) was(were) passed to the selector and this.entities have not
                        // been set yet, so we set it.
                        _this.firstLoad = false;
                    }
                    else {
                        // The selector has already been loaded, so we just check whether we have
                        // changes in the ID that we need to refresh
                        if (angular.equals(newValue, oldValue)) {
                            return;
                        }
                    }
                    if (_this.singleSelect) {
                        if (_this.ids !== null) {
                            _this.entities = [_this.ids].map(function (id) {
                                // See if we already have the entity loaded, otherwise make a request to load it.
                                return _.find(_this.entities, function (e) {
                                    return e.id == id;
                                }) || _this.EntityResource.get(id);
                            });
                        }
                        else {
                            _this.entities = [];
                        }
                    }
                    else {
                        _this.entities = _this.ids.map(function (id) {
                            // See if we already have the entity loaded, otherwise make a request to load it.
                            return _.find(_this.entities, function (e) {
                                return e.id == id;
                            }) || _this.EntityResource.get(id);
                        });
                    }
                };
                this.onEntitiesChanged = function (newValue, oldValue) {
                    if (newValue && oldValue && angular.equals(newValue, oldValue)) {
                        return;
                    }
                    if (_this.entities) {
                        // If the control only allows single select, we remove every elements
                        // before the last.
                        if (_this.singleSelect === 'true') {
                            // Single select mode, so only allow one entity to be selected and delete previous ones.
                            if (_this.entities.length > 1) {
                                _this.entities.splice(0, _this.entities.length - 1);
                            }
                            if (_this.entities.length == 1) {
                                // Ensure that the resource has been resolved before updating the scope's ID
                                if (typeof (_this.entities[0].id) === 'number') {
                                    _this.ids = _this.entities[0].id;
                                }
                            }
                            else {
                                _this.ids = null;
                            }
                        }
                        else {
                            if (_.every(_this.entities, function (e) {
                                return typeof (e.id) === 'number';
                            })) {
                                _this.ids = _this.entities.map(function (entity) {
                                    return entity.id;
                                });
                            }
                        }
                    }
                };
                this.entityToString = function (entity) {
                    switch (_this.type.toLowerCase()) {
                        case 'person':
                            return entity.display_name || entity.full_name;
                        case 'book':
                            return entity.title;
                        case 'hadithtag':
                            return entity.name;
                        case 'user':
                            return entity.first_name + " " + entity.last_name;
                        default:
                            throw 'Unreachable code';
                    }
                };
                if (!this.ids) {
                    if (this.singleSelect) {
                        this.ids = null;
                    }
                    else {
                        this.ids = [];
                    }
                }
                if (!this.entities) {
                    this.entities = [];
                }
                if (!this.textOnly) {
                    this.textOnly = 'false';
                }
                if (!this.clickable) {
                    this.clickable = 'false';
                }
                if (!this.type || typeof (this.type) !== 'string') {
                    throw 'Selector must have its type attribute set to a string.';
                }
                switch (this.type.toLowerCase()) {
                    case 'person':
                        this.EntityResource = PersonResource;
                        break;
                    case 'book':
                        this.EntityResource = BookResource;
                        break;
                    case 'hadithtag':
                        this.EntityResource = HadithTagResource;
                        break;
                    case 'user':
                        this.EntityResource = UserResource;
                        break;
                    default:
                        throw 'Invalid type for selector.';
                }
                //$scope.$watch('ctrl.ids', this.onIdsChanged);
                $scope.$watchCollection('ctrl.ids', this.onIdsChanged);
                //$scope.$watch('ctrl.entities', this.onEntitiesChanged);
                $scope.$watchCollection('ctrl.entities', this.onEntitiesChanged);
            }
            SelectorCtrl.prototype.findEntities = function (query) {
                return this.EntityResource.query({ search: query });
            };
            ;
            return SelectorCtrl;
        }());
        Directives.SelectorCtrl = SelectorCtrl;
        HadithHouse.HadithHouseApp.controller('SelectorCtrl', ['$scope', 'PersonResource', 'BookResource', 'HadithTagResource', 'UserResource', SelectorCtrl]);
        // TODO: Consider creating a class for this.
        HadithHouse.HadithHouseApp.directive('hhSelector', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: getHtmlBasePath() + 'directives/selector.directive.html',
                controller: 'SelectorCtrl',
                controllerAs: 'ctrl',
                bindToController: true,
                scope: {
                    ids: '=',
                    type: '@',
                    readOnly: '=',
                    singleSelect: '@',
                    textOnly: '@',
                    clickable: '@'
                }
            };
        });
    })(Directives = HadithHouse.Directives || (HadithHouse.Directives = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=selector.directive.js.map