///<reference path="../config/immortals_cfg.ts"/>
///<reference path="../magic_weapon/magic_weapon_model.ts"/>
///<reference path="../magic_weapon/magic_weapon_ctrl.ts"/>
///<reference path="../config/ride_fazhen_cfg.ts"/>
namespace modules.magicWeapon {
    import Event = Laya.Event;
    import Text = Laya.Text;
    import Image = Laya.Image;
    import CommonUtil = modules.common.CommonUtil;
    import BtnGroup = modules.common.BtnGroup;
    import CustomList = modules.common.CustomList;
    import CustomClip = modules.common.CustomClip;
    import BagModel = modules.bag.BagModel;
    import SuccessEffectCtrl = modules.effect.SuccessEffectCtrl;
    import BlendCfg = modules.config.BlendCfg;
    import BaseItem = modules.bag.BaseItem;
    import RedPointCtrl = modules.redPoint.RedPointCtrl;
    import BagUtil = modules.bag.BagUtil;
    import blendFields = Configuration.blendFields;
    import ExteriorSK = Configuration.ExteriorSK;
    import ExteriorSKCfg = modules.config.ExteriorSKCfg;
    import ExteriorSKFields = Configuration.ExteriorSKFields;
    import ItemFields = Protocols.ItemFields;
    import MagicShowInfoFields = Protocols.MagicShowInfoFields;
    import MagicWeaponModel = modules.magicWeapon.MagicWeaponModel;
    import MagicWeaponCtrl = modules.magicWeapon.MagicWeaponCtrl;
    import RideFazhenCfg = modules.config.RideFazhenCfg;
    import FuncBtnGroup = modules.common.FuncBtnGroup;
    import MagicWeaponFaZhenViewUI = ui.MagicWeaponFaZhenViewUI;
    import ride_fazhenFields = Configuration.ride_fazhenFields;
    import ride_fazhen = Configuration.ride_fazhen;
    import SkeletonAvatar = modules.common.SkeletonAvatar;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import MagicPetFaZhenViewUI = ui.MagicPetFaZhenViewUI;

    export class MagicWeaponFaZhenPanel extends MagicPetFaZhenViewUI {
        // 按钮组
        private _btnGroup: FuncBtnGroup;
        private _btnGroup2: BtnGroup;
        //消耗品
        private _consumables: BaseItem;
        private btnClip: CustomClip;
        private _nameArr: Array<Text>;
        private _liftArr: Array<Text>;
        private _list: CustomList;
        private _upImgsArr: Array<Image>;
        private _recordSelect: number[];
        private _attrPowerTxts: Array<Text>;
        /**
         *  //减去下一级所需的材料数量的剩余数量 >=0说明 材料够
         */
        private _numDiff: number;
        /**幻化显示 类型 */
        private _skeletonClip: SkeletonAvatar;
        /**当前使用的宠物的幻化显示s */
        private _showId: number;
        private _tiaoZhuanItemId: number;
        /**上下移动sk动画 */
        private _tween: TweenJS;
        constructor() {
            super();
        }

