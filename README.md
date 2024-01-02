# vite-plugin-auto-zip

my first vite plugin named auto-zip,mean it will auto zip your dist files after vite build done ,only emit when
production

### basic use on vite.config.js

Just in case, make sure AutoZip is the last item in the plugins
```javascript
import AutoZip from 'vite-plugin-auto-zip'
{
    plugins:[
        AutoZip()
    ]
}
```

### params of AutoZip

1. folderPath
    + the target folder you want to zip
    + default value is './dist'

2. outPath
    + the output folder you want to put the zip file
    + default value is './dist'
3. outName
    + your zip file name
    + default value is 'dist.zip'

```typescript
function AutoZip(folderPath: string = './dist', outPath: string = './dist', outName: string = 'dist.zip')
```
