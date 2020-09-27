let kleur;

function noop(txt) { return arguments.length > 0 ? arguments[0] : kleur; }

kleur = {
	enabled: false,

	reset: noop,
	bold: noop,
	dim: noop,
	italic: noop,
	underline: noop,
	inverse: noop,
	hidden: noop,
	strikethrough: noop,

	// colors
	black: noop,
	red: noop,
	green: noop,
	yellow: noop,
	blue: noop,
	magenta: noop,
	cyan: noop,
	white: noop,
	gray: noop,
	grey: noop,

	// background colors
	bgBlack: noop,
	bgRed: noop,
	bgGreen: noop,
	bgYellow: noop,
	bgBlue: noop,
	bgMagenta: noop,
	bgCyan: noop,
	bgWhite: noop
};

module.exports = kleur;
