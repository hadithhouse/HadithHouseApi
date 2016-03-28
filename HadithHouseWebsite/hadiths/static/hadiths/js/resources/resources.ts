/// <reference path="../../../../../TypeScriptDefs/angularjs/angular.d.ts" />
/// <reference path="../caching/cache.ts" />
/// <reference path="../app.ts" />

module HadithHouse.Resources {
  import IHttpService = angular.IHttpService;
  import Cache = HadithHouse.Caching.Cache;
  import IQService = angular.IQService;
  import IHttpPromise = angular.IHttpPromise;
  import IPromise = angular.IPromise;

  function getRestfulUrl(baseUrl:string, idOrIds?:number|number[]):string {
    if (!idOrIds) {
      return baseUrl;
    }
    else if (typeof(idOrIds) === 'number') {
      return `${baseUrl}/${idOrIds}`;
    } else {
      let ids = (<number[]>idOrIds).join(',');
      return `${baseUrl}?id=${ids}`;
    }
  }

  export class Entity {
    id:number;
    added_by:number;
    updated_by:number;
    added_on:string;
    updated_on:string;
    promise:IHttpPromise<Entity>;

    /**
     * Loads the entity having the given URL, or set it from an existing object.
     * @param idOrObject The ID of the entity or the object to set this entity from.
     * @param $http Angular's HTTP module.
     */
    constructor($http:IHttpService, baseUrl:string);
    constructor($http:IHttpService, baseUrl:string, id:number);
    constructor($http:IHttpService, baseUrl:string, object:Entity);
    constructor(private $http:IHttpService, private baseUrl:string, idOrObject?:any) {
      if (!idOrObject) {
        return;
      } else if (idOrObject instanceof Number) {
        this.load(idOrObject);
      } else {
        this.set(idOrObject);
      }
    }

    /**
     * Loads the entity having the given ID.
     * @param id The ID of the entity to load.
     */
    private load(id:number) {
      this.$http.get<Entity>(getRestfulUrl(this.baseUrl, id)).then((result) => {
        this.set(result.data);
      });
    }

    /**
     * Sets the entity from the the given object.
     * @param object The object.
     */
    public set(object:Entity) {
      for (let key in object) {
        this[key] = object[key];
      }
    }

