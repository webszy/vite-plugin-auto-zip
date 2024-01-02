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

function AutoZip(folderPath, outPath = './dist', outName = 'dist.zip') {
    const options = {folderPath, outPath, outName};
    return {
        name: 'vite-plugin-auto-zip',
        apply: 'build',
        enforce: 'post',
        configResolved(config) {
            if (config.mode !== 'production' && config.command !== 'build') {
                return;
            }
            // 获取vite配置，根据vite配置的root，outDir来设置压缩目录
            const outDir = resolve(config.root, config.build.outDir);
            if (outDir !== folderPath) {
                options.folderPath = outDir;
            }
            if (!outPath) {
                options.outPath = resolve(config.root, config.build.outDir, options.outName);
            }
            // console.log('zipConfig', options)
        },
        closeBundle() {
            // console.log(this)
            process.nextTick(() => {
                makeZip(options);
            });
        }
    };
}
const zip = makeZip;

export {AutoZip as default, zip};
