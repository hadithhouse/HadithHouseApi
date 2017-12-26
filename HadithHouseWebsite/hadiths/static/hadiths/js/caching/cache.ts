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

import moment from "moment";

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