    public save() {
      let url = getRestfulUrl(this.baseUrl, this.id);
      if (this.id) {
        let promise = this.$http.post<Entity>(url, this);
        promise.then((response) => {
          // TODO: We should copy all the object to save other auto-generated TODO.
          this.id = response.data.id;
        });
        return promise;
      } else {
        return this.$http.put<Entity>(url, this);
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

  export class CacheableResource<TEntity extends Entity> {
    cache:Cache<TEntity, number>;

    constructor(private TEntityClass:any,
                private baseUrl:string,
                private $http:IHttpService,
                private $q:IQService) {
      this.cache = new Cache<TEntity, number>();
    }

    public create():TEntity {
      return new this.TEntityClass(this.$http, this.baseUrl)
    }

    public query(query:any):ObjectWithPromise<TEntity[]> {
      var queryParams = $.param(query);
      let entities:ObjectWithPromise<TEntity[]> = [];
      var httpPromise = this.$http.get<PagedResults<TEntity>>(getRestfulUrl(this.baseUrl) + '?' + queryParams);
      var queryDeferred = this.$q.defer<TEntity[]>();
      httpPromise.then((response) => {
        for (let entity of response.data.results) {
          entities.push(entity);
          // Since we already get some entities back, we might as well cache them.
          this.cache.put(entity.id, entity);
        }
        queryDeferred.resolve(entities);
      }, (reason) => {
        queryDeferred.reject(reason);
      });
      entities.promise = queryDeferred.promise;
      return entities;
    }

    public pagedQuery(query:any):ObjectWithPromise<PagedResults<TEntity>> {
      var queryParams = $.param(query);
      let pagedEntities:ObjectWithPromise<PagedResults<TEntity>> = new PagedResults<TEntity>();
      var promise = this.$http.get<PagedResults<TEntity>>(getRestfulUrl(this.baseUrl) + '?' + queryParams);
      promise.then((response) => {
        pagedEntities.count = response.data.count;
        pagedEntities.next = response.data.next;
        pagedEntities.previous = response.data.previous;
        pagedEntities.results = [];
        for (let entity of response.data.results) {
          pagedEntities.results.push(entity);
          // Since we already get some entities back, we might as well cache them.
          this.cache.put(entity.id, entity);
        }
      });
      pagedEntities.promise = promise;
      return pagedEntities;
    }

    public get(id:number):TEntity;
    public get(ids:number[]):ObjectWithPromise<TEntity[]>;
    public get(idOrIds:number|number[]):TEntity|ObjectWithPromise<TEntity[]> {
      if (Array.isArray(idOrIds) && typeof(idOrIds[0]) === 'number') {
        return this.getByMultipleIds(<number[]>idOrIds);
      } else if (typeof(idOrIds) === 'number') {
        return this.getBySingleId(<number>idOrIds);
      } else {
        throw 'Invalid argument passed to get(). Arugment should be a number or an array of numbers.'
      }
    }

    private getBySingleId(id:number):TEntity {
      return this.getByMultipleIds([id])[0];
    }

    private getByMultipleIds(ids:number[]):ObjectWithPromise<TEntity[]> {
      // Which objects do we already have in the cache?
      let entities:ObjectWithPromise<TEntity[]> = [];
      let entitiesToFetch:number[] = [];

      // Check the cache to see which entities we already have and which ones
      // we need to fetch from the cache.
      var deferredsToResolve = {};
      for (let id of ids) {
        let entity = this.cache.get(id);
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
          this.cache.put(id, entity);
          entitiesToFetch.push(id);
          entities.push(entity);

          // Create a promise object in the entity in case the user wants to
          // get notified when the object is loaded or an error happens.
          let deferred = this.$q.defer();
          entity.promise = deferred.promise;

          // Save an instance of the deferred so we could resolve it later
          // when we get the response.
          deferredsToResolve[id] = deferred;
        }
      }

      // Requests the entities we don't have from the RESTful API.
      if (entitiesToFetch.length > 0) {
        var httpPromise = this.$http.get<{results:TEntity[]}>(getRestfulUrl(this.baseUrl, entitiesToFetch));
        var entitiesDeferred = this.$q.defer<TEntity[]>();
        httpPromise.then((response) => {
          for (let entity of response.data.results) {
            this.cache.get(entity.id).set(entity);

            // Resolve the promise object of the entity.
            deferredsToResolve[entity.id].resolve(entity);
          }
          entitiesDeferred.resolve(entities);
        }, (reason) => {
          for (let entity of entities) {
            // Rejects the promise object of the entity.
            deferredsToResolve[entity.id].reject(reason);
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

  export class Hadith extends Entity {
    text:string;
    person:number;
    book:number;
    tags:number[];
  }

  HadithHouse.HadithHouseApp.factory('HadithResource',
    ($http:IHttpService, $q:IQService):CacheableResource<Hadith> => {
      return new CacheableResource<Hadith>(Hadith, '/apis/hadiths', $http, $q);
    });

  //============================================================================
  // Person Resource
  //============================================================================

  export class Person extends Entity {
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

  HadithHouse.HadithHouseApp.factory('PersonResource',
    ($http:IHttpService, $q:IQService):CacheableResource<Person> => {
      return new CacheableResource<Person>(Person, '/apis/persons', $http, $q);
    });

  //============================================================================
  // Book Resource
  //============================================================================

  export class Book extends Entity {
    title:string;
    brief_desc:string;
    pub_year:number;
  }

  HadithHouse.HadithHouseApp.factory('BookResource',
    ($http:IHttpService, $q:IQService):CacheableResource<Book> => {
      return new CacheableResource<Book>(Book, '/apis/books', $http, $q);
    });

  //============================================================================
  // HadithTag Resource
  //============================================================================

  export class HadithTag extends Entity {
    name:string;
  }

  HadithHouse.HadithHouseApp.factory('HadithTagResource',
    ($http:IHttpService, $q:IQService):CacheableResource<HadithTag> => {
      return new CacheableResource<HadithTag>(HadithTag, '/apis/hadithtags', $http, $q);
    });

  //============================================================================
  // Chain Resource
  //============================================================================

  export class Chain extends Entity {
    hadith:number;
    persons:Array<number>;
    isEditing:boolean;
    isAddingNew:boolean;
  }

  HadithHouse.HadithHouseApp.factory('ChainResource',
    ($http:IHttpService, $q:IQService):CacheableResource<Chain> => {
      return new CacheableResource<Chain>(Chain, '/apis/chains/', $http, $q);
    });

  //============================================================================
  // User Resource
  //============================================================================

  export class User extends Entity {
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

  HadithHouse.HadithHouseApp.factory('UserResource',
    ($http:IHttpService, $q:IQService):CacheableResource<User> => {
      return new CacheableResource<User>(User, '/apis/users', $http, $q);
    });
}
