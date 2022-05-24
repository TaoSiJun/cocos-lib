namespace cclib {
    export const enum ErrorCode {
        WINDOW_REMOVED_NOT_FOUND,
        WINDOW_COMPONENT_NOT_FOUND,
        TRY_RELASE_ASSET,
    }

    export function error(errorId: number) {
        let message = "Unknow Error";
        return new Error(message);
    }

    export function warn(errorId: number) {}
}
