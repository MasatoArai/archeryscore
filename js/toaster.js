function toaster(){
    this.waitingCount=0;
    this.toastElement = $('<div style="max-width:80%;color:white;position:absolute;background-color:rgba(0,0,0,0.7);border-radius:10px;padding:14px;font-size:14px;bottom:10%;opacity:0;-webkit-box-shadow:rgba(0,0,0,0.4 0px 0px 9px 3px);z-index:500;margin:0 auto"></div>');
    this.inAction = false;
    this.waitAction = [];
}

toaster.prototype.showToast = function ( message,msecond,Lapped){
    var me = this;
    if((this.inAction)&&(!Lapped)){
        this.waitAction.push({
            message:message,
            msecond:msecond
        });
        this.waitingCount++;
        return;
    }
    this.toastElement.html(message);
    $("body").append(this.toastElement);
    this.toastElement.css("left",($("body").width()-this.toastElement.outerWidth())/2+"px");
    this.toastElement.hide();
    this.toastElement.css("opacity",1);
    this.inAction = true;
    this.toastElement.fadeIn(500,function(){
        setTimeout(function(){
            me.toastElement.fadeOut(500,function(){
                me.toastElement.remove();
                if(me.waitingCount>0){
                    me.showToast(me.waitAction[me.waitAction.length-me.waitingCount].message,
                                me.waitAction[me.waitAction.length-me.waitingCount].msecond,
                                true);
                    me.waitingCount-=1;
                }else{
                    me.waitAction=[];
                    me.inAction=false;
                }
            });
        },msecond);
    });
};