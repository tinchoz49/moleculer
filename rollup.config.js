import path from "path";

import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import alias from "rollup-plugin-alias";
import inject from "rollup-plugin-inject";
import analyze from "rollup-plugin-analyzer";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const nonBrowserCompatible = [
	"./amqp",
	"./mqtt",
	"./nats",
	"./redis",
	"moleculer-repl"
].reduce((curr, next) => {
	curr[next] = path.resolve("src/browser/non-compatible.js");
	return curr;
}, {});

const isProduction = process.env.NODE_ENV === "production";

const builtInModules = [
	"moleculer-repl"
];

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
		alias(nonBrowserCompatible),
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
		analyze({ hideDeps: true, limit: 0 })
	],
	external: id => {
		if (builtInModules.find(module => id.includes(module))) {
			return false;
		}

		return !id.startsWith("\0") && !id.startsWith(".") && !id.startsWith(path.sep);
	}
};
