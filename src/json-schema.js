import { keys, omit } from 'lodash';

export function schemaDefault(schema, defaultValue) {
  return {
    ...schema,
    default: defaultValue,
  };
}

export function schemaRequired (schema, required) {
  return { ...schema, required };
}

export const stringSchema = { type: 'string' };
export const dateSchema = { type: 'date' };
export const emptyStringSchema = schemaDefault(stringSchema, '');
export const limitedStringSchema = (limit = undefined) => ({ type: 'string', maxLength: limit });
export const numberSchema = { type: 'number' };

export const booleanSchema = { type: 'boolean' };
export const trueSchema = schemaDefault(booleanSchema, true);
export const falseSchema = schemaDefault(booleanSchema, false);

export function enumSchema (enumValues, defaultValue = undefined) {
  return {
    type: 'string',
    enum: enumValues,
    default: defaultValue,
  };
}

export function arraySchema(schema, defaultValue = []) {
  return {
    type: 'array',
    default: defaultValue,
    items: schema,
  };
}

export function objectSchema(properties=[]) {
  return {
    type: 'object',
    properties,
  }
}

export function requiredSchema(schema) {
  return {
    ...schema,
    required: keys(schema.properties),
    additionalProperties: false,
  };
}

export function exactSchema(schema) {
  return {
    ...schema,
    additionalProperties: false,
  };
}

export function omitId(schema) {
  return omit(schema, ['id', 'title', 'default']);
}

export function withId(schema, id) {
  return {
    ...schema,
    id,
  };
}
