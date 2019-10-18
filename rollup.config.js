const { terser } = require('rollup-plugin-terser');
const copy = require('rollup-plugin-copy');

const isProduction = process.env.BUILD === 'production';

export default [
  {
    input: 'src/index.js',
    output: {
      file: isProduction ? 'dist/json-schema-toolbox.min.js' : 'dist/json-schema-toolbox.js',
      format: 'cjs',
    },
    plugins: [
      isProduction && terser(),
      copy({
        targets: [{ src: 'src/index.d.ts', dest: 'dist', rename: 'json-schema-toolbox.d.ts' }]
      }),
    ],
    external: ['lodash', 'lodash/fp'],
  },
  {
    input: 'src/typescript.js',
    output: {
      file: 'dist/typescript.js',
      format: 'cjs',
    },
    external: ['json-schema-to-typescript'],
  },
];
