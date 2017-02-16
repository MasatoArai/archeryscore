//ひらいて閉じるときのアクションのこし、メニュースライド時　ローカルストレージに保存。復帰時いちおういちいちnew

function ScoreCTRL(confObj, stflag) {
    //パラメータ定数。
    this.TARGET_TRANSPARENT = (100 - storageCTRL.getTargetOpacity()) / 100;
    this.SETTING_TRANSPARENT = (100 - storageCTRL.getTargetOpacitySetting()) / 100;
    this.gameconfig = {
        gametype: "50mW",
        bowtype: "compound",
        standposition: "",
        info: "",
        timeOfShootEnd: 6,
        timeOfEndParRound: 6,
        timeOfRound: 2,
        targettype: "5-10",
        shaft: "Narrow",
        enableX: true,
        storageTag: 0
    };
    this.shaft_R = "2%";
    //記録情報
    this.contents = {
        roundTotal: 0,
        threeShotTotal: 0,
        sixShotTotal: 0,
        endTotal: 0,
        scoreLog: [], //１次ラウンド２次エンド３次スコア
        hitLog: [], //[[],[]]
        lock: [], //１次ラウンド２次エン
    };
    //アプリ内ステータス
    this.status = {
        hasimage: false, //todo 一時画像保持フラグ
        hasTargetBackground: false, //ターゲット背景保持フラグ
        nowRound: 0,
        nowEnd: 0,
        nowShoot: 0,
        selectShoot: -1,
        isFinished: false,
        onTargetFace: false,
        storageTag: this.gameconfig.storageTag,
        opacity_range: this.TARGET_TRANSPARENT,
        mousemode: {
            x: 0,
            y: 0,
            px: 0,
            py: 0
        }
    };

    //アプリ内着弾設定ステータス
    this.targetFace = {
            faceLock: true,
            box: SVG('target_svg'),
            info: {}
        }
        //アプリ写真読み込みパネルコード読み込み用
    this.iframeUnit = "";
    //アプリ写真読み込みクロップ画像保持
    this.cropImage = {};


    //各種ボタンへのイベント設定
    var me = this;

    //得点ボタン内クリアボタン
    $("#box_clear").on('touchstart mousedown', function (e) {
        e.preventDefault();
        if (me.contents.lock[me.status.nowRound][me.status.nowEnd]) return false;
        ons.notification.confirm({
            message: "このエンドのスコアを削除しますか？",
            title: "Clear",
            callback: function (idx) {
                switch (idx) {
                case 0:
                    break;
                case 1:
                    me.clearEnd();
                    break;
                }
            }
        });
        return false;
    });
    //ラウンド確定ボタン
    $("#end_confirm").on('touchstart mousedown', function (e) {
        event.preventDefault();
        me.confirmEnd();
        me.showEndCover();
        return false;
    });
    //エンド編集ロックボタン
    $("#endLock").on('touchstart mousedown', function (e) {
        event.preventDefault();
        me.contents.lock[me.status.nowRound][me.status.nowEnd] = me.contents.lock[me.status.nowRound][me.status.nowEnd] ? false : true;
        me.setLockClass();
        return false;
    });
    //スコアカード遷移ボタン
    $("#show_scorecard").on('touchstart mousedown', function (e) {
        event.preventDefault();
        me.inputLog2scorecard();
        me.setArrow2canvas();
        me.clearHitPoint();
        if (me.status.onTargetFace) {
            me.toggleTargetFace();
        }
        me.transScoreCell(false);
        return false;
    });
    //ターゲットフェース登録ボタン
    $('#direct_targetface').on('touchstart mousedown', function (e) {
        event.preventDefault();
        me.toggleTargetFace();
    });
    //ターゲットフェース内クローズボタン
    $('#face_close').on('touchstart mousedown', function (e) {
        event.preventDefault();
        me.toggleTargetFace();
    });
    //ターゲットフェース内ロックボタン
    $("#face_lock").on('touchstart mousedown', function (e) {
            event.preventDefault();
            me.targetFace.faceLock = me.targetFace.faceLock ? false : true;
            if (me.targetFace.faceLock) {
                $(this).children(".ons-icon").addClass("ion-locked");
                $(this).children(".ons-icon").removeClass("ion-unlocked");
                me.targetFace.info.show();
            } else {
                $(this).children(".ons-icon").addClass("ion-unlocked");
                $(this).children(".ons-icon").removeClass("ion-locked");
                me.targetFace.info.hide();
            }
        })
        //todo ターゲットフェース内撮影ボタン

    var ch = new flickTest()
    $("#take_photo").on("touchstart mousedown", function (e) {
        event.preventDefault();
        ch.setS(e);
    }).on('mousemove touchmove', function (e) {
        event.preventDefault();
        ch.checker(e, function () {
            if (!me.status.hasTargetBackground) return;
            $("#target_overlay_ui_wrapper").height($('#target_ui_wrapper').offset().top + $('#target_ui_wrapper').outerHeight());
            $("#target_overlay_ui_wrapper").css({
                left: "-" + $('#target_ui_wrapper').offset().left + "px",
                width: $('body').width() + "px"
            });

            $("#target_overlay_ui_base").hide();
            $("#target_overlay_ui_wrapper").show();
            $("#target_overlay_ui_base").slideDown(200);
        });
    }).on("mouseup touchend", function (e) {
        event.preventDefault();
        var isclick = ch.isClick(e);
        ch.resetTouch();

        if (e.type == "touchend" && ch.isSwiped() || !isclick) {
            return;
        }
        if (verificationImage.src) {
            me.showReferencePhoto();
        }
    });

    //無理くり上フリック検知
    function flickTest() {
        this.s = 0;
        this.x = 0
        this.istouch = false;
        this.isStarted = false;
        this.checker = function (ev, callback) {
            if (!this.isStarted) return;
            var ee = this.istouch ? ev.originalEvent.changedTouches[0].pageY : ev.pageY;
            var k = ee - this.s;
            if (k < -90) {
                console.log("flickeuped");
                (callback)();
                this.s = 0
                this.x = 0
                this.isStarted = false;
            }

        }
        this.isClick = function (ev) {
            var yy = this.istouch ? ev.originalEvent.changedTouches[0].pageY : ev.pageY;
            var xx = this.istouch ? ev.originalEvent.changedTouches[0].pageX : ev.pageX;

            var k = Math.abs(yy - this.s);
            var x = Math.abs(xx - this.x);
            if ((k < 60) && (x < 60)) {
                return true;
            } else {
                return false;
            }
        }
        this.isSwiped = function () {
            return (this.s == 0) ? true : false;
        }

        this.setS = function (ev) {
            this.isStarted = true;
            if (ev.originalEvent.changedTouches) {
                this.istouch = true;
            } else {
                this.istouch = false;
            }
            this.s = this.istouch ? ev.originalEvent.changedTouches[0].pageY : ev.pageY;
            this.x = this.istouch ? ev.originalEvent.changedTouches[0].pageX : ev.pageX;
        }
        this.resetTouch = function () {
            this.isStarted = false;
        }
    }

    //オーバレイUIバックグラウンドイベント
    $('#target_overlay_ui_wrapper').click(function (e) {
        if (e.target == this) {
            $('#target_overlay_ui_wrapper').toggle();
        }
    });
    //オーバレイuiベースイベント奪い
    $('#target_overlay_ui_base').click(function (e) {
        e.preventDefault();
    });

    this.refPhotoIframe = void(0);
    //初期化指定
    this.init(confObj, stflag);
};
ScoreCTRL.prototype.init = function (confObj, stflag) {

    var me = this;
    //iframe用コード読み込み
    $.ajax({
            type: 'GET',
            url: "photoviewer.html",
            dataType: "text",
            cache: false,
        })
        .done(function (d, s, j) {
            me.iframeUnit = d;
        });

    onsenCTRL.carousel.on("postchange", function (e) {
        if (e.activeIndex == 0) {
            $("#scorelist_footer").css({
                bottom: '0px',
                display: 'block'
            });
        } else {

            $("#scorelist_footer").css({
                bottom: '-100px',
                display: 'block'
            });
        }
    });
    onsenCTRL.carousel.on('overscroll', function (e) {
        if (e.activeIndex == 1) {
            $("#scorelist_footer").css({
                bottom: '-100px',
                display: 'none'
            });
        }
    });
    //this.targetfaceLoader("targetface_full");

    //ゲーム情報指定
    if (typeof confObj === "object") {
        mergeObj(this.gameconfig, confObj.gameconfig)
    }
    if (this.gameconfig.shaft == "Fat") {
        this.shaft_R = "6%";
    }

    if (localStorage.lastStatus) {
        var tmpsta = JSON.parse(localStorage.getItem("lastStatus"));
        if (tmpsta.storageTag == this.gameconfig.storageTag) {
            this.status = tmpsta;
        }
    }

    this.readyScoreLog();
    this.readyHitLog();
    this.readyLock();
    this.setTargetFace();
    this.setLockClass();

    if (typeof confObj === "object") {
        mergeObj(this.contents, confObj.contents);
    }

    this.buildScoreCard();
    //得点ボタン
    $("#score_pad_wrapper a").each(function (i) {
        var val = ++i
        if (val == 12) {
            val = -1;
        }
        switch (me.gameconfig.targettype) {
        case "5-10":
            if ((5 > val) && (val != -1)) $(this).addClass("button_disable");
            break;
        case "3spot":
            if (((6 > val) && (val != -1)) || (val == 11)) $(this).addClass("button_disable");
            break;
        }
        $(this).on('touchstart mousedown', function (e) {
            e.preventDefault();
            if (me.contents.lock[me.status.nowRound][me.status.nowEnd]) return false;
            switch (me.gameconfig.targettype) {
            case "5-10":
                if ((5 > val) && (val != -1)) return false;
                break;
            case "3spot":
                if (((6 > val) && (val != -1)) || (val == 11)) return false;
                break;
            }
            $(this).addClass("button_hover");
            me.inputBtn(val, 'key');
            return val;
        }).on("touchend mouseup mouseout", function (e) {
            e.preventDefault();
            $(this).removeClass("button_hover");
        });
    });
    //得点表示エリア
    $("#score_line .table_hr div").each(function (i) {
        if ((i >= me.contents.scoreLog[0][0].length) && (i < 6)) {
            $(this).addClass("voidcell");
        } else {
            $(this).on('touchstart mousedown', shoottime(i));
        }

        function shoottime(ind) {
            var index = ind;
            return function () {
                event.preventDefault();
                if (me.gameconfig.timeOfShootEnd - 1 < index) return false;
                me.status.nowShoot = index;
                me.setIndicator(index);
                return false;
            }
        }
    });

    $("#scorelist_footer").css("bottom", "0px");
    /*if (stflag) {
        if(onsenCTRL.carousel.getActiveCarouselItemIndex()!=0){
        this.transScoreCell(false);
        }*/
    this.inputLog2scorecard();
    //ラウンド別トータルグループ確認画像作成
    this.targetMakerOnCanvas();
    this.setArrow2canvas();
    //}

    //todo 撮影関連
    if (verificationImage.src) {
        $('#cameraimage').hide();
    } else {
        $('#cameraimage').show();
    }
    $('#cameraimage').on("change", function () {
        var reader = new FileReader();
        reader.onload = function (e) {
            me.reader2variable(reader);
        }
        var imgfile = $('#cameraimage').get(0).files[0];
        reader.readAsDataURL(imgfile);
    });
};
/**
 * ラウンドとターゲットフェースのロックに応じたボタンの姿の変更
 */
