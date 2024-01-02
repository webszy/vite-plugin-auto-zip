import {zip} from './dist/vite-plugin-auto-zip.js';

zip({
    outName: 'dist.zip',
    outPath: 'dist',
    folderPath: 'dist',
})
