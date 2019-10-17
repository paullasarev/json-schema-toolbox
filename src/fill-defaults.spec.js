const { fillDefaults, numberSchema, stringSchema, dateSchema } = require('../dist/bundle');

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

  describe('date', () => {
    it('should be empty for empty', () => {
      expect(fillDefaults(dateSchema, undefined)).toBeUndefined();
    });
    it('should keep value empty for defined', () => {
      expect(fillDefaults(dateSchema, '2018')).toBe('2018');
    });
  });


});
