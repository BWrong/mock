import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from 'rollup-plugin-terser';
import { babel } from '@rollup/plugin-babel';
import pkg from './package.json';
const libName = 'mockTool';
const banner = `/* libName: ${libName} version: ${pkg.version} author: ${pkg.author} */`;
const config = {
  input: 'src/index.js',
  output: [
    {
      file: './lib/index.js',
      format: 'umd',
      name: libName,
      banner
    },
    {
      file: './lib/index.min.js',
      format: 'umd',
      plugins:[terser()],
      name: libName,
      banner
    },
    {
      file: './lib/index.esm.js',
      format: 'esm',
      name: libName,
      banner
    },
    {
      file: './lib/index.common.js',
      format: 'cjs',
      name: libName,
      banner
    }
  ],
  plugins: [nodeResolve(), commonjs(), babel({
    exclude: 'node_modules/**',babelHelpers:'bundled' })],
  external:['chokidar','chalk','body-parser','path-to-regexp','glob','mockjs'],
  // globals:{},
};

export default config;
