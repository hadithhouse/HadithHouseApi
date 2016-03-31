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
     * Sets the values of this entity to the values of the given entity.
     * @param object The entity to copy values from.
     */
    public set(entity:Entity) {
      this.id = entity.id;
      this.added_by = entity.added_by;
      this.updated_by = entity.updated_by;
      this.added_on = entity.added_on;
      this.updated_on = entity.updated_on;
    }

    public save() {
      let url = getRestfulUrl(this.baseUrl, this.id);
      if (!this.id) {
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
          // NOTE: If there is an object in the cache already, don't overwrite it,
          // update it. This way other code parts which reference it will
          // automatically get the updated values.
          var entityInCache = this.cache.get(entity.id, true /* Returns expired */);
          if (!entityInCache) {
            entityInCache = this.create();
          }
          entityInCache.set(entity);
          this.cache.put(entity.id, entityInCache);
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
          // NOTE: If there is an object in the cache already, don't overwrite it,
          // update it. This way other code parts which reference it will
          // automatically get the updated values.
          var entityInCache = this.cache.get(entity.id, true /* Returns expired */);
          if (!entityInCache) {
            entityInCache = this.create();
          }
          entityInCache.set(entity);
          this.cache.put(entity.id, entityInCache);
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

    public set(entity:Entity) {
      super.set(entity);
      this.text = (<Hadith>entity).text;
      this.person = (<Hadith>entity).person;
      this.book = (<Hadith>entity).book;
      this.tags = (<Hadith>entity).tags.slice();
    }
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

    public set(entity:Entity) {
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

    public set(entity:Entity) {
      super.set(entity);
      this.title = (<Book>entity).title;
      this.brief_desc = (<Book>entity).brief_desc;
      this.pub_year = (<Book>entity).pub_year;
    }
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

    public set(entity:Entity) {
      super.set(entity);
      this.name = (<HadithTag>entity).name;
    }
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

    public set(entity:Entity) {
      super.set(entity);
      this.hadith = (<Chain>entity).hadith;
      this.persons = (<Chain>entity).persons.slice();
      this.isEditing = (<Chain>entity).isEditing;
      this.isAddingNew = (<Chain>entity).isAddingNew;
    }
  }

  HadithHouse.HadithHouseApp.factory('ChainResource',
    ($http:IHttpService, $q:IQService):CacheableResource<Chain> => {
      return new CacheableResource<Chain>(Chain, '/apis/chains/', $http, $q);
    });

  //============================================================================
  // User Resource
  //============================================================================

  export class User extends Entity {
    first_name:string;
    last_name:string;
    is_superuser:boolean;
    is_staff:boolean;
    username:string;
    date_joined:string;
    permissions:Array<string>;
    permissionsOrdered:Array<string>;

    public set(entity:Entity) {
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
    ($http:IHttpService, $q:IQService):CacheableResource<User> => {
      return new CacheableResource<User>(User, '/apis/users', $http, $q);
    });
}
