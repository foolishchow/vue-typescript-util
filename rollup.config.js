const
  nodeResolve = require('rollup-plugin-node-resolve'),
  Ts = require('rollup-typescript'),
  commonjs = require('rollup-plugin-commonjs'),
  uglify = require('rollup-plugin-uglify');

export default {
  input: './src/index.ts',
  moduleName: '',
  plugins: [
    Ts(),
    nodeResolve({
      browser: true,
      module: true,
      // jsnext: true,
      main: true,
      skip: ['vue']
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ],
  output: [
    { file: 'index.js', format: 'cjs' },
    { file: 'index.es.js', format: 'es' }
  ]
}