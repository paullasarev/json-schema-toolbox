const { numberSchema, stringSchema, dateSchema } = require('./json-schema');
const { fillDefaults, fillDefaultsArray } = require('./fill-defaults');

describe('fillDefaults', ()=>{
  const schemaObj = {
    type: 'object',
    properties: {
      id: numberSchema,
      name: stringSchema,
      folder: stringSchema,
    },
  };

  it('should check string schema', ()=>{
    const value = fillDefaults({type: 'string'}, 'asdf');
    expect(value).toBe('asdf');
  });
  it('should curry params', ()=>{
    const value = fillDefaults({type: 'string'})('asdf');
    expect(value).toBe('asdf');
  });
  it('should fill object', ()=>{
    const obj = { id: 1, name: 'name', folder: '/name' };
    const value = fillDefaults(schemaObj)(obj);
    expect(value).toEqual(obj);
  });
  it('should set string type', ()=>{
    const value = fillDefaults({type: 'string'}, 10);
    expect(value).toBe('10');
  });
  it('should set number type', ()=>{
    const value = fillDefaults({type: 'number'}, '10');
    expect(value).toBe(10);
  });
  it('should set number NaN', ()=>{
    const value = fillDefaults({type: 'number'}, 'asdf');
    expect(value).toBe(NaN);
  });

  describe('array', () => {
    it('should fill array', ()=>{
      const value = fillDefaultsArray({type: 'string'}, [11, 'asdf']);
      expect(value).toEqual(['11', 'asdf']);
    });
  });

  describe('date', () => {
    it('should be empty for empty', () => {
      expect(fillDefaults(dateSchema, undefined)).toBeUndefined();
    });
    it('should keep value empty for defined', () => {
      expect(fillDefaults(dateSchema, '2018')).toBe('2018');
    });
  });


});
