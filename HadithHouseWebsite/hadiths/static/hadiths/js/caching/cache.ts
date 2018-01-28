/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Rafid Khalid Al-Humaimidi
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

/**
 * Used by Cache class to cache objects.
 */
export class CacheEntry<TObject> {
  public expiryTime: moment.Moment;
  public key: string;
  public object: TObject;

  public isExpired(): boolean {
    const now = moment();
    return this.expiryTime.isBefore(now);
  }
}

/**
 * Supports caching object for specified periods of time.
 */
export class Cache<TObject> {
  private objectDict: { [key: string]: CacheEntry<TObject> };

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
   * @param cachingPeriod The caching period in minutes.
   */
  public put(key: string, object: TObject,
             cachingPeriod: number = this.defaultCachingPeriod) {
    if (key === null || typeof(key) === "undefined") {
      throw new Error("Parameter 'key' cannot be null or undefined.");
    }
    const entry = new CacheEntry<TObject>();
    entry.key = key.toString();
    entry.expiryTime = moment().add(cachingPeriod, "minutes");
    entry.object = object;
    this.objectDict[key.toString()] = entry;
  }

  /**
   * Retrieves an object from the cache.
   * @param key The key of the object.
   * @param returnsExpired Set to true if you want to retrieve expired entries
   * as well.
   * @returns The cached object or null if no object with the given key is
   * cached or it has expired.
   */
  public get(key: string, returnsExpired = true): TObject {
    if (key === null || typeof(key) === "undefined") {
      throw new Error("Parameter 'key' cannot be null or undefined.");
    }
    const entry = this.objectDict[key.toString()];
    if (!entry || (entry.isExpired() && returnsExpired !== true)) {
      return null;
    }
    return entry.object;
  }
}
