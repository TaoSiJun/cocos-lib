namespace ccl {
    const { ccclass, property, menu } = cc._decorator;

    @ccclass("Popup")
    @menu("ccl/component/Panel")
    export class Popup extends cc.Component {
        @property({ tooltip: "Block your popup's touch event" })
        blockInput: boolean = true;
        @property({ tooltip: "Touch the mask node to close the popup" })
        touchMask: boolean = false;
        @property(cc.Button)
        closeButton: cc.Button | null = null;

        /**
         * deliver data to popup
         */
        data: any = null;

        /**
         * prefab's path
         */
        prefabPath: string = "";

        /**
         * when add invoke
         */
        onAdded() {}

        /**
         * when remove invoke
         */
        onRemoved() {}

        remove() {
            popupMgr.remove(this.prefabPath);
        }
    }
}
