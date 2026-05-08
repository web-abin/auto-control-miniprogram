import { defineConfig } from 'tsup'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: false,
    target: 'node18',
    splitting: false,
  },
  {
    entry: { cli: 'src/cli.ts' },
    format: ['cjs'],
    dts: false,
    clean: false,
    sourcemap: false,
    target: 'node18',
    splitting: false,
    define: {
      __VERSION__: JSON.stringify(pkg.version),
    },
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
])
