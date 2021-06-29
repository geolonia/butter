const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");

const ymlPath = path.resolve(__dirname, "..", "style.yml");
const jsonPath = path.resolve(__dirname, "..", "style.json");

chokidar.watch(ymlPath).on("all", (event, path) => {
  console.log({ event, path });
  switch (event) {
    case "add":
    case "change":
      const jsonObject = yaml.load(fs.readFileSync(ymlPath, "utf-8"));
      try {
        const json = JSON.stringify(jsonObject, null, 2);
        fs.writeFileSync(jsonPath, json);
      } catch (error) {
        console.error(error);
      }
      break;
    default:
      break;
  }
});
