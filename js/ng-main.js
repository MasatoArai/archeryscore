
monaca.viewport({
    width: (360>$(window).width()/$(window).height()*555)?360:$(window).width()/$(window).height()*555,
    onAdjustment: function (scale) {
        // write code something.
    }
});

    //todo 一時画像ファイルの入れ物
var verificationImage = {};
var onsenCTRL = {};
ons.componentBase = onsenCTRL;
var scoreCTRL = {}; //スコア管理用コントローラ
var storageCTRL = new StorageCTRL(); //ストレージ管理コントローラ
var gameConfCTRL = new GameConfCTRL(); //ゲームコンフィグ制御コントローラ
var toaster = new toaster();
var isUsersInfoRegistered = false;

var module = angular.module('app', ['onsen','ngTouch']);

module.factory("SharedStateService", function () {
    return {
        storageTag: 0
    }
});
module.factory("$data", function () {
    var data={};
    data.reLoadLogList = function(){
        data.logList = storageCTRL.getSaveList(true);
    }
    data.reLoadLogList();
    data.bowObj ={
        "CompoundBow":{
            title:"コンパウンドボウ",
            value:"CompoundBow",
            initial:"CP"
        },
        "ReCurveBow":{
            title:"リカーブボウ",
            value:"ReCurveBow",
            initial:"RC"
        },
        "BearBow":{
            title:"ベアボウ",
            value:"BearBow",
            initial:"BB"
        }
    }
    data.targetFaces = [];
    data.targetFaceObj={
        "10ring":{
            title:"1-10点マト(フルフェイス)",
            score:[1,2,3,4,5,6,7,8,9,10,11],
            diameter:["122cm","80cm","60cm","40cm"],
            value:"10ring"
        },
        "6ring":{
            title:"5-10点マト(マルチ)",
            score:[5,6,7,8,9,10,11],
            diameter:["80cm","40cm"],
            value:"6ring"
        },
        "5ring":{
            title:"6-10点マト(マルチ)",
            score:[6,7,8,9,10,11],
            diameter:["80cm","40cm"],
            value:"5ring"
        },
        "3spot":{
            title:"三つ目マト",
            score:[6,7,8,9,10,11],
            diameter:["40cm"],
            canSelectShaft:true,
            value:"3spot"
        },
        "vegas":{
            title:"ベガスマト",
            score:[6,7,8,9,10,11],
            diameter:["40cm"],
            canSelectShaft:true,
            value:"vegas"
        }
    }
        data.targetFaces =["10ring","6ring","5ring","3spot","vegas"];
    data.events = [];
    data.favoriteEvents="";//todo storageCTRL.getfavoriteEvents();
    data.outdoorEvents=[];
    data.indoorEvents=[];
    
    data.eventsObj={
        FITA70mW:{
            title:"FITA70mラウンドダブル",
            value:"FITA70mW",
            bias:"ReCurve",
            stage:"Outdoor",
            unit:"Metric",
            round:2,
            roundName:["First half","Second half"],
            end:6,
            shoot:6,
            target:"10ring"
        },
        FITA50mW:{
            title:"FITA50mラウンドダブル",
            value:"FITA50mW",
            bias:"Compound",
            stage:"Outdoor",
            unit:"Metric",
            round:2,
            roundName:["First half","Second half"],
            end:6,
            shoot:6,
            target:"6ring"
        },
        FITAroundGen:{
            title:"FITAシングルラウンド(男子)",
            value:"FITAroundGen",
            bias:"all",
            stage:"Outdoor",
            unit:"Metric",
            round:4,
            roundName:["90m","70m","50m","30m"],
            secondTarget:2,
            end:6,
            shoot:6,
            target:"10ring",
            gender:"male"
        },
        FITAroundLad:{
            title:"FITAシングルラウンド(女子)",
            value:"FITAroundLad",
            bias:"all",
            stage:"Outdoor",
            unit:"Metric",
            round:4,
            roundName:["70m","60m","50m","30m"],
            secondTarget:2,
            end:6,
            shoot:6,
            target:"10ring",
            gender:"female"
        },
        FITA900:{
            title:"FITA 900",
            value:"FITA900",
            bias:"all",
            stage:"Outdoor",
            unit:"Metric",
            round:3,
            roundName:["60m","50m","40m"],
            end:5,
            shoot:6,
            target:"10ring"
        },
        shortMet:{
            title:"ショートハーフ",
            value:"shortMet",
            bias:"all",
            stage:"Outdoor",
            unit:"Metric",
            round:2,
            roundName:["50m","30m"],
            end:6,
            shoot:6,
            target:"10ring"
        },
        longMetGen:{
            title:"ロングハーフ(男子)",
            value:"longMetGen",
            bias:"all",
            stage:"Outdoor",
            unit:"Metric",
            round:2,
            roundName:["90m","70m"],
            end:6,
            shoot:6,
            target:"10ring",
            gender:"male"
        },
        longMetLad:{
            title:"ロングハーフ(女子)",
            value:"longMetLad",
            bias:"all",
            stage:"Outdoor",
            unit:"Metric",
            round:2,
            roundName:["70m","50m"],
            end:6,
            shoot:6,
            target:"10ring",
            gender:"famale"
        },
        practice360:{
            title:"プラクティス360",
            value:"practice360",
            bias:"all",
            stage:"Outdoor",
            unit:"Metric",
            round:1,
            roundName:["Do your best!"],
            end:6,
            shoot:6,
            target:"10ring",
        },
        FITA18:{
            title:"FITA 18",
            value:"FITA18",
            bias:"all",
            stage:"Indoor",
            unit:"Metric",
            round:2,
            roundName:["First half","Second half"],
            end:10,
            shoot:3,
            target:"3spot",
            canSelectX:true,
            innerTen:true
        },
        FITA25:{
            title:"FITA 25",
            value:"FITA25",
            bias:"all",
            stage:"Indoor",
            unit:"Metric",
            round:2,
            roundName:["First half","Second half"],
            end:10,
            shoot:3,
            target:"10ring",
            canSelectX:true
        },
        combined:{
            title:"Combined FITA",
            value:"combined",
            bias:"all",
            stage:"Indoor",
            unit:"Metric",
            round:4,
            roundName:["18m 1st","18m 2nd","25m 1st","25 2nd"],
            end:10,
            shoot:3,
            target:"10ring",
            canSelectX:true
        },
        vegas:{
            title:"Vegas",
            value:"vegas",
            bias:"all",
            stage:"Indoor",
            unit:"Metric",
            round:2,
            roundName:["First half","Second half"],
            end:10,
            shoot:3,
            target:"vegas",
            canSelectX:true,
            innerTen:true
        }
    };
        
    for(var key in data.eventsObj){
        data.events.push(key);
        if(data.eventsObj[key].stage=="Outdoor"){
            data.outdoorEvents.push(key);
        }
        if(data.eventsObj[key].stage=="Indoor"){
            data.indoorEvents.push(key);
        }
    }
    return data;
});
module.controller("globalCtrl",function($scope){
   
    ons.ready(function(){
        onsenCTRL.myNavi.on("postpush",function(e){
            if((!storageCTRL.isFirst())&&(e.enterPage.page == "page1.html"||e.enterPage.page == "page3.html"||e.enterPage.page=="about.html")){
                onsenCTRL.menu.setSwipeable(true);
            }else{
                onsenCTRL.menu.setSwipeable(false);
            }
        });
        onsenCTRL.myNavi.on("postpop",function(e){
            if((!storageCTRL.isFirst())&&(e.enterPage.page == "page1.html"||e.enterPage.page == "page3.html"||e.enterPage.page=="about.html")){
                onsenCTRL.menu.setSwipeable(true);
            }else{
                onsenCTRL.menu.setSwipeable(false);
            }
        });
        /*
        onsenCTRL.menu.on("preopen",function(e){
            console.log("test");
        })*/
        
    var options = {
        animation: 'fade', // アニメーションの種類
        onTransitionEnd: function () {} // アニメーションが完了した際によばれるコールバック
    };
        onsenCTRL.myNavi.resetToPage("page1.html", options);
    });
    
        if (storageCTRL.isFirst()) {
            ons.notification.alert({
                message: "最初にユーザー情報を入力してください",
                title: "introduction",
                buttonLabel: "OK",
                animation: "default",
                callback: function () {
                    onsenCTRL.myNavi.resetToPage("page3.html", {
                        animation: 'lift',
                        onTransitionEnd: function () {
                            onsenCTRL.userinfo._scope.initInfo();
                        }
                    })
                }
            });
            return false;
        }

});

