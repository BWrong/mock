interface IOptions {
  delay?: number;
  watchOptions?: Record<string, any>;
  headers?: Record<string, string>;
  prefix?: string;
  pattern?: string;
  debug?: boolean;
}
type MockServer = (app: any, mockFolder: string, options: IOptions) => void

export default MockServer