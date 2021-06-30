const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");
const chalk = require("chalk");
const { Transpiler } = require("./transpiler");

const NOTICE = () => `[${chalk.cyan("notice")} ${new Date().toISOString()}]`;
const WARN = () => `[${chalk.yellow("warn")} ${new Date().toISOString()}]`;
const notice = (message) => process.stdout.write(`${NOTICE()} ${message}\n`);
const warn = (message) => process.stdout.write(`${WARN()} ${message}\n`);

const ymlPath = path.resolve(__dirname, "..", "style.yml");
const jsonPath = path.resolve(__dirname, "..", "style.json");

const walk = (key, value, parent) => {
  if (key.startsWith("__")) {
    delete parent[key];
  } else {
    return value;
  }
};

const watcher = chokidar.watch(ymlPath);
watcher
  .on("add", (path) => notice(`${chalk.green(path)} has been added.`))
  .on("change", (path) => {
    try {
      const yaml = fs.readFileSync(ymlPath, "utf-8");
      const transpiler = new Transpiler(yaml, walk);
      transpiler.parse();
      transpiler.traverse();
      transpiler.generate();
      const json = transpiler.toJSON();
      fs.writeFileSync(jsonPath, json);
      notice(`${chalk.green(path)} -> ${chalk.green(jsonPath)}.`);
    } catch (error) {
      warn(`Failed to convert ${path}.`);
      warn(error);
    }
  });
