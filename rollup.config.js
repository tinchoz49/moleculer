import path from "path";

import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import alias from "rollup-plugin-alias";
import inject from "rollup-plugin-inject";
import analyze from "rollup-plugin-analyzer";
import visualizer from "rollup-plugin-visualizer";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

function aliasResolve(modules, into, result = {}) {
	return modules.reduce((curr, next) => {
		curr[next] = path.resolve(into);
		return curr;
	}, result);
}

let aliasModules = aliasResolve([
	// transporters
	"./amqp",
	"./mqtt",
	"./nats",
	"./kafka",
	"./tcp",
	"./stan",
	// cache
	"./redis",
	// strategies
	"./cpu-usage",
	"moleculer-repl"
], "src/browser/non-compatible.js");

aliasModules = aliasResolve([
	// serializers
	"./avro",
	"./msgpack",
	"./notepack",
	"./protobuf",
	"./thrift"
], "src/browser/unloaded-serializer.js", aliasModules);

const builtInModules = [
	"moleculer-repl"
];

const isProduction = process.env.NODE_ENV === "production";

export default {
	// browser-friendly UMD build
	input: "./index.js",
	output: {
		name: "moleculer",
		file: pkg.browser,
		format: "umd",
		sourcemap: true
	},
	plugins: [
		alias(aliasModules),
		json(),
		resolve({
			preferBuiltins: true
		}),
		commonjs(),
		inject({
			modules: {
				setTimeout: path.resolve("src/browser/set-timeout.js"),
				setInterval: path.resolve("src/browser/set-interval.js"),
				process: path.resolve("src/browser/process.js")
			}
		}),
		isProduction && terser(),
		!isProduction && visualizer({ template: 'treemap' }),
		analyze({ hideDeps: true, limit: 0 })
	],
	external: id => {
		if (builtInModules.find(module => id.includes(module))) {
			return false;
		}

		if (id.includes("node_modules")) {
			return true;
		}

		try {
			const module = require.resolve(id);
			if (module.includes("node_modules")) {
				return true;
			}
		} catch (err) {
			return false;
		}
	}
};
