/* global describe, it */

var assert = require("should");
var depcheck = require("../index");
var path = require("path");

describe("depcheck", function () {
  it("should find unused dependencies", function testUnused(done) {
    var absolutePath = path.resolve("test/fake_modules/bad");

    depcheck(absolutePath, { "withoutDev": true }, function checked(unused) {
      assert.equal(unused.dependencies.length, 1);
      done();
    });
  });

  it("should find unused dependencies in ES6 files", function testUnused(done) {
    var absolutePath = path.resolve("test/fake_modules/bad_es6");

    depcheck(absolutePath, { "withoutDev": true }, function checked(unused) {
      assert.equal(unused.dependencies.length, 1);
      assert.equal(unused.dependencies[0], "dont-find-me");
      done();
    });
  });

  it("should find all dependencies", function testUnused(done) {
    var absolutePath = path.resolve("test/fake_modules/good");

    depcheck(absolutePath, { "withoutDev": true }, function checked(unused) {
      assert.equal(unused.dependencies.length, 0);
      done();
    });
  });

  it("should find all dependencies in ES6 files", function testUnused(done) {
    var absolutePath = path.resolve("test/fake_modules/good_es6");

    depcheck(absolutePath, { "withoutDev": true }, function checked(unused) {
      // See ./good_es6/index.js for more information on the unsupported ES6
      // import syntax, which we assert here as the expected missing import.
      assert.equal(unused.dependencies.length, 1);
      assert.equal(unused.dependencies[0], "unsupported-syntax");
      done();
    });
  });

  it("should find manage grunt dependencies", function testUnused(done) {
    var absolutePath = path.resolve("test/fake_modules/grunt");

    depcheck(absolutePath, { "withoutDev": true }, function checked(unused) {
      assert.equal(unused.dependencies.length, 0);
      done();
    });
  });

  it("should find manage grunt task dependencies", function testUnused(done) {
    var absolutePath = path.resolve("test/fake_modules/grunt-tasks");

    depcheck(absolutePath, { "withoutDev": true }, function checked(unused) {
      assert.equal(unused.dependencies.length, 0);
      done();
    });
  });

  it("should look at devDependencies", function testUnused(done) {
    var absolutePath = path.resolve("test/fake_modules/dev");

    depcheck(absolutePath, { "withoutDev": false }, function checked(unused) {
      assert.equal(unused.devDependencies.length, 1);
      done();
    });
  });

  it("should ignore ignoreDirs", function testUnused(done) {
    var absolutePath = path.resolve("test/fake_modules/bad_deep");

    depcheck(absolutePath, { "ignoreDirs": ['sandbox'] }, function checked(unused) {
      assert.equal(unused.dependencies.length, 1);
      assert.equal(unused.dependencies[0], 'module_bad_deep');
      done();
    });
  });

  it("should ignore ignoreMatches", function testUnused(done) {
    var absolutePath = path.resolve("test/fake_modules/bad");

    depcheck(absolutePath, { "ignoreMatches": ['o*'] }, function checked(unused) {
      assert.equal(unused.dependencies.length, 0);
      done();
    });
  });

  it("should ignore bad javascript", function testBadJS(done) {
    var absolutePath = path.resolve("test/fake_modules/bad_js");

    depcheck(absolutePath, {  }, function checked(unused) {
      assert.equal(unused.dependencies.length, 1);
      //assert.deepEqual(Object.keys(unused.invalidFiles).length, 2);
      done();
    });
  });

  it("should report bad javascript", function testBadJS(done) {
    var absolutePath = path.resolve("test/fake_modules/bad_js");

    depcheck(absolutePath, {  }, function checked(unused) {
      assert.notEqual(unused.invalidFiles, {});
      done();
    });
  });

  it("should recognize nested requires", function testNested(done) {
    var absolutePath = path.resolve("test/fake_modules/nested");

    depcheck(absolutePath, {  }, function checked(unused) {
      assert.equal(unused.dependencies.length, 0);
      done();
    });
  });

  it("should support module names that are numbers", function testNested(done) {
    var absolutePath = path.resolve("test/fake_modules/number");

    depcheck(absolutePath, {  }, function checked(unused) {
      assert.equal(unused.dependencies.length, 0);
      done();
    });
  });

  it("should handle empty JavaScript file", function testEmpty(done) {
    var absolutePath = path.resolve("test/fake_modules/empty");

    depcheck(absolutePath, {}, function checked(unused) {
      assert.equal(unused.dependencies.length, 1);
      done();
    });
  });

  it("should accept acron options and passthrough to parse logic", function testAcronOptions(done) {
    var absolutePath = path.resolve("test/fake_modules/acron-options");

    depcheck(absolutePath, { allowReturnOutsideFunction: true }, function checked(unused) {
      assert.equal(unused.dependencies.length, 0);
      done();
    });
  });

  it("should allow dynamic package metadata", function testDynamic(done) {
    var absolutePath = path.resolve("test/fake_modules/bad");

    depcheck(absolutePath, {
      "package": {
        "dependencies": {
          "optimist": "~0.6.0",
          "express": "^4.0.0"
        }
      }
    }, function checked(unused) {
      assert.equal(unused.dependencies.length, 2);
      done();
    });
  });

});
