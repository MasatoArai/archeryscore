/*
管理オブジェクト概要
{
lnnn(管理タグ):{
gameconfig:{},
contents:{},
storagetag:nnn
}
}
*/




/**
 * ストレージ情報管理クラス
 */
function StorageCTRL() {
    this.storageCache = {};
    this.status = {};
    this.geoLog = {};
    this.favoriteEvents = [];
    this.loadLog();
    this.userInfo = this.getUserInfo();
}
StorageCTRL.prototype.setGeo = function () {
    if (("geolocation" in navigator) && this.userInfo.geo) {
        var me = this;
        var message = "";
        me.geoLog.formatted_address = "";
        navigator.geolocation.getCurrentPosition(function (position) {
            me.geoLog.timestamp = position.timestamp;
            me.geoLog.latitude = position.coords.latitude;
            me.geoLog.longitude = position.coords.longitude;
            var p = "&y=" + me.geoLog.latitude + "&x=" + me.geoLog.longitude + "&jsonp=geocode"
            $.ajax({
                type: 'GET',
                url: 'http://geoapi.heartrails.com/api/json?method=searchByGeoLocation' + p,
                dataType: 'jsonp',
                jsonpCallback: 'geocode',
                success: function (json) {
                    //me.geoLog.geocode=json;
                    me.geoLog.formatted_address = json.response.location[0].prefecture +
                        json.response.location[0].city +
                        json.response.location[0].town;
                    var tmpgeo = JSON.parse(localStorage.getItem("geoLog"));
                    localStorage.setItem("geoLog", JSON.stringify(me.geoLog));
                    if (tmpgeo.formatted_address != me.geoLog.formatted_address) {
                        message = "GPS情報を更新しました";
                        toaster.showToast(message, 3000);
                    }
                },
                error: function (e) {
                    console.log(e);
                    message = "地域情報の取得に失敗しました";
                    me.geoLog.formatted_address = "";
                    toaster.showToast(message, 3000);

                },
                complete: function (e) {
                    console.log(e);

                }
            });
        });
    } else {
        return false;
    }
}
StorageCTRL.prototype.getGeo = function () {
        if (!this.geoLog.latitude) return false;
        return this.geoLog;
    }
StorageCTRL.prototype.setfavoriteEvents = function(eventval){
    var va = this.userInfo.favoriteEvents;
    for(var i=0;i<va.length;i++){
        if(va[i]==eventval)return;
    }
    va.push(eventval);
    this.setUserInfo();
}
StorageCTRL.prototype.getfavoriteEvents = function(){
    return this.userInfo.favoriteEvents;
}

    /**
     * ユーザー情報のログ吸出し
     **/
StorageCTRL.prototype.getUserInfo = function () {

    var UserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!UserInfo) {
        return void(0);
    } else {
            this.userInfo={
        bows:[],
        arrows:[],
        finger_gap: true,
        gap_range: 50,
        gender: "male",
        geo: false,
        name: "annonymouse",
        opacity_range: 80,
        settingOpacity_range:20,
        favoriteEvents:[],
        lastBow:""
    };
        $.extend(this.userInfo,UserInfo);
        return this.userInfo;
    }
};
StorageCTRL.prototype.setUserInfo = function (infoObj) {
    if(typeof infoObj !== "undefined")this.userInfo = infoObj;
    localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
    gameConfCTRL.setinfo(this.userInfo);
}
StorageCTRL.prototype.clearUserInfo = function () {
        localStorage.removeItem("userInfo");
        this.userInfo = void(0);

        toaster.showToast("情報を削除しました", 3000);
    }
StorageCTRL.prototype.getTargetOpacity = function(){
    var opa = this.userInfo.opacity_range;
    return opa;
}
StorageCTRL.prototype.getTargetOpacitySetting = function(){
    var opa = this.userInfo.settingOpacity_range;
    return opa;
}
    /**
     * セーブされたログのリスト取得
     * @returns {Object} title:リスト表示タイトル storageTag:タグID
     */
StorageCTRL.prototype.getSaveList = function (b) {
        var lists = [];
        var txtline = "";
        for (var i in this.storageCache) {
            lists.push({
                title: this.getListTitle(this.storageCache[i].storageTag),
                storageTag: this.storageCache[i].storageTag,
                timecode: getDateCode(this.storageCache[i].storageTag)
            });
        }
        if (b) {
            lists.sort(function (a, b) {
                if (a.storageTag > b.storageTag) return -1;
                if (a.storageTag < b.storageTag) return 1;
                return 0;
            });
        }
        return lists;
    }
    /**
     * rリスト一覧に表示するタイトル文字列の取得
     * @param   {Number} tag 識別タグ
     * @returns {string} タイトル文字列
     */

