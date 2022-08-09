namespace cclib {
    export class HttpRequest {
        responseType: any = "json";
        withCredentials: boolean = false;
        timeout: number = 10 * 1000;
        mimeType: string = "";
        ssl: boolean = true;
        getHeaders: () => any = () => {
            return {};
        };
        getHost: () => string = () => {
            return "";
        };
        reject = (error: any) => {
            return error;
        };
        resolve = (json: any) => {
            return json;
        };

        getParams(object: any) {
            let params = "";
            for (let key in object) {
                params += `${key}=${object[key]}&`;
            }
            return params;
        }

        request(options: { path: string; data: any; method: "POST" | "GET" }, onComplete: (error?: Error | null, response?: any) => void) {
            if (this.getHost() === "") {
                console.error("request error: please set the http host");
                return;
            }
            let path = options.path;
            let data = options.data;
            let method = options.method;
            let url = `${this.getHost()}/${path}`;
            let info = "request failed:" + url + "status:";
            let xhr = new XMLHttpRequest();
            if (method === "GET") {
                let params = this.getParams(data);
                if (params !== "") {
                    url += "?" + params;
                }
                data = null;
            } else if (method === "POST") {
                if (typeof data === "object") {
                    data = JSON.stringify(data);
                }
            }
            xhr.open(method, url, true);
            if (this.responseType !== void 0) {
                xhr.responseType = this.responseType;
            }
            if (this.withCredentials !== void 0) {
                xhr.withCredentials = this.withCredentials;
            }
            if (this.mimeType !== void 0 && xhr.overrideMimeType) {
                xhr.overrideMimeType(this.mimeType);
            }
            if (this.timeout !== void 0) {
                xhr.timeout = this.timeout;
            }
            if (this.getHeaders) {
                xhr.setRequestHeader("Content-type", "application/json");
                for (let header in this.getHeaders()) {
                    xhr.setRequestHeader(header, this.getHeaders()[header]);
                }
            }
            xhr.onload = function () {
                if (xhr.status === 200 || xhr.status === 0) {
                    cc.log(`request:${method} ${url}`, `\r\ndata:${data}`, `\r\nresponse:${JSON.stringify(xhr.response)}`);
                    onComplete && onComplete(null, xhr.response);
                } else {
                    onComplete && onComplete(new Error(info + xhr.status + "(no response)"));
                }
            };
            xhr.onerror = function () {
                onComplete && onComplete(new Error(info + xhr.status + "(error)"));
            };
            xhr.ontimeout = function () {
                onComplete && onComplete(new Error(info + xhr.status + "(time out)"));
            };
            xhr.onabort = function () {
                onComplete && onComplete(new Error(info + xhr.status + "(abort)"));
            };
            xhr.send(data);
            return xhr;
        }

        get(path: string, data?: any) {
            return new Promise<any>((resolve, reject) => {
                this.request({ path, data, method: "GET" }, (err, res) => {
                    if (!err) {
                        try {
                            resolve(this.resolve(res));
                        } catch (error) {
                            reject(this.reject(error));
                        }
                    } else {
                        reject(this.reject(err));
                    }
                });
            });
        }

        post(path: string, data?: any) {
            return new Promise<any>((resolve, reject) => {
                this.request({ path, data, method: "POST" }, (err, res) => {
                    if (!err) {
                        try {
                            resolve(this.resolve(res));
                        } catch (error) {
                            reject(this.reject(error));
                        }
                    } else {
                        reject(this.reject(err));
                    }
                });
            });
        }
    }
}
