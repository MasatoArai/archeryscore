        function getRoundTitle(scorectrl, roundNum) { //ラウンドタイトルの表示文字列取得
            return scorectrl.gameconfig.gametype.roundName[roundNum];
        }

        function getDateCode(tag) {
            if (typeof tag === "undefined") {
                return false;
            } else {
                return retVal.call(this, tag);
            }

            function retVal(t) {
                var dd, dates, time, cnf;
                dd = new Date(t);
                dates = dd.toLocaleDateString();
                time = dd.toLocaleTimeString();
                return dates + " / " + time;
            }
        }

        function conversionGeoLocation(obj) {
            if ((typeof obj == "object") && (obj.latitude)) {
                var geocode = (obj.formatted_address == "undefined") ? "" : obj.formatted_address;
                return geocode + "[latlng:" + obj.latitude + "," + obj.longitude + "]";
            } else {
                return "noGPS";
            }
        }

        function conversionArrowType(code) {
            switch (code) {
            case "Fat":
                return "ファットシャフト";
                break;
            case "Narrow":
                return "ナローシャフト";
                break;
            }
        }




        function mergeObj(obj1, obj2) {
            if (!obj2) {
                obj2 = {};
            }
            for (var attrname in obj2) {
                if (obj2.hasOwnProperty(attrname)) {
                    obj1[attrname] = obj2[attrname];
                }

            }
        }

        function dbconsole(o) {
            var message = (typeof o !== "string") ? JSON.stringify(o) : o;
            var target = $("#debugconsole");
            if (target.length == 0) {
                console.log(message);
            } else {
                target.html(message + target.html());
            }
        }

function cal(a,b,mode){
    var deci = 4;
    var aa,bb;
    var ans=0;
    aa=a;
    bb=b;
    for(var i=0;i<deci;i++){
        aa=aa*10;
        bb=bb*10;
    }
    aa=Math.round(aa);
    bb=Math.round(bb);
    switch(mode){
        case "+":
            ans=Math.round(aa+bb);
            for(i=0;i<deci;i++){
                ans=ans/10;
            }
            break;
        case "-":
            ans=Math.round(aa-bb);
            for(i=0;i<deci;i++){
                ans=ans/10;
            }
            break;
        case "*":
            ans=Math.round(aa*bb);
            for(i=0;i<deci*2;i++){
                ans=ans/10;
            }
            break;
        case "/":
            ans=aa/bb;
            break;
    }
    return ans;
}