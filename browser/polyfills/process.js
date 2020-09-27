const { default: _process } = require("bfs-process");

// polyfill override global "process" implementation
for (const prop in _process) {
	if (typeof _process[prop] === "function") {
		_process[prop].bind(_process);
	}
	if (prop === "env") {
		continue;
	}
	process[prop] = _process[prop];
}

if (typeof queueMicrotask !== "undefined") {
	process.nextTick = function nextTick(handler, ...args) {
		queueMicrotask(() => handler(...args));
	};
}