ScoreCTRL.prototype.setLockClass = function () {
    if (
        this.contents.lock[this.status.nowRound][this.status.nowEnd]
    ) {
        $("#endLock").addClass("elock");
        this.targetFace.info2.show();
    } else {
        $("#endLock").removeClass("elock");
        this.targetFace.info2.hide();
    }
    /*todo
    if (this.targetFace.faceLock) {
        $("#target_lock_btn").css("background-image", "url(img/lock2.svg)");
    } else {
        $("#target_lock_btn").css("background-image", "url(img/lock1.svg)");
    }*/
};
/**
 * スコアログ配列の初期化　配列設定と0投入
 */
ScoreCTRL.prototype.readyScoreLog = function () {
    this.contents.scoreLog = new Array(this.gameconfig.timeOfRound);
    for (var i = 0; i < this.gameconfig.timeOfRound; i++) {
        this.contents.scoreLog[i] = new Array(this.gameconfig.timeOfEndParRound);
        for (var s = 0; s < this.gameconfig.timeOfEndParRound; s++) {
            this.contents.scoreLog[i][s] = new Array(this.gameconfig.timeOfShootEnd);
            for (var o = 0; o < this.gameconfig.timeOfShootEnd; o++) {
                this.contents.scoreLog[i][s][o] = 0;
            }
        }
    }

};
/**
 * ヒット位置入力ログの初期化オブジェクト投入
 */

ScoreCTRL.prototype.readyHitLog = function () {
    this.contents.hitLog = new Array(this.gameconfig.timeOfRound);
    for (var i = 0; i < this.gameconfig.timeOfRound; i++) {
        this.contents.hitLog[i] = new Array(this.gameconfig.timeOfEndParRound);
        for (var s = 0; s < this.gameconfig.timeOfEndParRound; s++) {
            this.contents.hitLog[i][s] = new Array(this.gameconfig.timeOfShootEnd);
            for (var o = 0; o < this.gameconfig.timeOfShootEnd; o++) {
                this.contents.hitLog[i][s][o] = {};
            }
        }
    }

};
/**
 * ロック管理配列の初期化
 */

ScoreCTRL.prototype.readyLock = function () {
    this.contents.lock = new Array(this.gameconfig.timeOfRound);
    for (var i = 0; i < this.gameconfig.timeOfRound; i++) {
        this.contents.lock[i] = new Array(this.gameconfig.timeOfEndParRound);
        for (var s = 0; s < this.gameconfig.timeOfEndParRound; s++) {
            this.contents.lock[i][s] = false;
        }
    }

};
/**
 * 得点入力メソッド
 * @param   {Number} v   得点
 * @param   {String} key キーパッド入力時"key"が投入
 * @returns {Boolean}  処理後返答
 */

