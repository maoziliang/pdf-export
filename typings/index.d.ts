import CDP = require('./chrome-remote-interface');

export = PDFExport;

interface IPDFExportOptions extends CDP.ICDPOptions {
  chromeBin: string,
  timeout?: number,
}

declare class PDFExport {
  constructor(options: IPDFExportOptions);

  /**
   * 导出url指向的网页
   *
   * @param {string} url
   * @returns {Promise<Buffer>}
   * @memberof PDFExport
   */
  export(opts: {
    url: string,
    cookies?: CDP.ICookieItem[],
    pdfOptions?: CDP.IPrintToPDFOptions,
  }): Promise<Buffer>;

  /**
   * 清理资源
   */
  dispose(): Promise<void>;
}