namespace ccl {
    class I18nManager {
        private _data: any;

        public set data(json: any) {
            this._data = json;
        }

        public localize(key: string, ...args: any[]) {
            try {
                if (!this._data) {
                    throw "I18n data is undefined.";
                }
                let s = this._data[key] as string;
                if (!s || s == "") {
                    cc.warn("I18n '" + key + "' not found.");
                    return key;
                }
                for (let i = 0; i < args.length; ++i) {
                    s = s.replace("{" + i + "}", args[i]);
                }
                return s;
            } catch (error) {
                cc.error(error);
                return key;
            }
        }
    }

    /**
     * @example
     * var json = { key:"Hello", key2:"Hello {0} {1} placeholder" }
     * I18nManager.data = json; //Initial the i18n data when game started
     * I18nManager.localize("key"); //Return "Hello"
     * I18nManager.localize("key2", "test1", "test2"); //Return "Hello test1 test2 placeholder"
     */
    export const i18nMgr = new I18nManager();
}
