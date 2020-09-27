const { default: _process } = require("bfs-process");

if (typeof queueMicrotask !== "undefined") {
	_process.nextTick = function nextTick(handler, ...args) {
		queueMicrotask(() => handler(...args));
	};
}

if (typeof process !== "undefined") {
	// polyfill override global browserify "process" implementation: https://github.com/defunctzombie/node-process
	for (const prop in _process) {
		if (typeof _process[prop] === "function") {
			_process[prop].bind(_process);
		}
		if (prop === "env") {
			continue;
		}
		process[prop] = _process[prop];
	}
}

module.exports = _process;
