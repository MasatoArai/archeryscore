var wwidth, wheight, iwidth, itop, ileft, orientation;
$(document).ready(function () {
    wwidth = $(window).width();
    wheight = $(window).height();
    iwidth = wwidth * 0.9;
    itop = (wheight - iwidth) / 2;
    ileft = (wwidth - iwidth) / 2;
    var str = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ' + wwidth + ' ' + wheight + '"><path fill="rgba(0,0,0,0.6)" d="M0,0v' + wheight + 'h' + wwidth + 'V0H0zM' + ((wwidth + iwidth) / 2) + ',' + ((wheight + iwidth) / 2) + 'H' + ileft + 'V' + itop + 'h' + iwidth + 'v' + ((wheight + iwidth) / 2) + 'z"></path><rect x="' + ileft + '" y="' + itop + '" fill="none" stroke="#000" stroke-width="2" stroke-miterlimit="10" width="' + iwidth + '" height="' + iwidth + '"></rect>' +
        '<circle cx="' + (wwidth / 2) + '" cy="' + (wheight / 2) + '" r="' + (iwidth * 0.45) + '" stroke="#000" stroke-width="2" fill="none"></circle>' +
        '<line x1="' + ileft + '" y1="' + (wheight / 2) + '" x2="' + ((wwidth + iwidth) / 2) + '" y2="' + (wheight / 2) + '" stroke-width="2" stroke-dasharray="5 5" stroke="#000"></line>' +
        '<line x1="' + (wwidth / 2) + '" y1="' + itop + '" x2="' + (wwidth / 2) + '" y2="' + ((wheight + iwidth) / 2) + '" stroke-width="2" stroke-dasharray="5 5" stroke="#000"></line>' +
        '</svg>';
    $("#waku").append(str).hide();
    $('#incameraimage').on("change", function () {
        var reader = new FileReader();
        reader.onload = function (e) {
                var verificationImage = new Image();
                verificationImage.src = reader.result;
                $(verificationImage).load(function (e) {
                    setImageInit(verificationImage,true);
                });
            //parent.scoreCTRL.image2variable(reader, true);
        }
        var imgfile = $('#incameraimage').get(0).files[0];
        reader.readAsDataURL(imgfile);
    });
});

function setImageInit(img,returnImage) {
    var MAXWIDTH = 1920;
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    var t;
    if(w>h){
        t=MAXWIDTH/w;
        w=t*w;
        h=t*h;
    }else{
        t=MAXWIDTH/h;
        w=t*w;
        h=t*h;
    }
    var o = getOrientation(img.src);
    orientation = o;
    var $c = $("<canvas></canvas>");

    $("#stage canvas").remove();

    var context;
    if (o == 6 || o == 8) {
        $c.attr({
            "width": h,
            "height": w
        });
        context = $c.get(0).getContext('2d');
        context.save();
        context.translate(h / 2, w / 2);
        switch (o) {
        case 6:
            context.rotate(90 * Math.PI / 180);
            break;
        case 8:
            context.rotate(270 * Math.PI / 180);
            break;
        }
        context.translate(-(w / 2), -(h / 2));
        context.drawImage(img, 0, 0, w, h);
        context.restore();
    } else {
        $c.attr({
            "width": w,
            "height": h
        });
        context = $c.get(0).getContext('2d');
        context.save();
        context.translate(w / 2, h / 2);
        switch (o) {
        case 1:
            //context.translate(0,0);
            break;
        case 3:
            context.rotate(180 * Math.PI / 180);
            break;
        }
        context.translate(-(w / 2), -(h / 2));
        context.drawImage(img, 0, 0, w, h);
        context.restore();
    }

    $("#stage").append($c);
    if(returnImage){
        parent.scoreCTRL.image2variable($c[0].toDataURL("image/jpeg",0.7));
    }
    zoomInit($c);
}

