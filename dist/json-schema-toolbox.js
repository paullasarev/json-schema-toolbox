'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var lodash = require('lodash');
var fp = require('lodash/fp');

function schemaDefault(schema, defaultValue) {
  return {
    ...schema,
    default: defaultValue,
    required: true,
  };
}

function schemaRequired (schema, required) {
  return { ...schema, required };
}

const stringSchema = { type: 'string' };
const dateSchema = { type: 'date' };
const emptyStringSchema = schemaDefault(stringSchema, '');
const limitedStringSchema = (limit = undefined) => ({ type: 'string', maxLength: limit });
const numberSchema = { type: 'number' };

const booleanSchema = { type: 'boolean' };
const trueSchema = schemaDefault(booleanSchema, true);
const falseSchema = schemaDefault(booleanSchema, false);

function enumSchema (enumValues, defaultValue = undefined) {
  return {
    type: 'string',
    enum: enumValues,
    default: defaultValue,
  };
}

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

  const val = lodash.omitBy(node, lodash.isUndefined);
  if (lodash.isEmpty(val)) {
    return null;
  }

  const result = {};

  if (node) {
    lodash.forOwn(node, (propertyValue, propertyName) => {
      if (isDefined(propertyValue)) {
        result[propertyName] = propertyValue;
      }
    });
  }
  lodash.forOwn(schema.properties, (propertySchema, propertyName) => {
    if (propertySchema.required
      || (isDefined(node) && isDefined(node[propertyName]))) {
      const nodeValue = lodash.isUndefined(node) ? undefined : node[propertyName];
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

  const result = [];

  if (schema.items) {
    for (const node of data) {
      result.push(processNode(schema.items, node));
    }
  }
  return result;
}

const normalizeToSave = fp.curryN(2, (schema, data) => processNode(schema, data));

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
        if (isDefined$1(dataNode)) {
          if(schemaNode.type === 'string' && typeof dataNode !== 'string') {
            return String(dataNode);
          }
          if(schemaNode.type === 'number' && typeof dataNode !== 'number') {
            return Number(dataNode);
          }
          return dataNode;
        }
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

const fillDefaults = fp.curryN(2, (schema, data) => autoDefaults(data, schema));
const fillDefaultsArray = fp.curryN(2, (schema, data) => autoDefaults(data, arraySchema(schema)));

exports.arraySchema = arraySchema;
exports.booleanSchema = booleanSchema;
exports.dateSchema = dateSchema;
exports.emptyStringSchema = emptyStringSchema;
exports.enumSchema = enumSchema;
exports.exactSchema = exactSchema;
exports.falseSchema = falseSchema;
exports.fillDefaults = fillDefaults;
exports.fillDefaultsArray = fillDefaultsArray;
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
