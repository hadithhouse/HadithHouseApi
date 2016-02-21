/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Rafid K. Abdullah
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


module HadithHouse.Services {
  HadithHouse.HadithHouseApp.factory('Hadith', function ($resource) {
    return $resource('/apis/hadiths/:id', {id: '@id'}, {
      'query': {
        method: 'GET',
        isArray: true,
        transformResponse: function (data) {
          return JSON.parse(data).results;
        }
      }
    });
  });

  HadithHouse.HadithHouseApp.factory('Person', function ($resource) {
    return $resource('/apis/persons/:id', {id: '@id'}, {
      'query': {
        method: 'GET',
        isArray: true,
        transformResponse: function (data) {
          return JSON.parse(data).results;
        }
      }
    });
  });

  export interface IBook extends ng.resource.IResource<IBook> {
    id:number;
    title:string;
    brief_desc:string;
    pub_year:number;
  }

  export interface IBookResource extends ng.resource.IResourceClass<IBook> {

  }

  HadithHouse.HadithHouseApp.factory('BookResource', ($resource:ng.resource.IResourceService):IBookResource => {
    return <IBookResource>$resource<IBook, IBookResource>('/apis/books/:id', {id: '@id'}, {
      'query': {
        method: 'GET',
        isArray: true,
        transformResponse: function (data) {
          return JSON.parse(data).results;
        }
      }
    });
  });

  HadithHouse.HadithHouseApp.factory('HadithTag', function ($resource) {
    return $resource('/apis/hadithtags/:id', {id: '@id'}, {
      'query': {
        method: 'GET',
        isArray: true,
        transformResponse: function (data) {
          return JSON.parse(data).results;
        }
      }
    });
  });

  HadithHouse.HadithHouseApp.factory('User', function ($resource) {
    return $resource('/apis/users/:id', {id: '@id'}, {
      'query': {
        method: 'GET',
        isArray: true,
        transformResponse: function (data) {
          return JSON.parse(data).results;
        }
      }
    });
  });
}
