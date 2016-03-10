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

module HadithHouse.Services {
  // TODO: Add tracking fields: added_by, added_on, etc.
  import IResource = angular.resource.IResource;
  import IResourceArray = angular.resource.IResourceArray;
  import IResourceClass = angular.resource.IResourceClass;

  export interface IEntity {
    id:number;
    added_by:number;
    updated_by:number;
    added_on:string;
    updated_on:string;
  }

  export interface IEntityQueryResult<T> {
    count: number;
    next: string;
    previous: string;
    results:IResourceArray<T>
  }

  export interface IEntityResourceClass<T> {
    pagedQuery(): IEntityQueryResult<T>;
    pagedQuery(params:Object): IEntityQueryResult<T>;
    pagedQuery(success:Function, error?:Function): IEntityQueryResult<T>;
    pagedQuery(params:Object, success:Function, error?:Function): IEntityQueryResult<T>;
    pagedQuery(params:Object, data:Object, success?:Function, error?:Function): IEntityQueryResult<T>;
  }

  export interface IHadithResource extends IEntity, IResource<IHadithResource> {
    text:string;
    person:number;
    book:number;
    tags:number[];
  }

  export interface IHadithResourceClass extends IEntityResourceClass<IHadithResource>, IResourceClass<IHadithResource> {

  }

  HadithHouse.HadithHouseApp.factory('HadithResource', ($resource:ng.resource.IResourceService):IHadithResourceClass => {
    return <IHadithResourceClass>$resource<IHadithResource, IHadithResourceClass>('/apis/hadiths/:id', {id: '@id'}, {
      'query': {
        method: 'GET',
        isArray: true,
        transformResponse: function (data) {
          return JSON.parse(data).results;
        }
      },
      'pagedQuery': {
        method: 'GET',
        isArray: false,
      }
    });
  });

  export interface IPersonResource extends IEntity, IResource<IPersonResource> {
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

  export interface IPersonResourceClass extends IEntityResourceClass<IPersonResource>, IResourceClass<IPersonResource> {

  }

  HadithHouse.HadithHouseApp.factory('PersonResource', ($resource:ng.resource.IResourceService):IPersonResourceClass => {
    return <IPersonResourceClass>$resource<IPersonResource, IPersonResourceClass>('/apis/persons/:id', {id: '@id'}, {
      'query': {
        method: 'GET',
        isArray: true,
        transformResponse: function (data) {
          return JSON.parse(data).results;
        }
      },
      'pagedQuery': {
        method: 'GET',
        isArray: false,
      }
    });
  });

  export interface IBookResource extends IEntity, IResource<IBookResource> {
    title:string;
    brief_desc:string;
    pub_year:number;
  }

  export interface IBookResourceClass extends IEntityResourceClass<IBookResource>, IResourceClass<IBookResource> {

  }

  HadithHouse.HadithHouseApp.factory('BookResource', ($resource:ng.resource.IResourceService):IBookResourceClass => {
    return <IBookResourceClass>$resource<IBookResource, IBookResourceClass>('/apis/books/:id', {id: '@id'}, {
      'query': {
        method: 'GET',
        isArray: true,
        transformResponse: function (data) {
          return JSON.parse(data).results;
        }
      },
      'pagedQuery': {
        method: 'GET',
        isArray: false,
      }
    });
  });

  export interface IHadithTagResource extends IEntity, IResource<IHadithTagResource> {
    name:string;
  }

  export interface IHadithTagResourceClass extends IEntityResourceClass<IHadithTagResource>, IResourceClass<IHadithTagResource> {

  }

  HadithHouse.HadithHouseApp.factory('HadithTagResource', ($resource:ng.resource.IResourceService):IHadithTagResourceClass => {
    return <IHadithTagResourceClass>$resource<IHadithTagResource, IHadithTagResourceClass>('/apis/hadithtags/:id', {id: '@id'}, {
      'query': {
        method: 'GET',
        isArray: true,
        transformResponse: function (data) {
          return JSON.parse(data).results;
        }
      },
      'pagedQuery': {
        method: 'GET',
        isArray: false,
      }
    });
  });

  export interface IUserResource extends IEntity, IResource<IUserResource> {
    first_name:string;
    last_name:string;
    is_superuser:boolean;
    is_staff:boolean;
    username:string;
    date_joined:string;
    permissions:Array<string>;
    permissionsOrdered:Array<string>;
  }

  export interface IUserResourceClass extends IEntityResourceClass<IUserResource>, IResourceClass<IUserResource> {
  }

  HadithHouse.HadithHouseApp.factory('UserResource', ($resource:ng.resource.IResourceService):IUserResourceClass => {
    return <IUserResourceClass>$resource<IUserResource, IUserResourceClass>('/apis/users/:id', {id: '@id'}, {
      'query': {
        method: 'GET',
        isArray: true,
        transformResponse: function (data) {
          return JSON.parse(data).results;
        }
      },
      'pagedQuery': {
        method: 'GET',
        isArray: false,
      }
    });
  });
}
