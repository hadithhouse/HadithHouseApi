/// <reference path="../../../../../TypeScriptDefs/angularjs/angular.d.ts" />
/// <reference path="../caching/cache.ts" />
/// <reference path="../app.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HadithHouse;
(function (HadithHouse) {
    var Resources;
    (function (Resources) {
        var Cache = HadithHouse.Caching.Cache;
        function getRestfulUrl(baseUrl, idOrIds) {
            if (!idOrIds) {
                return baseUrl;
            }
            else if (typeof (idOrIds) === 'number') {
                return baseUrl + "/" + idOrIds;
            }
            else {
                var ids = idOrIds.join(',');
                return baseUrl + "?id=" + ids;
            }
        }
        var Entity = (function () {
            function Entity($http, baseUrl, idOrObject) {
                this.$http = $http;
                this.baseUrl = baseUrl;
                if (!idOrObject) {
                    return;
                }
                else if (idOrObject instanceof Number) {
                    this.load(idOrObject);
                }
                else {
                    this.set(idOrObject);
                }
            }
            /**
             * Loads the entity having the given ID.
             * @param id The ID of the entity to load.
             */
            Entity.prototype.load = function (id) {
                var _this = this;
                this.$http.get(getRestfulUrl(this.baseUrl, id)).then(function (result) {
                    _this.set(result);
                });
            };
            /**
             * Sets the entity from the the given object.
             * @param object The object.
             */
            Entity.prototype.set = function (object) {
                for (var key in object) {
                    this[key] = object[key];
                }
            };
            Entity.prototype.save = function () {
                var url = getRestfulUrl(this.baseUrl, this.id);
                if (this.id) {
                    return this.$http.post(url, this);
                }
                else {
                    return this.$http.put(url, this);
                }
            };
            /**
             * Delete the object.
             */
            Entity.prototype.delete = function () {
                var url = getRestfulUrl(this.baseUrl, this.id);
                return this.$http.delete(url);
            };
            return Entity;
        }());
        Resources.Entity = Entity;
        var EntityArray = (function (_super) {
            __extends(EntityArray, _super);
            function EntityArray() {
                _super.apply(this, arguments);
            }
            return EntityArray;
        }(Array));
        Resources.EntityArray = EntityArray;
        var CacheableResource = (function () {
            function CacheableResource(TEntityClass, baseUrl, $http, $q) {
                this.TEntityClass = TEntityClass;
                this.baseUrl = baseUrl;
                this.$http = $http;
                this.$q = $q;
                this.cache = new Cache();
            }
            CacheableResource.prototype.get = function (idOrIds) {
                if (typeof (idOrIds) === 'number') {
                    return this.getBySingleId(idOrIds);
                }
                else {
                    return this.getByMultipleIds(idOrIds);
                }
            };
            CacheableResource.prototype.query = function (query) {
                var _this = this;
                var entities = [];
                this.$http.get(getRestfulUrl(this.baseUrl) + '?search=' + query)
                    .then(function (response) {
                    for (var _i = 0, _a = response.data.results; _i < _a.length; _i++) {
                        var entity = _a[_i];
                        entities.push(entity);
                        // Since we already get some entities back, we might as well cache them.
                        _this.cache.put(entity.id, entity);
                    }
                });
                return entities;
            };
            CacheableResource.prototype.getBySingleId = function (id) {
                return this.getByMultipleIds([id])[0];
            };
            CacheableResource.prototype.getByMultipleIds = function (ids) {
                var _this = this;
                // Which objects do we already have in the cache?
                var objects = [];
                var toFetch = [];
                for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                    var id = ids_1[_i];
                    var obj = this.cache.get(id);
                    if (obj != null) {
                        console.log('Found this object in cache, no need to retrieve it:');
                        console.dir(obj);
                        objects.push(obj);
                    }
                    else {
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
                    this.$http.get(getRestfulUrl(this.baseUrl, toFetch))
                        .then(function (response) {
                        for (var _i = 0, _a = response.data.results; _i < _a.length; _i++) {
                            var entity = _a[_i];
                            _this.cache.get(entity.id).set(entity);
                        }
                    });
                }
                return objects;
            };
            return CacheableResource;
        }());
        Resources.CacheableResource = CacheableResource;
        //============================================================================
        // Hadith Resource
        //============================================================================
        var Hadith = (function (_super) {
            __extends(Hadith, _super);
            function Hadith() {
                _super.apply(this, arguments);
            }
            return Hadith;
        }(Entity));
        Resources.Hadith = Hadith;
        HadithHouse.HadithHouseApp.factory('HadithResource', function ($http, $q) {
            return new CacheableResource(Hadith, '/apis/hadiths', $http, $q);
        });
        //============================================================================
        // Person Resource
        //============================================================================
        var Person = (function (_super) {
            __extends(Person, _super);
            function Person() {
                _super.apply(this, arguments);
            }
            return Person;
        }(Entity));
        Resources.Person = Person;
        HadithHouse.HadithHouseApp.factory('PersonResource', function ($http, $q) {
            return new CacheableResource(Person, '/apis/persons', $http, $q);
        });
        //============================================================================
        // Book Resource
        //============================================================================
        var Book = (function (_super) {
            __extends(Book, _super);
            function Book() {
                _super.apply(this, arguments);
            }
            return Book;
        }(Entity));
        Resources.Book = Book;
        HadithHouse.HadithHouseApp.factory('BookResource', function ($http, $q) {
            return new CacheableResource(Book, '/apis/books', $http, $q);
        });
        //============================================================================
        // HadithTag Resource
        //============================================================================
        var HadithTag = (function (_super) {
            __extends(HadithTag, _super);
            function HadithTag() {
                _super.apply(this, arguments);
            }
            return HadithTag;
        }(Entity));
        Resources.HadithTag = HadithTag;
        HadithHouse.HadithHouseApp.factory('HadithTagResource', function ($http, $q) {
            return new CacheableResource(HadithTag, '/apis/hadithtags', $http, $q);
        });
        //============================================================================
        // Chain Resource
        //============================================================================
        var Chain = (function (_super) {
            __extends(Chain, _super);
            function Chain() {
                _super.apply(this, arguments);
            }
            return Chain;
        }(Entity));
        Resources.Chain = Chain;
        HadithHouse.HadithHouseApp.factory('ChainResource', function ($http, $q) {
            return new CacheableResource(Chain, '/apis/chains/', $http, $q);
        });
        //============================================================================
        // User Resource
        //============================================================================
        var User = (function (_super) {
            __extends(User, _super);
            function User() {
                _super.apply(this, arguments);
            }
            return User;
        }(Entity));
        Resources.User = User;
        HadithHouse.HadithHouseApp.factory('UserResource', function ($http, $q) {
            return new CacheableResource(User, '/apis/users', $http, $q);
        });
    })(Resources = HadithHouse.Resources || (HadithHouse.Resources = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=resources.js.map