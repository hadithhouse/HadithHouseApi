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

import {Cache} from "caching/cache"
import _ from "lodash";
import {IHttpService, IQService, IHttpPromise, IPromise} from "angular";
import {HadithHouseApp} from "app-def";

function getRestfulUrl<TId>(baseUrl: string, idOrIds?: TId | TId[]): string {
  if (!idOrIds) {
    return baseUrl;
  } else if (!Array.isArray(idOrIds)) {
    return `${baseUrl}/${idOrIds}`;
  } else {
    if ((<TId[]>idOrIds).length === 1) {
      // If there is one ID only, pass directly in the URL path. This
      // is necessary for special requests like hadiths/random or
      // users/current.
      return `${baseUrl}/${idOrIds}`;
    } else {
      let ids = (<TId[]>idOrIds).join(',');
      return `${baseUrl}?id=${ids}`;
    }
  }
}

export class Entity<TId> {
  public id: TId;
  public added_by: number;
  public updated_by: number;
  public added_on: string;
  public updated_on: string;
  public valid: boolean = null;
  public promise: IPromise<Entity<TId>>;

  /**
   * Constructs a new entity.
   * @param $http Angular's HTTP module.
   * @param baseUrl The base URL for doing CRUD operations on this entity.
   */
  constructor($http: IHttpService, baseUrl: string);

  /**
   * Loads the entity having the given ID.
   * @param $http Angular's HTTP module.
   * @param baseUrl The base URL for doing CRUD operations on this entity.
   * @param id The ID of the entity to load.
   */
  constructor($http: IHttpService, baseUrl: string, id: TId);

  /**
   * Constructs a wrapper entity for the given object.
   * @param $http Angular's HTTP module.
   * @param baseUrl The base URL for doing CRUD operations on this entity.
   * @param object The object to wrap.
   */
  constructor($http: IHttpService, baseUrl: string, object: Entity<TId>);

  constructor(private $http: IHttpService, private baseUrl: string, idOrObject?: any) {
    if (!idOrObject) {
      return;
    } else if (typeof(idOrObject) === 'object') {
      this.set(idOrObject);
    } else {
      this.load(idOrObject);
    }
  }

  /**
   * Sets the values of this entity to the values of the given entity.
   * @param entity The entity to copy values from.
   */
  public set(entity: Entity<TId>) {
    this.id = entity.id;
    this.added_by = entity.added_by;
    this.updated_by = entity.updated_by;
    this.added_on = entity.added_on;
    this.updated_on = entity.updated_on;
  }

  public save() {
    let url = getRestfulUrl(this.baseUrl, this.id);
    if (!this.id) {
      let promise = this.$http.post<Entity<TId>>(url, this);
      promise.then((response) => {
        // TODO: We should copy all the object to save other auto-generated TODO.
        this.id = response.data.id;
      });
      return promise;
    } else {
      return this.$http.put<Entity<TId>>(url, this);
    }
  }

  /**
   * Delete the object.
   */
  public delete() {
    let url = getRestfulUrl(this.baseUrl, this.id);
    return this.$http.delete(url);
  }

  /**
   * Loads the entity having the given ID.
   * @param id The ID of the entity to load.
   */
  private load(id: TId) {
    this.$http.get<Entity<TId>>(getRestfulUrl(this.baseUrl, id)).then((result) => {
      if (result.status == 200) {
        this.set(result.data);
        this.valid = true;
      } else {
        this.valid = false;
      }
    }, (reason) => {
      this.valid = false;
    });
  }
}

export class PagedResults<TEntity> {
  public count: number;
  public next: string;
  public previous: string;
  public results: TEntity[];
}

export type ObjectWithPromise<TObject> = TObject & { promise?: IPromise<TObject> };

export class CacheableResource<TEntity extends Entity<TId>, TId> {
  private cache: Cache<TEntity, string>;

  constructor(private TEntityClass: any,
              private baseUrl: string,
              private $http: IHttpService,
              private $q: IQService) {
    this.cache = new Cache<TEntity, string>();
  }

  public create(): TEntity {
    return new this.TEntityClass(this.$http, this.baseUrl);
  }

