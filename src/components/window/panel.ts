namespace cclib {
    const { ccclass, property, menu } = cc._decorator;

    @ccclass("Panel")
    @menu("cclib/Panel")
    export class Panel extends Window {
        @property({ type: cc.Component.EventHandler })
        pushEvents: cc.Component.EventHandler[] = [];
        @property({ type: cc.Component.EventHandler })
        popEvents: cc.Component.EventHandler[] = [];

        __onPushPanel() {
            cc.Component.EventHandler.emitEvents(this.pushEvents);
        }

        __onPopPanel() {
            cc.Component.EventHandler.emitEvents(this.popEvents);
        }
    }
}
