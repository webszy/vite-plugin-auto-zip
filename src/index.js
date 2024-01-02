import { resolve as pathResolve } from 'node:path';
import { makeZip } from "./zipUtils";
// 默认配置
const defaultOption = {
    folderPath: 'dist',
    outName: 'dist.zip',
    outPath: ''
};
export default function AutoZip(options = defaultOption) {
    const zipConfig = Object.assign({}, options);
    if (!zipConfig.outName) {
        zipConfig.outName = 'dist.zip';
    }
    return {
        name: 'vite-plugin-auto-zip',
        apply: 'build',
        enforce: 'post',
        configResolved(config) {
            // 获取vite配置，根据vite配置的root，outDir来设置压缩目录
            if (config.mode !== 'production' && config.command !== 'build') {
                return;
            }
            const outDir = pathResolve(config.root, config.build.outDir);
            if (outDir !== zipConfig.folderPath) {
                zipConfig.folderPath = outDir;
            }
            if (!zipConfig.outPath) {
                zipConfig.outPath = pathResolve(config.root, config.build.outDir, zipConfig.outName);
            }
            console.log('zipConfig', zipConfig);
        },
        closeBundle() {
            console.log(this);
            process.nextTick(() => {
                makeZip(zipConfig);
            });
        }
    };
}
export const zip = makeZip;
