namespace cclib {
    const { ccclass, property, menu } = cc._decorator;

    @ccclass("I18nStatic")
    @menu("cclib/I18nStatic")
    export class I18nStatic extends cc.Component {
        @property
        key: string = "";
        @property
        params: string[] = [];

        onLoad() {
            this.setString(this.params);
        }

        getLabel() {
            return this.node.getComponent(cc.Label);
        }

        getRichText() {
            return this.node.getComponent(cc.RichText);
        }

        setString(...args: any[]) {
            if (this.key != "") {
                try {
                    (this.getLabel() || this.getRichText()).string = i18nMgr.localize(this.key, ...args);
                } catch (error) {
                    cc.error("I18nStatic:", error);
                }
            }
        }
    }
}
