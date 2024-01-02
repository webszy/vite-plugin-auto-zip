import {ResolvedConfig, Plugin} from 'vite'
import {resolve as pathResolve} from 'node:path';
import {makeZip} from "./zipUtils";


// 默认配置
const defaultOption = {
    folderPath: 'dist',
    outName: 'dist.zip',
    outPath: ''
}
export default function AutoZip(
    folderPath: string,
    outPath: string = './dist',
    outName: string = 'dist.zip'
): Plugin {
    const options = {folderPath, outPath, outName}
    return {
        name: 'vite-plugin-auto-zip',
        apply: 'build',
        enforce: 'post',
        configResolved(config: ResolvedConfig) {
            if (config.mode !== 'production' && config.command !== 'build') {
                return
            }
            // 获取vite配置，根据vite配置的root，outDir来设置压缩目录
            const outDir = pathResolve(config.root, config.build.outDir)
            if (outDir !== folderPath) {
                options.folderPath = outDir
            }
            if (!outPath) {
                options.outPath = pathResolve(config.root, config.build.outDir, options.outName)
            }
            // console.log('zipConfig', options)
        },
        closeBundle() {
            // console.log(this)
            process.nextTick(() => {
                makeZip(options)
            })
        }
    }
}
export const zip = makeZip