  public query(query: any, useCache = true): ObjectWithPromise<TEntity[]> {
    let queryParams = $.param(query);
    let entities: ObjectWithPromise<TEntity[]> = [];
    let httpPromise = this.$http.get<PagedResults<TEntity>>(getRestfulUrl(this.baseUrl) + '?' + queryParams);
    let queryDeferred = this.$q.defer<TEntity[]>();
    httpPromise.then((response) => {
      for (let entity of response.data.results) {
        entities.push(new this.TEntityClass(this.$http, this.baseUrl, entity));
        // Since we already get some entities back, we might as well cache them.
        // NOTE: If there is an object in the cache already, don't overwrite it,
        // update it. This way other code parts which reference it will
        // automatically get the updated values.
        let entityInCache = useCache ? this.cache.get(entity.id.toString(), true /* Returns expired */) : null;
        if (!entityInCache) {
          entityInCache = this.create();
        }
        entityInCache.set(entity);
        if (useCache) {
          this.cache.put(entity.id.toString(), entityInCache);
        }
      }
      queryDeferred.resolve(entities);
    }, (reason) => {
      queryDeferred.reject(reason);
    });
    entities.promise = queryDeferred.promise;
    return entities;
  }

  public pagedQuery(query: any, useCache = true): ObjectWithPromise<PagedResults<TEntity>> {
    let queryParams = $.param(query);
    let pagedEntities: ObjectWithPromise<PagedResults<TEntity>> = new PagedResults<TEntity>();
    let promise = this.$http.get<PagedResults<TEntity>>(getRestfulUrl(this.baseUrl) + '?' + queryParams);
    promise.then((response) => {
      pagedEntities.count = response.data.count;
      pagedEntities.next = response.data.next;
      pagedEntities.previous = response.data.previous;
      pagedEntities.results = [];
      for (let entity of response.data.results) {
        pagedEntities.results.push(new this.TEntityClass(this.$http, this.baseUrl, entity));
        // Since we already get some entities back, we might as well cache them.
        // NOTE: If there is an object in the cache already, don't overwrite it,
        // update it. This way other code parts which reference it will
        // automatically get the updated values.
        let entityInCache = useCache ? this.cache.get(entity.id.toString(), true /* Returns expired */) : null;
        if (!entityInCache) {
          entityInCache = this.create();
        }
        entityInCache.set(entity);
        if (useCache) {
          this.cache.put(entity.id.toString(), entityInCache);
        }
      }
    });
    pagedEntities.promise = this.$q.defer<PagedResults<TEntity>>().promise;
    return pagedEntities;
  }

  public get(id: TId, useCache?: boolean): TEntity;
  public get(ids: TId[], useCache?: boolean): ObjectWithPromise<TEntity[]>;
  public get(idOrIds: TId | TId[], useCache = true): TEntity | ObjectWithPromise<TEntity[]> {
    if (Array.isArray(idOrIds)) {
      // An array of IDs.
      return this.getByMultipleIds(<TId[]>idOrIds, useCache);
    } else {
      // A single ID.
      return this.getBySingleId(<TId>idOrIds, useCache);
    }
  }

  private getBySingleId(id: TId, useCache = true): TEntity {
    return this.getByMultipleIds([id], useCache)[0];
  }