module.controller('menuCtrl', function ($scope) {
    $scope.setPage = function (ids) {
        onsenCTRL.menu.closeMenu();
        onsenCTRL.myNavi.resetToPage(ids, {
            animation: 'none',
            onTransitionEnd: function () {
               if(onsenCTRL.userinfo._scope) onsenCTRL.userinfo._scope.initInfo();
            }
        });
    }
});
module.controller('aboutCtrl',function($scope){
    $scope.canvas={};
    $scope.stage={};
    $scope.exportRoot={};

//
$scope.init=function() {
	$scope.canvas = document.getElementById("canvas");
	$scope.exportRoot = new lib.名称未設定1();

	$scope.stage = new createjs.Stage($scope.canvas);
	$scope.stage.addChild($scope.exportRoot);
	$scope.stage.update();

	createjs.Ticker.setFPS(lib.properties.fps);
	createjs.Ticker.addEventListener("tick", $scope.stage);
}
    onsenCTRL.menu.once("postclose",function(){
        $scope.init();
    });
});
module.controller('naviCtrl', function ($scope) {
    
});
module.controller('scoreCtrl',function($scope, SharedStateService){
    $scope.shear = SharedStateService;
    $scope.opacity_range = storageCTRL.getTargetOpacity();
    $scope.setOpacity2target = function(){
        var opa = (100-$scope.opacity_range)/100
        scoreCTRL.setOpacity2target(opa,true);
    }
    $scope.removeTargetPic=function(){
        scoreCTRL.clearTargetBackground();
    }
    ons.ready(function(){
        // scoreCTRL = new ScoreCTRL(storageCTRL.getLog($scope.shear.storageTag), true);

    });
    $scope.listHtml = "";
    $scope.setNgEvent = function(htex){
       $scope.html = htex;
    }
});
module.controller('loginfoCtrl', function ($scope, SharedStateService, $data) {
    $scope.shear = SharedStateService;
    $scope.data = $data;
    
    var handleID = 'l' + $scope.shear.storageTag;
    $scope.param = storageCTRL.storageCache[handleID].gameconfig;
    $scope.canGameTitleEdit = false;
    $scope.canMemoEdit = false;
    $scope.listParam = [
        {
            title: "Game",
            data: $scope.param.gametype.title
        },
        {
            title: "Date",
            data: getDateCode($scope.shear.storageTag)
        },
        {
            title: "Target No",
            data: $scope.param.standposition
        },
        {
            title:"Bow",
            data: $scope.param.bow.bowname
        },

        {
            title: "BowType",
            data: $scope.param.bowtype
        },

        {
            title: "Arrow",
            data: $scope.param.arrow.arrowname
        },
        {
            title: "FatArrow",
            data: $scope.param.shaft!="Narrow"?"true":"false"
        },
        {
            title: "Target",
            data: $scope.param.targettype.title
        },
        {
            title: "Count X",
            data: $scope.param.enableX?"Enable":"Disable"
        },
        {
            title: "GeoLocation",
            data: conversionGeoLocation($scope.param.geo)
        }
    ]
    $scope.editGameTitle = function(){
        $scope.canGameTitleEdit = true;
    };
    $scope.gameTitleUpDate = function(){
        $scope.canGameTitleEdit = false;
        storageCTRL.reSetGameConfig($scope.param);
        $scope.data.reLoadLogList();
    };
    $scope.editMemo = function(){
        $scope.canMemoEdit = true;
    };
    $scope.memoUpDate = function(){
        $scope.canMemoEdit = false;
        storageCTRL.reSetGameConfig($scope.param);
        $scope.data.reLoadLogList();
    };
    
    $scope.rescore = function () {
        var tag = $scope.param.storageTag;
        onsenCTRL.myNavi.pushPage("page2.html", {
            animation: 'slide', // アニメーションの種類
            onTransitionEnd: function () {
                    scoreCTRL = new ScoreCTRL(storageCTRL.getLog(tag), true);
                } // アニメーションが完了した際によばれるコールバック
        });
    };
    $scope.delete = function () {
        ons.notification.confirm({
            message: "このスコアカードを削除いたしますか？",
            title:"スコアカード削除",
            callback: function (idx) {
                switch (idx) {
                case 0:
                    break;
                case 1:
                    storageCTRL.deleteLog($scope.shear.storageTag);
                    $scope.data.reLoadLogList();
                    onsenCTRL.myNavi.popPage();
                    toaster.showToast("スコアカードを削除しました", 3000);
                    break;
                }
            }
        });
    };
});

