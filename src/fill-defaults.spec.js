const {
  arraySchema,
  numberSchema,
  stringSchema,
  dateSchema,
  schemaDefault,
} = require('./json-schema');

const { fillDefaults } = require('./fill-defaults');

describe('fillDefaults', ()=>{
  const schemaObj = {
    type: 'object',
    properties: {
      id: numberSchema,
      name: stringSchema,
      folder: stringSchema,
    },
  };

  describe('object', () => {
    it('should fill object', () => {
      const obj = { id: 1, name: 'name', folder: '/name' };
      const value = fillDefaults(schemaObj)(obj);
      expect(value).toEqual(obj);
    });
    it('should not create non-required props', () => {
      const obj = { id: 1 };
      const value = fillDefaults(schemaObj)(obj);
      expect(value).toEqual(obj);
    });
    it('should create required props', () => {
      const obj = { id: 1 };
      const schema = {
        type: 'object',
        properties: {
          id: numberSchema,
          name: stringSchema,
          folder: stringSchema,
          sub: {
            type: 'object',
            propeties: {
              id: stringSchema,
            }
          },
        },
        required:['id', 'name', 'folder', 'sub'],
      };
      
      const value = fillDefaults(schema)(obj);
      expect(value).toEqual({ id: 1, sub: {} });
    });
    it('should not create non-required object prop', () => {
      const obj = { id: 1 };
      const schema = {
        type: 'object',
        properties: {
          id: numberSchema,
          name: stringSchema,
          folder: stringSchema,
          sub: {
            type: 'object',
            propeties: {
              id: stringSchema,
            }
          },
        },
        required:['id', 'name', 'folder'],
      };
      
      const value = fillDefaults(schema)(obj);
      expect(value).toEqual({ id: 1 });
    });
    it('should create required default props', () => {
      const obj = { id: 1 };
      const schema = {
        type: 'object',
        properties: {
          id: numberSchema,
          name: schemaDefault(stringSchema, ''),
          folder: stringSchema,
        },
        required:['id', 'name', 'folder'],
      };
      
      const value = fillDefaults(schema)(obj);
      expect(value).toEqual({ id: 1, name: '' });
    });
  });
  
  describe('string', () => {
    it('should check string schema', () => {
      const value = fillDefaults({ type: 'string' })('asdf');
      expect(value).toBe('asdf');
    });
    it('should set string type', () => {
      const value = fillDefaults({ type: 'string' })(10);
      expect(value).toBe('10');
    });
  });
  
  describe('number', () => {
    it('should set number type', () => {
      const value = fillDefaults({ type: 'number' })('10');
      expect(value).toBe(10);
    });
    it('should set number NaN', () => {
      const value = fillDefaults({ type: 'number' })('asdf');
      expect(value).toBe(NaN);
    });
  });
  
  describe('integer', () => {
    it('should set number type', () => {
      const value = fillDefaults({ type: 'integer' })('10');
      expect(value).toBe(10);
    });
    it('should set 0 for undefined', () => {
      const value = fillDefaults({ type: 'integer' })(undefined);
      expect(value).toBe(0);
    });
  });
  
  describe('array', () => {
    it('should check array', () => {
      const value = fillDefaults(arraySchema({ type: 'string' }))(undefined);
      expect(value).toEqual([]);
    });
    it('should fill array', () => {
      const value = fillDefaults(arraySchema({ type: 'string' }))([11, 'asdf']);
      expect(value).toEqual(['11', 'asdf']);
    });
    it('should fill undefined array', () => {
      const value = fillDefaults(arraySchema({ type: 'string' }, null))(undefined);
      expect(value).toEqual([]);
    });
    it('should fill null array', () => {
      const value = fillDefaults(arraySchema({ type: 'string' }))(null);
      expect(value).toEqual([]);
    });
  });
  
  describe('date', () => {
    it('should be empty for empty', () => {
      expect(fillDefaults(dateSchema)(undefined)).toBeUndefined();
    });
    it('should keep value empty for defined', () => {
      expect(fillDefaults(dateSchema)('2018')).toBe('2018');
    });
  });
  

});
