export interface IJsonSchema {
  type: string;
  id?: string;
  properties?: {[k:string]: IJsonSchema};
  items?: IJsonSchema;
  default?: any;
  required?: string[] | boolean;
}

// noinspection JSUnusedLocalSymbols
export const schemaDefault : (schema: IJsonSchema, defaultValue: any) => IJsonSchema;
// noinspection JSUnusedLocalSymbols
export const schemaRequired : (schema: IJsonSchema, required: any) => IJsonSchema;
// noinspection JSUnusedLocalSymbols
export const enumSchema : (enumValues: string[], defaultValue?: string) => IJsonSchema;

export const stringSchema: IJsonSchema;
export const dateSchema: IJsonSchema;
export const emptyStringSchema: IJsonSchema;
export const numberSchema: IJsonSchema;
export const booleanSchema: IJsonSchema;
export const trueSchema: IJsonSchema;
export const falseSchema: IJsonSchema;

export function objectSchema(properties?: {[k:string]: IJsonSchema}, defaultValue?): IJsonSchema;
export function arraySchema(itemSchema: IJsonSchema, defaultValue?): IJsonSchema;
export function requiredSchema(schema: IJsonSchema): IJsonSchema;
export function omitId(schema: IJsonSchema): IJsonSchema;
export function withId(schema: IJsonSchema, id: string): IJsonSchema;

