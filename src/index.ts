import {ResolvedConfig, Plugin} from 'vite'
import {resolve as pathResolve} from 'node:path';
import {makeZip} from "./zipUtils";

export interface IPluginOptions {
    folderPath: string,//需要压缩的文件夹路径,相对于项目根目录
    outName: string,//压缩后的文件名
    outPath: string //压缩后的文件路径
}
// 默认配置
const defaultOption = {
    folderPath: 'dist',
    outName: 'dist.zip',
    outPath: ''
}
export default function AutoZip(
    outName?: string,
    folderPath?: string,
    outPath?: string,
): Plugin {
    const options = {folderPath, outPath, outName} as Partial<IPluginOptions>

    options.outName = outName ?? defaultOption.outName
    options.folderPath = folderPath ?? defaultOption.folderPath
    options.outPath = outPath ?? defaultOption.outPath
    // console.log('plugin init',options)
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
                options.outPath = pathResolve(config.root, config.build.outDir, <string>options.outName)
            }
            // console.log('zipConfig', options)
        },
        closeBundle() {
            // console.log(this)
            console.time('✓ zip in')
            process.nextTick(() => {
                makeZip(<IPluginOptions>options)
                console.timeEnd('✓ zip in')
            })
        },
    }
}
export const zip = makeZip