        public destroy(destroyChild: boolean = true): void {
            if (this.btnClip) {
                this.btnClip.removeSelf();
                this.btnClip.destroy();
                this.btnClip = null;
            }
            if (this._list) {
                this._list.removeSelf();
                this._list.destroy();
                this._list = null;
            }
            if (this._skeletonClip) {
                this._skeletonClip.removeSelf();
                this._skeletonClip.destroy();
                this._skeletonClip = null;
            }
            if (this._btnGroup) {
                this._btnGroup.destroy();
                this._btnGroup = null;
            }
            if (this._btnGroup2) {
                this._btnGroup2.destroy();
                this._btnGroup2 = null;
            }
            if (this._tween) {
                this._tween.stop();
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this._showId = -1;
            this.centerX = 0;
            this.centerY = 0;
            this._recordSelect = [0, 0];
            this.creatEffect();
            this._btnGroup = new FuncBtnGroup();
            this._btnGroup.setFuncIds(ActionOpenId.rideFeed, ActionOpenId.rideRank, ActionOpenId.rideMagicShow, ActionOpenId.rideRefine, ActionOpenId.rideFazhen);
            this._btnGroup.setBtns(this.cultureBtn, this.advancedBtn, this.illusionBtn, this.practiceBtn, this.methodArrayBtn);
            this._btnGroup2 = new BtnGroup();
            this._btnGroup2.setBtns(this.zhenpinBtn, this.jipinBtn, this.juepinBtn);
            this._consumables = new BaseItem();
            this._consumables.pos(318, 940 - 9);
            this._consumables.scale(0.8, 0.8);
            this._consumables.zOrder = 30;
            this.addChild(this._consumables);
            this._nameArr = new Array<Text>();
            this._liftArr = new Array<Text>();
            this._upImgsArr = new Array<Image>();
            this._nameArr = [this.nameTxt_1, this.nameTxt_2, this.nameTxt_3, this.nameTxt_4, this.nameTxt_5, this.nameTxt_6];
            this._liftArr = [this.liftTxt_1, this.liftTxt_2, this.liftTxt_3, this.liftTxt_4, this.liftTxt_5, this.liftTxt_6];
            this._upImgsArr = [this.upArrImg_1, this.upArrImg_2, this.upArrImg_3, this.upArrImg_4, this.upArrImg_5, this.upArrImg_6];
            this._attrPowerTxts = [this.power_1, this.power_2, this.power_3, this.power_4, this.power_5, this.power_6]
            this._list = new CustomList();
            this._list.spaceX = 25;
            this._list.scrollDir = 2;
            this._list.width = 650;
            this._list.height = 152;
            this._list.vCount = 1;
            this._list.itemRender = WPItem;
            this._list.x = 35;
            this._list.y = 745;
            this.huanhuaPanel.addChild(this._list);
            this._numDiff = 0;

            this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_RANK_BTN, this.advancedBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_REFINE_BTN, this.practiceBtn);
            this.regGuideSpr(GuideSpriteId.MAGIC_WEAPON_FAZHEN_BTN, this.methodArrayBtn);
            this.regGuideSpr(GuideSpriteId.MGAIC_WEAPON_FAZHEN_ACTIVE_BTN, this.goBtn);
        }

        protected onOpened(): void {
            super.onOpened();
            this.cultureBtn.label = "强化"
            this.advancedBtn.label = "进化"
            this.practiceBtn.label = "附魔"
            this.methodArrayBtn.label = "精灵造物"
            this.btnClip.play();
            this.btnClip.visible = false;
            this._btnGroup.selectedIndex = 4;
            if (this._tiaoZhuanItemId) {
                let weizhi = MagicWeaponModel.instance.panDuanpingzhi(this._tiaoZhuanItemId);
                if (weizhi != -1) {
                    this._btnGroup2.selectedIndex = weizhi;
                    this.selectQualityById(this._tiaoZhuanItemId);
                }
                else {
                    this.searchOne();
                }
            }
            else {

                this.searchOne();
            }
            this._tiaoZhuanItemId = null;
        }

