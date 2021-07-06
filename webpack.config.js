const path = require("path");

module.exports = {
  entry: "./bin/transpiler.js",
  output: {
    path: __dirname,
    filename: "transpiler.min.js",
  },
};
