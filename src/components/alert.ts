namespace cclib {
    const { ccclass, property, menu } = cc._decorator;

    @ccclass("Alert")
    @menu("cclib/Alert")
    export class Alert extends cc.Component {
        @property(cc.Node)
        cancleNode: cc.Node | null = null;
        @property(cc.Node)
        confirmNode: cc.Node | null = null;
        @property({ type: cc.Component.EventHandler })
        cancleEvents: cc.Component.EventHandler[] = [];
        @property({ type: cc.Component.EventHandler })
        confirmEvents: cc.Component.EventHandler[] = [];

        __onAdd(): void {
            this.cancleNode?.on(cc.Node.EventType.TOUCH_END, this._onCancle, this);
            this.confirmNode?.on(cc.Node.EventType.TOUCH_END, this._onConfirm, this);
        }

        private _onCancle(e: cc.Event.EventTouch) {
            cc.Component.EventHandler.emitEvents(this.cancleEvents, e);
            // winMgr.remove(this.path);
        }

        private _onConfirm(e: cc.Event.EventTouch) {
            cc.Component.EventHandler.emitEvents(this.confirmEvents, e);
            // winMgr.remove(this.path);
        }
    }
}