        protected addListeners(): void {
            super.addListeners();
            this._btnGroup.on(Event.CHANGE, this, this.changeMagicPetHandler);
            this._btnGroup2.on(Event.CHANGE, this, this.selectBtnGroup2, [true]);
            this._btnGroup2.selectedIndex = 0;
            this.aboutBtn.on(Event.CLICK, this, this.openAbout);
            this.goBtn.on(Event.CLICK, this, this.goBtnFunc);
            //this.changeImg.on(Event.CLICK, this, this.changefunc);
            this._list.on(Event.SELECT, this, this.selectSkinItem);
            this.sumAttrBtn.on(Event.CLICK, this, this.openSumAttr);
            // GlobalData.dispatcher.on(CommonEventType.BAG_UPDATE, this, this.updateBag);
            GlobalData.dispatcher.on(CommonEventType.WEAPONFZHUANHUA_UPDATA, this, this.showEffect1);
            GlobalData.dispatcher.on(CommonEventType.WEAPONFZCHANGE_HUANHUA, this, this.selectBtnGroup2, [false]);
            RedPointCtrl.instance.registeRedPoint(this.cultureRP, ["weaponFeedSkillRP", "weaponFeedMatRP"]);
            RedPointCtrl.instance.registeRedPoint(this.advancedRP, ["weaponRankSkillRP", "weaponRankMatRP"]);
            RedPointCtrl.instance.registeRedPoint(this.practiceRP, ["weaponRefineMaterialRP"]);
            RedPointCtrl.instance.registeRedPoint(this.methodArrayRP, ["weaponFazhenJipinRP", "weaponFazhenZhenpinRP", "weaponFazhenJuepinRP"]);
            RedPointCtrl.instance.registeRedPoint(this.dotImg_4, ["weaponFazhenJipinRP"]);
            RedPointCtrl.instance.registeRedPoint(this.dotImg_5, ["weaponFazhenZhenpinRP"]);
            RedPointCtrl.instance.registeRedPoint(this.dotImg_6, ["weaponFazhenJuepinRP"]);
            RedPointCtrl.instance.registeRedPoint(this.hhDotImg, ["weaponIllusionRP"]);
        }
        public setOpenParam(value: number): void {
            super.setOpenParam(value);
            this._tiaoZhuanItemId = value;
        }
        protected removeListeners(): void {
            this._btnGroup2.off(Event.CHANGE, this, this.selectBtnGroup2);
            this._btnGroup.off(Event.CHANGE, this, this.changeMagicPetHandler);
            this.goBtn.off(Event.CLICK, this, this.goBtnFunc);
            //this.changeImg.off(Event.CLICK, this, this.changefunc);
            this.aboutBtn.off(Event.CLICK, this, this.openAbout);
            this._list.off(Event.SELECT, this, this.selectSkinItem);
            this.sumAttrBtn.off(Event.CLICK, this, this.openSumAttr);
            // GlobalData.dispatcher.off(CommonEventType.BAG_UPDATE, this, this.updateBag);
            GlobalData.dispatcher.off(CommonEventType.WEAPONFZHUANHUA_UPDATA, this, this.showEffect1);
            GlobalData.dispatcher.off(CommonEventType.WEAPONFZCHANGE_HUANHUA, this, this.selectBtnGroup2);
            RedPointCtrl.instance.retireRedPoint(this.cultureRP);
            RedPointCtrl.instance.retireRedPoint(this.advancedRP);
            RedPointCtrl.instance.retireRedPoint(this.practiceRP);
            RedPointCtrl.instance.retireRedPoint(this.methodArrayRP);
            RedPointCtrl.instance.retireRedPoint(this.dotImg_4);
            RedPointCtrl.instance.retireRedPoint(this.dotImg_5);
            RedPointCtrl.instance.retireRedPoint(this.dotImg_6);
            RedPointCtrl.instance.retireRedPoint(this.hhDotImg);
            super.removeListeners();
        }

        /**
         * 进阶广播回调
         */
        private showEffect1(): void {
            let id = MagicWeaponModel.instance._huanhuaActId;
            for (let i: int = 0, len: int = MagicWeaponModel.instance.huanhuaList.keys.length; i < len; i++) {
                if (id == MagicWeaponModel.instance.huanhuaList.keys[i] &&
                    MagicWeaponModel.instance.huanhuaList.get(id)[MagicShowInfoFields.star] > 1)
                    SuccessEffectCtrl.instance.play("assets/others/tx_jinjiechengong7.png");
            }
            //进阶成功许刷新几乎整个界面
            this.changeMagicPetHandler();
        }

        private searchOne(): void {
            let selectIndex: number = 0;
            if (this.dotImg_4.visible) {
            } else if (this.dotImg_5.visible) {
                selectIndex = 1;
            } else if (this.dotImg_6.visible) {
                selectIndex = 2;
            }
            this._btnGroup2.selectedIndex = selectIndex;
            this.selectQuality();
        }

        // private updateBag(): void {
        //     this.changeMagicPetHandler();
        // }
        /**
         * 切换界面
         */
        private changeMagicPetHandler(): void {
            if (this._btnGroup.selectedIndex == 0) {
                WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_FEED_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 1) {
                WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_RANK_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 2) {
                WindowManager.instance.open(WindowEnum.WEAPON_ILLUSION_PANEL);
                return;
            } else if (this._btnGroup.selectedIndex == 3) {
                WindowManager.instance.open(WindowEnum.MAGIC_WEAPON_REFINE_PANEL);
                return;
            }
            this.atkMsz.value = MagicWeaponModel.instance.fighting.toString();//幻化战力
            let width = this.jieCharMsz.width + 5 + this.jieMsz.width;
            let x = (this.width - width) / 2;
            this.jieMsz.x = x;
            this.jieCharMsz.x = x + this.jieMsz.width + 5;
            this.selectBtnGroup2(false);
        }

