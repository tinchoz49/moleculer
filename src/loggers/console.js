/*
 * moleculer
 * Copyright (c) 2020 MoleculerJS (https://github.com/moleculerjs/moleculer)
 * MIT Licensed
 */

/* eslint-disable no-console */

"use strict";

const FormattedLogger 	= require("./formatted");
const kleur 			= require("kleur");
const { detect }        = require("detect-browser");

const environment = detect();

/**
 * Console logger for Moleculer
 *
 * @class ConsoleLogger
 * @extends {FormattedLogger}
 */
class ConsoleLogger extends FormattedLogger {

	/**
	 * Creates an instance of ConsoleLogger.
	 * @param {Object} opts
	 * @memberof ConsoleLogger
	 */
	constructor(opts) {
		super(opts);

		this.maxPrefixLength = 0;
	}

	init(loggerFactory) {
		super.init(loggerFactory);

		if (!this.opts.colors)
			kleur.enabled = false;
	}

	/**
	 *
	 * @param {object} bindings
	 */
	getLogHandler(bindings) {
		const level = bindings ? this.getLogLevel(bindings.mod) : null;
		if (!level)
			return null;

		const levelIdx = FormattedLogger.LEVELS.indexOf(level);
		const formatter = this.getFormatter(bindings);

		return (type, args) => {
			const typeIdx = FormattedLogger.LEVELS.indexOf(type);
			if (typeIdx > levelIdx) return;

			let pargs = formatter(type, args);
			if (environment.type === "browser") {
				pargs = pargs.join(" ");
			}

			switch(type) {
				case "fatal":
				case "error": return this._print("error", pargs);
				case "warn": return this._print("warn", pargs);
				default: return this._print("log", pargs);
			}
		};
	}

	_print(type, args) {
		if (Array.isArray(args)) return console[type](...args);
		return console[type](args);
	}
}

module.exports = ConsoleLogger;
