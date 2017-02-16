function GameConfCTRL() {
    this.infoObj = storageCTRL.getUserInfo();
}
GameConfCTRL.prototype.setinfo = function (obj) {
    this.infoObj = obj;
};
GameConfCTRL.prototype.getinfo = function () {
    this.infoObj = storageCTRL.getUserInfo();
    return this.infoObj;
};
GameConfCTRL.prototype.biasBowTYpe = function(){
    return this.infoObj.bow;
};
GameConfCTRL.prototype.biasTargetTypeByGameType = function (bowtype,gametype) {
    var bow = "";
    if(typeof bowtype === "string"){
        bow = bowtype;
    }else{
        bow = this.infoObj.bowtype;
    }
    var game = gametype;
    switch (game) {
        case "50mW":
        switch (bow) {
            case "Compound":
            return "5-10";
            break;
            case "ReCurve":
            return "1-10";
            break;
            case "BearBow":
            return "1-10";
        }
        break;
        case "70mW":
        return "1-10";
        break;
            case "single":
        return "1-10";
        break;
        case "360":
        return "1-10";
        break;
            case "18mIndoor":
        return "3spot"
        break;
        default:
        return "1-10";
        break;
    }
};