(function (lib, img, cjs) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 300,
	height: 170,
	fps: 40,
	color: "#333333",
	manifest: []
};

// stage content:
(lib.名称未設定1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// レイヤー 15
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("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");
	this.shape.setTransform(193.9,88.3);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(40));

	// レイヤー 14
	this.instance = new lib.シンボル2("synched",0);
	this.instance.setTransform(233.6,56.9,0.659,0.659,0,0,0,292.7,33.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(40));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(186.5,119.8,232.9,87.6);


// symbols:
(lib.sippo = function() {
	this.initialize();

	// レイヤー 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AnLSOICAh1Qg/hMiTlFQiVlQAAozQAAoDDHjPQDLjAEgABQEggBDNDAQDGDPAAIDQAAIziVFQQiTFFg/BMICAB1g");
	this.shape.setTransform(-4.2,-179.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AHMUBIiAh1QA/hMCTlFQCVlQAAozQAAoDjGjPQjNjAkgABQkggBjLDAQjHDPAAIDQAAIzCVFQQCTFFA/BMIiAB1IiAB0QhXhai2mRQi0mFAAqNQAAq/E0kOIAAgBQEtkdGrgBQGrABEvEdIAAABQEzEOAAK/QAAKNi0GFQi2GRhXBag");
	this.shape_1.setTransform(-4.2,-191.4);

	this.addChild(this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-108,-331.1,207.5,279.4);


(lib.kintama = function() {
	this.initialize();

	// レイヤー 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("ABzGeIhzhiIhxBiQh1BoihgBQiwAAh7h7IAAgBQh8h8gBivQABitB8h8QB1h2ClgGIgGi9IMzAAIgDC9QCpADB5B5IgBAAQB8B8ABCtQAACwh8B8Qh8B7ivAAIgCAAQigAAh0hng");
	this.shape.setTransform(116.2,67.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AAAKXQitBpjaABQk/AAjhjhQjijhAAk/QAAk9DijhQDYjYEsgJIAFCcIAGC+QilAFh1B2Qh8B8gBCuQABCvB8B8IAAAAQB7B8CwAAQChAAB1hoIBxhhIBzBiQB1BnChAAQCvAAB8h8QB8h8AAivQgBiuh8h8IABAAQh5h5ipgDIADi9IADidQE1AGDbDcQDiDhgBE9QABE+jiDiQjhDhk+AAQjagBivhpg");
	this.shape_1.setTransform(116.2,76.9);

	this.addChild(this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,232.4,153.9);


(lib.doutai = function() {
	this.initialize();

	// レイヤー 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("A/pZTQljlSiborIAAAAQiNn0AtolQBMuhMepqIAAAAQMDpYQHARQP6ANLqJfQLyJnBJOEQAnH6iiH9QitIdlZFYQnFHBnMEBQiXBUiVA9IAAxIIjPAoQkMA3kzAAQkyAAkMg3IjQgoIAARdQpjjsp4pXgADLq4QAbAcAnAAQAnAAAcgcQAcgcAAgnQAAgngcgbIjLjLIDMjMQAbgcAAgnQAAgngbgbQgcgcgnAAQgnAAgcAcIjLDLIjKjLQgcgcgnAAQgnAAgbAcQgcAbAAAnQAAAnAcAcIDLDMIjLDKQgcAcAAAnQAAAnAcAcQAcAcAnAAQAnAAAcgcIDJjLg");
	this.shape.setTransform(299,280.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("EgJ4AsQQgTgCgRgHQsRjasrsAQmlmNi4qOQidouAxpkIAAAAQBVw1OarMQNhqgSCAQQR2ARNEKqQNqLIBPQUQAtI7i3JAQjIJ0mUGNQnrHmnyEVIABgBQkjCikeBZQgTAHgWADQgfAEgegHQgngIgfgaQgYgSgPgYQgTgfgFgkQgEgUACgTIAAuTQjRAbjjAAQjjAAjRgbIAAOiQABASgCASQgFAlgTAeQgNAWgTARIgMAKQgeAWgjAIQgTAFgUAAIgXgCgA7d9wIgBABQsdJqhNOhQgsIkCMH0IAAABQCcIqFiFTQJ4JWJkDtIAAxeIDPApQEMA2EzAAQEyAAEMg2IDQgpIAARJQCVg+CWhUQHMkBHGnBQFZlXCsodQCin+gnn5QhIuErypnQrqpgv7gNIg1AAQvmAAruJHgADKrZIjKjLIjKDLQgcAbgnAAQgnAAgbgcQgcgcAAgmQAAgnAcgcIDLjLIjMjLQgcgcAAgnQAAgnAcgcQAcgcAnAAQAnAAAcAcIDKDMIDLjMQAbgcAnAAQAnAAAcAcQAcAcAAAnQAAAngcAcIjLDLIDLDLQAbAcAAAnQAAAngbAcQgcAbgnAAQgnAAgcgbg");
	this.shape_1.setTransform(299,283.5);

	this.addChild(this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,598,566.9);


(lib.シンボル1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// kintama
	this.instance = new lib.kintama("synched",0);
	this.instance.setTransform(-536,599.5,0.284,0.284,-3.3,0,0,115.8,-0.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:116.2,regY:76.9,rotation:-0.3,x:-535.7,y:621.4},0).wait(1).to({rotation:2.7,x:-536.9},0).wait(1).to({rotation:5.6,x:-538,y:621.3},0).wait(1).to({rotation:8.3,x:-539,y:621.2},0).wait(1).to({rotation:10.6,x:-539.9,y:621.1},0).wait(1).to({rotation:12.5,x:-540.6,y:620.9},0).wait(1).to({rotation:13.9,x:-541.1,y:620.8},0).wait(1).to({rotation:14.7,x:-541.4,y:620.7},0).wait(1).to({regX:116.1,regY:0.1,rotation:15,x:-536,y:599.6},0).wait(1).to({regX:116.2,regY:76.9,rotation:14.9,x:-541.5,y:620.6},0).wait(1).to({rotation:14.5,x:-541.3,y:620.7},0).wait(1).to({rotation:13.8,x:-541.1},0).wait(1).to({rotation:12.9,x:-540.8,y:620.8},0).wait(1).to({rotation:11.7,x:-540.3,y:620.9},0).wait(1).to({rotation:10.2,x:-539.8,y:621.1},0).wait(1).to({rotation:8.5,x:-539.1},0).wait(1).to({rotation:6.5,x:-538.4,y:621.2},0).wait(1).to({rotation:4.4,x:-537.7,y:621.4},0).wait(1).to({regX:116.1,regY:0.2,rotation:2.3,x:-536,y:599.6},0).wait(1).to({regX:116.2,regY:76.9,rotation:-0.2,x:-535.9,y:621.3},0).wait(1).to({rotation:-2.8,x:-534.9,y:621.4},0).wait(1).to({rotation:-5.3,x:-533.9,y:621.3},0).wait(1).to({rotation:-7.7,x:-533,y:621.2},0).wait(1).to({rotation:-9.8,x:-532.2,y:621},0).wait(1).to({rotation:-11.6,x:-531.5,y:620.9},0).wait(1).to({rotation:-13.1,x:-531,y:620.8},0).wait(1).to({rotation:-14.2,x:-530.6,y:620.7},0).wait(1).to({rotation:-14.8,x:-530.3,y:620.6},0).wait(1).to({regX:116.1,regY:-0.1,rotation:-15,x:-536,y:599.5},0).wait(1).to({regX:116.2,regY:76.9,rotation:-14.9,x:-530.3,y:620.6},0).wait(1).to({rotation:-14.5,x:-530.4,y:620.7},0).wait(1).to({rotation:-13.9,x:-530.7},0).wait(1).to({rotation:-13,x:-531,y:620.8},0).wait(1).to({rotation:-11.9,x:-531.4,y:620.9},0).wait(1).to({rotation:-10.6,x:-531.9,y:621.1},0).wait(1).to({rotation:-9,x:-532.5},0).wait(1).to({rotation:-7.2,x:-533.2,y:621.2},0).wait(1).to({rotation:-5.3,x:-533.9},0).wait(1).to({regX:115.8,regY:-0.1,rotation:-3.3,x:-536,y:599.5},0).wait(1).to({regX:116.2,regY:76.9,rotation:-0.6,x:-535.6,y:621.4},0).wait(1).to({rotation:2.1,x:-536.7},0).wait(1).to({rotation:4.7,x:-537.7,y:621.3},0).wait(1).to({rotation:7.2,x:-538.6,y:621.2},0).wait(1).to({rotation:9.5,x:-539.5,y:621.1},0).wait(1).to({rotation:11.4,x:-540.2,y:621},0).wait(1).to({rotation:13,x:-540.7,y:620.9},0).wait(1).to({rotation:14.1,x:-541.1,y:620.8},0).wait(1).to({rotation:14.8,x:-541.4,y:620.7},0).wait(1).to({regX:116.1,regY:0.1,rotation:15,x:-536,y:599.6},0).wait(1));

	// sippo
	this.instance_1 = new lib.sippo("synched",0);
	this.instance_1.setTransform(-534.2,569.9,0.284,0.284,-4.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1).to({regX:-4.3,regY:-191.4,rotation:-11.9,x:-546.6,y:517},0).wait(1).to({rotation:-18.9,x:-553,y:518.9},0).wait(1).to({rotation:-25.4,x:-558.7,y:521.4},0).wait(1).to({rotation:-31.2,x:-563.5,y:524.1},0).wait(1).to({rotation:-36.1,x:-567.3,y:526.7},0).wait(1).to({rotation:-40,x:-570.2,y:529.1},0).wait(1).to({rotation:-42.8,x:-572.1,y:530.9},0).wait(1).to({rotation:-44.4,x:-573.2,y:532},0).wait(1).to({regX:0,regY:0,rotation:-45,x:-534.3,y:570},0).wait(1).to({regX:-4.3,regY:-191.4,rotation:-44.6,x:-573.3,y:532.2},0).wait(1).to({rotation:-43.4,x:-572.6,y:531.4},0).wait(1).to({rotation:-41.5,x:-571.2,y:530.1},0).wait(1).to({rotation:-38.7,x:-569.2,y:528.3},0).wait(1).to({rotation:-35.1,x:-566.5,y:526.2},0).wait(1).to({rotation:-30.7,x:-563.1,y:523.9},0).wait(1).to({rotation:-25.6,x:-558.9,y:521.5},0).wait(1).to({rotation:-19.8,x:-553.9,y:519.3},0).wait(1).to({rotation:-13.5,x:-548.2,y:517.4},0).wait(1).to({regX:0,regY:0,rotation:-6.8,x:-534.3,y:570},0).wait(1).to({regX:-4.3,regY:-191.4,rotation:1,x:-534.5,y:515.7},0).wait(1).to({rotation:8.8,x:-527.2,y:516.1},0).wait(1).to({rotation:16.4,x:-520.1,y:517.5},0).wait(1).to({rotation:23.4,x:-513.7,y:519.6},0).wait(1).to({rotation:29.8,x:-508.3,y:522.2},0).wait(1).to({rotation:35.1,x:-504,y:524.8},0).wait(1).to({rotation:39.4,x:-500.7,y:527.2},0).wait(1).to({rotation:42.5,x:-498.4,y:529.1},0).wait(1).to({rotation:44.4,x:-497.1,y:530.3},0).wait(1).to({regX:0,regY:0,rotation:45,x:-534.3,y:570},0).wait(1).to({regX:-4.3,regY:-191.4,rotation:44.6,x:-497,y:530.4},0).wait(1).to({rotation:43.3,x:-497.9,y:529.6},0).wait(1).to({rotation:41.1,x:-499.5,y:528.2},0).wait(1).to({rotation:37.9,x:-501.8,y:526.4},0).wait(1).to({rotation:33.9,x:-504.9,y:524.2},0).wait(1).to({rotation:29.1,x:-508.9,y:521.9},0).wait(1).to({rotation:23.4,x:-513.8,y:519.6},0).wait(1).to({rotation:17,x:-519.5,y:517.7},0).wait(1).to({rotation:10.1,x:-525.9,y:516.3},0).wait(1).to({regX:0,regY:0,rotation:2.8,x:-534.3,y:570},0).wait(1).to({regX:-4.3,regY:-191.4,rotation:-2,x:-537.3,y:515.7},0).wait(1).to({rotation:-6.7,x:-541.8,y:516.2},0).wait(1).to({rotation:-11.5,x:-546.3,y:517},0).wait(1).to({rotation:-16.3,x:-550.7,y:518.2},0).wait(1).to({rotation:-21.1,x:-555,y:519.7},0).wait(1).to({rotation:-25.8,x:-559.1,y:521.6},0).wait(1).to({rotation:-30.6,x:-563,y:523.8},0).wait(1).to({rotation:-35.4,x:-566.8,y:526.4},0).wait(1).to({rotation:-40.2,x:-570.3,y:529.3},0).wait(1).to({regX:0,regY:0,rotation:-45,x:-534.3,y:570},0).wait(1));

	// doutai
	this.instance_2 = new lib.doutai("synched",0);
	this.instance_2.setTransform(-535.2,606.6,0.284,0.269,0,0,0,298.9,283.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({_off:true},40).wait(10));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-620.1,476.2,170,206.7);


(lib.シンボル2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.play();
	}
	this.frame_39 = function() {
		this.gotoAndPlay(0);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(39).call(this.frame_39).wait(1));

	// レイヤー 1
	this.instance = new lib.シンボル1("synched",0,false);
	this.instance.setTransform(54.1,127.5,0.637,0.637,-8.2,0,0,-535.3,676.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:-535.2,regY:576.9,x:45.2,y:64.9,startPosition:1},0).wait(1).to({rotation:-8,x:45.3,y:65,startPosition:2},0).wait(1).to({rotation:-7.8,x:45.5,y:64.9,startPosition:3},0).wait(1).to({rotation:-7.5,x:45.8,startPosition:4},0).wait(1).to({rotation:-7.1,x:46.3,y:64.8,startPosition:5},0).wait(1).to({rotation:-6.6,x:46.8,y:64.7,startPosition:6},0).wait(1).to({rotation:-6.1,x:47.5,startPosition:7},0).wait(1).to({rotation:-5.4,x:48.1,startPosition:8},0).wait(1).to({rotation:-4.7,x:48.9,y:64.6,startPosition:9},0).wait(1).to({rotation:-3.9,x:49.8,y:64.5,startPosition:10},0).wait(1).to({rotation:-2.9,x:50.9,startPosition:11},0).wait(1).to({rotation:-2,x:51.9,y:64.4,startPosition:12},0).wait(1).to({rotation:-0.9,x:53.1,startPosition:13},0).wait(1).to({rotation:0.2,x:54.4,startPosition:14},0).wait(1).to({rotation:1.4,x:55.7,startPosition:15},0).wait(1).to({rotation:2.6,x:57,y:64.5,startPosition:16},0).wait(1).to({rotation:3.9,x:58.4,startPosition:17},0).wait(1).to({rotation:5.2,x:59.8,y:64.6,startPosition:18},0).wait(1).to({regX:-535.3,regY:676.3,rotation:6.5,x:54,y:127.6,startPosition:19},0).wait(1).to({regX:-535.2,regY:576.9,x:61.2,y:64.7,startPosition:20},0).wait(1).to({rotation:6.4,startPosition:21},0).wait(1).to({rotation:6.2,x:60.9,startPosition:22},0).wait(1).to({rotation:5.9,x:60.6,y:64.6,startPosition:23},0).wait(1).to({rotation:5.6,x:60.3,startPosition:24},0).wait(1).to({rotation:5.1,x:59.8,y:64.5,startPosition:25},0).wait(1).to({rotation:4.6,x:59.2,startPosition:26},0).wait(1).to({rotation:4,x:58.5,y:64.4,startPosition:27},0).wait(1).to({rotation:3.3,x:57.8,startPosition:28},0).wait(1).to({rotation:2.6,x:57,startPosition:29},0).wait(1).to({rotation:1.8,x:56.1,y:64.3,startPosition:30},0).wait(1).to({rotation:0.9,x:55.1,startPosition:31},0).wait(1).to({rotation:-0.1,x:54.1,startPosition:32},0).wait(1).to({rotation:-1.1,x:52.9,startPosition:33},0).wait(1).to({rotation:-2.2,x:51.8,startPosition:34},0).wait(1).to({rotation:-3.3,x:50.5,startPosition:35},0).wait(1).to({rotation:-4.4,x:49.2,y:64.5,startPosition:36},0).wait(1).to({rotation:-5.6,x:47.9,startPosition:37},0).wait(1).to({rotation:-6.8,x:46.6,y:64.7,startPosition:38},0).wait(1).to({regX:-535.3,regY:676.1,rotation:-8,x:54.1,y:127.5,startPosition:39},0).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-6.6,1,118.9,132.4);

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;