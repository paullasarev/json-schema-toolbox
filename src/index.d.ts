export interface IJsonSchema {
    type: string;
    id?: string;
    properties?: {[k:string]: IJsonSchema};
    items?: IJsonSchema;
    default?: string[];
    required?: string[] | boolean;
}

export function schemaDefault (schema: IJsonSchema, defaultValue: any): IJsonSchema;
export function schemaRequired (schema: IJsonSchema, required: any): IJsonSchema;
export function enumSchema (enumValues: string[], defaultValue?: string): IJsonSchema;

export const stringSchema: IJsonSchema;
export const dateSchema: IJsonSchema;
export const emptyStringSchema: IJsonSchema;
export const numberSchema: IJsonSchema;
export const booleanSchema: IJsonSchema;
export const trueSchema: IJsonSchema;
export const falseSchema: IJsonSchema;

export function arraySchema(schema: IJsonSchema, defaultValue?): IJsonSchema;
export function requiredSchema(schema: IJsonSchema): IJsonSchema;
export function omitId(schema: IJsonSchema): IJsonSchema;
export function withId(schema: IJsonSchema, id: string): IJsonSchema;

export function fillDefaults<T = any>(schema: IJsonSchema): (obj: any) => T;
export function fillDefaults<T = any>(schema: IJsonSchema, obj: any): T;
export function fillDefaultsArray<T = any>(schema: IJsonSchema): (obj: any) => T[];
export function fillDefaultsArray<T = any>(schema: IJsonSchema, obj: any): T[];

export function normalizeToSave<T = any>(schema: IJsonSchema): (obj: any) => T;
export function normalizeToSave<T = any>(schema: IJsonSchema, obj: any): T;
