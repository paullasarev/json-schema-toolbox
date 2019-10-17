'use strict';

var jsonSchemaToTypescript = require('json-schema-to-typescript');

const { writeFileSync } = require('fs');
const { basename, dirname, join, resolve } = require('path');
const glob = require('glob');

const SCHEMA_EXT = '.schema.js';
const SCHEMA_FILES = `/**/*${SCHEMA_EXT}`;

const processFile = (filesExt, context) => (file) => {
  try {
    const fileDirname = dirname(file);
    const fileBasename = basename(file, filesExt);
    const jsonSchema = require(file); // eslint-disable-line import/no-dynamic-require
    const mainSchema = jsonSchema.default;
    mainSchema.default = undefined;
    const fileName = join(fileDirname, `${fileBasename}.d.ts`);
    context.count++;
    jsonSchemaToTypescript.compile(mainSchema)
      .then((tsText) => {
        writeFileSync(fileName, tsText);
        console.log('done', fileName);
      });
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }
};

const generate = (targetDir, filesGlob, filesExt) => {
  const pattern = join(targetDir, filesGlob);
  console.log('process', pattern); // eslint-disable-line no-console
  const files = glob.sync(pattern);
  const context = { count: 0 };
  files.forEach(processFile(filesExt, context));
  console.log(`process ${context.count} files`); // eslint-disable-line no-console
};

generate(resolve('./src'), SCHEMA_FILES, SCHEMA_EXT);
