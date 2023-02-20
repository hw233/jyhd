///<reference path="../../../libs/LayaAir.d.ts"/>
namespace modules.rotary_table_jiuzhou {
    import CustomList = modules.common.CustomList;
    import Point = laya.maths.Point;
    import PayRewardNote = Protocols.PayRewardNote;
    export class RotaryTableJiuZhouMyRecordAlert extends ui.PayRewardMyRecordAlertUI {
        private _list: CustomList;
        private _pos: Point;
        private _type: number;
        constructor() {
            super();
        }
        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }
        protected initialize(): void {
            super.initialize();
            this._pos = new Point(60, 70);
            this._list = new CustomList();
            this._list.width = 530;
            this._list.height = 340;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.itemRender = RotaryTableJiuZhouMyRecordItem;
            this._list.x = 67;
            this._list.y = 109;
            this.addChild(this._list);
        }
        public onOpened(): void {
            super.onOpened();
        }
        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.updateMyRecord();
        }
        protected addListeners(): void {
            super.addListeners();
        }
        protected removeListeners(): void {
            super.removeListeners();
        }
        public updateMyRecord(): void {
            let PayRewardNoteList: Array<PayRewardNote> = RotaryTableJiuZhouModel.instance.PayRewardNoteList;
            this._list.datas = PayRewardNoteList;
        }
    }
}
