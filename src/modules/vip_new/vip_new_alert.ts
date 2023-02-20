/**vip面板 */


namespace modules.vip_new {
    import Event = Laya.Event;
    import CustomList = modules.common.CustomList;
    import privilege = Configuration.privilege;
    import privilegeFields = Configuration.privilegeFields;

    export class VipNewAlert extends ui.VipAlertUI {
        constructor() {
            super();
        }

        private _list: CustomList;
        private _showVip: number;
        protected initialize(): void {
            super.initialize();
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.hCount = 1;
            this._list.spaceY = 15;
            this._list.itemRender = VipNewPowerItem;
            this._list.width = 454;
            this._list.height = 415;
            this._list.pos(21, 6, true);
            this.showPanel.addChild(this._list);
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.leftBtn, Event.CLICK, this, this.leftBtnHandler);
            this.addAutoListener(this.rightBtn, Event.CLICK, this, this.rightBtnHandler);
        }
        protected removeListeners(): void {
            super.removeListeners();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this._showVip = value as number;
            this.refreshShow();
        }

        private refreshShow(): void {
            this.updateBtnShow();
            let dengJi = this._showVip - 50
            this.title.text = `VIP${dengJi}特权`;
            let cfg: privilege = VipNewModel.instance.getVipCfgByLevel(this._showVip);
            this._list.datas = cfg[privilegeFields.allAddPower];
        }

        private updateBtnShow(): void {
            if (this._showVip == VipNewModel.instance.maxVipLevel) {
                this.rightBtn.visible = false;
                this.leftBtn.visible = true;
            } else if (this._showVip == 51) {
                this.leftBtn.visible = false;
                this.rightBtn.visible = true;
            } else {
                this.leftBtn.visible = true;
                this.rightBtn.visible = true;
            }
        }

        //向左按
        private leftBtnHandler(): void {
            if (this._showVip == 51) {
                return;
            }
            this._showVip--;
            this.refreshShow();
        }

        //向右按
        private rightBtnHandler(): void {
            if (this._showVip == VipNewModel.instance.maxVipLevel) {
                return;
            }
            this._showVip++;
            this.refreshShow();
        }

        public destroy(): void {
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            super.destroy();
        }
    }
}