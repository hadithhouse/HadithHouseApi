/// <reference path="../../../../../TypeScriptDefs/angularjs/angular.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/lodash/lodash.d.ts" />
/// <reference path="../caching/cache.ts" />
/// <reference path="../app.ts" />

module HadithHouse.Resources {
  import IHttpService = angular.IHttpService;
  import Cache = HadithHouse.Caching.Cache;
  import IQService = angular.IQService;
  import IHttpPromise = angular.IHttpPromise;
  import IPromise = angular.IPromise;

  function getRestfulUrl<TId>(baseUrl:string, idOrIds?:TId|TId[]):string {
    if (!idOrIds) {
      return baseUrl;
    }
    else if (!Array.isArray(idOrIds)) {
      return `${baseUrl}/${idOrIds}`;
    } else {
      if ((<TId[]>idOrIds).length == 1) {
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
    id:TId;
    added_by:number;
    updated_by:number;
    added_on:string;
    updated_on:string;
    promise:IHttpPromise<Entity<TId>>;

    /**
     * Loads the entity having the given URL, or set it from an existing object.
     * @param idOrObject The ID of the entity or the object to set this entity from.
     * @param $http Angular's HTTP module.
     */
    constructor($http:IHttpService, baseUrl:string);
    constructor($http:IHttpService, baseUrl:string, id:number|string);
    constructor($http:IHttpService, baseUrl:string, object:Entity<TId>);
    constructor(private $http:IHttpService, private baseUrl:string, idOrObject?:any) {
      if (!idOrObject) {
        return;
      } else if (typeof(idOrObject) === 'number' || typeof(idOrObject) === 'string') {
        this.load(idOrObject);
      } else {
        this.set(idOrObject);
      }
    }

    /**
     * Loads the entity having the given ID.
     * @param id The ID of the entity to load.
     */
    private load(id:TId) {
      this.$http.get<Entity<TId>>(getRestfulUrl(this.baseUrl, id)).then((result) => {
        this.set(result.data);
      });
    }

    /**
     * Sets the values of this entity to the values of the given entity.
     * @param object The entity to copy values from.
     */
    public set(entity:Entity<TId>) {
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
  }

  export class PagedResults<TEntity> {
    count:number;
    next:string;
    previous:string;
    results:TEntity[]
  }

  export type ObjectWithPromise<TObject> = TObject & { promise?:IPromise<TObject> };

  export class CacheableResource<TEntity extends Entity<TId>, TId> {
    cache:Cache<TEntity, string>;

    constructor(private TEntityClass:any,
                private baseUrl:string,
                private $http:IHttpService,
                private $q:IQService) {
      this.cache = new Cache<TEntity, string>();
    }

    public create():TEntity {
      return new this.TEntityClass(this.$http, this.baseUrl)
    }

    public query(query:any, useCache:boolean = true):ObjectWithPromise<TEntity[]> {
      let queryParams = $.param(query);
      let entities:ObjectWithPromise<TEntity[]> = [];
      let httpPromise = this.$http.get<PagedResults<TEntity>>(getRestfulUrl(this.baseUrl) + '?' + queryParams);
      let queryDeferred = this.$q.defer<TEntity[]>();
      httpPromise.then((response) => {
        for (let entity of response.data.results) {
          entities.push(entity);
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

    public pagedQuery(query:any, useCache:boolean = true):ObjectWithPromise<PagedResults<TEntity>> {
      let queryParams = $.param(query);
      let pagedEntities:ObjectWithPromise<PagedResults<TEntity>> = new PagedResults<TEntity>();
      let promise = this.$http.get<PagedResults<TEntity>>(getRestfulUrl(this.baseUrl) + '?' + queryParams);
      promise.then((response) => {
        pagedEntities.count = response.data.count;
        pagedEntities.next = response.data.next;
        pagedEntities.previous = response.data.previous;
        pagedEntities.results = [];
        for (let entity of response.data.results) {
          pagedEntities.results.push(entity);
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
      pagedEntities.promise = promise;
      return pagedEntities;
    }

    public get(id:TId, useCache?:boolean):TEntity;
    public get(ids:TId[], useCache?:boolean):ObjectWithPromise<TEntity[]>;
    public get(idOrIds:TId|TId[], useCache:boolean = true):TEntity|ObjectWithPromise<TEntity[]> {
      if (Array.isArray(idOrIds)) {
        // An array of IDs.
        return this.getByMultipleIds(<TId[]>idOrIds, useCache);
      } else {
        // A single ID.
        return this.getBySingleId(<TId>idOrIds, useCache);
      }
    }

    private getBySingleId(id:TId, useCache:boolean = true):TEntity {
      return this.getByMultipleIds([id], useCache)[0];
    }

    private getByMultipleIds(ids:TId[], useCache:boolean = true):ObjectWithPromise<TEntity[]> {
      // Which objects do we already have in the cache?
      let entities:ObjectWithPromise<TEntity[]> = [];
      let idsOfEntitiesToFetch:TId[] = [];

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
          let deferred = this.$q.defer();
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
          let deferred = this.$q.defer();
          entity.promise = deferred.promise;

          // Save an instance of the deferred so we could resolve it later
          // when we get the response.
          deferredsToResolve[id.toString()] = deferred;
        }
      }

      // Requests the entities we don't have from the RESTful API.
      if (idsOfEntitiesToFetch.length > 1) {
        let httpPromise = this.$http.get<{results:TEntity[]}>(getRestfulUrl(this.baseUrl, idsOfEntitiesToFetch));
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
      } else if (idsOfEntitiesToFetch.length == 1) {
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
        let deferred = this.$q.defer();
        entities.promise = deferred.promise;
        deferred.resolve(entities);
      }

      return entities;
    }
  }

  //============================================================================
  // Hadith Resource
  //============================================================================

  export class Hadith extends Entity<number> {
    text:string;
    person:number;
    book:number;
    tags:number[];

    public set(entity:Entity<number>) {
      super.set(entity);
      this.text = (<Hadith>entity).text;
      this.person = (<Hadith>entity).person;
      this.book = (<Hadith>entity).book;
      this.tags = (<Hadith>entity).tags.slice();
    }
  }

  HadithHouse.HadithHouseApp.factory('HadithResource',
    ($http:IHttpService, $q:IQService):CacheableResource<Hadith, number> => {
      return new CacheableResource<Hadith, number>(Hadith, '/apis/hadiths', $http, $q);
    });

  //============================================================================
  // Person Resource
  //============================================================================

  export class Person extends Entity<number> {
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

    public set(entity:Entity<number>) {
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
  }

  HadithHouse.HadithHouseApp.factory('PersonResource',
    ($http:IHttpService, $q:IQService):CacheableResource<Person, number> => {
      return new CacheableResource<Person, number>(Person, '/apis/persons', $http, $q);
    });

  //============================================================================
  // Book Resource
  //============================================================================

  export class Book extends Entity<number> {
    title:string;
    brief_desc:string;
    pub_year:number;

    public set(entity:Entity<number>) {
      super.set(entity);
      this.title = (<Book>entity).title;
      this.brief_desc = (<Book>entity).brief_desc;
      this.pub_year = (<Book>entity).pub_year;
    }
  }

  HadithHouse.HadithHouseApp.factory('BookResource',
    ($http:IHttpService, $q:IQService):CacheableResource<Book, number> => {
      return new CacheableResource<Book, number>(Book, '/apis/books', $http, $q);
    });

  //============================================================================
  // HadithTag Resource
  //============================================================================

  export class HadithTag extends Entity<number> {
    name:string;

    public set(entity:Entity<number>) {
      super.set(entity);
      this.name = (<HadithTag>entity).name;
    }
  }

  HadithHouse.HadithHouseApp.factory('HadithTagResource',
    ($http:IHttpService, $q:IQService):CacheableResource<HadithTag, number> => {
      return new CacheableResource<HadithTag, number>(HadithTag, '/apis/hadithtags', $http, $q);
    });

  //============================================================================
  // Chain Resource
  //============================================================================

  export class Chain extends Entity<number> {
    hadith:number;
    persons:Array<number>;
    isEditing:boolean;
    isAddingNew:boolean;

    public set(entity:Entity<number>) {
      super.set(entity);
      this.hadith = (<Chain>entity).hadith;
      this.persons = (<Chain>entity).persons.slice();
      this.isEditing = (<Chain>entity).isEditing;
      this.isAddingNew = (<Chain>entity).isAddingNew;
    }
  }

  HadithHouse.HadithHouseApp.factory('ChainResource',
    ($http:IHttpService, $q:IQService):CacheableResource<Chain, number> => {
      return new CacheableResource<Chain, number>(Chain, '/apis/chains', $http, $q);
    });

  //============================================================================
  // User Resource
  //============================================================================

  export class User extends Entity<number> {
    first_name:string;
    last_name:string;
    is_superuser:boolean;
    is_staff:boolean;
    username:string;
    date_joined:string;
    permissions:Array<string>;
    permissionsOrdered:Array<string>;

    public set(entity:Entity<number>) {
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
  }

  HadithHouse.HadithHouseApp.factory('UserResource',
    ($http:IHttpService, $q:IQService):CacheableResource<User, number> => {
      return new CacheableResource<User, number>(User, '/apis/users', $http, $q);
    });
}