        /**
         * 确定当前幻化品质后 设置了 list的selectedData 后会走这里
         */
        private selectSkinItem(): void {
            this.tips_bg.visible = false
            if (this._list.selectedData) {
                this._showId = this._list.selectedData;
            }
            let _pitchId: number = this._showId;
            if (!_pitchId) return;
            //设置 3D显示幻化
            let modelCfg: ExteriorSK = ExteriorSKCfg.instance.getCfgById(_pitchId);
            // this._skeletonClip.reset(0, 0, 0, 0, _pitchId);
            let _bgSKId: number = modelCfg[ExteriorSKFields.effect_bg];
            this._skeletonClip.reset(0, 0, 0, 0, _pitchId, 0, _bgSKId);
            this._skeletonClip.setUseCfgScaleAndOffset(AvatarAniBigType.other);

            this.NameTxt.text = modelCfg[ExteriorSKFields.name];
            // console.log("当前_pitchId：" + _pitchId);
            // console.log("当前幻化id：" + MagicWeaponModel.instance.fazhenId);
            let currShowId: number = MagicWeaponModel.instance.fazhenId; //幻化id
            // if (_pitchId === currShowId) {
            //     //this.changeImg.visible = false;
            //     this.useImg.visible = true;
            // } else {
            //     //this.changeImg.visible = true;
            //     this.useImg.visible = false;
            // }
            if (MagicWeaponModel.instance.huanhuaList.get(_pitchId)) {
                this.jieMsz.visible = true;
                this.jieCharMsz.visible = true;
                this.noActImg.visible = false;
                this.tipBox.visible = false;
                this.goBtn.label = "升阶";
                this.jieMsz.value = MagicWeaponModel.instance.huanhuaList.get(_pitchId)[MagicShowInfoFields.star];
            } else {
                this.jieMsz.visible = false;
                this.jieCharMsz.visible = false;
                this.noActImg.visible = true;
                this.tipBox.visible = true;
                this.goBtn.label = "激活";
                //this.changeImg.visible = false;//未激活时隐藏
                this.showTip(_pitchId);
            }
            //设置阶级居中
            let charNum: number = this.jieMsz.value.length;
            let charWidth: number = 22 * charNum + (this.atkMsz.spaceX) * (charNum - 1);
            let width = this.jieCharMsz.width + 5 + charWidth;
            let x = (this.width - width) / 2;
            this.jieMsz.x = x;
            this.jieCharMsz.x = x + charWidth + 5;
            let _lev: number = 0;
            for (let i: int = 0, len: int = MagicWeaponModel.instance.huanhuaList.keys.length; i < len; i++) {
                if (_pitchId == MagicWeaponModel.instance.huanhuaList.keys[i])
                    _lev = MagicWeaponModel.instance.huanhuaList.get(MagicWeaponModel.instance.huanhuaList.keys[i])[MagicShowInfoFields.star];
            }
            let cfg = RideFazhenCfg.instance.getHuanhuaCfgByIdAndLev(_pitchId, _lev);
            let nextCfg = RideFazhenCfg.instance.getHuanhuaCfgByIdAndLev(_pitchId, _lev + 1);
            this.setAttr(cfg, nextCfg);
            if (this._list.selectedIndex != -1) {
                this._recordSelect = [this._btnGroup2.selectedIndex, this._list.selectedIndex];
            }
            // this.showModelClipPet();
        }

