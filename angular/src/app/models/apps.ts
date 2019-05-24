export interface AppData {
    name : string,
    appid : string,
    installs : number,
    uninstalls : number
}
export interface Apps {
    statusCode : number;
    data : AppData [];
    msg : string;
    error? : string;
}


