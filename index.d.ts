interface Options{
  pattern?: string,
  delay?: number,
  prefix?: string,
  debug?: boolean,
  headers?: object,
  watchOptions?: object
}
export default function mockServer(app,folder:string,options:Options):void