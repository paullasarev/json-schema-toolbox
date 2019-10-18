import { curryN } from 'lodash/fp';

import autoDefaults from './json-schema-fill-defaults';
import { arraySchema } from './json-schema';

export const fillDefaults = curryN(2, (schema, data) => autoDefaults(data, schema));
export const fillDefaultsArray = curryN(2, (schema, data) => autoDefaults(data, arraySchema(schema)));
