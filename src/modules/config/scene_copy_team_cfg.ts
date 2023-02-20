/** 组队副本 场景配置*/
namespace modules.config {
    import scene_copy_team = Configuration.scene_copy_team;
    import Dictionary = Laya.Dictionary;
    import scene_copy_teamFields = Configuration.scene_copy_teamFields;

    export class SceneCopyTeamCfg {
        private static _instance: SceneCopyTeamCfg;
        public static get instance(): SceneCopyTeamCfg {
            return this._instance = this._instance || new SceneCopyTeamCfg();
        }

        private _dic: Dictionary;

        constructor() {
            this.init();
        }

        private init(): void {

            let arr: Array<scene_copy_team> = GlobalData.getConfig("scene_copy_team");

            this._dic = new Dictionary();

            for (let i: int = 0, len: int = arr.length; i < len; i++) {
                this._dic.set(arr[i][scene_copy_teamFields.ware], arr[i]);
            }
        }

        //根据波数取配置
        public getCfgByWare(ware: number): scene_copy_team {
            return this._dic.get(ware);
        }
    }
}