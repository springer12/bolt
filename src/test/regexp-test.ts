/*
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="../typings/node.d.ts" />

var bolt = (typeof(window) !== 'undefined' && window.bolt) || require('../bolt');
var rulesSuite = bolt.rulesSuite;
var secrets = require('../../auth-secrets');

rulesSuite("RegExp", function(test) {
  test.database(secrets.APP, secrets.SECRET);
  test.rules('samples/regexp');

  test("SocialSecurity", (rules) => {
    rules
      .at('/ss')
      .write('000-00-0000')
      .succeeds("All zeros.")

      .write('123-45-6789')
      .succeeds("All numbers.")

      .write('000-0a-0000')
      .fails("Contains letter.")

      .write('000-00-00000')
      .fails("Too long.")

      .write('000-0-000')
      .fails("Too short.")

      .write('00000000')
      .fails("Missing dashes.")
    ;
  });

  test("IntegerString", (rules) => {
    rules
      .at('/integer')
      .write('0')
      .succeeds("Zero.")

      .write('')
      .fails("Empty string.")

      .write('a')
      .fails("Alphabetic.")

      .write(' 0')
      .fails("Has spaces.")

      .write('0.0')
      .fails("Has decimal.")
    ;
  });

  test("FloatString", (rules) => {
    rules
      .at('/float')
      .write('0.0')
      .succeeds("Zero.")

      .write('123.456')
      .succeeds("Fixed point number.")

      .write('.0')
      .fails("No leading digits.")

      .write('0.')
      .succeeds("No trailing digits.")

      .write('0')
      .fails("Zero.")

      .write('')
      .fails("Empty string.")

      .write('a')
      .fails("Alphabetic.")

      .write(' 0')
      .fails("Has spaces.")
    ;
  });

  test("Integer", (rules) => {
    rules
      .at('/int')
      .write(0)
      .succeeds("Zero")

      .write(0.0)
      .succeeds("Floating Zero")

      .write(1.1)
      .fails("No fractional part allowed.")

      .write('0')
      .fails("String.")
    ;
  });

  test("Alpha", (rules) => {
    rules
      .at('/alpha')
      .write('a')
      .succeeds("Alpha")

      .write('A')
      .succeeds("Alpha")

      .write("hello")
      .succeeds("Word.")

      .write("123")
      .fails("Numeric.")

      .write(1)
      .fails("Number.")

      .write(true)
      .fails("Boolean.")

      .write("hello, world")
      .fails("Non-alpha.")
    ;
  });

  test("Year", (rules) => {
    rules
      .at('/year')
      .write('2015')
      .succeeds("This year.")

      .write('1900')
      .succeeds("Earliest year.")

      .write('1999')
      .succeeds("Latest in 20th century.")

      .write('2099')
      .succeeds("Latest in 21th century.")

      .write('2015 ')
      .fails("Extra space.")

      .write('2100')
      .fails("Distant future.")

      .write(1960)
      .fails("Number.")

      .write('')
      .fails("Empty string.")
    ;
  });

  test("ISODate", (rules) => {
    rules
      .at('/date')
      .write('2015-11-20')
      .succeeds("Today.")

      .write('1900-01-01')
      .succeeds("Earliest date.")

      .write('2099-12-31')
      .succeeds("Latest date.")

      .write('1899-12-31')
      .fails("Too early date.")

      .write('2100-01-01')
      .fails("Too late date.")

      .write('')
      .fails("Empty string.")
    ;
  });
});