        /**
         * 设置下一阶的 战力加成 提示
         * @param pitchId
         */
        private showTip(pitchId: int): void {
            let cfg = RideFazhenCfg.instance.getHuanhuaCfgByIdAndLev(pitchId, 0);
            let str: string = cfg[ride_fazhenFields.getWay].toString();
            let str1: string = "", str2: string = "";
            let j = str.length;
            for (let i: int = 0, len: int = str.length; i < len; i++) {
                if (str[i] === '#') {
                    str2 += '+';
                    j = i;
                    continue;
                }
                i < j == true ? str1 += str[i] : str2 += str[i];
            }
            this.tipTxt_1.text = str1;
            this.tipTxt_2.text = str2;
            this.tips_bg.visible = true
        }
        // 打开幻化界面
        private illusionHandler(): void {
            if (FuncOpenModel.instance.getFuncNeedShow(ActionOpenId.rideMagicShow)) {
                WindowManager.instance.open(WindowEnum.WEAPON_ILLUSION_PANEL);
            } else {
                SystemNoticeManager.instance.addNotice(FuncOpenModel.instance.getFuncOpenTipById(ActionOpenId.rideMagicShow), true);
            }
        }
        /**
         * 根据当前品质索引 显示对应品质的 法阵
         */
        private selectBtnGroup2(click: boolean): void {
            //待替换
            let _arr: Array<ride_fazhen> = new Array<ride_fazhen>();
            if (this._btnGroup2.selectedIndex == 0) {
                _arr = RideFazhenCfg.instance.getSkinCfgByType(3);
            } else if (this._btnGroup2.selectedIndex == 1) {
                _arr = RideFazhenCfg.instance.getSkinCfgByType(4);
            } else {
                _arr = RideFazhenCfg.instance.getSkinCfgByType(5);
            }
            //设置list居中
            let num = _arr.length;
            let width = num * 100 + this._list.spaceX * (num - 1);//
            this._list.x = (this.width / 2) - (width / 2);
            let _data: number[] = [];//储存当前品质的所有showId/*外观id*/
            for (let j: int = 0; j < num; j++) {
                _data.push(_arr[j][ride_fazhenFields.showId]);
            }
            this._list.datas = _data;
            if (this._list.selectedData) {
                this._showId = this._list.selectedData;
            }
            if (this._btnGroup2.selectedIndex == this._recordSelect[0]) this._list.selectedIndex = this._recordSelect[1];
            else this._list.selectedIndex = -1;

            // 切换品级时将选择第一个进行预览或跳至拥有的物品
            if (!click) {
                this.selectSkinItem();
                return;
            };
            if (this._list.items.length) {
                let weared = -1;
                for (let i = 0; i < _arr.length; i++) {
                    if (_arr[i][ride_fazhenFields.showId] == MagicWeaponModel.instance.fazhenId) {
                        weared = i;
                    }
                }
                if (weared !== -1) {
                    this._list.selectedIndex = weared;
                    this._list.scrollToIndex(weared);
                } else {
                    this._list.selectedIndex = 0;
                }
            }
        }

        private selectQuality(): void {
            this.selectBtnGroup2(true);
            for (let i: int = 0, len: int = this._list.datas.length; i < len; i++) {
                let lev: int = MagicWeaponModel.instance.huanhuaList.get(this._list.datas[i]) ?
                    MagicWeaponModel.instance.huanhuaList.get(this._list.datas[i])[MagicShowInfoFields.star] : 0;
                let cfg = RideFazhenCfg.instance.getHuanhuaCfgByIdAndLev(this._list.datas[i], lev);
                let itemId: int = cfg[ride_fazhenFields.items][0];
                let count: int = cfg[ride_fazhenFields.items][1];
                if (BagModel.instance.getItemCountById(itemId) >= count) {
                    this._list.selectedIndex = i;
                    this._recordSelect = [this._btnGroup2.selectedIndex, this._list.selectedIndex];
                    return;
                }
            }
            this._list.selectedIndex = 0;
            this._recordSelect = [this._btnGroup2.selectedIndex, this._list.selectedIndex];
        }
        private selectQualityById(id: number): void {
            this.selectBtnGroup2(true);
            for (let i: int = 0, len: int = this._list.datas.length; i < len; i++) {
                let lev: int = MagicWeaponModel.instance.huanhuaList.get(this._list.datas[i]) ?
                    MagicWeaponModel.instance.huanhuaList.get(this._list.datas[i])[MagicShowInfoFields.star] : 0;
                let cfg = RideFazhenCfg.instance.getHuanhuaCfgByIdAndLev(this._list.datas[i], lev);
                let itemId: int = cfg[ride_fazhenFields.items][0];
                let count: int = cfg[ride_fazhenFields.items][1];
                if (itemId == id) {
                    this._list.selectedIndex = i;
                    this._recordSelect = [this._btnGroup2.selectedIndex, this._list.selectedIndex];
                    return;
                }
            }
            this._list.selectedIndex = 0;
            this._recordSelect = [this._btnGroup2.selectedIndex, this._list.selectedIndex];
        }

