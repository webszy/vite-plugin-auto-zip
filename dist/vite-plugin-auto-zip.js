import * as path from 'node:path';
import {resolve} from 'node:path';
import JSZip from 'jszip';
import * as fs from 'node:fs';

function makeZip(config) {
    const {outPath: distPath, outName: fileName} = config;
    const zip = new JSZip();
    const readDir = function (zipInstance, dirPath) {
        // 读取dist下的根文件目录
        fs.readdirSync(dirPath)
            .forEach(fileName => {
                const fillPath = path.join(dirPath, "./", fileName);
                const file = fs.statSync(fillPath);
                // 如果是文件夹的话需要递归遍历下面的子文件
                if (file.isDirectory()) {
                    const dirZip = zipInstance.folder(fileName);
                    readDir(dirZip, fillPath);
                } else {
                    // 读取每个文件为buffer存到zip中
                    zip.file(fileName, fs.readFileSync(fillPath));
                }
            });
    };
    const removeExistedZip = () => {
        const dest = path.join(distPath, './' + fileName);
        if (fs.existsSync(dest)) {
            fs.unlinkSync(dest);
        }
    };
    const zipDir = function () {
        readDir(zip, distPath);
        zip.generateAsync({
            type: "nodebuffer", // 压缩类型
            compression: "DEFLATE", // 压缩算法
            compressionOptions: {
                level: 9
            }
        }).then((content) => {
            const dest = path.join(distPath, './' + fileName);
            removeExistedZip();
            // 把zip包写到硬盘中，这个content现在是一段buffer
            fs.writeFileSync(dest, content);
        });
    };
    removeExistedZip();
    zipDir();
}

// 默认配置
const defaultOption = {
    folderPath: 'dist',
    outName: 'dist.zip',
    outPath: ''
};

function AutoZip(options = defaultOption) {
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
            const outDir = resolve(config.root, config.build.outDir);
            if (outDir !== zipConfig.folderPath) {
                zipConfig.folderPath = outDir;
            }
            if (!zipConfig.outPath) {
                zipConfig.outPath = resolve(config.root, config.build.outDir, zipConfig.outName);
            }
            console.log('zipConfig', zipConfig);
        },
        closeBundle() {
            process.nextTick(() => {
                makeZip(zipConfig);
            });
        }
    };
}

const zip = makeZip;

export {AutoZip as default, zip};
