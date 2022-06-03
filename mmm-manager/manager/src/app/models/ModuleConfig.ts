export interface ModuleConfig extends ConfigAccess{
    
}
export interface ConfigAccess {
    [key: string]: string | number | Array<any> | ModuleConfig;
}
