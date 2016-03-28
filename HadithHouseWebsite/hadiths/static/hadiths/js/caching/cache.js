/// <reference path="../../../../../TypeScriptDefs/moment/moment.d.ts" />
var HadithHouse;
(function (HadithHouse) {
    var Caching;
    (function (Caching) {
        /**
         * Used by Cache class to cache objects.
         */
        var CacheEntry = (function () {
            function CacheEntry() {
            }
            CacheEntry.prototype.isExpired = function () {
                var now = moment();
                return this.expiryTime.isBefore(now);
            };
            return CacheEntry;
        }());
        Caching.CacheEntry = CacheEntry;
        /**
         * Supports caching object for specified periods of time.
         */
        var Cache = (function () {
            /**
             * Constructs a new cache object.
             * @param defaultCachingPeriod Default caching time in minutes.
             */
            function Cache(defaultCachingPeriod) {
                if (defaultCachingPeriod === void 0) { defaultCachingPeriod = 5; }
                this.defaultCachingPeriod = defaultCachingPeriod;
                this.objectDict = {};
            }
            /**
             * Put an object into the cache.
             * @param key The key of the object.
             * @param object The object.
             * @param cachingPeriod The
             */
            Cache.prototype.put = function (key, object, cachingPeriod) {
                if (cachingPeriod === void 0) { cachingPeriod = this.defaultCachingPeriod; }
                var entry = new CacheEntry();
                entry.key = key;
                entry.expiryTime = moment().add(cachingPeriod, 'minutes');
                entry.object = object;
                this.objectDict[key.toString()] = entry;
            };
            /**
             * Retrieves an object from the cache.
             * @param key The key of the object.
             * @param returnsExpired Set to true if you want to retrieve expired entries as well.
             * @returns The cached object or null if no object with the given key is
             * cached or it has expired.
             */
            Cache.prototype.get = function (key, returnsExpired) {
                if (returnsExpired === void 0) { returnsExpired = true; }
                var entry = this.objectDict[key.toString()];
                if (!entry || (entry.isExpired() && !returnsExpired)) {
                    return null;
                }
                return entry.object;
            };
            return Cache;
        }());
        Caching.Cache = Cache;
    })(Caching = HadithHouse.Caching || (HadithHouse.Caching = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=cache.js.map