        //
        /**
         * 设置属性加成列表
         * @param cfg
         * @param nextCfg
         */
        private setAttr(cfg: ride_fazhen, nextCfg: ride_fazhen): void {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._nameArr,
                this._attrPowerTxts,
                this._upImgsArr,
                this._liftArr,
                ride_fazhenFields.attrs
            );

            // if (t <= 2) this.textBackImg.height = 70;
            // else if (t <= 4) this.textBackImg.height = 110;
            // else if (t <= 6) this.textBackImg.height = 150;
            let items: Array<number>;
            ///*消耗道具 道具ID#道具数量*/
            items = (<ride_fazhen>cfg)[ride_fazhenFields.items];
            this.fullLevelImg.visible = false;
            if (nextCfg) {    //可以升级
                this._consumables.visible = true;
                this.goBtn.visible = true;
                let hasItemNum: int = BagModel.instance.getItemCountById(items[0]);//获取当前拥有的材料
                this._consumables.dataSource = [items[0], 0, 0, null];
                //消耗道具 颜色判定修改
                let colorStr = "#ff7462";
                if (hasItemNum < items[1]) {
                    this._consumables.setNum(`${hasItemNum}/${items[1]}`, colorStr);
                } else {
                    colorStr = "#ffffff";
                    this._consumables.setNum(`${hasItemNum}/${items[1]}`, colorStr);
                }
                this._numDiff = hasItemNum - items[1];//计算差值  如果大于或者等于零说明可以升级 或者激活
                this.btnClip.visible = this._numDiff >= 0;
            } else {          //没有下一级
                this._consumables.visible = false;
                this.goBtn.visible = false;
                this.fullLevelImg.visible = true;
                this.btnClip.visible = false;
            }
            // for (let i: int = t, len: int = this._nameArr.length; i < len; i++) {
            //     this._nameArr[i].visible = this._valueArr[i].visible = this._upImgsArr[i].visible = this._liftArr[i].visible = false;
            // }
        }

        /**
         * 初始化一些特效效果
         */
        private creatEffect(): void {

            this.btnClip = new CustomClip();
            this.goBtn.addChild(this.btnClip);
            this.btnClip.skin = "assets/effect/btn_light.atlas";
            this.btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this.btnClip.durationFrame = 5;
            this.btnClip.play();
            this.btnClip.loop = true;
            this.btnClip.pos(-5, -14);
            this.btnClip.scale(0.96, 1);
            this.btnClip.visible = false;

            this._skeletonClip = SkeletonAvatar.createShow(this, this.huanhuaPanel, 2);
            this.moveSk();
            this._skeletonClip.centerX = 0;
            this._skeletonClip.y = 370;
        }
        /**
         * 升级按钮
         */
        private goBtnFunc(): void {
            let id = this._consumables.itemData[ItemFields.ItemId];
            if (this._numDiff >= 0) {
                MagicWeaponModel.instance._huanhuaActId = this._showId;
                MagicWeaponCtrl.instance.magicLev(this._showId);
            } else {
                BagUtil.openLackPropAlert(id, -this._numDiff);
            }
        }

        /**
         * 更换幻化皮肤
         */
        private changefunc(): void {
            MagicWeaponCtrl.instance.changeMagic(this._showId);
        }

        //
        /**
         * 关于
         */
        private openAbout(): void {
            CommonUtil.alertHelp(20032);
        }

        /**
         *总属性
         */
        private openSumAttr(): void {
            //总有属性有 新的额外属性 （标识 方便修改）
            WindowManager.instance.openDialog(WindowEnum.ATTR_ALERT,
                ["精灵造物总属性",
                    MagicWeaponModel.instance.fighting,
                    MagicWeaponModel.instance.attr,
                    RideFazhenCfg.instance.huanhuaAttrIndices
                ]);
        }
        /**
       * 上下移动sk
       */
        private moveSk() {
            if (!this._tween) {
                this._skeletonClip.y = 330;
                this._tween = TweenJS.create(this._skeletonClip).yoyo(true).repeat(99999999);
                this._tween
                    .to({ y: 330 }, 1200)
                    .to({ y: 360 }, 1000)
                    .start()
            }
        }
    }
}