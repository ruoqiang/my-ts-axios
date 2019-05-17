import { AxiosRequestConfig } from "../types";

const starts = Object.create(null)
function defaultStart(val1:any,val2:any):any{
    return typeof val2 !== 'undefined' ? val2 : val1
}
export default function mergeConfig(config1:AxiosRequestConfig,config2?:AxiosRequestConfig):AxiosRequestConfig {
    if(!config2) {
        config2 ={}
    }
    
    const config = Object.create(null)

    for(let key in config2) {
        mergerField(key)
    }

    for (const key in config1) {
        if (!config2[key]) {
            mergerField(key)
        }
    }

    function mergerField(key:string):void {
        const start = starts[key] || defaultStart
        config[key] = start(config1[key],config2![key])
    }
    return config
}