ScoreCTRL.prototype.inputBtn = function (v, key) {
    if (this.status.nowShoot == this.gameconfig.timeOfShootEnd) return false;

    var $scoreline = $("#score_line .table_hr div");
    $($scoreline.get(this.status.nowShoot)).text(this.code2score(v));
    this.contents.scoreLog[this.status.nowRound][this.status.nowEnd][this.status.nowShoot] = v;
    this.draftScoreLine();
    if (key == "key") {
        if (this.targetFace.hit[this.status.nowShoot]) {
            this.targetFace.hit[this.status.nowShoot].remove();
            delete this.targetFace.hit[this.status.nowShoot];
            this.contents.hitLog[this.status.nowRound][this.status.nowEnd][this.status.nowShoot] = {};
            this.setHitLogIndicator(this.status.nowShoot, false);
        }
    } else {
        this.setHitLogIndicator(this.status.nowShoot, true);
    }
    this.status.nowShoot++;
    this.setIndicator(this.status.nowShoot);
    storageCTRL.setLogFromIns(this);
};
/**
 * スコア表示の小計ラウンド計入力
 */

ScoreCTRL.prototype.draftScoreLine = function () {
    var $scoreline = $("#score_line .table_hr div");

    var $endTotal = $($scoreline.get($scoreline.length - 2));
    var $roundTotal = $($scoreline.get($scoreline.length - 1));
    $endTotal.html("");
    $endTotal.text(this.endCounter(this.status.nowRound, this.status.nowEnd));
    $roundTotal.html("");
    $roundTotal.text(this.subtotalRound(this.status.nowRound, this.status.nowEnd));
}
ScoreCTRL.prototype.setHitLogIndicator = function (num, deleteFlg) {
    var $scoreline = $("#score_line .table_hr div");
    if (deleteFlg) {
        $($scoreline.get(num)).addClass("hitloged");
    } else {
        $($scoreline.get(num)).removeClass("hitloged");
    }
}

/**
 * 得点表のインジケーター表示
 * @param {Number} num インジケータ設置位置
 */

ScoreCTRL.prototype.setIndicator = function (num) {
        this.status.selectShoot = num;
        this.targetFace.selecthit = num;
        if (this.targetFace.hit) {

            $.each(this.targetFace.hit, function (i, value) {
                if (value) {
                    value.fill({
                        color: "#f00"
                    }).stroke({
                        color: "#fff",
                        width: 2
                    });
                }
            });
            if (this.targetFace.hit[num]) {
                this.targetFace.hit[num].fill({
                    color: "#ffff44"
                }).stroke({
                    color: "#000",
                    width: 2
                }).front();
            }
        }

        var $scoreline = $("#score_line .table_hr div");
        $scoreline.each(function () {
            $(this).removeClass("select");
        });

        if (!(this.status.selectShoot >= this.gameconfig.timeOfShootEnd)) {
            $($scoreline.get(this.status.selectShoot)).addClass("select");
        } else {
            this.status.selectShoot = -1;
            this.targetFace.selecthit = -1;
        }
        /*
        $($scoreline.get(this.status.selectShoot)).addClass("select");*/
    }
    /**
     * エンドの登録実行
     */

ScoreCTRL.prototype.confirmEnd = function () {
    this.contents.lock[this.status.nowRound][this.status.nowEnd] = true;
    this.status.nowEnd++;
    if (this.status.nowEnd >= this.gameconfig.timeOfEndParRound) {
        this.status.nowRound++;
        this.status.nowEnd = 0;
        this.status.nowShoot = 0;
        if (this.status.nowRound >= this.gameconfig.timeOfRound) {
            this.status.isFinished = true;
            this.status.nowRound = 0;
            this.status.nowEnd = 0;
            this.status.nowShoot = 0;
            //this.inputLog2scorecard();

            this.inputLog2scorecard();
            this.setArrow2canvas();
            this.clearHitPoint();
            if (this.status.onTargetFace) {
                this.toggleTargetFace();
            }
            this.transScoreCell(false);
            return;
        }
    }
    this.clearLine();
    this.clearHitPoint();
    this.scoreboxHeaderInfo(true);
    this.setIndicator(0);
    this.reinput(this.status.nowRound, this.status.nowEnd);
    this.logExtraction();
    //todo ログに情報あった場合引っ張り出す。
}

//scoreログでそのエンドのログがあった場合は展開。
ScoreCTRL.prototype.logExtraction = function () {
    var isLogedNum = 0;
    for (var i = 0; i < this.contents.scoreLog[this.status.nowRound][this.status.nowEnd].length; i++) {
        isLogedNum += Math.abs(this.contents.scoreLog[this.status.nowRound][this.status.nowEnd][i]);
    }
    if (isLogedNum == 0) return false;

    var hitObj = this.contents.hitLog[this.status.nowRound][this.status.nowEnd];
    var hitpoint = {};
    for (i = 0; i < this.contents.scoreLog[this.status.nowRound][this.status.nowEnd].length; i++) {
        if (typeof hitObj[i].x == "undefined") continue;
        hitpoint = this.targetFace.hitgroup.circle(this.shaft_R).fill("#ff0000").stroke({
            color: "#fff",
            width: 2
        }).center(hitObj[i].x + "%", hitObj[i].y + "%");
        this.targetFace.hit[i] = hitpoint;
    }
};
/**
 * スコア入力準備
 * @param {Number} round ラウンド数
 * @param {Number} end   エンド数
 */

ScoreCTRL.prototype.reinput = function (round, end) {
    this.clearLine();
    this.status.nowRound = round;
    this.status.nowEnd = end;
    this.status.nowShoot = 0;
    this.setLockClass();
    this.scoreboxHeaderInfo(true);

    var $scoreline = $("#score_line .table_hr div");
    var v = -1;
    var me = this;
    $scoreline.each(function (index) {
        if (index < me.gameconfig.timeOfEndParRound) {
            v = me.contents.scoreLog[me.status.nowRound][me.status.nowEnd][index];
            $(this).text(me.code2score(v));
            if (me.gameconfig.timeOfShootEnd > index) {

                if (me.contents.hitLog[me.status.nowRound][me.status.nowEnd][index].x) {
                    $(this).addClass("hitloged");
                }
            }
        }
    });
    this.draftScoreLine();
    this.setIndicator(0);
};
/**
 * 現在のラウンド　エンド表示コントロール\\
 */

ScoreCTRL.prototype.scoreboxHeaderInfo = function (b) {
        if (b) {
            $("#header_info").html("");
            $("#header_info").html(getRoundTitle(this, this.status.nowRound) + " END:" + (this.status.nowEnd + 1));
        } else {
            $("#header_info").html("");
            $("#header_info").html("Aim small Miss small");
        }
    }
    /**
     * エンドを全部クリア
     */

