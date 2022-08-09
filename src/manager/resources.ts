namespace cclib {
    class Resources {
        private readonly __groupsCache: { [group: string]: string[] } = {};
        private readonly __assetsCache: { [group: string]: { [path: string]: cc.Asset } } = {};

        private __deleteCache() {
            for (let group in this.__groupsCache) {
                delete this.__groupsCache[group];
                cc.log("delete group:" + group);
            }
            for (let group in this.__assetsCache) {
                for (let path in this.__assetsCache[group]) {
                    this.__assetsCache[group][path].decRef();
                }
                delete this.__assetsCache[group];
                cc.log("delete assets:" + group);
            }
        }

        /**
         * 创建一个资源分组配置
         * @param group 组名
         * @param paths 该组的所有资源路径
         * @param override `true`(默认)会覆盖掉之前的路径 `false`添加到当前组
         * @returns
         */
        createGroup(group: string, paths: string[], override: boolean = true) {
            if (!paths || paths.length == 0) {
                return false;
            }
            let _paths = this.__groupsCache[group] || [];
            if (override) {
                _paths = paths;
            } else {
                _paths = _paths.concat(paths);
            }
            this.__groupsCache[group] = _paths;
            return true;
        }

        /**
         * 加载一组资源
         * @param group
         * @returns
         */
        async loadGroup(group: string) {
            let _paths = this.__groupsCache[group];
            if (!_paths) {
                throw new Error("group not found:" + group);
            } else {
                let assets: any[] = [];
                for (let i = 0; i < _paths.length; ++i) {
                    try {
                        let a = await this.loadAsset(_paths[i], cc.Asset, group);
                        assets.push(a);
                        cc.log("load assets success", _paths[i]);
                    } catch (error) {
                        cc.error(group, _paths[i], error);
                    }
                }
                return assets;
            }
        }

        /**
         * 返回分组资源的数量 默认0
         * @param group
         * @returns
         */
        countGroup(group: string) {
            if (this.__groupsCache[group]) {
                return this.__groupsCache[group].length;
            }
            return 0;
        }

        /**
         * 获取已加载的分组资源
         * @param group
         * @returns
         */
        getAssetsByGroup(group: string) {
            return this.__assetsCache[group];
        }

        /**
         * 释放一个分组的资源 会释放已创建的资源分组配置
         * @param group
         */
        releaseGroup(group: string) {
            if (this.__assetsCache[group]) {
                for (let path in this.__assetsCache[group]) {
                    try {
                        this.__assetsCache[group][path].decRef();
                    } catch (error) {
                        cc.warn("try to release resource not exist. path=" + path);
                    }
                }
                delete this.__assetsCache[group];
            }
        }

        /**
         * 通过`cc.resources.load`加载一个资源
         * @param path resources目录下的资源路径
         * @param type 资源类型
         * @param group 资源分组名
         * @returns
         */
        loadAsset<T extends cc.Asset>(path: string, type: typeof cc.Asset, group: string) {
            return new Promise<T>((resolve, reject) => {
                let _asset = cc.resources.get<T>(path, type);
                if (_asset) {
                    if (!this.__assetsCache[group]) {
                        this.__assetsCache[group] = {};
                    }
                    if (!this.__assetsCache[group][path]) {
                        this.__assetsCache[group][path] = _asset;
                        _asset.addRef();
                    }
                    resolve(_asset);
                } else {
                    cc.resources.load<T>(path, type, (err, asset) => {
                        if (err) {
                            cc.error("Resources.loadAsset", err);
                            reject(err);
                        } else {
                            if (!cc.resources.get(path)) {
                                this.__assetsCache[group] = this.__assetsCache[group] || {};
                                this.__assetsCache[group][path] = asset;
                                asset.addRef();
                            }
                            resolve(asset);
                        }
                    });
                }
            });
        }

        /**
         * 释放所有当前已加载的资源
         */
        releaseAll() {
            // __deleteCache();
            // cc.resources.releaseAll();
            this.__deleteCache();
        }
    }

    /**
     * 管理使用`cc.resources`加载的资源
     * 主要是引用计数`refCount`和资源分组`group`
     */
    export const resources = new Resources();
}
