module.exports = function (promise, timeout, opts) {
    var Promise     = promise.constructor;
    var rejectWith  = opts && opts.rejectWith;
    var resolveWith = opts && opts.resolveWith;
    var timer;

    var timeoutPromise = new Promise(function (resolve, reject) {
        timer = setTimeout(function () {
            if (rejectWith !== void 0)
                reject(rejectWith);
            else
                resolve(resolveWith);
        }, timeout);
    });

    return Promise.race([timeoutPromise, promise])
        .then(function (value) {
            if (timer.unref) timer.unref();
            return value;
        }, function (error) {
            if (timer.unref) timer.unref();
            throw error;
        });
};
