interface Options{
  pattern?: string,
  delay?: number,
  prefix?: string,
  debug?: boolean,
  headers?: object
}
export default function mockServer(app:Express,folder:string,options:Options):any