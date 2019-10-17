import { curryN } from 'lodash/fp';

import autoDefaults from './json-schema-fill-defaults';
import { arraySchema, IJsonSchema } from './json-schema';

export const fillDefaults = curryN(2, (schema: {}, data: any) => autoDefaults(data, schema));

export function getDataBySchema(schema: IJsonSchema) {
  return (state: any, action: any) => fillDefaults(schema, action.data);
}

export function getDataByArraySchema(schema: IJsonSchema) {
  const aSchema = arraySchema(schema);
  return (state: any, action: any) => {
    return fillDefaults(aSchema, action.data);
  };
}

export function getDefaultsBySchema<T = any>(schema: IJsonSchema): () => T {
  return () => fillDefaults(schema, {});
}

export function getDefaultsByArraySchema(schema: IJsonSchema) {
  return () => fillDefaults(arraySchema(schema), {});
}

export function fillDefaultsArray(schema: IJsonSchema, obj: {} = {}) {
  return fillDefaults(arraySchema(schema), obj);
}
