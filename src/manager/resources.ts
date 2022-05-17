namespace ccl {
    const __groupsCache: { [name: string]: string[] } = {};
    const __assetsCache: { [name: string]: { [path: string]: {} } } = {};

    function __deleteCache() {
        for (let k in __groupsCache) {
            delete __groupsCache[k];
        }
        for (let k in __assetsCache) {
            delete __assetsCache[k];
        }
    }

    class Resources {
        /**
         * 创建一个资源分组
         * @param groupName 组名
         * @param paths 该组的所有资源路径
         * @param override `true`(默认)会覆盖掉之前的路径 `false`添加到当前组
         * @returns
         */
        createGroup(groupName: string, paths: string[], override: boolean = true) {
            if (!paths || paths.length == 0) {
                return false;
            }
            let _paths = __groupsCache[groupName] || [];
            if (override) {
                _paths = paths;
            } else {
                _paths = _paths.concat(paths);
            }
            __groupsCache[groupName] = _paths;
            return true;
        }

        /**
         * 加载一组资源
         * @param groupName
         * @returns
         */
        loadGroup(groupName: string) {
            let _paths = __groupsCache[groupName];
            if (!_paths) {
                return Promise.reject("group is not found:" + groupName);
            } else {
                let assets = [];
                for (let i = 0; i < _paths.length; ++i) {
                    assets.push(this.loadAsset(_paths[i], cc.Asset, groupName));
                }
                return Promise.all(assets);
            }
        }

        /**
         * 返回分组资源的数量
         * @param groupName
         * @returns
         */
        countGroup(groupName: string) {
            return (__groupsCache[groupName] && __groupsCache[groupName].length) || 0;
        }

        /**
         * 获取已加载的分组资源
         * @param groupName
         * @returns
         */
        getGroupAssets(groupName: string) {
            return __assetsCache[groupName];
        }

        /**
         * 释放一个分组的资源
         * @param groupName
         */
        releaseGroup(groupName: string) {
            for (let path in __assetsCache[groupName]) {
                let asset = cc.resources.get(path);
                if (asset) {
                    asset.decRef();
                } else {
                    cc.warn("try to release resource not exist:", path);
                }
            }
            delete __assetsCache[groupName];
            delete __groupsCache[groupName];
        }

        /**
         * 通过`cc.resources.load`加载一个资源
         * @param path resources目录下的资源路径
         * @param type 资源类型
         * @param groupName 资源分组名 默认`temp`
         * @returns
         */
        loadAsset<T extends cc.Asset>(path: string, type: typeof cc.Asset, groupName: string = "temp") {
            return new Promise<T>((resolve, reject) => {
                if (!__assetsCache[groupName]) {
                    __assetsCache[groupName] = {};
                }
                let _assetsCache = __assetsCache[groupName];
                let _asset = cc.resources.get<T>(path, type);
                if (_asset) {
                    if (!_assetsCache[path]) {
                        _asset.addRef();
                        _assetsCache[path] = _asset;
                    }
                    resolve(_asset);
                } else {
                    cc.resources.load<T>(path, type, (err, assets) => {
                        if (err) {
                            console.error("resources.loadAsset", err);
                            reject(err);
                        } else {
                            assets.addRef();
                            _assetsCache[path] = assets;
                            resolve(assets);
                        }
                    });
                }
            });
        }

        /**
         * 释放资源所有的引用计数
         * @param path
         */
        releaseAsset(path: string) {
            let asset = cc.resources.get(path);
            if (asset) {
                for (let i = 0; i < asset.refCount; ++i) {
                    asset.decRef();
                }
            } else {
                cc.warn("try to release resource not exist:", path);
            }
        }

        releaseAll() {
            __deleteCache();
            cc.resources.releaseAll();
        }
    }

    /**
     * 管理使用`cc.resources`加载的资源
     * 主要是引用计数`refCount`和资源分组`groupName`
     */
    export const resMgr = new Resources();
}
