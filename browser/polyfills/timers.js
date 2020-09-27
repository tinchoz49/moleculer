/* global window, self */

const scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
const apply = Function.prototype.apply;

// DOM APIs, for completeness
const _setTimeout = setTimeout;
const _setInterval = setInterval;

scope.setTimeout = function() {
	return new Timeout(apply.call(_setTimeout, scope, arguments), clearTimeout);
};
scope.setInterval = function() {
	return new Timeout(apply.call(_setInterval, scope, arguments), clearInterval);
};
scope.clearTimeout =
scope.clearInterval = function(timeout) {
	if (timeout) {
		timeout.close();
	}
};

function Timeout(id, clearFn) {
	this._id = id;
	this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
	this._clearFn.call(scope, this._id);
};

// setimmediate attaches itself to the global object
require("setimmediate");
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
scope.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                    (typeof global !== "undefined" && global.setImmediate) ||
					(this && this.setImmediate);
scope.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                    (typeof global !== "undefined" && global.clearImmediate) ||
                    (this && this.clearImmediate);
