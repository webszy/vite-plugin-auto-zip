const plugin = function(){
    const makeZip = function (output, fileName = 'dist.zip') {
        const path = require('path')
        const fs = require('fs')
        const JSZip = require('jszip');
        const zip = new JSZip()
        const distPath = path.resolve(output)
        const readDir = function (zip, dirPath) {
            // 读取dist下的根文件目录
            const files = fs.readdirSync(dirPath);
            files.forEach(fileName => {
                const fillPath = path.join(dirPath, "./", fileName)
                const file = fs.statSync(fillPath);
                // 如果是文件夹的话需要递归遍历下面的子文件
                if (file.isDirectory()) {
                    const dirZip = zip.folder(fileName);
                    readDir(dirZip, fillPath);
                } else {
                    // 读取每个文件为buffer存到zip中
                    zip.file(fileName, fs.readFileSync(fillPath))
                }
            });
        }
        const removeExistedZip = () => {
            const dest = path.join(distPath, './' + fileName)
            if (fs.existsSync(dest)) {
                fs.unlinkSync(dest)
            }
        }
        const zipDir = function () {
            readDir(zip, distPath);
            zip.generateAsync({
                type: "nodebuffer", // 压缩类型
                compression: "DEFLATE", // 压缩算法
                compressionOptions: { // 压缩级别
                    level: 9
                }
            }).then(content => {
                const dest = path.join(distPath, './' + fileName)
                removeExistedZip()
                // 把zip包写到硬盘中，这个content现在是一段buffer
                fs.writeFileSync(dest, content);
            });
        }
        removeExistedZip()
        zipDir(distPath)
    }
    return {
        name: 'vite-plugin-auto-zip',
        apply: 'build',
        closeBundle(){
            const path = require('path')
            const realPath = path.resolve(__dirname,'../../dist')
            const name = 'dist.'+process.env.NODE_ENV+'.zip'
            makeZip(realPath,name)
        }
    }
}
module.exports = plugin