ScoreCTRL.prototype.clearEnd = function () {
    var log = this.contents.scoreLog[this.status.nowRound][this.status.nowEnd]
    var hitlog = this.contents.hitLog[this.status.nowRound][this.status.nowEnd]
    for (var i = 0; i < log.length; i++) {
        log[i] = 0;
        delete this.targetFace.hit[i];
        hitlog[i] = {};
    }

    this.clearLine();
    this.clearHitPoint();
    this.draftScoreLine();
    this.setIndicator(0);
};
/**
 * 得点表示部の初期化
 */

ScoreCTRL.prototype.clearLine = function () {
    var $scoreline = $("#score_line .table_hr div");
    $scoreline.html("");
    $scoreline.removeClass("select");
    $scoreline.removeClass("hitloged");
    this.status.nowShoot = 0;
    this.status.selectShoot = -1;
};

/**
 * エンドのトータルスコアを返す
 * @param   {Number} roundNum ラウンドnum
 * @param   {Number} endNum   エンドnum
 * @returns {Number} ログデータから得たコードから点数を返す
 */

ScoreCTRL.prototype.endCounter = function (roundNum, endNum) {
    var log = this.contents.scoreLog;
    var total = 0
    for (var s = 0; s < log[roundNum][endNum].length; s++) {
        total += flatX(log[roundNum][endNum][s]);
    }
    return total;

    function flatX(v) {
        if (v == 11) {
            return 10;
        } else if (v == -1) {
            return 0;
        } else {
            return v;
        }
    }
};
/**
 * ラウンド合計
 * @param   {Number} roundNum ラウンドnum
 * @param   {Number} endNum   エンドnum
 * @returns {Number} ラウンド合計スコアを返す
 */
ScoreCTRL.prototype.subtotalRound = function (roundNum, endNum) {
    var rn, en;
    var total = 0
    if (typeof roundNum == "undefined") {
        for (var r = 0; r < this.gameconfig.timeOfRound; r++) {
            for (var e = 0; e < this.gameconfig.timeOfEndParRound; e++) {
                total += this.endCounter(r, e);
            }
        }
        return total;
    } else {
        rn = roundNum;
        en = endNum;
    }
    var log = this.contents.scoreLog;
    for (var s = 0; s < en + 1; s++) {
        total += this.endCounter(rn, s);
    }
    return total;
}

/**
 * 9点10点X点計算
 * @param   {Number} roundNum ラウンドnum
 * @returns {Object}   9.10.Xの構造体を返す
 */

ScoreCTRL.prototype.get910x = function (roundNum) {
    var log = this.contents.scoreLog;
    var nine = 0,
        ten = 0,
        x = 0;

    if (typeof roundNum == "number") {
        counting(log[roundNum]);
    } else {
        for (var s = 0; s < log.length; s++) {
            counting(log[s]);
        }
    }
    return {
        nine: nine,
        ten: ten,
        x: x
    };

    function counting(tar) {
        for (var i = 0; i < tar.length; i++) {
            for (var o = 0; o < tar[i].length; o++) {
                switch (tar[i][o]) {
                case 9:
                    nine++;
                    break;
                case 10:
                    ten++;
                    break;
                case 11:
                    x++;
                    break;
                default:
                    break;
                }
            }
        }
    }
};
/**
 * コード実得点変換
 * @param   {Number} s コード
 * @returns {String} 得点文字列を返す
 */

ScoreCTRL.prototype.code2score = function (s) {
    var sc = "";
    switch (s) {
    case undefined:
        sc = " ";
        break;
    case 0:
        sc = " ";
        break;
    case -1:
        sc = "M";
        break;
    case 11:
        sc = "X";
        break;
    default:
        sc = "" + s;
        break;
    }
    return sc;
};
/**
 * ヒット位置入力画面切り替え
 */

ScoreCTRL.prototype.toggleTargetFace = function () {
        $("#target_face").toggle();
        if ($('#target_face').is(':visible')) {
            this.status.onTargetFace = true;
            if (this.targetFace.selecthit == -1) {
                this.status.nowShoot = 0;
                this.setIndicator(0);
            }
        } else {
            this.status.onTargetFace = false;
        }
    }
    /**
     * ヒット一入力ターゲット描写
     */

ScoreCTRL.prototype.setTargetFace = function () {
    this.targetFace.box.clear();
    this.targetFace.box.width(350).height(350);
    this.targetFace.info = this.targetFace.box.group();
    this.targetFace.info.width("100%").height("100%");
    this.targetFace.info.infobk = this.targetFace.info.rect("90%", "4%").move("5%", "96%").fill("#C43030");

    this.targetFace.info.infotext = this.targetFace.info.text("Score number is locked").move("50%", "96%");
    this.targetFace.info.infotext.font({
        family: "Roboto",
        size: 13,
        anchor: "middle",
        leading: 1
    });
    this.targetFace.info2 = this.targetFace.box.group();
    this.targetFace.info2.width("100%").height("100%");
    this.targetFace.info2.infobk = this.targetFace.info2.rect("90%", "4%").move("5%", "0").fill("#C43030");

    this.targetFace.info2.infotext = this.targetFace.info2.text("This END is locked").move("50%", "0%").fill("#fff");
    this.targetFace.info2.infotext.font({
        family: "Roboto",
        size: 13,
        anchor: "middle",
        leading: 1
    });
    this.targetFace.info2.hide();

    this.targetFace.group = this.targetFace.box.group();
    this.targetFace.hitgroup = this.targetFace.box.group();
    this.targetFace.group.width("100%").height("100%");
    this.targetFace.hitgroup.width("100%").height("100%");
    this.targetFace.targetCircle = [];
    var targetparam = {};
    var colorset = {
        target: {
            p1: ["#fff", "#000"],
            p2: ["#fff", "#000"],
            p3: ["#000", "#fff"],
            p4: ["#000", "#fff"],
            p5: ["#586ee6", "#000"],
            p6: ["#586ee6", "#000"],
            p7: ["#e65858", "#000"],
            p8: ["#e65858", "#000"],
            p9: ["#e6e658", "#000"],
            p10: ["#e6e658", "#000"],
            p11: ["#e6e658", "#000"]
        }
    };
    var isIndoor = false;
    switch (this.gameconfig.targettype) {
    case "1-10":
        targetparam = {
            face: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            maxr: 90,
            step: 9,
            color: "target"
        }
        break;
    case "5-10":
        targetparam = {
            face: [5, 6, 7, 8, 9, 10, 11],
            maxr: 90,
            step: 15,
            color: "target"
        }
        break;
    case "3spot":
        isIndoor = true;
        targetparam = {
            face: [6, 7, 8, 9, 10],
            maxr: 90,
            step: 18,
            color: "target"
        }
    }
    var xr = 0;
    for (var i = 0; i < targetparam.face.length; i++) {
        if (targetparam.face[i] == 11) {
            xr = targetparam.step / 2;
        }

        if (isIndoor && (targetparam.face[i] == 10)) {
            if (this.gameconfig.bowtype == "Compound") {
                xr -= targetparam.step / 2;
            }
        }
        this.targetFace.targetCircle.unshift(this.targetFace.group.circle(targetparam.maxr - (targetparam.step * i) + xr + "%").fill(colorset[targetparam.color]["p" + targetparam.face[i]][0]).stroke({
            color: colorset[targetparam.color]["p" + targetparam.face[i]][1],
            width: 0.5
        }).center("50%", "50%"));
        this.targetFace.targetCircle[0].pointval = targetparam.face[i];
        this.targetFace.targetCircle[0].radiusval = parseFloat(this.targetFace.targetCircle[0].attr("ry"));
    }

    this.addHitPointInit();
    this.setMagnify();
}

