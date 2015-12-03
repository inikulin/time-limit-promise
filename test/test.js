var assert    = require('assert');
var Promise   = require('pinkie-promise');
var timeLimit = require('../');

function createTestPromise () {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve('test-promise');
        }, 150);
    });
}

it('Should resolve promise', function () {
    var promise = createTestPromise();

    return timeLimit(promise, 1000)
        .then(function (val) {
            assert.strictEqual(val, 'test-promise');
        });
});

it('Should resolve promise on timeout', function () {
    var promise = createTestPromise();

    return timeLimit(promise, 30)
        .then(function (val) {
            assert(!val);
        });
});

it('Should resolve promise on timeout with the provided value', function () {
    var promise = createTestPromise();

    return timeLimit(promise, 30, { resolveWith: 'timeout' })
        .then(function (val) {
            assert.strictEqual(val, 'timeout');
        });
});


it('Should reject promise on timeout with the provided value', function () {
    var promise = createTestPromise();
    var error   = new Error('timeout');

    return timeLimit(promise, 30, { rejectWith: error })
        .then(function () {
            throw new Error('Promise rejection expected');
        })
        .catch(function (val) {
            assert.strictEqual(val, error);
        });
});
