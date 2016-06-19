/// <reference path="../../../../../TypeScriptDefs/moment/moment.d.ts" />

module HadithHouse.Caching {
  import Moment = moment.Moment;

  /**
   * Used by Cache class to cache objects.
   */
  export class CacheEntry<TObject, TKey> {
    public expiryTime:Moment;
    public key:TKey;
    public object:TObject;

    public isExpired():boolean {
      let now = moment();
      return this.expiryTime.isBefore(now);
    }
  }

  /**
   * Supports caching object for specified periods of time.
   */
  export class Cache<TObject, TKey> {
    private objectDict:any;

    /**
     * Constructs a new cache object.
     * @param defaultCachingPeriod Default caching time in minutes.
     */
    constructor(private defaultCachingPeriod = 5) {
      this.objectDict = {};
    }

    /**
     * Put an object into the cache.
     * @param key The key of the object.
     * @param object The object.
     * @param cachingPeriod The 
     */
    public put(key:TKey, object:TObject, cachingPeriod:number = this.defaultCachingPeriod) {
      let entry = new CacheEntry<TObject, TKey>();
      entry.key = key;
      entry.expiryTime = moment().add(cachingPeriod, 'minutes');
      entry.object = object;
      this.objectDict[key.toString()] = entry;
    }

    /**
     * Retrieves an object from the cache.
     * @param key The key of the object.
     * @param returnsExpired Set to true if you want to retrieve expired entries as well.
     * @returns The cached object or null if no object with the given key is
     * cached or it has expired.
     */
    public get(key:TKey, returnsExpired = true):TObject {
      let entry = this.objectDict[key.toString()];
      if (!entry || (entry.isExpired() && !returnsExpired)) {
        return null;
      }
      return entry.object;
    }
  }
}
