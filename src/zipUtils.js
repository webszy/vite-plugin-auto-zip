import JSZip from 'jszip';
import * as fs from 'node:fs';
import * as path from 'node:path';
export function makeZip(config) {
    const { outPath: distPath, outName: fileName } = config;
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
            }
            else {
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
