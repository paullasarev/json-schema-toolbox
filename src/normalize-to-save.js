import { isEmpty, isUndefined, isNull, isString, omitBy, forOwn, includes, replace } from 'lodash';
import { curryN } from 'lodash/fp';

function isDefined(val) {
  return val !== undefined;
}

function processNumber(schema, data) {
  if (!isDefined(data) || isNull(data) || data === '') {
    return undefined;
  }
  if (isString(data) && includes(data, ',')) {
    data = replace(data, /,/g, '.');
  }
  return Number(data);
}

function processString(schema, data) {
  if (isUndefined(data)) {
    return data;
  }
  if (!isString(data)) {
    return String(data);
  }
  return data;
}

function processDate(schema, data) {
  if (isUndefined(data) || data === '-') {
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

  const val = omitBy(node, isUndefined);
  if (isEmpty(val)) {
    return null;
  }

  const result = {};

  if (node) {
    forOwn(node, (propertyValue, propertyName) => {
      if (isDefined(propertyValue)) {
        result[propertyName] = propertyValue;
      }
    });
  }
  forOwn(schema.properties, (propertySchema, propertyName) => {
    if (propertySchema.required
      || (isDefined(node) && isDefined(node[propertyName]))) {
      const nodeValue = isUndefined(node) ? undefined : node[propertyName];
      result[propertyName] = processNode(propertySchema, nodeValue);
    }
  });

  return result;
}

function processArray(schema, data) {
  if (isUndefined(data)) {
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

export const normalizeToSave = curryN(2, (schema, data) => processNode(schema, data));
