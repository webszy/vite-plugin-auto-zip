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

1. outName <span style="color:red">see breaking changes when 1.2.0</span>
   + your zip file name
   + default value is 'dist.zip'

2. folderPath
    + the target folder you want to zip
    + default value is './dist'

3. outPath
    + the output folder you want to put the zip file
    + default value is './dist'


```typescript
function AutoZip(outName: string = 'dist.zip', folderPath: string = './dist', outPath: string = './dist') {
}
```

# breaking changes

## v1.2.0

+ outName will be first params
