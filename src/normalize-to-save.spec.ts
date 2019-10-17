import fillDefaults from 'json-schema-fill-defaults';

import { normalizeToSave } from './normalize-to-save';
import { dateSchema, IJsonSchema, numberSchema, stringSchema } from './json-schema';

describe('normalize to save', () => {
  describe('object', () => {
    const codeDescriptionSchema = {
      type: 'object',
      required: true,
      properties: {
        code: stringSchema,
        id: numberSchema,
        description: stringSchema,
      },
    };

    const schema: IJsonSchema = {
      type: 'object',
      properties: {
        type: codeDescriptionSchema,
      },
    };

    it('should make a deep copy ob object', () => {
      const typeObj = {};
      const entry = {
        type: typeObj,
      };
      const converted = normalizeToSave(schema, entry);
      expect(converted).not.toBe(entry);
      expect(converted.type).not.toBe(entry.type);
    });

    it('should set empty obj to null', () => {
      const entry = {
        type: {},
      };
      const converted = normalizeToSave(schema, entry);
      expect(converted.type).toBeNull();
    });

    it('should set empty obj to null for curried call', () => {
      const entry = {
        type: {},
      };
      const converter = normalizeToSave(schema);
      const converted = converter(entry);
      expect(converted.type).toBeNull();
    });

    it('should keep non-empty obj', () => {
      const type = { id: 0 };
      const entry = {
        type,
      };
      const converted = normalizeToSave(schema, entry);
      expect(converted.type.id).toBe(type.id);
    });

    it('should convert string with comma to number according to schema', () => {
      const type = { id: '1,1' };
      const entry = {
        type,
      };
      const converted = normalizeToSave(schema, entry);
      expect(converted.type.id).toBe(1.1);
    });

    it('should convert string with dot to number according to schema', () => {
      const type = { id: '1.1' };
      const entry = {
        type,
      };
      const converted = normalizeToSave(schema, entry);
      expect(converted.type.id).toBe(1.1);
    });

    it('should not set empty numbers', () => {
      const type = { code: 'asd' };
      const entry = {
        type,
      };
      const converted = normalizeToSave(schema, entry);
      expect(converted.type.code).toBe(type.code);
      expect(converted.type.id).toBeUndefined();
    });

    it('should not set empty string', () => {
      const type = { id: 0 };
      const entry = {
        type,
      };
      const converted = normalizeToSave(schema, entry);
      expect(converted.type.id).toBe(type.id);
      expect(converted.type.code).toBeUndefined();
    });

    it('should keep non-schema property', () => {
      const entry = {
        extra: '234',
      };
      const converted = normalizeToSave(schema, entry);
      expect(converted.extra).toBe('234');
    });
  });

  describe('normalize date', () => {
    it('should set empty for dash', () => {
      expect(normalizeToSave(dateSchema, '-')).toBeUndefined();
    });

    it('should set empty for undefined', () => {
      expect(normalizeToSave(dateSchema, undefined)).toBeUndefined();
    });

    it('should keep value for defined', () => {
      expect(normalizeToSave(dateSchema, 'asdf')).toBe('asdf');
    });
  });

  describe('fillDefaults date', () => {
    it('should be empty for empty', () => {
      expect(fillDefaults(undefined, dateSchema)).toBeUndefined();
    });
    it('should keep value empty for defined', () => {
      expect(fillDefaults('2018', dateSchema)).toBe('2018');
    });
  });

  describe('normalize string', () => {
    it('should keep string', () => {
      expect(normalizeToSave(stringSchema, '-')).toBe('-');
    });
    it('should keep undefined', () => {
      expect(normalizeToSave(stringSchema, undefined)).toBeUndefined();
    });
    it('should convert number to string', () => {
      expect(normalizeToSave(stringSchema, 0)).toBe('0');
    });
  });

});
