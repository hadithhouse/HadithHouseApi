/// <reference path="../../../../../TypeScriptDefs/angularjs/angular.d.ts" />
/// <reference path="../caching/cache.ts" />
/// <reference path="../app.ts" />

module HadithHouse.Resources {
  import IHttpService = angular.IHttpService;
  import Cache = HadithHouse.Caching.Cache;
  import IQService = angular.IQService;
  import IHttpPromise = angular.IHttpPromise;

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
      this.$http.get(getRestfulUrl(this.baseUrl, id)).then((result) => {
        this.set(<Entity>result);
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
        return this.$http.post(url, this);
      } else {
        return this.$http.put(url, this);
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

  export class EntityArray<T extends Entity> extends Array<T> {

  }

  export class CacheableResource<TEntity extends Entity> {
    cache:Cache<TEntity, number>;

    constructor(private TEntityClass:any,
                private baseUrl:string,
                private $http:IHttpService,
                private $q:IQService) {
      this.cache = new Cache<TEntity, number>();
    }

    public get(id:number):TEntity;
    public get(ids:number[]):TEntity[];
    public get(idOrIds:number|number[]):TEntity|TEntity[] {
      if (typeof(idOrIds) === 'number') {
        return this.getBySingleId(<number>idOrIds);
      } else {
        return this.getByMultipleIds(<number[]>idOrIds);
      }
    }

    public query(query:string):TEntity[] {
      let entities:TEntity[] = [];
      this.$http.get<{results:TEntity[]}>(getRestfulUrl(this.baseUrl) + '?search=' + query)
        .then((response) => {
          for (let entity of response.data.results) {
            entities.push(entity);
            // Since we already get some entities back, we might as well cache them.
            this.cache.put(entity.id, entity);
          }
        });
      return entities;
    }

    private getBySingleId(id:number):TEntity {
      return this.getByMultipleIds([id])[0];
    }

    private getByMultipleIds(ids:number[]):TEntity[] {
      // Which objects do we already have in the cache?
      let objects:TEntity[] = [];
      let toFetch:number[] = [];
      for (let id of ids) {
        let obj = this.cache.get(id);
        if (obj != null) {
          console.log('Found this object in cache, no need to retrieve it:');
          console.dir(obj);

          objects.push(obj);
        } else {
          console.log("Couldn't find this object in cache, need to fetch it:");
          console.dir(id);

          obj = new this.TEntityClass(this.$http, this.baseUrl);
          this.cache.put(id, obj);
          toFetch.push(id);
          objects.push(obj);
        }
      }

      // Create cache objects
      if (toFetch.length > 0) {
        this.$http.get<{results:TEntity[]}>(getRestfulUrl(this.baseUrl, toFetch))
          .then((response) => {
            for (let entity of response.data.results) {
              this.cache.get(entity.id).set(entity);
            }
          });
      }

      return objects;
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