ScoreCTRL.prototype.setMagnify = function () {
        var magnitarget = $("#magnitarget");
        var magnify = $("#magnify");
        $(this.targetFace.box.node).clone().appendTo("#magnitarget").attr("width", "700").attr("height", "700");
        magnitarget.css({
            left: "-551px",
            top: "-551px"
        });
        this.magnifyPosition("lt");
    }
    /**
     * 虫眼鏡の位置変更
     * @param {String} p 右左移動指示文字列
     */

ScoreCTRL.prototype.magnifyPosition = function (p) {
        var magnify = $("#magnify");
        var magR = cal(magnify.outerWidth(),2,"/");
        var stageR = 180;
        switch (p) {
        case "lt":
            magnify.css({
                left:cal(cal($("body").width(), 2,"/"), cal(stageR,10,"+"),"-") + "px",
                top: $("#target_face").offset().top - 50 + "px"
            });
            break;
        case "rt":
            magnify.css({
                left: cal($("body").width(), 2,"/") + "px",
                top: $("#target_face").offset().top - 50 + "px"
            });
            break;
        case "lb":
            magnify.css({
                left: cal(cal($("body").width(), 2,"/"), cal(stageR,10,"+"),"-") + "px",
                top: 700 - 260 + "px"
            });
            braek;
        case "rb":
            magnify.css({
                left: cal(cal($("body").width(), 2,"/"), cal(stageR,260,"-"),"+") + "px",
                top: 700 - 260 + "-40px"
            });
            break;
        }
    }
    /**
     * ヒットポイントクリア
     */

ScoreCTRL.prototype.clearHitPoint = function () {
        this.targetFace.hit = [];
        this.targetFace.selecthit = -1;
        this.targetFace.hitgroup.clear();
        this.targetFace.touched = false;
        //ターゲットバックグラウンドの削除とフラグ制御
        this.clearTargetBackground();
    }
    /**
     * ターゲットフェイス初期化
     * @returns {Boolean} [[Description]]
     */

