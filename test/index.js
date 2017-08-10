const fs = require('fs');
const PDFExportor = require('../dist').default;
const exporter = new PDFExportor({
  host: 'localhost',
  port: 9333,
  chromeBin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  timeout: 5000,
});

async function main() {
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