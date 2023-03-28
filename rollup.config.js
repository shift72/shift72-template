import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const production = process.env.NODE_ENV == 'production';

export default {
  external: ['s72', 's72.ui'],
  input: 'output/site/static/js/local.js',
  output: {
    name: 'template',
    file: 'output/site/static/scripts/main.js',
    format: 'iife',
    globals: {
      s72: 's72',
      's72.ui': 's72.ui'
    },
    compact: production,
    sourcemap: !production
  },
  plugins: [
    babel({
      babelHelpers: 'external',
      exclude: 'node_modules/**',
      skipPreflightCheck: true,
      presets: [
        [ '@babel/preset-react', { 'pragma': 's72.ui.h' } ]
      ]
    }),
    (production && terser())
  ]
};