ScoreCTRL.prototype.addHitPointInit = function () {
    var me = this;
    var are = $("#target_face svg");
    var magni = $("#magnitarget");

    this.targetFace.hit = [];
    this.targetFace.selecthit = -1;

    $(me.targetFace.box.node).on({
        /* タッチの開始、マウスボタンを押したとき */
        'touchstart mousedown': function (e) {
            e.preventDefault();
            if ((me.targetFace.hit.length >= me.gameconfig.timeOfShootEnd && me.targetFace.selecthit < 0) || (me.contents.lock[me.status.nowRound][me.status.nowEnd])) return false;
            me.targetFace.touched = true;
            me.targetFace.selecthit = me.status.nowShoot;
            if (me.status.hasTargetBackground) {
                me.setOpacity2target(me.SETTING_TRANSPARENT);
            }
            directHit(e, true);

        },
        /* タッチしながら移動、マウスのドラッグ */
        'mousemove touchmove': function (e) {
            e.preventDefault();
            if (!me.targetFace.touched) {
                return;
            }
            $('#magnify').show().css("opacity", 1);
            directHit(e)
        },
        /* タッチの終了、マウスのドラッグの終了 */
        'touchend mouseup': function (e) {

            if (!me.targetFace.touched) {
                return;
            }
            $("#magnify").css("opacity", 0).on("transitionend", function (e) {
                if (event.propertyName == "opacity") {
                    $(this).hide().unbind("transitionend");
                }
            });

            if (me.status.hasTargetBackground) {
                me.setOpacity2target(me.status.opacity_range);
            }

            setHitLog();
            me.targetFace.hit[me.targetFace.selecthit].fill({
                color: "#f00"
            }).stroke({
                color: "#fff",
                width: 2
            });
            me.inputBtn(me.targetFace.score, true);
            // タッチ処理は終了したため、フラグをたたむ
            me.targetFace.touched = false;

        }
    });
    /**
     * ヒット位置の入力
     * @param {Object}   e      eventオブジェクト
     * @param {Boolean} t タッチ時フラグ
     */
    function directHit(e, tstart) {
        var isReset = false;
        if (tstart) {//touchstart　時
            if (me.status.nowShoot <= me.targetFace.hit.length - 1 && typeof me.targetFace.hit[me.status.nowShoot] != "undefined") { //再設定時
                me.targetFace.hit[me.targetFace.selecthit].front();
                isReset = true; //


            } else {
                var hitpoint = me.targetFace.hitgroup.circle(me.shaft_R).fill("#ffff44").stroke({
                    color: "#000",
                    width: 2
                });
                me.targetFace.hit[me.status.nowShoot] = hitpoint;
            }
            me.status.mousemode.x=-1;
            me.status.mousemode.y=-1;
        }
        var isTouch = false;

        if (e.type == "touchmove" || e.type == "touchstart") isTouch = true;
        var tim = ($('body').css('zoom')) ? $('body').css('zoom') : 1;

        var touchX = isTouch ? e.originalEvent.changedTouches[0].clientX : e.clientX;
        var touchY = isTouch ? e.originalEvent.changedTouches[0].clientY : e.clientY;

        //console.log(touchX);
        touchX = cal(touchX, tim, "/");
        touchY = cal(touchY, tim, "/");
        //console.log(tim);

        if (storageCTRL.isUseGap() && isTouch) {
            touchY = cal(touchY,cal(cal(60,storageCTRL.getGapRange(),"*"),100,"/"),"-");
            //touchY -= 60 * storageCTRL.getGapRange() / 100;
        }

        var center = {};
        center.left = cal(cal(are.width(),2,"/"),are.offset().left,"+");
        center.top = cal(cal(are.height(),2,"/"),are.offset().top,"+");
        /*
        center.left = are.width() / 2 + are.offset().left;
        center.top = are.height() / 2 + are.offset().top;
        */
        //タッチ位置のフェースレイヤ面座標(px
        var touchXonFacePx = cal(touchX,are.offset().left,"-");
        var touchYonFacePx = cal(touchY,are.offset().top,"-");
        /*
        var touchXonFacePx = (touchX - are.offset().left);
        var touchYonFacePx = (touchY - are.offset().top);*/
        if (isTouch && isReset && tstart) {//mousemode
            me.status.mousemode.x = touchXonFacePx;
            me.status.mousemode.y = touchYonFacePx;            me.status.mousemode.touchX=parCtoPx(parseFloat(me.targetFace.hit[me.targetFace.selecthit].attr("touchX")));      me.status.mousemode.touchY=parCtoPx(parseFloat(me.targetFace.hit[me.targetFace.selecthit].attr("touchY")));
            
console.debug(touchXonFacePx+":"+touchYonFacePx+"-"+me.status.mousemode.touchX+":"+me.status.mousemode.touchY);
            return; }
        if(isTouch && me.status.mousemode.x>=0){
            //console.debug((touchXonFacePx-me.status.mousemode.x)+':'+(touchYonFacePx-me.status.mousemode.y));
            //return;
            touchXonFacePx=cal(cal(touchXonFacePx,me.status.mousemode.x,"-"),me.status.mousemode.touchX,"+");
            touchYonFacePx=cal(cal(touchYonFacePx,me.status.mousemode.y,"-"),me.status.mousemode.touchY,"+");
            //me.status.mousemode.x=touchXonFacePx;
            //me.status.mousemode.y=touchYonFacePx;
            console.debug(touchXonFacePx);
        }
        
        function parCtoPx(num) {//パーセントをpxに
            return cal(cal(num ,are.width(),"*"),100,"/"); 
        }
        

        //rFromCenterPX　斜辺の長さ（ｐｘ
        var rFromCenterPX = Math.sqrt(cal(Math.pow(cal(touchX,center.left,"-"), 2), Math.pow(cal(touchY,center.top,"-"), 2),'+'));
        //移動範囲ロックフラグ
        var lock = false;
        //ログから指定矢の得点取得
        var shotval = me.contents.scoreLog[me.status.nowRound][me.status.nowEnd][me.status.nowShoot];
        if (shotval !== 0 && me.targetFace.faceLock) {
            lock = true;
        }
        var rad, shortR, longR, rFromCenterPercent, tox, toy;
        var arrowR = parseFloat(me.targetFace.hit[me.targetFace.selecthit].attr("rx"));
        //描画ターゲット面の最高得点最低得点取得
        var highestVal = me.targetFace.targetCircle[0].pointval;
        var lowestVal = me.targetFace.targetCircle[me.targetFace.targetCircle.length - 1].pointval;
        if (lock) {
            rad = Math.atan2(touchX - center.left, touchY - center.top);//角度産出
            //console.debug((rad * 360/(2*Math.PI))+"rad");
            if (shotval != -1) {
                shortR = getR(shotval + 1) + ((highestVal != shotval) ? arrowR + 0.5 : 0); //内側のリング指定）＋矢の半径＋ラインすきま
                longR = getR(shotval) + arrowR; //外系限界半径＋シャフト軽
            } else {
                shortR = getR(lowestVal) + arrowR + 0.6;
                longR = 200;
            }
            rFromCenterPercent = cal(cal(rFromCenterPX,are.width(),"/"), 100,"*"); //ターゲット中心とカーソルとの斜辺パーセント
            console.debug(longR+"ll"+rFromCenterPercent+"%R");
            if (rFromCenterPercent < shortR || rFromCenterPercent > longR) {
                if (rFromCenterPercent < shortR) {
                    toy = Math.cos(rad) * shortR + 50;
                    tox = Math.sin(rad) * shortR + 50;
                } else if (rFromCenterPercent > longR) {
                    toy = Math.cos(rad) * longR + 50;
                    tox = Math.sin(rad) * longR + 50;
                }
            } else {
                tox = touchXonFacePx / are.width() * 100;
                toy = touchYonFacePx / are.height() * 100;
            }
        } else {
            tox = cal(cal(touchXonFacePx,are.width(),"/"),100,"*");
            toy = cal(cal(touchYonFacePx,are.height(),"/"),100,"*");
        }
//console.debug(touchXonFacePx);
        me.targetFace.hit[me.targetFace.selecthit].center(tox + "%", toy + "%");
        directMagnifyPos(tox, toy);
        //me.magnifyPosition(lrtb);
        magni.css({
            left: 75 - tox / 100 * are.width() * 2 + "px",
            top: 75 - toy / 100 * are.height() * 2 + "px"
        });
        me.targetFace.score = getScore();
        $("#magnum").text(me.code2score(me.targetFace.score));
    }



    function directMagnifyPos(tox, toy) {
        var lrtb = ""
        if (tox < 45 && toy < 45) {
            lrtb = "r";
        } else {
            lrtb = "l";
        }
        lrtb += "t";
        me.magnifyPosition(lrtb);
    }
    //指定面のターゲット得点値リングの半径取得
    function getR(num) {
        for (var i = 0; i < me.targetFace.targetCircle.length; i++) {
            if (me.targetFace.targetCircle[i].pointval == num) {
                return me.targetFace.targetCircle[i].radiusval;
            }
        }
        return -1;
    }

    function getScore() {
        var assR = parseFloat(me.targetFace.hit[me.targetFace.selecthit].attr("rx"));
        assR *= 100;
        var assL = parseFloat(me.targetFace.hit[me.targetFace.selecthit].attr("touchX")) - 50;
        assL = Math.abs(assL);
        assL = Math.floor(assL *= 100);

        var assT = parseFloat(me.targetFace.hit[me.targetFace.selecthit].attr("touchY")) - 50;
        assT = Math.abs(assT);
        assT = Math.floor(assT *= 100);
        var c = Math.sqrt(Math.pow(assL, 2) + Math.pow(assT, 2));
        var num = 0;
        for (var i = 0; i < me.targetFace.targetCircle.length; i++) {
            if (me.targetFace.targetCircle[i].radiusval * 100 + assR >= c) {
                num = parseInt(me.targetFace.targetCircle[i].pointval)
                return num;
                break;
            }
        }
        if (i >= me.targetFace.targetCircle.length) {
            return -1;
        }
    }

    function setHitLog() {
        var tararr = me.contents.hitLog[me.status.nowRound][me.status.nowEnd][me.status.nowShoot];
        tararr.x = parseFloat(me.targetFace.hit[me.targetFace.selecthit].attr("touchX"));
        tararr.y = parseFloat(me.targetFace.hit[me.targetFace.selecthit].attr("touchY"));
        tararr.r = parseFloat(me.targetFace.hit[me.targetFace.selecthit].attr("rx"));
    }

    function par2val(par, k) {
        if (k == "y") {
            return par / 100 * are.height();
        } else {
            return par / 100 * are.width();
        }
    }

    function val2par(val) {
        return val / are.width() * 100;
    }
}

//合計表示画面内のｈｔｍｌｒ
/**
 * カード画面作成
 */