  private getByMultipleIds(ids: TId[], useCache = true): ObjectWithPromise<TEntity[]> {
    // Which objects do we already have in the cache?
    let entities: ObjectWithPromise<TEntity[]> = [];
    let idsOfEntitiesToFetch: TId[] = [];

    // Remove duplicated IDs before starting.
    ids = _.uniq(ids);

    // Check the cache to see which entities we already have and which ones
    // we need to fetch from the cache.
    let deferredsToResolve = {};
    for (let id of ids) {
      let entity = useCache ? this.cache.get(id.toString()) : null;
      if (entity != null) {
        entities.push(entity);

        // Create a promise object in the entity in case the user wants to
        // get notified when the object is loaded or an error happens. Here,
        // though, we resolve it immediately because we already have it in
        // the cache.
        let deferred = this.$q.defer<TEntity>();
        entity.promise = deferred.promise;

        deferred.resolve(entity);
      } else {
        // Create a stub for the entity to fill in later when we receives
        // the response from the RESTful API. Also cache it so next requests
        // for the same object won't have to go to the RESTful API again.
        entity = this.create();
        entity.id = id;
        if (useCache) {
          this.cache.put(id.toString(), entity);
        }
        idsOfEntitiesToFetch.push(id);
        entities.push(entity);

        // Create a promise object in the entity in case the user wants to
        // get notified when the object is loaded or an error happens.
        let deferred = this.$q.defer<TEntity>();
        entity.promise = deferred.promise;

        // Save an instance of the deferred so we could resolve it later
        // when we get the response.
        deferredsToResolve[id.toString()] = deferred;
      }
    }

    // Requests the entities we don't have from the RESTful API.
    if (idsOfEntitiesToFetch.length > 1) {
      let httpPromise = this.$http.get<{ results: TEntity[] }>(getRestfulUrl(this.baseUrl, idsOfEntitiesToFetch));
      let entitiesDeferred = this.$q.defer<TEntity[]>();
      httpPromise.then((response) => {
        // Now that we receive the data from the server, start filling in the
        // entities we returned to the user and resolving their promises.
        for (let entity of response.data.results) {
          _.each(_.filter(entities, (e) => e.id === entity.id), (e) => {
            e.set(entity);
          });
          // Resolve the promise object of the entity.
          deferredsToResolve[entity.id.toString()].resolve(entity);
        }
        entitiesDeferred.resolve(entities);
      }, (reason) => {
        for (let entity of entities) {
          // Rejects the promise object of the entity.
          deferredsToResolve[entity.id.toString()].reject(reason);
        }
        entitiesDeferred.reject(reason);
      });
      entities.promise = entitiesDeferred.promise;
    } else if (idsOfEntitiesToFetch.length === 1) {
      // Cannot use the same variable name as above with different type :-S
      // How is let useful over var then?
      let httpPromise2 = this.$http.get<TEntity>(getRestfulUrl(this.baseUrl, idsOfEntitiesToFetch));
      let entitiesDeferred = this.$q.defer<TEntity[]>();
      httpPromise2.then((response) => {
        let entity = response.data;
        _.each(_.filter(entities, (e) => e.id === entity.id), (e) => {
          e.set(entity);
        });

        // Resolve the promise object of the entity.
        deferredsToResolve[entity.id.toString()].resolve(entity);
        entitiesDeferred.resolve(entities);
      }, (reason) => {
        for (let entity of entities) {
          // Rejects the promise object of the entity.
          deferredsToResolve[entity.id.toString()].reject(reason);
        }
        entitiesDeferred.reject(reason);
      });
      entities.promise = entitiesDeferred.promise;
    } else {
      // Nothing to fetch, so create promise object that resolves immediately.
      let deferred = this.$q.defer<TEntity[]>();
      entities.promise = deferred.promise;
      deferred.resolve(entities);
    }

    return entities;
  }
}

///===========================================================================
/// Hadith Resource
///===========================================================================

export class Hadith extends Entity<number | string> {
  public text: string;
  public person: number;
  public book: number;
  public volume: number;
  public chapter: number;
  public section: number;
  public tags: number[];

  public set(entity: Entity<number | string>) {
    super.set(entity);
    this.text = (<Hadith>entity).text;
    this.person = (<Hadith>entity).person;
    this.book = (<Hadith>entity).book;
    this.volume = (<Hadith>entity).volume;
    this.chapter = (<Hadith>entity).chapter;
    this.section = (<Hadith>entity).section;
    this.tags = (<Hadith>entity).tags.slice();
  }
}

HadithHouseApp.factory('HadithResource',
  ($http: IHttpService, $q: IQService): CacheableResource<Hadith, number | string> => {
    return new CacheableResource<Hadith, number | string>(Hadith, '/apis/hadiths', $http, $q);
  });

///===========================================================================
/// Person Resource
///===========================================================================

export class Person extends Entity<number> {
  public title: string;
  public display_name: string;
  public full_name: string;
  public brief_desc: string;
  public birth_year: number;
  public birth_month: number;
  public birth_day: number;
  public death_year: number;
  public death_month: number;
  public death_day: number;