function zoomInit(img) {
    var kk;
    if (parseFloat(img.attr("width")) < parseFloat(img.attr("height"))) {
        kk = $(window).width() / parseFloat(img.attr("width"));
    } else {
        kk = $(window).height() / parseFloat(img.attr("height"));
    }

    //translate(-1px, 0px) scale(0.3, 0.3);
    $("canvas").css({
        "transform-origin": "0 0",
        transform: "translate(0px, 0px) scale(" + kk + ", " + kk + ")"
    });
    var zoom = d3.behavior.zoom()
        .scale(kk)
        .scaleExtent([.1, 10])
        .on("zoom", zoomed);

    var svg = d3.select("#stage")
        .call(zoom);


    function zoomed() {
        var t = "translate(" + d3.event.translate[0] + 'px,' + d3.event.translate[1] + "px) " +
            "scale(" + d3.event.scale + ',' + d3.event.scale + ")";
        d3.select("canvas")
            .style("transform-origin", "0 0")
            .style("-moz-transform-origin", "0 0")
            .style("-webkit-transform-origin", "0 0")
            .style("-o-transform-origin", "0 0")
            .style("-ms-transform-origin", "0 0")
            .style("transform", t)
            .style("-moz-transform", t)
            .style("-webkit-transform", t)
            .style("-o-transform", t)
            .style("-ms-transform", t);
    }
}

function toggleWaku() {
    $("#waku").toggle();
    $("#bottomuibase2").toggle();
    var img = $("#stage img").get(0);
}

function cropDo() {
    $("#progres").show();
    var target = $("#stage canvas").get(0);
    var ori = orientation;
    var tmpcanvas = $("<canvas></canvas>").attr({
        "width": iwidth,
        "height": iwidth
    });
    var context = tmpcanvas[0].getContext('2d');
    var mtrxparam = $("#stage canvas").css("transform");
    //var gap = [0,0,0,0];
    console.debug(mtrxparam);
    mtrxparam = mtrxparam.substring(mtrxparam.indexOf('(') + 1, mtrxparam.indexOf(')'));
    var mtrx = mtrxparam.split(",");
    $.each(mtrx, function (i, v) {
        mtrx[i] = parseFloat(v);
    });

    var imageRate = 1 / mtrx[0];
    var cimage = new Image();
    var tmpimage = new Image();
    tmpimage.src = target.toDataURL()
    $(tmpimage).one("load",function(){
    context.drawImage(tmpimage,
        0,
        0,
        target.width,
        target.height,
        mtrx[4] - ileft,
        mtrx[5] - itop, (target.width * mtrx[0]), (target.height * mtrx[3]));

    cimage.src = tmpcanvas[0].toDataURL();
    parent.scoreCTRL.setCropImage(cimage);
        
    $("#progres").hide();
    });
}

function getOrientation(imgDataURL) {
    var byteString = atob(imgDataURL.split(',')[1]);
    var orientaion = byteStringToOrientation(byteString);
    return orientaion;
    function byteStringToOrientation(img) {
        var head = 0;
        var orientation;
        while (1) {
            if (img.charCodeAt(head) == 255 & img.charCodeAt(head + 1) == 218) {
                break;
            }
            if (img.charCodeAt(head) == 255 & img.charCodeAt(head + 1) == 216) {
                head += 2;
            } else {
                var length = img.charCodeAt(head + 2) * 256 + img.charCodeAt(head + 3);
                var endPoint = head + length + 2;
                if (img.charCodeAt(head) == 255 & img.charCodeAt(head + 1) == 225) {
                    var segment = img.slice(head, endPoint);
                    var bigEndian = segment.charCodeAt(10) == 77;
                    if (bigEndian) {
                        var count = segment.charCodeAt(18) * 256 + segment.charCodeAt(19);
                    } else {
                        var count = segment.charCodeAt(18) + segment.charCodeAt(19) * 256;
                    }
                    for (i = 0; i < count; i++) {
                        var field = segment.slice(20 + 12 * i, 32 + 12 * i);
                        if ((bigEndian && field.charCodeAt(1) == 18) || (!bigEndian && field.charCodeAt(0) == 18)) {
                            orientation = bigEndian ? field.charCodeAt(9) : field.charCodeAt(8);
                        }
                    }
                    break;
                }
                head = endPoint;
            }
            if (head > img.length) {
                break;
            }
        }
        console.debug(orientation);
        return orientation;
    }
}