StorageCTRL.prototype.getListTitle = function (tag) {
    if (typeof tag === "undefined") {
        return false;
    } else {
        return retVal.call(this, tag);
    }

    function retVal(t) {
        var cnf = this.storageCache['l' + t].gameconfig;
        if(cnf.gameTitle.length<=0){
            return cnf.bowtype + "[" + cnf.gametype.value + "]";
        }else{
            return cnf.gameTitle + "[" + cnf.gametype.value + "]";
        }
    }
};
    
/**
 * ストレージから全ログのロード
 * @returns {Boolean} true:ロード成功 false:ロード失敗
 */

StorageCTRL.prototype.loadLog = function () {
    this.storageCache = JSON.parse(localStorage.getItem("scoreLog"));
    this.status = JSON.parse(localStorage.getItem("lastStatus"));
    if (!this.storageCache) {
        return false;
    } else {
        return true;
    }
};
/**
 * タグ：unix時間　をkeyにログを取得
 * @param   {Number} tag ログ固有IDタグ（unixタイム）
 * @returns {Object} 対象ログデータ
 */

StorageCTRL.prototype.getLog = function (tag) {
    if (typeof tag !== "undefined") {
        return this.storageCache["l" + tag];
    } else {
        return false;
    }
};
/**
 * ステータス情報取得
 * @returns {Object} ステータスログ
 */

StorageCTRL.prototype.getStatus = function () {
    return this.status;
};

StorageCTRL.prototype.setLogFromIns = function (instance) {
    var log = {
        gameconfig: instance.gameconfig,
        contents: instance.contents,
        storageTag: instance.gameconfig.storageTag
    };
    this.storageCache["l" + instance.gameconfig.storageTag] = log;

    localStorage.setItem("scoreLog", JSON.stringify(this.storageCache));

    localStorage.setItem("lastStatus", JSON.stringify(instance.status));
};
StorageCTRL.prototype.reSetGameConfig = function (conf) {
    var log = this.storageCache["l" + conf.storageTag];
    if(log.gameconfig != conf){
    log.gameconfig = conf;
    this.storageCache["l" + conf.storageTag] = log;
    }
    localStorage.setItem("scoreLog", JSON.stringify(this.storageCache));
};

StorageCTRL.prototype.setLog = function (conf) {
    var scoreLog = {};

    var log = {
        gameconfig: {
            gametype: {},
            bow:{},
            arrow:{},
            bowtype: "",
            standposition: "",
            shaft: "",
            gameTitle: "",
            memo:"",
            geo: "",
            timeOfShootEnd: 1,
            timeOfEndParRound: 1,
            timeOfRound: 1,
            targettype: {},
            enableX: true,
            storageTag: new Date().getTime()
        },
        contents: {},
        storageTag: 0
    };
    log.storageTag = log.gameconfig.storageTag;
    $.extend(log.gameconfig,conf);
    
    //gametypeからパラメータ設定
        log.gameconfig.timeOfEndParRound = log.gameconfig.gametype.end;
        log.gameconfig.timeOfRound =  log.gameconfig.gametype.round;
        log.gameconfig.timeOfShootEnd =  log.gameconfig.gametype.shoot;
    
    if (typeof localStorage.scoreLog !== "undefined") {//todo undefinedこないす
        scoreLog = JSON.parse(localStorage.scoreLog);
    } else {
        scoreLog = {};
    }
    scoreLog["l" + log.gameconfig.storageTag] = log;
    localStorage.setItem("scoreLog", JSON.stringify(scoreLog));
    localStorage.removeItem("lastStatus"); //todo laststatusの有無をフラグに
    this.loadLog();
    return log.gameconfig.storageTag;
};
StorageCTRL.prototype.isUseGap = function () {
    return this.userInfo.finger_gap
}
StorageCTRL.prototype.getGapRange = function () {
    return this.userInfo.gap_range;
}
StorageCTRL.prototype.isFirst = function () {
        return (this.userInfo) ? false : true;
    }
    /**
     * ログ削除
     * @param {Number} tag 管理用識別タグ（unixtime)
     */

StorageCTRL.prototype.deleteLog = function (tag) {
    delete this.storageCache["l" + tag];
    localStorage.setItem("scoreLog", JSON.stringify(this.storageCache));
    this.loadLog();
};
/**
 * すべてのストレージデータの消去
 */
StorageCTRL.prototype.clearLog = function () {
    localStorage.clear();
};