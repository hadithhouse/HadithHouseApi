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
/// <reference path="../app.ts" />
// TODO: Split this files into multiple files?
var HadithHouse;
(function (HadithHouse) {
    var Services;
    (function (Services) {
        HadithHouse.HadithHouseApp.factory('HadithResource', function ($resource) {
            return $resource('/apis/hadiths/:id', { id: '@id' }, {
                'query': {
                    method: 'GET',
                    isArray: true,
                    transformResponse: function (data) {
                        return JSON.parse(data).results;
                    }
                },
                'pagedQuery': {
                    method: 'GET',
                    isArray: false
                }
            });
        });
        HadithHouse.HadithHouseApp.factory('PersonResource', function ($resource) {
            return $resource('/apis/persons/:id', { id: '@id' }, {
                'query': {
                    method: 'GET',
                    isArray: true,
                    transformResponse: function (data) {
                        return JSON.parse(data).results;
                    }
                },
                'pagedQuery': {
                    method: 'GET',
                    isArray: false
                }
            });
        });
        HadithHouse.HadithHouseApp.factory('BookResource', function ($resource) {
            return $resource('/apis/books/:id', { id: '@id' }, {
                'query': {
                    method: 'GET',
                    isArray: true,
                    transformResponse: function (data) {
                        return JSON.parse(data).results;
                    }
                },
                'pagedQuery': {
                    method: 'GET',
                    isArray: false
                }
            });
        });
        HadithHouse.HadithHouseApp.factory('HadithTagResource', function ($resource) {
            return $resource('/apis/hadithtags/:id', { id: '@id' }, {
                'query': {
                    method: 'GET',
                    isArray: true,
                    transformResponse: function (data) {
                        return JSON.parse(data).results;
                    }
                },
                'pagedQuery': {
                    method: 'GET',
                    isArray: false
                }
            });
        });
        HadithHouse.HadithHouseApp.factory('ChainResource', function ($resource) {
            return $resource('/apis/chains/:id', { id: '@id' }, {
                'query': {
                    method: 'GET',
                    isArray: true,
                    transformResponse: function (data) {
                        return JSON.parse(data).results;
                    }
                },
                'pagedQuery': {
                    method: 'GET',
                    isArray: false
                }
            });
        });
        HadithHouse.HadithHouseApp.factory('UserResource', function ($resource) {
            return $resource('/apis/users/:id', { id: '@id' }, {
                'query': {
                    method: 'GET',
                    isArray: true,
                    transformResponse: function (data) {
                        return JSON.parse(data).results;
                    }
                },
                'pagedQuery': {
                    method: 'GET',
                    isArray: false
                }
            });
        });
    })(Services = HadithHouse.Services || (HadithHouse.Services = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=services.js.map