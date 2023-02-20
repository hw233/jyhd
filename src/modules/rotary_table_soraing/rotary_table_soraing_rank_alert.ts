///<reference path="../../../libs/LayaAir.d.ts"/>
///<reference path="../config/duobao_reward_cfg.ts"/>
///<reference path="../config/duobao_weight_cfg.ts"/>
namespace modules.rotary_table_soraing {
    import DuobaoRewardCfg = modules.config.DuobaoRewardCfg;
    import duobao_reward = Configuration.duobao_reward;
    import duobao_rewardFields = Configuration.duobao_rewardFields;
    import CustomList = modules.common.CustomList;
    import Point = laya.maths.Point;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    export class RotaryTableSoaringRankAlert extends ui.RotaryTableRewardRankAlertUI {
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
            this._list.width = 593;
            this._list.height = 635;
            this._list.hCount = 1;
            this._list.spaceX = 0;
            this._list.spaceY = 6;
            this._list.itemRender = RotaryTableSoaringRankItem;
            this._list.x = 33;
            this._list.y = 116;
            this.addChild(this._list);
        }
        public onOpened(): void {
            super.onOpened();
            this.titleTxt.text = "积分奖励";
            this.updateList();
        }
        public close(type?: string, showEffect?: boolean): void {
            super.close(type, showEffect);
        }
        public setOpenParam(value: any): void {
            super.setOpenParam(value);
        }
        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.ROTARYTABLE_SOARING_UPDATE, this, this.updateList);
        }
        protected removeListeners(): void {
            super.removeListeners();
        }
        //排序
        private overSort(A: duobao_reward, B: duobao_reward): number {
            let A_grade = A[duobao_rewardFields.id];
            let B_grade = B[duobao_rewardFields.id];
            let A_state = RotaryTableSoaringModel.instance.getRewardStart(A_grade);
            let B_state = RotaryTableSoaringModel.instance.getRewardStart(B_grade);
            let returnNum = 1;
            if (A_state == B_state) {
                if (A_grade < B_grade) {
                    returnNum = -1;
                } else {
                    returnNum = 1;
                }
            } else {
                if (A_state == 2 && B_state != 2) {
                    returnNum = 1;
                } else if (A_state != 2 && B_state == 2) {
                    returnNum = -1;
                }
            }
            return returnNum;
        };
        /**
         * 根据当前对应活动类型 去拿对应的数据 判断活动的 开启,是|否进行中
         */
        public updateList(): void {
            let date: Array<duobao_reward> = DuobaoRewardCfg.instance.getDateArr(RotaryTableSoaringModel.instance.type, RotaryTableSoaringModel.instance.param);
            date.sort(this.overSort);
            this._list.datas = date;
            this.changDrawNum();
        }
        public changDrawNum() {
            let _money = BlendCfg.instance.getCfgById(15501)[blendFields.intParam];
            this.TipsText.text = `每次抽奖可获得10点积分,积分每日0点重置`;
        }
    }
}