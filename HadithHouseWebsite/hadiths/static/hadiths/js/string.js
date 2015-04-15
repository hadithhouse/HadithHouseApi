/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Rafid K. Abdullah
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

/**
 * Contains extensions to JavaScript string object.
 * @author rafidka@gmail.com (Rafid K. Abdullah)
 */

if (!String.prototype.format) {
  /**
   * Formats a string by replacing placeholders of the form {...} with the
   * corresponding given indexed or named arguments.
   *
   * The arguments are a set of indexed and named arguments to replace the
   * placeholders in the string.
   *
   * This is taken from this from this Stack Overflow answer:
   * http://stackoverflow.com/a/4673436/196697
   * and is thus bound by StackOverflow licence, which is licenced under
   * CC-BY-SA 3.0 at the time of writing this comment, Jan-18 2014.
   *
   * @return {String} The formatted string.
   */
  String.prototype.format = function() {
    'use strict';
    var args;
    args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return args[number] !== 'undefined' ? args[number] : match;
    });
  };
}