module.controller('gameconfigCtrl', function ($scope, $filter, $data) {
    $scope.conf = {};
    $scope.data = $data;
    $scope.user = storageCTRL.getUserInfo();
    $scope.getWindowParam =function(){
        return {maxHeight:document.documentElement.clientHeight - 100+"px",width:"320px"};
    }

    
    $scope.setArrowType = function () {
        $scope.showDialog('arrowlist.html');
    };
    $scope.setGameType = function () {

        $scope.showDialog('gamelist.html');
    };
    $scope.setBowType = function () {
        $scope.showDialog('bowlist.html');

    };
    $scope.setTargetType = function () {
        $scope.showDialog('targetlist.html');

    };
    
    /**
     * パラメーターセット用
     * @param {string} key    対象オブジェクトキー
     * @param {string} data   入力するデータ
     * @param {string} target ダイアログ名ｒ
     */
    
    $scope.setParam = function (key, data, target) {
        $scope.conf[key] = data;
        console.trace($scope.conf[key]);
        $scope.dialogs[target].hide({
            animation: "none"
        });
        if(key=="gametype"){
            if(data.canSelectX == true){
                $scope.setEnableX(false);
            }else{
                $scope.setEnableX(true);
            }
            $scope.conf.shaft = "Narrow";
        }
        /*
        if(target=="gamelist.html"||target=="bowlist.html"){
            if($scope.conf.gametype){
        $scope.biasTarget();
            }
        }*/
    }
    
    storageCTRL.setGeo();
    $scope.conf.shaft = "Narrow";
    $scope.conf.enableX = true;

    $scope.getArrowType = function () {
        return conversionArrowType($scope.conf.shaft);
    }
    $scope.setEnableX = function (b){
        if(typeof b === "boolean"){
            $scope.conf.enableX = b;
            onsenCTRL.enableX.setChecked(b);
        }else{
       $scope.conf.enableX = onsenCTRL.enableX.isChecked();
        console.log($scope.conf.enableX);
        }
        $scope.$apply();
    }
    
    ons.ready(function(){
        onsenCTRL.myNavi.once("postpush",function(e){
            if(e.enterPage.page == "gameconfig.html"){
                $scope.setEnableX(true);
                onsenCTRL.enableX.on("change",function(ev){
                    $scope.setEnableX();
                });
            }
        });
    });
    
    $scope.dialogs = {};

    $scope.showDialog = function (dlg) {
        if (!$scope.dialogs[dlg]) {
            ons.createDialog(dlg, {
                parentScope: $scope
            }).then(function (dialog) {
                $scope.dialogs[dlg] = dialog;
                dialog.show({
                    animation: "none"
                });
            });
        } else {
            $scope.dialogs[dlg].show({
                animation: "none"
            });
        }
    };
    $scope.hideDialog = function(dlg){
        $scope.dialogs[dlg].hide({
            animation: "none"
        });
    };


    $scope.entry = function () {
        //todo エラー制御
        if (!$scope.conf.gametype) { 
            ons.notification.alert({
                message: "競技種別の登録は必須です",
                title: "introduction",
                buttonLabel: "OK",
                animation: "default"
            });
            return;
        }

        $scope.conf.geo = storageCTRL.getGeo();

        console.log($filter("json")($scope.conf));

        var tag = storageCTRL.setLog($scope.conf);
        $scope.data.reLoadLogList();
        $scope.gameconf_clear();

        onsenCTRL.myNavi.replacePage("page2.html", {
            animation: 'lift', // アニメーションの種類
            onTransitionEnd: function () {
                    scoreCTRL = new ScoreCTRL(storageCTRL.getLog(tag), true);
                } // アニメーションが完了した際によばれるコールバック
        });

    }
    $scope.gameconf_clear = function () {
        $scope.conf = {};
    };

    
    $scope.$watch('conf.bow', function() {
        if(typeof $scope.conf.bow != "undefined"){
            $scope.conf.bowtype = $scope.conf.bow.bowtype;
        }
    });
    $scope.$watch('conf.gametype', function() {
        if(typeof $scope.conf.gametype != "undefined"){
            $scope.conf.targettype = $scope.data.targetFaceObj[$scope.conf.gametype.target];
        }
    });

});
module.controller('listCtrl', function ($scope, SharedStateService, $data, $filter) {
    $scope.data = $data;
    $scope.shear = SharedStateService;
    $scope.ss = $scope.data.logList;
        //
    $scope.gameTitle = "";
    $scope.standbyLoginfo = function () {
        $scope.shear.storageTag = parseInt(this.t.storageTag);
        onsenCTRL.myNavi.pushPage("loginfo.html", {
            animation: "slide"
        })
    }


        //ゲームコンフィグ
    $scope.showGameConf = function () {
        if (storageCTRL.isFirst()) {
            ons.notification.alert({
                message: "最初にユーザー情報を入力してください",
                title: "introduction",
                buttonLabel: "OK",
                animation: "default",
                callback: function () {
                    onsenCTRL.myNavi.pushPage("page3.html", {
                        animation: 'lift', // アニメーションの種類
                        onTransitionEnd: function () {
                            onsenCTRL.userinfo._scope.initInfo();
                        }
                    })
                }
            });
            return false;
        }
        onsenCTRL.myNavi.pushPage("gameconfig.html", {
            animation: 'lift', // アニメーションの種類
            onTransitionEnd: function () {}
        })
    };
});


