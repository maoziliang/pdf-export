export = CDP;

interface IProtocol {
  remote: Boolean;
  descriptor: any;
}

interface IRemoteObject {
  type: string;
  subtype: string;
  className: string;
  value: any;
  unserializableValue: string;
  description: string;
  objectId: string;
  preview: any;
  customPreview: any;
}

declare type IndexNumber = Number;
declare type WebSocketUrl = String;
declare type TargetId = String;
declare type targetFn = (targets: CDP.ITargetInfo[]) => (CDP.ITargetInfo | IndexNumber);

interface IBaseOption {
  host: string;
  port: number;
  secure?: boolean;
}
interface ICDPListOptions extends IBaseOption {
}
interface ICDPNewOptions extends IBaseOption {
  /**
   * @type {string}
   * @default "about:blank"
   * @memberof ICDPNewOptions
   */
  url?: string;
}
interface ICDPCloseOptions extends IBaseOption {
  /**
   * Target Id
   * @type {string}
   * @memberof ICDPCloseOptions
   */
  id: string;
}

interface IPage {
  enable(): Promise<void>;
  disable(): Promise<void>;
  /**
   * deprecated
   *
   * @param {{ scriptSource: string }} options
   * @returns {Promise<{ identifier: string }>}
   * @memberof IPage
   */
  addScriptToEvaluateOnLoad(options: { scriptSource: string }): Promise<{ identifier: string }>;
  /**
   * Evaluates given script in every frame upon creation (before loading frame's scripts)
   *
   * @param {{ source: string }} options
   * @returns {Promise<{ identifier: string }>}
   * @memberof IPage
   */
  addScriptToEvaluateOnNewDocument(options: { source: string }): Promise<{ identifier: string }>;
  printToPDF(options?: {
    landscape?: Boolean;
    displayHeaderFooter?: Boolean;
    printBackground?: Boolean;
    scale?: Number;
    /**
     * Paper width in inches. Defaults to 8.5 inches.
     * @type {Number}
     */
    paperWidth?: Number;
    /**
     * Paper height in inches. Defaults to 11 inches.
     * @type {Number}
     */
    paperHeight?: Number;
    /**
     * Top margin in inches. Defaults to 1cm (~0.4 inches).
     * @type {Number}
     */
    marginTop?: Number;
    /**
     * Bottom margin in inches. Defaults to 1cm (~0.4 inches).
     * @type {Number}
     */
    marginBottom?: Number;
    /**
     * Left margin in inches. Defaults to 1cm (~0.4 inches).
     * @type {Number}
     */
    marginLeft?: Number;
    /**
     * Right margin in inches. Defaults to 1cm (~0.4 inches).
     * @type {Number}
     */
    marginRight?: Number;
    /**
     * Paper ranges to print, e.g., '1-5, 8, 11-13'. Defaults to the empty string, which means print all pages.
     * @type {Number}
     */
    pageRanges?: Number;
    /**
     * Whether to silently ignore invalid but successfully parsed page ranges, such as '3-2'. Defaults to false.
     * @type {Boolean}
     */
    ignoreInvalidPageRanges?: Boolean;
  }): Promise<{ data: string }>;
  bringToFront(): Promise<void>;
  /**
   * Navigates current page to the given URL.
   * @param {{ url: string, referer?: string }} options
   * @returns {Promise<{ frameId: string }>} FrameId
   * @memberof IPage
   */
  navigate(options: { url: string, referer?: string }): Promise<{ frameId: string }>;

  // events
  /**
   * load事件触发
   */
  loadEventFired(): Promise<{ timestamp: number }>;
}

interface IRuntime {
  evaluate(options: {
    expression: string,
    objectGroup?: string,
    includeCommandLineAPI?: boolean,
    silent?: boolean,
    contextId?: number,
    returnByValue?: boolean,
    awaitPromise?: boolean,
  }): Promise<{
    result: IRemoteObject,
    exceptionDetails: any,
  }>;
}

interface INetwork {
  clearBrowserCookies(): Promise<{ result: boolean }>;
  setCookie(cookieItem: CDP.ICookieItem): Promise<{ success: boolean }>;
  setUserAgentOverride(options: { userAgent: string}): Promise<void>;
}

declare function CDP(options: CDP.ICDPOptions): Promise<CDP.ICDPClient>;
declare function CDP():Promise<CDP.ICDPClient>;

declare namespace CDP {
  export interface ICDPOptions extends IBaseOption {
    target?: targetFn | CDP.ITargetInfo | WebSocketUrl | TargetId;
    protocol?: IProtocol;
    remote?: Boolean;
  }
  export interface ITargetInfo {
    description: string; //"",
    devtoolsFrontendUrl: string; //"/devtools/inspector.html?ws=localhost:9333/devtools/page/ed799813-e25a-43ab-a315-b4380cc1bc64",
    id: string; //"ed799813-e25a-43ab-a315-b4380cc1bc64",
    title: string; //"about:blank",
    type: string; //"page",
    url: string; //"about:blank",
    webSocketDebuggerUrl: string; //"ws://localhost:9333/devtools/page/ed799813-e25a-43ab-a315-b4380cc1bc64"
  }

  interface ICDPClient {
    close():Promise<void>;
    Page: IPage;
    Runtime: IRuntime;
    Network: INetwork;
  }

  interface ICookieItem {
    url: string,
    name: string,
    value: string,
    path?: string,
    httpOnly?: boolean,
    secure?: boolean,
  }

  export function List(options: ICDPListOptions): Promise<ITargetInfo[]>;
  export function New(options: ICDPNewOptions): Promise<ITargetInfo>;
  export function Close(options: ICDPCloseOptions): Promise<void>;
}

