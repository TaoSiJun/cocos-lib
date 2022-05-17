namespace ccl {
    const { ccclass, menu } = cc._decorator;

    @ccclass("Panel")
    @menu("ccl/component/Panel")
    export class Panel extends cc.Component {
        /**
         * Deliver data to panel
         */
        data: any = null;

        /**
         * Prefab's path
         */
        prefabPath: string = "";

        /**
         * Call when the panel poped
         * @override
         */
        onPopPanel() {}

        /**
         * Call when the panel pushed
         * @override
         */
        onPushPanel() {}
    }
}