module.controller('personalinfoCtrl', function ($scope, $data) {

            $scope.data = $data;

            $(".range").on({
                'touchstart mousedown': function (e) {
                    onsenCTRL.menu.setSwipeable(false);
                },
                'touchend mouseup': function (e) {
                    onsenCTRL.menu.setSwipeable(true);
                }
            });
            $scope.openSlideMenu = function () {
                if ($scope.userForm.$invalid) {

                    ons.notification.alert({
                        message: "最低限のユーザー情報「名前」と「性別」を入力してください",
                        title: "introduction",
                        buttonLabel: "OK",
                        animation: "default"
                    });
                    return false;
                }else if(!$scope.enchange||storageCTRL.isFirst()){
                        ons.notification.confirm({
                          message: '情報が変更されています。更新しますか?',
                          callback: function(idx) {
                            switch (idx) {
                              case 0:
                                    $scope.initInfo();
                                break;
                              case 1:
                                    $scope.setPersonalInfo();
                                    ons.notification.alert({
                                  message: 'ユーザー情報が更新されました'
                                });
                                break;
                            }
                          }
                        });
                    return false;
                }
                                    onsenCTRL.menu.toggleMenu(); 

            }
            
    
            $scope.deleteModeBow = [];
            $scope.deleteModeArrow = [];
            $scope.user = {
                name: "",
                gender: "",
                geo: false,
                finger_gap: false,
                gap_range: 50,
                opacity_range: 80,
                settingOpacity_range: 20,
                bows: [], //{bowname: bowtype:},,,
                arrows:[]//{arrowname: isFat:Boolean}
            }
            $scope.enchange = true;//情報変更フラグ
            //$scope.switches = [onsenCTRL.geo,onsenCTRL.gap];
            $scope.setPersonalInfo = function () {
                $scope.user.geo = onsenCTRL.geo.isChecked();
                console.log($scope.user);
                storageCTRL.setUserInfo($scope.user);

                if ($scope.user.geo) {
                    storageCTRL.setGeo();
                }
                onsenCTRL.menu.closeMenu();
                onsenCTRL.myNavi.resetToPage("page1.html", {
                    animation: 'lift'
                });
            }
            $scope.clearPersonalInfo = function () {
                ons.notification.confirm({
                    message: "ユーザー情報を削除いたしますか？",
                    callback: function (idx) {
                        switch (idx) {
                        case 0:
                            break;
                        case 1:
                            storageCTRL.clearUserInfo();
                            onsenCTRL.menu.setSwipeable(false);
                            $scope.user = {
                                name: "",
                                gender: "",
                                geo: false,
                                finger_gap: false,
                                gap_range: 50,
                                opacity_range: 80,
                                settingOpacity_range: 20,
                                bows: [],
                                arrows: []
                            }

                            onsenCTRL.geo.setChecked($scope.user.geo);
                            onsenCTRL.gap.setChecked($scope.user.finger_gap);
                            $scope.$apply();
                            break;
                        }
                    }
                });
            }
            $scope.initInfo = function () {
                var inf = storageCTRL.getUserInfo();
                if (inf) {
                    $scope.user = inf;
                    onsenCTRL.geo.setChecked($scope.user.geo);
                    onsenCTRL.gap.setChecked($scope.user.finger_gap);
                } else {
                    onsenCTRL.geo.setChecked(false);
                    onsenCTRL.gap.setChecked(false);
                }
                $scope.deleteModeBow = new Array($scope.user.bows.length)
                for(var i=0;i<$scope.deleteModeBow.length;i++){
                    $scope.deleteModeBow[i]="";
                }
                $scope.deleteModeArrow = new Array($scope.user.bows.length)
                for(var i=0;i<$scope.deleteModeArrow.length;i++){
                    $scope.deleteModeArrow[i]="";
                }
                onsenCTRL.gap.on("change", function (e) {
                    $scope.user.finger_gap = onsenCTRL.gap.isChecked();
                    console.log("fingergap" + $scope.user.finger_gap);
                    $scope.$apply();
                });
                $scope.$apply();
                $scope.$watch('user', function (e) {
                    $scope.enchange = false;
                    onsenCTRL.menu.setSwipeable(false);
                });
            }
            $scope.deleteBowSlide = function(index,b){
                $scope.deleteModeBow[index]=b?"delleteMode":"";
            }
            $scope.deleteBow = function(index){
                $scope.deleteModeBow.splice(index,1);
                $scope.user.bows.splice(index,1);
            }
            $scope.deleteArrowSlide = function(index,b){
                $scope.deleteModeArrow[index]=b?"delleteMode":"";
            }
            $scope.deleteArrow = function(index){
                $scope.deleteModeArrow.splice(index,1);
                $scope.user.arrows.splice(index,1);
            }
            $scope.dialogs = {};

            $scope.showDialog = function (dlg) {
                if (!$scope.dialogs[dlg]) {
                    ons.createDialog(dlg, {
                        parentScope: $scope
                    }).then(function (dialog) {
                        $scope.dialogs[dlg] = dialog;
                        dialog.show({
                            animation: "none"
                        });
                    });
                } else {
                    $scope.dialogs[dlg].show({
                        animation: "none"
                    });
                }
            };
            $scope.hideDialog = function (dlg) {
                $scope.dialogs[dlg].hide({
                    animation: "none"
                });
            };
        
    $scope.tmpUserBow ={
        bowname:"",
        bowtype:""
    };
    $scope.tmpUserArrow = {
        arrowname:"",
        isFat:false 
    }
    
    /** 
     * パラメーターセット用
     * @param {string} key    対象オブジェクトキー
     * @param {string} data   入力するデータ
     * @param {string} target ダイアログ名ｒ
     */
    
    $scope.setBowParam = function (data) {
        //$scope.conf[key] = data;
        //$scope.user.bows[]
        $scope.tmpUserBow.bowtype = data;
    }
    
    //addbow dialog
    $scope.addBow = function (){
        var tmp = angular.copy($scope.tmpUserBow);
        $scope.hideDialog('adduserbow.html');
        if($scope.tmpUserBow.bowname==""||$scope.tmpUserBow.bowtype=="")return;
        $scope.user.bows.push(tmp);
        $scope.tmpUserBow.bowname="";
        $scope.tmpUserBow.bowtype="";
    }
    
    //addarrow dialog
    $scope.addArrow = function(){
        var tmp = angular.copy($scope.tmpUserArrow);
        $scope.hideDialog('adduserarrow.html');
        if($scope.tmpUserArrow.arrowname=="")return;
        $scope.user.arrows.push(tmp);
        $scope.tmpUserArrow.arrowname="";
        $scope.tmpUserArrow.isFat=false;
    }
    
    //弓種イニシャル取得
    $scope.convertBowInitial = function(type){
       return $scope.data.bowObj[type].initial;
    }
});
ons.ready(function () {
    /*
    onsenCTRL.menu.on("postclose", function () {
        console.log(onsenCTRL.menu._currentPageUrl);
    });*/
});