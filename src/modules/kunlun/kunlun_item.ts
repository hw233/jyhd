///<reference path="../common/common_util.ts"/>
///<reference path="../common_alert/equip_wear_alert.ts"/>
///<reference path="../common_alert/prop_use_alert.ts"/>
/** 背包道具单元项*/
namespace modules.kunlun {
    import BaseItem = modules.bag.BaseItem;

    export class KunLunItme extends BaseItem {
        constructor() {
            super();
            this.height = 122;
        }

        protected initialize(): void {
            super.initialize();
            this.nameVisible = true;
            this.needTip = true;
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        protected setDataSource(value: Protocols.Item) {
            super.setDataSource(value);
        }

        public destroy(): void {
            super.destroy(true);
        }
    }
}