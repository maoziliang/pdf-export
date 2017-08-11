An utility tool for export an url to pdf, which depend on chrome headless mode.  
For client side rendered webpage. You should invoke `window.__notifyPageRenderFinished()` to notify the exporter, or just wait for `timeout`.

# Document

1. Constructor(options: IPDFExportOptions): ICDPClient

    contstructor an exporter instance.

1. export({ url: string, cookies?: ICookieItem[] }): Promise<Buffer>

    Visit the url with the given cookies.

1. dispose():void

    Kill the child chrome process.

# How to use.

1. Install chrome/chromium on your system.

2. `npm install pdf-export`

3. Usage
    ``` javascript
    const fs = require('fs');
    const PDFExportor = require('pdf-export').default;
    const exporter = new PDFExportor({
      host: 'localhost',
      port: 9333,
      chromeBin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      timeout: 5000,
    });

    function main() {
      Promise.all([
        exporter.export('http://localhost:8082/test1.html').then(buffer => {
          fs.writeFileSync('test1.pdf', buffer);
        }),
        exporter.export('http://localhost:8082/test2.html').then(buffer => {
          fs.writeFileSync('test2.pdf', buffer);
        }),
        exporter.export('http://localhost:8082/test1.html').then(buffer => {
          fs.writeFileSync('test3.pdf', buffer);
        }),
        exporter.export('http://localhost:8082/test2.html').then(buffer => {
          fs.writeFileSync('test4.pdf', buffer);
        }),
      ]).then(exporter.dispose.bind(exporter), console.log)
    }
    main();
    ```

# Other

This library depend on [chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface), which not provide typescript type definitions. So I just write a partial definitions of `chrome-remote-inteface` library.
