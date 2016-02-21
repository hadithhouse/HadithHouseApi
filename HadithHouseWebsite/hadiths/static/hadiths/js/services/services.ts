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


// TODO: Split this files into multiple files?

module HadithHouse.Services {
  // TODO: Add tracking fields: added_by, added_on, etc.
  export interface IEntity {
    id:number;
  }

  export interface IHadith extends IEntity, ng.resource.IResource<IHadith> {
    text:string;
    person:number;
    book:number;
    tags:number[];
  }

  export interface IHadithResource extends ng.resource.IResourceClass<IHadith> {

  }

  HadithHouse.HadithHouseApp.factory('HadithResource', ($resource:ng.resource.IResourceService):IHadithResource => {
    return <IHadithResource>$resource<IHadith, IHadithResource>('/apis/hadiths/:id', {id: '@id'}, {
      'query': {
        method: 'GET',
        isArray: true,
        transformResponse: function (data) {
          return JSON.parse(data).results;
        }
      }
    });
  });

  export interface IPerson extends IEntity, ng.resource.IResource<IPerson> {
    title:string;
    display_name:string;
    full_name:string;
    brief_desc:string;
    birth_year:number;
    birth_month:number;
    birth_day:number;
    death_year:number;
    death_month:number;
    death_day:number;
  }

  export interface IPersonResource extends ng.resource.IResourceClass<IPerson> {

  }

  HadithHouse.HadithHouseApp.factory('PersonResource', ($resource:ng.resource.IResourceService):IPersonResource => {
    return <IPersonResource>$resource<IPerson, IPersonResource>('/apis/persons/:id', {id: '@id'}, {
      'query': {
        method: 'GET',
        isArray: true,
        transformResponse: function (data) {
          return JSON.parse(data).results;
        }
      }
    });
  });

  export interface IBook extends IEntity, ng.resource.IResource<IBook> {
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
