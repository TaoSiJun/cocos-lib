namespace ccl {
    const { ccclass, property, menu } = cc._decorator;

    export class Popup extends cc.Component {
        @property({ tooltip: "Block your popup's touch event" })
        blockInput: boolean = true;
        @property({ tooltip: "Touch the mask node to close the popup" })
        touchMask: boolean = false;
        @property(cc.Button)
        closeButton: cc.Button | null = null;

        /**
         * Deliver data to popup
         */
        data: any = null;

        /**
         * Prefab's path
         */
        prefabPath: string = "";

        /**
         * Call when the popup show
         * @override
         */
        onShow() {}

        /**
         * Call when the popup hide
         * @override
         */
        onHide() {}

        hide() {
            popupMgr.hide(this.prefabPath);
        }
    }
}
