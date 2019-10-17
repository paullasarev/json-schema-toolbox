const { terser } = require('rollup-plugin-terser');
import typescript from 'rollup-plugin-typescript2';

const isProduction = process.env.BUILD === 'production';

export default [
  {
    input: 'src/index.js',
    output: {
      file: isProduction ? 'dist/bundle.min.js' : 'dist/bundle.js',
      format: 'cjs',
    },
    plugins: [
      isProduction && terser(),
      typescript(),
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
