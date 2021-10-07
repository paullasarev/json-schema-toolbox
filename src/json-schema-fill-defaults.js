import { forOwn, isArray } from 'lodash';

function isDefined(obj) {
  return obj !== undefined && obj !== null;
}

function isType(schemaNode, dataNode, schemaType, nodeType) {
  return schemaNode.type === schemaType && typeof dataNode !== nodeType;
}

function processNode(schemaNode, dataNode) {
  switch (schemaNode.type) {
    case 'object':
      return processObject(schemaNode, dataNode); //// eslint-disable-line no-use-before-define
    
    case 'array':
      return processArray(schemaNode, dataNode); //// eslint-disable-line no-use-before-define
    
    default:
      if (isDefined(dataNode)) {
        if (isType(schemaNode, dataNode, 'string', 'string')) {
          return String(dataNode);
        }
        if (isType(schemaNode, dataNode, 'number', 'number')) {
          return Number(dataNode);
        }
        if (isType(schemaNode, dataNode, 'integer', 'number')) {
          return Number(dataNode);
        }
        return dataNode;
      }
      if (isDefined(schemaNode.default)) {
        return schemaNode.default;
      }
      if (schemaNode.type === 'integer') {
        return 0;
      }
      return undefined;
  }
}

function processObject(schemaNode, dataNode) {
  const result = {};
  
  forOwn(schemaNode.properties, (propertySchema, propertyName) => {
    const isRequired =
      isArray(schemaNode.required) && schemaNode.required.indexOf(propertyName) >= 0;
    if (isRequired || (isDefined(dataNode) && isDefined(dataNode[propertyName]))) {
      const nodeValue = isDefined(dataNode) ? dataNode[propertyName] : undefined;
      result[propertyName] = processNode(propertySchema, nodeValue);
    }
  });
  
  if (dataNode) {
    forOwn(dataNode, (propertyValue, propertyName) => {
      if (!isDefined(result[propertyName]) && isDefined(propertyValue)) {
        result[propertyName] = propertyValue;
      }
    });
  }
  return result;
}

function processArray(schemaNode, dataNode) {
  if (dataNode === undefined || dataNode === null) {
    if (schemaNode.default) {
      return schemaNode.default;
    }
    return [];
  }
  
  const result = [];
  
  for (let i = 0; i < dataNode.length; i++) {
    result.push(processNode(schemaNode.items, dataNode[i]));
  }
  return result;
}

export const fillDefaults = (schema) => (data) => {
  return processNode(schema, data);
};

export default function autoDefaults(data, schema) {
  return processNode(schema, data);
}
