///<reference path="../config/cumulate_pay_cfg.ts"/>
//每日累充
namespace modules.limit {
    import LimitCumulateItemUI = ui.LimitCumulateItemUI;
    import Items = Configuration.Items;
    import limit_cumulateFields = Configuration.limit_cumulateFields;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import limit_cumulateReward = Protocols.limit_cumulateReward;
    import limit_cumulateRewardFields = Protocols.limit_cumulateRewardFields;
    import BagUtil = modules.bag.BagUtil;
    import Item = Protocols.Item;
    import limit_day_cumulate = Configuration.limit_day_cumulate;
    import limit_day_cumulateFields = Configuration.limit_day_cumulateFields;
    import BaseItem = modules.bag.BaseItem;
    import LayaEvent = modules.common.LayaEvent;

    export class LimitDayCumulateItem extends LimitCumulateItemUI {
        private _cfg: limit_day_cumulate;
        private getState: number = 0;
        private _btnClip: CustomClip;
        private _itemId: number;
        private _itemIdAr: number[];
        private _stateMoney: number;
        private _cumuMoney: number;
        private _day: number;

        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this._btnClip) {
                this._btnClip.removeSelf();
                this._btnClip.destroy();
                this._btnClip = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            //用于设置控件属性 或者创建新控件
            this._itemId = 0;
            this._itemIdAr = [];
            this._day = 0;
            this.cumulateText.color = "#5d2606";
            this.cumulateText.style.fontFamily = "SimHei";
            this.cumulateText.style.fontSize = 26;
            this.creatEffect();
        }

        private creatEffect(): void {
            this._btnClip = CustomClip.createAndPlay("assets/effect/btn_light.atlas", "btn_light", 16);
            this.sureBtn.addChild(this._btnClip);
            this._btnClip.pos(-6, -18, true);
            this._btnClip.scale(0.81, 1.1);
            this._btnClip.visible = false;
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.sureBtn, LayaEvent.CLICK, this, this.sureBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LIMIT_DAY_CUMULATE_UPDATE, this, this.updateView);
        }

        public onOpened(): void {
            this.updateView();
        }

        private updateView(): void {
            //更新累充豪礼面板状态 和累充事件绑定
            this.setBtnSure();
            this.setMoney();
        }


        protected setData(value: limit_day_cumulate): void {
            this._cfg = value as limit_day_cumulate;
            let awardArr: Array<Items> = [];
            //this._stateMoney=CumulatePayModel.instance.getMoney;
            this._cumuMoney = this._cfg[limit_day_cumulateFields.money];
            this._itemId = this._cfg[limit_day_cumulateFields.id];
            this._day = this._cfg[limit_day_cumulateFields.day];
            this._itemIdAr.push(this._cfg[limit_day_cumulateFields.id]);
            let showIdArr: number[] = [];
            awardArr = this._cfg[limit_day_cumulateFields.reward];
            for (let i: int = 0; i < awardArr.length; i++) {
                showIdArr.push(awardArr[i][ItemsFields.itemId]);
            }
            this.setMoney();
            let count: number = showIdArr.length;
            let DayBase: BaseItem[] = [];
            DayBase.push(this.cumulateBase1);
            DayBase.push(this.cumulateBase2);
            DayBase.push(this.cumulateBase3);
            DayBase.push(this.cumulateBase4);
            for (let i: int = 0; i < 4; i++) {
                if (i < count) {
                    if (!DayBase[i].visible) {
                        DayBase[i].visible = true;
                    }
                    DayBase[i].dataSource = [awardArr[i][ItemsFields.itemId], awardArr[i][ItemsFields.count], 0, null];
                } else {
                    DayBase[i].visible = false;
                }
            }
            this.setBtnSure();
        }


        private sureBtnHandler(): void {
            if (this.getState == 0) {
                WindowManager.instance.open(WindowEnum.RECHARGE_PANEL);
                WindowManager.instance.close(WindowEnum.CUMULATE_PAY2_UPDATE);
            }
            if (this.getState == 1) {
                let rewards: Array<Items> = this._cfg[limit_day_cumulateFields.reward];
                let items: Array<Item> = [];
                for (let i: int = 0, len: int = rewards.length; i < len; i++) {
                    let item: Items = rewards[i];
                    items.push([item[ItemsFields.itemId], item[ItemsFields.count], 0, null]);
                }
                if (BagUtil.canAddItemsByBagIdCount(items)) {
                    LimitDayCumulateCtrl.instance.GetLimitXunBaoDayCumulatePayReward([this.bigtype,this._itemId]);
                }
            }
        }

        private setBtnSure(): void {
            this.getState = 0;//重置
            let rewarList: Table<limit_cumulateReward> = LimitDayCumulateModel.instance.rewarTable(this.bigtype);
            let value = rewarList[this._itemId];
            if (!value) {
                this.sureBtn.label = "前往充值";
                this.sureBtn.visible = true;
                this.receivedImg.visible = false;
                this._btnClip.stop();
                this._btnClip.visible = false;
                
            } else {
                this.getState = value[limit_cumulateRewardFields.state];
                if (this.getState !== 0) {
                    this.sureBtn.label = "领取";
                    if (this.getState == 1) {
                        this._btnClip.play();
                        this._btnClip.visible = true;
                        this.sureBtn.visible = true;
                        this.receivedImg.visible = false;
                    } else {
                        this.sureBtn.visible = false;
                        this.receivedImg.visible = true;
                    }
                }
            }
        }

        protected get bigtype(): LimitBigType {
            return LimitBigType.fish;
        }
        private setMoney(): void {
            this._stateMoney = LimitDayCumulateModel.instance.totalMoney(this.bigtype);
            this.cumulateText.innerHTML = `${this._cfg[limit_cumulateFields.money]}元<span style='color:#ffffff'>&nbsp;,可领取奖励！</span>`;
            this.scheduleText.text = `${this._stateMoney}/${this._cumuMoney}`;
            if (this._stateMoney >= this._cumuMoney) {
                this.scheduleText.color = "#16ba17";
            } else {
                this.scheduleText.color = "#FF3e3e";
            }
        }
    }
}