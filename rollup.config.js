import {defineConfig} from 'rollup';

import typescript from "rollup-plugin-typescript2";

const name = 'vite-plugin-auto-zip'
export default defineConfig({
    input: 'src/index.ts',
    output: [
        {
            file: `dist/${name}.js`,
            format: 'es',
        },
    ],
    plugins: [
        typescript({
            tsconfig: 'tsconfig.json',
            tsconfigOverride: {
                compilerOptions: {
                    declaration: false,
                    declarationDir: null,
                    composite: false
                }
            },
            // 保留 declaration 选项
            declaration: false,
        }),
    ],
    external: ['jszip', 'node:fs', 'node:path']
})
