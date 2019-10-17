import { fillDefaults } from './fill-defaults';
import { numberSchema, stringSchema } from './json-schema';

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
});
