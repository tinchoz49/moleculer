/*global performance */

const cpus = require("cpus");
const os = require("os");

os.cpus = cpus;
os.loadavg = require("../cpu-usage").loadavg;
os.totalmem = (() => performance ? performance.memory.totalJSHeapSize : 0);
os.freemem = (() => performance ? performance.memory.totalJSHeapSize - performance.memory.usedJSHeapSize : 0);
