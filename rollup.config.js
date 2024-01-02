import {defineConfig} from 'rollup';

import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const name = 'vite-plugin-auto-zip'
export default defineConfig([
    {
        input: 'src/index.ts',
        output: [
            {
                file: `dist/${name}.js`,
                format: 'es'
            }
        ],
        plugins: [
            typescript({
                sourceMap: false,
            })
        ],
        external: ['node:path', 'node:fs', 'jszip']
    },
    {
        input: "src/index.ts",
        output: [{file: `dist/${name}.d.ts`, format: "cjs"}],
        plugins: [dts()],
    }
])