ScoreCTRL.prototype.buildScoreCard = function () {
        var me = this;
        var tmpHTML = '<div class = "score_line_table"><div class="table_hr" ';

        var tmpHTML2 = '><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div></div></div>';

        var round = "";
        var $listhtml = $('<div id="card_wrapper">');
        for (var s = 0; s < this.gameconfig.timeOfRound; s++) {
            for (var i = 0; i < this.gameconfig.timeOfEndParRound; i++) {
                round += tmpHTML + 'round="' + s + '" end="' + i + '"' + tmpHTML2;
            }
            round = '<div class="round_title">' + getRoundTitle(this, s) + '</div><div class="roundlist" round="' + s + '">' + round + '</div><div class="x10"></div>'
            $listhtml.append('<div class="slick_target"><div class="slick_item slick_list">' + round + '</div><div class="slick_item"><div class="roundface" id="layerbase' + s + '"><canvas id="faceCanvas' + s + '" width="350" height="350"></canvas></div><div class="sliders"></div><div class="slider_endnum"></div></div></div> ');
            round = "";
        }
        var $slider = $listhtml.find(".slick_item .sliders");
        for (s = 0; s < $slider.length; s++) {

            //スライダー設置
            noUiSlider.create($slider[s], {
                start: 0,
                step: 10,
                range: {
                    'min': 0,
                    'max': this.gameconfig.timeOfEndParRound * 10
                }
            });
            $slider[s].noUiSlider.on("update", showHitOfEnd($listhtml.find("#layerbase" + s), $($listhtml.find(".slider_endnum")[s]), $slider[s]));
        }
        //スライダーコールバック
        function showHitOfEnd(tar, endnum, sl) {
            var $tar = tar;
            var sl = sl;
            var $endnum = endnum
            return function () {
                var $lays = $tar.find(".arrowLayer");
                var targetlay = sl.noUiSlider.get() / 10 - 1;
                for (var i = 0; i < $lays.length; i++) {
                    if (targetlay == -1) {
                        $($lays[i]).show();
                        $endnum.html("");
                        continue;
                    }
                    if (i == targetlay) {
                        $($lays[i]).show();
                        $endnum.html("").html('<span style="font-size:14px;font-weight:400;">End</span>' + (i + 1));
                    } else {
                        $($lays[i]).hide();
                    }
                }
            }
        }

        //カード内得点セルでのイベント設置
        $listhtml.find(".table_hr").each(function (index) {
            $(this).on('click', function () {
                me.reinput(parseInt($(this).attr("round")), parseInt($(this).attr("end")));
                me.logExtraction();
                me.transScoreCell(true);
            });
        });

        $("#endlist").html("");
        $("#endlist").html($listhtml);
        //slick boot
        $('.slick_target').slick({
            dots: false,
            draggable: true,
            arrows: false,
            accessibility: false,
            edgeFriction: 0.05,
            mobileFirst: true,
            speed: 200,
            cssEase: "cubic-bezier(.13, .51, .26, .97)",
            infinite: false
        });

        //無理くりフリック検知
        function flickTest() {
            this.s = 0;
            this.istouch = false;
            this.direction = ""
            this.checker = function (ev) {
                var ee = this.istouch ? ev.originalEvent.changedTouches[0].pageX : ev.pageX;
                var k = (ee - this.s) / $(window).width();
                if (k > 0.4 && this.direction == "right") {
                    onsenCTRL.myNavi.popPage();
                    console.log("flicked");
                }
                //console.log(k);
                this.s = 0

            }

            this.setS = function (ev) {
                if (ev.originalEvent.changedTouches) {
                    this.istouch = true;
                } else {
                    this.istouch = false;
                }
                this.s = this.istouch ? ev.originalEvent.changedTouches[0].pageX : ev.pageX;
            }
            this.setEdgeDirection = function (d) {
                this.direction = d;
            }
        }

        var ch = new flickTest()
        $('.slick_target').on("edge", function (e, slick, direction) {
            console.log(direction);
            ch.setEdgeDirection(direction);
        });

        $('.slick_target').on("touchstart mousedown", function (e) {
            ch.setS(e);
            //console.log(e);
        });

        $('.slick_target').on("touchend mouseup", function (e) {
            ch.checker(e);
            //console.log(e);
        });

        this.setIndicator(0);
    }
    /**
     * ログのストレージ
     */

ScoreCTRL.prototype.inputLog2scorecard = function () {
    var $round = $("#scorenote_wrapper .roundlist");
    var $x10s = $("#card_wrapper .x10");
    var x10obj = {};
    var me = this;
    for (var i = 0; i < this.gameconfig.timeOfRound; i++) {
        for (var s = 0; s < this.gameconfig.timeOfEndParRound; s++) {
            $($($round.get(i)).find(".table_hr").get(s)).find("div").each(function (index) {
                $(this).html("");
                if (index < me.gameconfig.timeOfShootEnd) {
                    if (me.contents.hitLog[i][s][index].x) {
                        $(this).addClass("hitloged");
                    } else {
                        $(this).removeClass("hitloged");
                    }
                }
                if (me.contents.scoreLog[i][s][index] == 0) {
                    $(this).text(" ");
                } else {
                    if (index < me.gameconfig.timeOfShootEnd) {
                        $(this).text(me.code2score(me.contents.scoreLog[i][s][index]));
                    } else if (index == 6) {
                        $(this).text(me.endCounter(i, s));
                    } else if (index == 7) {
                        $(this).text(me.subtotalRound(i, s));
                        if (me.contents.lock[i][s]) {
                            $(this).addClass("endlocked");
                        } else {
                            $(this).removeClass("endlocked");
                        }
                    } else { //エンド中６射以下の場合（インドア
                        $(this).addClass("voidcell");
                    }
                }

            });
        }
        x10obj = this.get910x(i);
        $($x10s.get(i)).html('X:' + x10obj.x + " 10:" + (x10obj.x + x10obj.ten) + " 9:" + x10obj.nine);
    }
    x10obj = this.get910x();
    $("#scorelist_footer .x109").html('X:' + x10obj.x + " 10:" + (x10obj.x + x10obj.ten) + " 9:" + x10obj.nine);
    $("#scorelist_footer .totalscore").text(me.subtotalRound());
}


/**
 * キャンバスターゲットログ（ラウンド記録）の画像を作成設置
 */


ScoreCTRL.prototype.setArrow2canvas = function () {
        for (var roundNum = 0; roundNum < this.gameconfig.timeOfRound; roundNum++) {
            for (var i = 0; i < this.gameconfig.timeOfEndParRound; i++) {
                if ($('#arrows' + roundNum + '_' + i).length == 0) {
                    $("#layerbase" + roundNum).append('<canvas class="arrowLayer" id="arrows' + roundNum + '_' + i + '" width="350" height="350"></canvas>');
                }
                var stage = new createjs.Stage("arrows" + roundNum + '_' + i);
                stage.removeAllChildren();
                for (var e = 0; e < this.contents.hitLog[roundNum][i].length; e++) {
                    if (this.contents.hitLog[roundNum][i][e].x) {
                        var shape = new createjs.Shape();
                        shape.graphics.beginFill("#e65858")
                            .beginStroke("#ffffff")
                            .drawCircle(0, 0, calcPar(this.contents.hitLog[roundNum][i][e].r));
                        shape.x = calcPar(this.contents.hitLog[roundNum][i][e].x);
                        shape.y = calcPar(this.contents.hitLog[roundNum][i][e].y);
                        stage.addChild(shape);
                    }
                }

                stage.update();
            }
        }

        function calcPar(numr) {
            return 350 / 100 * numr;
        }
    }
    /**
     * キャンバスにターゲットフェースを描画する
     * @param   {Number} roundNum 対象表示ラウンド
     */

