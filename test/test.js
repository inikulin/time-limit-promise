var assert    = require('assert');
var Promise   = require('pinkie-promise');
var timeLimit = require('../');
var fork      = require('child_process').fork;

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

it('Should resolve promise on timeout even with a new Promise that does not resolve', function () {
    // This test forks a process that uses the time-limit-promise implementation.
    // The behavior being reproduced depends on being able to be sure that the
    // event loop is empty when it executes and mocha installs too many timers
    // and other work to reproduce the conditions needed.
    var child = fork('./test/bad-promise-example');
    return new Promise(function (resolve, reject) {
        child.on('exit', function (code) {
            if (code !== 42) {
                console.log('Result', code);
                throw new Error('The process did not execute the then block');
            }
            resolve();
        });
        child.on('error', reject);
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
