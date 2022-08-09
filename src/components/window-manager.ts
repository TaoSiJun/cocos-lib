// namespace cclib {
//     const __windowNodeMap: { [k: string]: cc.Node } = {};

//     const __windowIndexMap: { [k: string]: number } = {
//         Panel: 0,
//         Modal: 1,
//         Popup: 2,
//         Alert: 3,
//     };

//     const __panels: Panel[] = [];

//     export class WindowManager {
//         private get _rootNode() {
//             let canvas = cc.Canvas.instance;
//             let root = canvas.node.getChildByName("CCLibRoot");
//             if (!root) {
//                 root = new cc.Node("CCLibRoot");
//                 root.setParent(canvas.node);
//                 for (let k in __windowIndexMap) {
//                     let node = new cc.Node(k);
//                     node.setParent(root);
//                     node.setSiblingIndex(__windowIndexMap[k]);
//                 }
//             }
//             return root;
//         }

//         private get _panelNode() {
//             return this._rootNode.getChildByName("Panel");
//         }

//         private get _modalNode() {
//             return this._rootNode.getChildByName("Modal");
//         }

//         private get _popupNode() {
//             return this._rootNode.getChildByName("Popup");
//         }

//         private get _alertNode() {
//             return this._rootNode.getChildByName("Alert");
//         }

//         private _getNode(nodeName: string) {
//             switch (nodeName) {
//                 case "Panel":
//                     return this._panelNode;
//                 case "Modal":
//                     return this._modalNode;
//                 case "Popup":
//                     return this._popupNode;
//                 case "Alert":
//                     return this._alertNode;
//                 default:
//                     let node = new cc.Node(nodeName);
//                     let index = Object.keys(__windowIndexMap).length;
//                     this.registerWindowIndex(nodeName, index);
//                     node.setParent(this._rootNode);
//                     node.setSiblingIndex(index);
//                     return node;
//             }
//         }

//         /**
//          * @param name
//          * @param index
//          */
//         registerWindowIndex(name: string, index: number) {
//             let windowIndex = __windowIndexMap;
//             if (windowIndex[name] != void 0) {
//                 cc.warn(`The ${name}'s index is ${index}`);
//             }
//             windowIndex[name] = index;
//         }

//         /**
//          * 添加一个窗口
//          * @param path
//          * @param data
//          * @returns
//          */
//         async add(path: string, data: any = null) {
//             try {
//                 let prefab = await resources.loadAsset<cc.Prefab>(path, cc.Prefab, "WINDOW");
//                 let node = cc.instantiate(prefab);
//                 let win = node.getComponent(Window);
//                 if (!win) {
//                     // resources.releaseAsset(path);
//                     throw new Error(`${path} has not Window component`);
//                 }
//                 win.path = path;
//                 win.data = data;
//                 win.__onAdd();
//                 node.setParent(this._getNode(win["__classname__"]));
//                 __windowNodeMap[path] = node;
//                 return node;
//             } catch (error) {
//                 cc.error(error);
//             }
//         }

//         /**
//          * 删除一个窗口
//          * @param path
//          * @param releasePrefab `true`释放预制体资源
//          */
//         remove(path: string, releasePrefab: boolean = true) {
//             try {
//                 let node = __windowNodeMap[path];
//                 if (!node) {
//                     throw new Error(`${path} not found`);
//                 }
//                 let win = node.getComponent(Window);
//                 win.path = "";
//                 win.data = null;
//                 win.__onRemove();
//                 if (cc.isValid(node)) node.destroy();
//                 // if (releasePrefab) resources.releaseAsset(path);
//                 delete __windowNodeMap[path];
//             } catch (error) {
//                 cc.error(error);
//             }
//         }

//         clear() {
//             for (let path in __windowNodeMap) {
//                 this.remove(path);
//             }
//         }

//         async pushPanel(path: string, data: any = null) {
//             try {
//                 let prevNode = this._panelNode.children[0];
//                 let prevPanel = prevNode?.getComponent(Panel);
//                 let node = await this.add(path, data);
//                 let panel = node?.getComponent(Panel);
//                 if (panel) {
//                     panel.__onPushPanel();
//                     if (prevPanel) {
//                         prevNode.removeFromParent(false);
//                         __panels.push(prevPanel);
//                     }
//                 } else {
//                     this.remove(path);
//                 }
//             } catch (error) {
//                 cc.error(error);
//             }
//         }

//         popPanel(releasePrefab: boolean = true) {
//             try {
//                 let prevNode = this._panelNode.children[0];
//                 let prevPanel = prevNode?.getComponent(Panel);
//                 if (prevPanel) {
//                     prevPanel.__onPopPanel();
//                     this.remove(prevPanel.path, releasePrefab);
//                 }
//                 let panel = __panels.pop();
//                 if (panel) {
//                     panel.node.setParent(this._panelNode);
//                 }
//             } catch (error) {
//                 cc.error(error);
//             }
//         }
//     }

//     export const winMgr = new WindowManager();
// }
