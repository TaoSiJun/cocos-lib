namespace cclib {
    const { ccclass, property, menu } = cc._decorator;

    @ccclass("Modal")
    @menu("cclib/Modal")
    export class Modal extends Window {
        @property(cc.Button)
        closeButton: cc.Button | null = null;
        @property({ tooltip: "Block touch the after nodes" })
        blockThrough: boolean = true;
        @property({ tooltip: "Touch the mask to close" })
        touchClose: boolean = true;
        @property
        maskAlpha: number = 0.5;

        __onAdd(): void {
            this.closeButton?.node.on(cc.Node.EventType.TOUCH_END, this._onClose, this);
            let w = cc.winSize.width;
            let h = cc.winSize.height;
            let node = new cc.Node("Modal Mask");
            node.width = w;
            node.height = h;
            let g = node.addComponent(cc.Graphics);
            g.fillColor = cc.color(0, 0, 0, 255 * this.maskAlpha);
            g.fillRect(-2 / w, -2 / h, w, h);
            if (this.blockThrough) {
                node.addComponent(cc.BlockInputEvents);
            }
            if (this.touchClose) {
                node.on(cc.Node.EventType.TOUCH_END, this._onClose, this);
            }
            node.setParent(this.node);
            node.setSiblingIndex(0);
        }

        private _onClose() {
            winMgr.remove(this.path);
        }
    }
}
