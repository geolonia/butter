const jsYaml = require("js-yaml");

/**
 * noop walker to traverse and transform values.
 * @param {string} key
 * @param {any} value
 * @param {object} parent
 * @returns value
 */
const defaultWalker = (key, value, parent) => value;

/**
 * Plugable YAML -> JSON Transpiler
 */
class Transpiler {
  constructor(yaml, walk = defaultWalker) {
    this._json = null;
    this._object = null;
    this._yaml = yaml;
    this._walk = walk;
  }
  parse() {
    this._object = jsYaml.load(this._yaml);
    return this._object;
  }

  traverse(target = this._object) {
    for (var key in target) {
      if (target.hasOwnProperty(key)) {
        const value = this._walk(key, target[key], target);
        if (typeof value === "object") {
          return this.traverse(value);
        }
      }
    }
    return target;
  }

  generate() {
    this._json = JSON.stringify(this._object, null, 2);
    return this._json;
  }
  toJSON() {
    return this._json;
  }
}

module.exports.Transpiler = Transpiler;
