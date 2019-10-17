'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var lodash = require('lodash');
var fp = require('lodash/fp');

const schemaDefault = (schema, defaultValue) => ({
  ...schema,
  default: defaultValue,
  required: true,
});
const schemaRequired = (schema, required) => ({ ...schema, required });

const stringSchema = { type: 'string' };
const dateSchema = { type: 'date' };
const emptyStringSchema = schemaDefault(stringSchema, '');
const limitedStringSchema = (limit = undefined) => ({ type: 'string', maxLength: limit });
const numberSchema = { type: 'number' };

const booleanSchema = { type: 'boolean' };
const trueSchema = schemaDefault(booleanSchema, true);
const falseSchema = schemaDefault(booleanSchema, false);

const enumSchema = (enumValues, defaultValue = undefined) => ({
  type: 'string',
  enum: enumValues,
  default: defaultValue,
});

function arraySchema(schema, defaultValue = []) {
  return {
    type: 'array',
    default: defaultValue,
    items: schema,
  };
}

function requiredSchema(schema) {
  return {
    ...schema,
    required: lodash.keys(schema.properties),
    additionalProperties: false,
  };
}

function exactSchema(schema) {
  return {
    ...schema,
    additionalProperties: false,
  };
}

function omitId(schema) {
  return lodash.omit(schema, ['id', 'title', 'default']);
}

function withId(schema, id) {
  return {
    ...schema,
    id,
  };
}

function isDefined(val) {
    return val !== undefined;
}
function processNumber(schema, data) {
    if (!isDefined(data) || lodash.isNull(data) || data === '') {
        return undefined;
    }
    if (lodash.isString(data) && lodash.includes(data, ',')) {
        // tslint:disable-next-line:no-parameter-reassignment
        data = lodash.replace(data, /,/g, '.');
    }
    return Number(data);
}
function processString(schema, data) {
    if (lodash.isUndefined(data)) {
        return data;
    }
    if (!lodash.isString(data)) {
        return String(data);
    }
    return data;
}
function processDate(schema, data) {
    if (lodash.isUndefined(data) || data === '-') {
        return schema.default;
    }
    return data;
}
function processNode(schema, data) {
    switch (schema.type) {
        case 'object':
            return processObject(schema, data); // eslint-disable-line no-use-before-define
        case 'array':
            return processArray(schema, data); // eslint-disable-line no-use-before-define
        case 'number':
            return processNumber(schema, data);
        case 'string':
            return processString(schema, data);
        case 'date':
            return processDate(schema, data);
        default:
            return data;
    }
}
function processObject(schema, node) {
    var val = lodash.omitBy(node, lodash.isUndefined);
    if (lodash.isEmpty(val)) {
        return null;
    }
    var result = {};
    if (node) {
        lodash.forOwn(node, function (propertyValue, propertyName) {
            if (isDefined(propertyValue)) {
                result[propertyName] = propertyValue;
            }
        });
    }
    lodash.forOwn(schema.properties, function (propertySchema, propertyName) {
        if (propertySchema.required
            || (isDefined(node) && isDefined(node[propertyName]))) {
            var nodeValue = lodash.isUndefined(node) ? undefined : node[propertyName];
            result[propertyName] = processNode(propertySchema, nodeValue);
        }
    });
    return result;
}
function processArray(schema, data) {
    if (lodash.isUndefined(data)) {
        if (schema.default) {
            return schema.default;
        }
        return undefined;
    }
    var result = [];
    if (schema.items) {
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var node = data_1[_i];
            result.push(processNode(schema.items, node));
        }
    }
    return result;
}
var normalizeToSave = fp.curryN(2, function (schema, data) { return processNode(schema, data); });

function forOwn(object, callback) {
  Object.keys(object).map(key => callback(object[key], key, object));
}

function isDefined$1(obj) {
  return obj !== undefined && obj !== null;
}

function autoDefaults(data, schema) {
  function processNode(schemaNode, dataNode) {
    switch (schemaNode.type) {
      case 'object':
        return processObject(schemaNode, dataNode); // eslint-disable-line no-use-before-define

      case 'array':
        return processArray(schemaNode, dataNode); // eslint-disable-line no-use-before-define

      default:
        if (isDefined$1(dataNode)) return dataNode;
        if (isDefined$1(schemaNode.default)) return schemaNode.default;
        return undefined;
    }
  }

  function processObject(schemaNode, dataNode) {
    const result = {};

    forOwn(schemaNode.properties, (propertySchema, propertyName) => {
      if (
        propertySchema.required ||
        (isDefined$1(dataNode) && isDefined$1(dataNode[propertyName]))) {
        const nodeValue = isDefined$1(dataNode) ? dataNode[propertyName] : undefined;
        result[propertyName] = processNode(propertySchema, nodeValue);
      }
    });

    if (dataNode) {
      forOwn(dataNode, (propertyValue, propertyName) => {
        if (!isDefined$1(result[propertyName]) && isDefined$1(propertyValue)) {
          result[propertyName] = propertyValue;
        }
      });
    }
    return result;
  }

  function processArray(schemaNode, dataNode) {
    if (dataNode === undefined) {
      if (schemaNode.default) {
        return schemaNode.default;
      }

      return undefined;
    }

    const result = [];

    for (let i = 0; i < dataNode.length; i++) {
      result.push(processNode(schemaNode.items, dataNode[i]));
    }
    return result;
  }

  return processNode(schema, data);
}

var fillDefaults = fp.curryN(2, function (schema, data) { return autoDefaults(data, schema); });
function getDataBySchema(schema) {
    return function (state, action) { return fillDefaults(schema, action.data); };
}
function getDataByArraySchema(schema) {
    var aSchema = arraySchema(schema);
    return function (state, action) {
        return fillDefaults(aSchema, action.data);
    };
}
function getDefaultsBySchema(schema) {
    return function () { return fillDefaults(schema, {}); };
}
function getDefaultsByArraySchema(schema) {
    return function () { return fillDefaults(arraySchema(schema), {}); };
}
function fillDefaultsArray(schema, obj) {
    if (obj === void 0) { obj = {}; }
    return fillDefaults(arraySchema(schema), obj);
}

exports.arraySchema = arraySchema;
exports.booleanSchema = booleanSchema;
exports.dateSchema = dateSchema;
exports.emptyStringSchema = emptyStringSchema;
exports.enumSchema = enumSchema;
exports.exactSchema = exactSchema;
exports.falseSchema = falseSchema;
exports.fillDefaults = fillDefaults;
exports.fillDefaultsArray = fillDefaultsArray;
exports.getDataByArraySchema = getDataByArraySchema;
exports.getDataBySchema = getDataBySchema;
exports.getDefaultsByArraySchema = getDefaultsByArraySchema;
exports.getDefaultsBySchema = getDefaultsBySchema;
exports.limitedStringSchema = limitedStringSchema;
exports.normalizeToSave = normalizeToSave;
exports.numberSchema = numberSchema;
exports.omitId = omitId;
exports.requiredSchema = requiredSchema;
exports.schemaDefault = schemaDefault;
exports.schemaRequired = schemaRequired;
exports.stringSchema = stringSchema;
exports.trueSchema = trueSchema;
exports.withId = withId;
