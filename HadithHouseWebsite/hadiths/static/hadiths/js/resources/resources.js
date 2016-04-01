/// <reference path="../../../../../TypeScriptDefs/angularjs/angular.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/lodash/lodash.d.ts" />
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
            else if (!Array.isArray(idOrIds)) {
                return baseUrl + "/" + idOrIds;
            }
            else {
                if (idOrIds.length == 1) {
                    // If there is one ID only, pass directly in the URL path. This
                    // is necessary for special requests like hadiths/random or
                    // users/current.
                    return baseUrl + "/" + idOrIds;
                }
                else {
                    var ids = idOrIds.join(',');
                    return baseUrl + "?id=" + ids;
                }
            }
        }
        var Entity = (function () {
            function Entity($http, baseUrl, idOrObject) {
                this.$http = $http;
                this.baseUrl = baseUrl;
                if (!idOrObject) {
                    return;
                }
                else if (typeof (idOrObject) === 'number' || typeof (idOrObject) === 'string') {
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
                    _this.set(result.data);
                });
            };
            /**
             * Sets the values of this entity to the values of the given entity.
             * @param object The entity to copy values from.
             */
            Entity.prototype.set = function (entity) {
                this.id = entity.id;
                this.added_by = entity.added_by;
                this.updated_by = entity.updated_by;
                this.added_on = entity.added_on;
                this.updated_on = entity.updated_on;
            };
            Entity.prototype.save = function () {
                var _this = this;
                var url = getRestfulUrl(this.baseUrl, this.id);
                if (!this.id) {
                    var promise = this.$http.post(url, this);
                    promise.then(function (response) {
                        // TODO: We should copy all the object to save other auto-generated TODO.
                        _this.id = response.data.id;
                    });
                    return promise;
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
        var PagedResults = (function () {
            function PagedResults() {
            }
            return PagedResults;
        }());
        Resources.PagedResults = PagedResults;
        var CacheableResource = (function () {
            function CacheableResource(TEntityClass, baseUrl, $http, $q) {
                this.TEntityClass = TEntityClass;
                this.baseUrl = baseUrl;
                this.$http = $http;
                this.$q = $q;
                this.cache = new Cache();
            }
            CacheableResource.prototype.create = function () {
                return new this.TEntityClass(this.$http, this.baseUrl);
            };
            CacheableResource.prototype.query = function (query, useCache) {
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                var queryParams = $.param(query);
                var entities = [];
                var httpPromise = this.$http.get(getRestfulUrl(this.baseUrl) + '?' + queryParams);
                var queryDeferred = this.$q.defer();
                httpPromise.then(function (response) {
                    for (var _i = 0, _a = response.data.results; _i < _a.length; _i++) {
                        var entity = _a[_i];
                        entities.push(entity);
                        // Since we already get some entities back, we might as well cache them.
                        // NOTE: If there is an object in the cache already, don't overwrite it,
                        // update it. This way other code parts which reference it will
                        // automatically get the updated values.
                        var entityInCache = useCache ? _this.cache.get(entity.id.toString(), true /* Returns expired */) : null;
                        if (!entityInCache) {
                            entityInCache = _this.create();
                        }
                        entityInCache.set(entity);
                        if (useCache) {
                            _this.cache.put(entity.id.toString(), entityInCache);
                        }
                    }
                    queryDeferred.resolve(entities);
                }, function (reason) {
                    queryDeferred.reject(reason);
                });
                entities.promise = queryDeferred.promise;
                return entities;
            };
            CacheableResource.prototype.pagedQuery = function (query, useCache) {
                var _this = this;
                if (useCache === void 0) { useCache = true; }
                var queryParams = $.param(query);
                var pagedEntities = new PagedResults();
                var promise = this.$http.get(getRestfulUrl(this.baseUrl) + '?' + queryParams);
                promise.then(function (response) {
                    pagedEntities.count = response.data.count;
                    pagedEntities.next = response.data.next;
                    pagedEntities.previous = response.data.previous;
                    pagedEntities.results = [];
                    for (var _i = 0, _a = response.data.results; _i < _a.length; _i++) {
                        var entity = _a[_i];
                        pagedEntities.results.push(entity);
                        // Since we already get some entities back, we might as well cache them.
                        // NOTE: If there is an object in the cache already, don't overwrite it,
                        // update it. This way other code parts which reference it will
                        // automatically get the updated values.
                        var entityInCache = useCache ? _this.cache.get(entity.id.toString(), true /* Returns expired */) : null;
                        if (!entityInCache) {
                            entityInCache = _this.create();
                        }
                        entityInCache.set(entity);
                        if (useCache) {
                            _this.cache.put(entity.id.toString(), entityInCache);
                        }
                    }
                });
                pagedEntities.promise = promise;
                return pagedEntities;
            };
            CacheableResource.prototype.get = function (idOrIds, useCache) {
                if (useCache === void 0) { useCache = true; }
                if (Array.isArray(idOrIds)) {
                    // An array of IDs.
                    return this.getByMultipleIds(idOrIds, useCache);
                }
                else {
                    // A single ID.
                    return this.getBySingleId(idOrIds, useCache);
                }
            };
            CacheableResource.prototype.getBySingleId = function (id, useCache) {
                if (useCache === void 0) { useCache = true; }
                return this.getByMultipleIds([id], useCache)[0];
            };
            CacheableResource.prototype.getByMultipleIds = function (ids, useCache) {
                if (useCache === void 0) { useCache = true; }
                // Which objects do we already have in the cache?
                var entities = [];
                var idsOfEntitiesToFetch = [];
                // Remove duplicated IDs before starting.
                ids = _.uniq(ids);
                // Check the cache to see which entities we already have and which ones
                // we need to fetch from the cache.
                var deferredsToResolve = {};
                for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                    var id = ids_1[_i];
                    var entity = useCache ? this.cache.get(id.toString()) : null;
                    if (entity != null) {
                        entities.push(entity);
                        // Create a promise object in the entity in case the user wants to
                        // get notified when the object is loaded or an error happens. Here,
                        // though, we resolve it immediately because we already have it in
                        // the cache.
                        var deferred = this.$q.defer();
                        entity.promise = deferred.promise;
                        deferred.resolve(entity);
                    }
                    else {
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
                        var deferred = this.$q.defer();
                        entity.promise = deferred.promise;
                        // Save an instance of the deferred so we could resolve it later
                        // when we get the response.
                        deferredsToResolve[id.toString()] = deferred;
                    }
                }
                // Requests the entities we don't have from the RESTful API.
                if (idsOfEntitiesToFetch.length > 1) {
                    var httpPromise = this.$http.get(getRestfulUrl(this.baseUrl, idsOfEntitiesToFetch));
                    var entitiesDeferred_1 = this.$q.defer();
                    httpPromise.then(function (response) {
                        // Now that we receive the data from the server, start filling in the
                        // entities we returned to the user and resolving their promises.
                        var _loop_1 = function(entity) {
                            _.each(_.filter(entities, function (e) { return e.id === entity.id; }), function (e) {
                                e.set(entity);
                            });
                            // Resolve the promise object of the entity.
                            deferredsToResolve[entity.id.toString()].resolve(entity);
                        };
                        for (var _i = 0, _a = response.data.results; _i < _a.length; _i++) {
                            var entity = _a[_i];
                            _loop_1(entity);
                        }
                        entitiesDeferred_1.resolve(entities);
                    }, function (reason) {
                        for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
                            var entity = entities_1[_i];
                            // Rejects the promise object of the entity.
                            deferredsToResolve[entity.id.toString()].reject(reason);
                        }
                        entitiesDeferred_1.reject(reason);
                    });
                    entities.promise = entitiesDeferred_1.promise;
                }
                else if (idsOfEntitiesToFetch.length == 1) {
                    // Cannot use the same variable name as above with different type :-S
                    // How is let useful over var then?
                    var httpPromise2 = this.$http.get(getRestfulUrl(this.baseUrl, idsOfEntitiesToFetch));
                    var entitiesDeferred_2 = this.$q.defer();
                    httpPromise2.then(function (response) {
                        var entity = response.data;
                        _.each(_.filter(entities, function (e) { return e.id === entity.id; }), function (e) {
                            e.set(entity);
                        });
                        // Resolve the promise object of the entity.
                        deferredsToResolve[entity.id.toString()].resolve(entity);
                        entitiesDeferred_2.resolve(entities);
                    }, function (reason) {
                        for (var _i = 0, entities_2 = entities; _i < entities_2.length; _i++) {
                            var entity = entities_2[_i];
                            // Rejects the promise object of the entity.
                            deferredsToResolve[entity.id.toString()].reject(reason);
                        }
                        entitiesDeferred_2.reject(reason);
                    });
                    entities.promise = entitiesDeferred_2.promise;
                }
                else {
                    // Nothing to fetch, so create promise object that resolves immediately.
                    var deferred = this.$q.defer();
                    entities.promise = deferred.promise;
                    deferred.resolve(entities);
                }
                return entities;
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
            Hadith.prototype.set = function (entity) {
                _super.prototype.set.call(this, entity);
                this.text = entity.text;
                this.person = entity.person;
                this.book = entity.book;
                this.tags = entity.tags.slice();
            };
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
            Person.prototype.set = function (entity) {
                _super.prototype.set.call(this, entity);
                this.title = entity.title;
                this.display_name = entity.display_name;
                this.full_name = entity.full_name;
                this.brief_desc = entity.brief_desc;
                this.birth_year = entity.birth_year;
                this.birth_month = entity.birth_month;
                this.birth_day = entity.birth_day;
                this.death_year = entity.death_year;
                this.death_month = entity.death_month;
                this.death_day = entity.death_day;
            };
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
            Book.prototype.set = function (entity) {
                _super.prototype.set.call(this, entity);
                this.title = entity.title;
                this.brief_desc = entity.brief_desc;
                this.pub_year = entity.pub_year;
            };
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
            HadithTag.prototype.set = function (entity) {
                _super.prototype.set.call(this, entity);
                this.name = entity.name;
            };
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
            Chain.prototype.set = function (entity) {
                _super.prototype.set.call(this, entity);
                this.hadith = entity.hadith;
                this.persons = entity.persons.slice();
                this.isEditing = entity.isEditing;
                this.isAddingNew = entity.isAddingNew;
            };
            return Chain;
        }(Entity));
        Resources.Chain = Chain;
        HadithHouse.HadithHouseApp.factory('ChainResource', function ($http, $q) {
            return new CacheableResource(Chain, '/apis/chains', $http, $q);
        });
        //============================================================================
        // User Resource
        //============================================================================
        var User = (function (_super) {
            __extends(User, _super);
            function User() {
                _super.apply(this, arguments);
            }
            User.prototype.set = function (entity) {
                _super.prototype.set.call(this, entity);
                this.first_name = entity.first_name;
                this.last_name = entity.last_name;
                this.is_superuser = entity.is_superuser;
                this.is_staff = entity.is_staff;
                this.username = entity.username;
                this.date_joined = entity.date_joined;
                this.permissions = entity.permissions.slice();
                this.permissionsOrdered = (entity.permissionsOrdered != null)
                    ? entity.permissionsOrdered.slice()
                    : null;
            };
            return User;
        }(Entity));
        Resources.User = User;
        HadithHouse.HadithHouseApp.factory('UserResource', function ($http, $q) {
            return new CacheableResource(User, '/apis/users', $http, $q);
        });
    })(Resources = HadithHouse.Resources || (HadithHouse.Resources = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=resources.js.map