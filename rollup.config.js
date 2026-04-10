import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import path from 'path';

export default {
  input: 'dist/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
  },
  plugins: [
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs({}),
    json(),
    alias({
      entries: [
        { find: '@', replacement: path.resolve('dist') },
      ],
    }),
  ],
  // External packages that shouldn't be bundled
  external: [
    'content-type',
    'express',
    'node:crypto',
    'node:*',
    'http',
    'https',
    'path',
    'fs',
    'url',
    'util',
    'assert',
    'stream',
    'events',
    'zlib',
    'statuses',
  ],
};