  public set(entity: Entity<number>) {
    super.set(entity);
    this.title = (<Person>entity).title;
    this.display_name = (<Person>entity).display_name;
    this.full_name = (<Person>entity).full_name;
    this.brief_desc = (<Person>entity).brief_desc;
    this.birth_year = (<Person>entity).birth_year;
    this.birth_month = (<Person>entity).birth_month;
    this.birth_day = (<Person>entity).birth_day;
    this.death_year = (<Person>entity).death_year;
    this.death_month = (<Person>entity).death_month;
    this.death_day = (<Person>entity).death_day;
  }

  public toString(): string {
    if (this.display_name || this.full_name) {
      return this.display_name || this.full_name;
    }
    return null;
  }
}

HadithHouseApp.factory('PersonResource',
  ($http: IHttpService, $q: IQService): CacheableResource<Person, number> => {
    return new CacheableResource<Person, number>(Person, '/apis/persons', $http, $q);
  });

///===========================================================================
/// Book Resource
///===========================================================================

export class Book extends Entity<number> {
  public title: string;
  public brief_desc: string;
  public pub_year: number;

  public set(entity: Entity<number>) {
    super.set(entity);
    this.title = (<Book>entity).title;
    this.brief_desc = (<Book>entity).brief_desc;
    this.pub_year = (<Book>entity).pub_year;
  }

  public toString(): string {
    if (this.title) {
      return this.title;
    }
    return null;
  }
}

HadithHouseApp.factory('BookResource',
  ($http: IHttpService, $q: IQService): CacheableResource<Book, number> => {
    return new CacheableResource<Book, number>(Book, '/apis/books', $http, $q);
  });

///===========================================================================
/// HadithTag Resource
///===========================================================================

export class HadithTag extends Entity<number> {
  public name: string;

  public set(entity: Entity<number>) {
    super.set(entity);
    this.name = (<HadithTag>entity).name;
  }

  public toString(): string {
    if (this.name) {
      return this.name;
    }
    return null;
  }
}

HadithHouseApp.factory('HadithTagResource',
  ($http: IHttpService, $q: IQService): CacheableResource<HadithTag, number> => {
    return new CacheableResource<HadithTag, number>(HadithTag, '/apis/hadithtags', $http, $q);
  });

///===========================================================================
/// Chain Resource
///===========================================================================

export class Chain extends Entity<number> {
  public hadith: number | string;
  public persons: Array<number>;
  public isEditing: boolean;
  public isAddingNew: boolean;

  public set(entity: Entity<number>) {
    super.set(entity);
    this.hadith = (<Chain>entity).hadith;
    this.persons = (<Chain>entity).persons.slice();
    this.isEditing = (<Chain>entity).isEditing;
    this.isAddingNew = (<Chain>entity).isAddingNew;
  }
}

HadithHouseApp.factory('ChainResource',
  ($http: IHttpService, $q: IQService): CacheableResource<Chain, number> => {
    return new CacheableResource<Chain, number>(Chain, '/apis/chains', $http, $q);
  });

///===========================================================================
/// User Resource
///===========================================================================

export class User extends Entity<number> {
  public first_name: string;
  public last_name: string;
  public is_superuser: boolean;
  public is_staff: boolean;
  public username: string;
  public date_joined: string;
  public permissions: Array<string>;
  public permissionsOrdered: Array<string>;

  public set(entity: Entity<number>) {
    super.set(entity);
    this.first_name = (<User>entity).first_name;
    this.last_name = (<User>entity).last_name;
    this.is_superuser = (<User>entity).is_superuser;
    this.is_staff = (<User>entity).is_staff;
    this.username = (<User>entity).username;
    this.date_joined = (<User>entity).date_joined;
    this.permissions = (<User>entity).permissions.slice();
    this.permissionsOrdered = ((<User>entity).permissionsOrdered != null)
      ? (<User>entity).permissionsOrdered.slice()
      : null;
  }

  public toString(): string {
    if (this.first_name && this.last_name) {
      return `${this.first_name} ${this.last_name}`;
    } else if (this.first_name) {
      return `${this.first_name}`;
    } else if (this.last_name) {
      return `${this.first_name}`;
    }
    return null;
  }
}

HadithHouseApp.factory('UserResource',
  ($http: IHttpService, $q: IQService): CacheableResource<User, number> => {
    return new CacheableResource<User, number>(User, '/apis/users', $http, $q);
  });
