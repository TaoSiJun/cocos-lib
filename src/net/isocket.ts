namespace cclib {
    export class ISocket {
        private _socket: WebSocket = null;

        constructor() {
            if (!window["WebSocket"]) {
                console.error("Current browser does not support WebSocket");
            }
        }

        private _bindEvent() {
            if (this._socket) {
                this._socket.onopen;
                this._socket.onclose;
                this._socket.onerror;
                this._socket.onmessage;
            }
        }

        connect(host: string, port: number) {
            this._socket = new WebSocket(`ws://${host}:${port}`);
            this._socket.binaryType = "arraybuffer";
            this._bindEvent();
        }

        connectByUrl(url: string) {
            this._socket = new WebSocket(url);
            this._socket.binaryType = "arraybuffer";
            this._bindEvent();
        }

        send(message: any) {
            if (this._socket) this._socket.send(message);
        }

        close() {
            if (this._socket) this._socket.close();
        }
    }
}
