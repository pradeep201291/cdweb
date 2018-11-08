/**
 * 
 * 
 * @export
 * @param {*} parentModule
 * @param {string} moduleName
 */
export function ModuleLoaderException(parentModule: any, moduleName: string) {
  if (parentModule) {
    throw new Error(`${moduleName} has already been loaded. Import Core modules in the AppModule only.`);
  }
}
