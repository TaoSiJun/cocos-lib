namespace cclib {
    const { ccclass, property, menu } = cc._decorator;

<<<<<<<< HEAD:src/components/i18n.ts
    @ccclass("I18n")
    @menu("ccl/component/I18n")
    export class I18n extends cc.Component {
========
    @ccclass("I18nStatic")
    @menu("cclib/I18nStatic")
    export class I18nStatic extends cc.Component {
>>>>>>>> origin/dev:src/components/i18n-static.ts
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
                    cc.error("I18n:", error);
                }
            }
        }
    }
}
