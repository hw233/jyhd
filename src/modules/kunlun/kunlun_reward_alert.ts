///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/scene_riches_cfg.ts"/>
///<reference path="../day_drop_treasure/day_drop_treasure_model.ts"/>
///<reference path="../yunmeng/yun_meng_mi_jing_model.ts"/>
namespace modules.kunlun {
    import CustomList = modules.common.CustomList;
    import Point = laya.maths.Point;
    import Item = Protocols.Item;

    export class KunLunRewordAlert extends ui.KunLunRewordAlertUI {
        private _list: CustomList;
        private _pos: Point;
        private _type: number;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.width = 520;
            this._list.height = 230;
            this._list.hCount = 4;
            this._list.spaceX = 30;
            //  30=  this._list.spaceX * (this._list.hCount );
            this._list.itemRender = KunLunItme1;
            this._list.x = 80;
            this._list.y = 129;
            this.addChild(this._list);
        }

        public onOpened(): void {
            super.onOpened();
        }

        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }

        public setOpenParam(value: Array<Item>): void {
            super.setOpenParam(value);
            if (value) {
                this._list.datas = value;
            }
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }
    }
}