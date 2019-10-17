import { isEmpty, isUndefined, isNull, isString, omitBy, forOwn, includes, replace } from 'lodash';
import { curryN } from 'lodash/fp';
import { IJsonSchema } from './json-schema';

function isDefined(val: any) {
  return val !== undefined;
}

function processNumber(schema: IJsonSchema, data: any) {
  if (!isDefined(data) || isNull(data) || data === '') {
    return undefined;
  }
  if (isString(data) && includes(data, ',')) {
    // tslint:disable-next-line:no-parameter-reassignment
    data = replace(data, /,/g, '.');
  }
  return Number(data);
}

function processString(schema: IJsonSchema, data: any) {
  if (isUndefined(data)) {
    return data;
  }
  if (!isString(data)) {
    return String(data);
  }
  return data;
}

function processDate(schema: IJsonSchema, data: any) {
  if (isUndefined(data) || data === '-') {
    return schema.default;
  }
  return data;
}

function processNode(schema: IJsonSchema, data: any) {
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

function processObject(schema: IJsonSchema, node: any) {

  const val = omitBy(node, isUndefined);
  if (isEmpty(val)) {
    return null;
  }

  const result: any = {};

  if (node) {
    forOwn(node, (propertyValue: any, propertyName: string) => {
      if (isDefined(propertyValue)) {
        result[propertyName] = propertyValue;
      }
    });
  }
  forOwn(schema.properties, (propertySchema: IJsonSchema, propertyName: string) => {
    if (propertySchema.required
      || (isDefined(node) && isDefined(node[propertyName]))) {
      const nodeValue = isUndefined(node) ? undefined : node[propertyName];
      result[propertyName] = processNode(propertySchema, nodeValue);
    }
  });

  return result;
}

function processArray(schema: IJsonSchema, data: any): any {
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

export const normalizeToSave = curryN(2, (schema: IJsonSchema, data: any) => processNode(schema, data));
