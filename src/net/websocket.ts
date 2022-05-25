namespace cclib {
    /**
     * WebSocket准备状态
     */
    export const enum ReadyState {
        /** 还未连接 */
        Initial,
        /** 连接中 */
        Connecting,
        /** 已经连接且可以通信 */
        Connected,
        /** 连接已经关闭或没有连接成功 */
        Closed,
    }

    export class HTML5WebSocket {
    }
}
