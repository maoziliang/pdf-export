"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const CDP = require("chrome-remote-interface");
const timeout = async (mis) => new Promise(resolve => setTimeout(resolve, mis));
;
class PDFExport {
    constructor(options) {
        this.options = null;
        this.cookies = [];
        this._chromeProcessPromise = null;
        this.options = options;
        this.options.timeout = this.options.timeout || 3000;
    }
    async spawnChrome() {
        if (this._chromeProcessPromise === null) {
            this._chromeProcessPromise = new Promise(async (resolve) => {
                const process = child_process_1.spawn(this.options.chromeBin, [
                    `--remote-debugging-port=${this.options.port}`,
                    '--headless',
                ]);
                let started = false;
                while (!started) {
                    try {
                        await timeout(200);
                        const client = await CDP(this.options);
                        started = true;
                        client.close();
                        resolve(process);
                    }
                    catch (e) { }
                }
            });
        }
        return this._chromeProcessPromise;
    }
    injectDetectScript(client) {
        return client.Page.addScriptToEvaluateOnLoad({
            scriptSource: `
        window.__pageRenderFinishedPromise__ = new Promise(function(resolve) {
          window.__notifyPageRenderFinished__ = resolve;
        });
      `
        });
    }
    /**
     * 等待__notifyPageRenderFinished__被调用，或者5秒钟超时
     *
     * @private
     * @param {CDP.ICDPClient} client
     * @returns {Promise<any>}
     * @memberof PDFExport
     */
    waitForRenderFinished(client) {
        return Promise.race([
            client.Runtime.evaluate({
                expression: `new Promise(function(resolve) {
          setTimeout(function () {
            window.__pageRenderFinishedPromise__.then(resolve);
          });
        })`,
                awaitPromise: true,
            }).then(() => 'page render finished callback.'),
            timeout(this.options.timeout).then(() => 'timeout for waiting rendering.'),
        ]).then(console.log);
    }
    /**
     * 设置网络请求的cookies
     *
     * @param {CDP.ICookieItem[]} cookies
     * @memberof PDFExport
     */
    setCookies(cookies) {
        if (cookies !== null) {
            this.cookies = cookies;
        }
    }
    async setClientCookies(client) {
        await client.Network.clearBrowserCookies();
        await Promise.all(this.cookies.map(cookieItem => client.Network.setCookie(cookieItem)));
    }
    /**
     * 导出url指向的网页
     *
     * @param {string} url
     * @returns {Promise<Buffer>}
     * @memberof PDFExport
     */
    async export(url) {
        await this.spawnChrome();
        const { host, port } = this.options;
        const target = await CDP.New({ host, port });
        const client = await CDP({ host, port, target });
        try {
            await this.setClientCookies(client);
            await client.Page.enable();
            await this.injectDetectScript(client);
            await client.Page.navigate({ url });
            await client.Page.loadEventFired();
            await this.waitForRenderFinished(client);
            const base64Data = await client.Page.printToPDF();
            const buffer = Buffer.from(base64Data.data, 'base64');
            return buffer;
        }
        catch (e) {
            console.log(e);
            return null;
        }
        finally {
            await client.close();
            await CDP.Close({ host, port, id: target.id });
        }
    }
    /**
     * 清理资源
     */
    async dispose() {
        const chromeProcess = await this._chromeProcessPromise;
        chromeProcess.kill();
    }
}
exports.default = PDFExport;
//# sourceMappingURL=index.js.map