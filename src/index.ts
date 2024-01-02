import {ResolvedConfig} from 'vite'
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
export default function AutoZip(options: IPluginOptions = defaultOption) {
    const zipConfig: IPluginOptions = {
        ...options
    }
    if (!zipConfig.outName) {
        zipConfig.outName = 'dist.zip'
    }
    return {
        name: 'vite-plugin-auto-zip',
        apply: 'build',
        enforce: 'post',
        configResolved(config: ResolvedConfig) {
            // 获取vite配置，根据vite配置的root，outDir来设置压缩目录
            if (config.mode !== 'production' && config.command !== 'build') {
                return
            }
            const outDir = pathResolve(config.root, config.build.outDir)
            if (outDir !== zipConfig.folderPath) {
                zipConfig.folderPath = outDir
            }
            if (!zipConfig.outPath) {
                zipConfig.outPath = pathResolve(config.root, config.build.outDir, zipConfig.outName)
            }
            console.log('zipConfig', zipConfig)
        },
        closeBundle() {
            process.nextTick(() => {
                makeZip(zipConfig)
            })
        }
    }
}
export const zip = makeZip