ScoreCTRL.prototype.targetMakerOnCanvas = function () {
    //レイヤー作成

    var STAGE_WIDTH = 350; //canvasのサイズpx
    var targetparam = {};


    var colorset = {
        target: {
            p1: ["#fff", "#000"],
            p2: ["#fff", "#000"],
            p3: ["#000", "#fff"],
            p4: ["#000", "#fff"],
            p5: ["#586ee6", "#000"],
            p6: ["#586ee6", "#000"],
            p7: ["#e65858", "#000"],
            p8: ["#e65858", "#000"],
            p9: ["#e6e658", "#000"],
            p10: ["#e6e658", "#000"],
            p11: ["#e6e658", "#000"]
        }
    };
    var isIndoor = false;
    switch (this.gameconfig.targettype) {
    case "1-10":
        targetparam = {
            face: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            maxr: 90,
            step: 9,
            color: "target"
        }
        break;
    case "5-10":
        targetparam = {
            face: [5, 6, 7, 8, 9, 10, 11],
            maxr: 90,
            step: 15,
            color: "target"
        }
        break;
    case "3spot":
        isIndoor = true;
        targetparam = {
            face: [6, 7, 8, 9, 10],
            maxr: 90,
            step: 18,
            color: "target"
        }
    }
    var xr = 0;


    for (var r = 0; r < this.gameconfig.timeOfRound; r++) {
        maketarget.call(this, r);
    }

    function maketarget(roundNum) {
        var stage = new createjs.Stage("faceCanvas" + roundNum);
        xr = 0;
        stage.removeAllChildren();
        for (var i = 0; i < targetparam.face.length; i++) {
            if (targetparam.face[i] == 11) {
                xr = targetparam.step / 2;
            }

            if (isIndoor && (targetparam.face[i] == 10)) {
                if (this.gameconfig.bowtype == "Compound") {
                    xr -= targetparam.step / 2;
                }
            }

            function calcCircle(targetp, inum, xr) {
                var ret = STAGE_WIDTH / 2 / 100 * (targetp.maxr - (targetp.step * inum) + xr);
                // console.log(ret);
                return ret;
            }

            var shape = new createjs.Shape();
            shape.graphics.beginFill(colorset[targetparam.color]["p" + targetparam.face[i]][0])
                .beginStroke("rgba(0,0,0,0.4)")
                .drawCircle(0, 0, calcCircle(targetparam, i, xr));
            shape.x = STAGE_WIDTH / 2;
            shape.y = STAGE_WIDTH / 2;
            stage.addChild(shape);
        }

        stage.update();

    }
}



/**
 * スプラッシュタイトル表示処理
 * @param {Boolean} false で表示　trueで初期化
 */

ScoreCTRL.prototype.showEndCover = function (b) {
        if (!b) {
            if (onsenCTRL.carousel.getActiveCarouselItemIndex() == 0) {
                $("#scorebook_body").hide();
            }
            var tmp = getRoundTitle(this, this.status.nowRound) + " END:" + (this.status.nowEnd + 1);
            if (this.contents.lock[this.status.nowRound][this.status.nowEnd]) {
                tmp = tmp + '<br><ons-icon class="ons-icon ons-icon--ion ion-locked" style="font-size: 30px;"></ons-icon>';
            }
            $("#end_cover .end_inner").html("").html(tmp);
            if ($("#end_cover").is(':hidden')) {
                $("#end_cover").show();
            }

            setTimeout(function () {
                $("#end_cover").fadeOut(300, function () {
                    $("#scorebook_body").show();
                });
            }, 300);

        } else {
            $("#end_cover .end_inner").html("");
        }
    }
    /**
     * カルーセル移動
     * @param {Boolean} direct true:入力面 false:カード面
     */

ScoreCTRL.prototype.transScoreCell = function (direct) {
        var me = this;
        if (!direct) {
            this.showEndCover(true);

            $("#end_cover").show();
            onsenCTRL.carousel.first();
            me.scoreboxHeaderInfo(false);
        } else {
            this.showEndCover(false);
            onsenCTRL.carousel.last();
            this.scoreboxHeaderInfo(true);
        }
    }
    //todo　撮影関連
    /**
     * グローバル変数verificationImage　に参照画像を読み込む
     * @param {Object}   reader 読み込んだ画像リーダーおぶじぇくと
     */
ScoreCTRL.prototype.reader2variable = function (reader) {
    var me = this;
    verificationImage = new Image();
    verificationImage.src = reader.result;
    $(verificationImage).load(function (e) {
        //console.log(verificationImage.src);
        $(verificationImage).unbind("load");
        me.showReferencePhoto(true);
    });
}
ScoreCTRL.prototype.image2variable = function (img) {
        verificationImage = new Image();
        verificationImage.src = img;
    }
    /**
     * 確認画像画面の生成・表示
     * @param   {Boolean} returnImage 送信したイメージを縮小で受ける場合true
     * @returns {Boolean}  [[Description]]
     */

ScoreCTRL.prototype.showReferencePhoto = function (returnImage) {

    if (verificationImage.src) {
        $('#cameraimage').hide();
    } else {
        $('#cameraimage').show();
    }
    var $inf = {};
    if (this.refPhotoIframe) { //既にiframeあったら。
        $("#reference_photo").show();
        return false;
    }

    $inf = $("<iframe></iframe>", {
        id: "zoomer",
        css: {
            border: "none"
        }
    });
    $inf.css({
        margin: 0,
        width: "100%",
        height: '100%'
    })

    $inf.load(function (e) {
        if ($inf.get(0).contentWindow.setImageInit) {
            $inf.get(0).contentWindow.setImageInit(verificationImage, returnImage);
        }
    });
    $("#reference_photo").html("").append($inf).show();
    if (this.iframeUnit.length > 0) {
        $inf.get(0).contentDocument.open();
        $inf.get(0).contentDocument.write(this.iframeUnit);
        $inf.get(0).contentDocument.close();
    } else {
        $inf.attr("src", "photoviewer.html");
    }
    this.refPhotoIframe = $inf;
}
ScoreCTRL.prototype.hideReferencePhoto = function () {
    $("#reference_photo").hide();
}
ScoreCTRL.prototype.setOpacity2target = function (num, boolean) {
    var opa = this.TARGET_TRANSPARENT;
    if (typeof num == 'number') {
        opa = num;
        if (boolean) {
            this.status.opacity_range = opa;
        }
    }
    this.targetFace.group.attr("opacity", opa);

}
ScoreCTRL.prototype.setCropImage = function (img) {
    this.cropImage = img;
    console.log("image croped");
    this.setTargetBackground();
}
ScoreCTRL.prototype.setTargetBackground = function () {
    if (this.cropImage.src) {
        $("#target_background").css("background-image", "url(" + this.cropImage.src + ")");
        this.setOpacity2target(this.status.opacity_range);
        this.hideReferencePhoto();
        this.status.hasTargetBackground = true;
    } else {
        console.log("no image:target background");
        return false;
    }
}
ScoreCTRL.prototype.clearTargetBackground = function () {
    this.status.hasTargetBackground = false;
    $("#target_background").css("background-image", "none");
    this.setOpacity2target(1);
    $('#target_overlay_ui_wrapper').hide()
}