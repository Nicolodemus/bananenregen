// Global variables
var _canvas, _div, _loader, _stage, _graphics = {};
var _current_level = create_level(0);
var _score = 0;

/** This function is called within index.html */
function load_content() {
	_canvas = document.getElementById("main_canvas");
	_div = document.getElementById("main_div");
	resize_canvas(_canvas);
	resize_canvas(_div);
	let png_files = [
		"images/background.png", 
		"images/bananas.png", 
		"images/barrels.png", 
		"images/sky.png"
	];
	let manifest = [];
	for (const png of png_files) {
		manifest.push({ "src": png, "id": png });
	}
	_loader = new createjs.LoadQueue(false);
	_loader.addEventListener("complete", create_all);
	_loader.loadManifest(manifest, true, "./");
}

/** Create everything that will be drawn */
function create_all() {
	create_sky();
	create_background();
	create_bananas();
	create_barrels();
	create_info_text();
	create_stage();
	create_ticker();
}

function add_circle(x, y, radius) {
	let circle = new createjs.Shape();
	circle.graphics.f("rgba(0, 0, 0, 0.1)");
	circle.graphics.dc(x, y, radius);
	return circle;
}

function add_text(x, y, font_size, content) {
	let text = new createjs.Text(content, font_size+"px Arial", "#FFF");
	text.x = x;
	text.y = y;
	return text;
}

function create_sky() {
	let sky = _loader.getResult("images/sky.png");
	_graphics.sky = new createjs.Bitmap(sky);
	set_transform(_graphics.sky, scale_to_canvas(_canvas, sky, 0, 0, 1, 1));
}

function create_background() {
	let bg = _loader.getResult("images/background.png");
	_graphics.bg = new createjs.Bitmap(bg);
	set_transform(_graphics.bg, scale_to_canvas(_canvas, bg, 0, 0.75, 1, 0.25));
}

function create_bananas() {
	let frames = { 
		"regX": 0, "regY": 0, "width": 128, "height": 128, 
		"count": 6 * 8
	};
	let bananas = {
		framerate: 10,
		"images": [_loader.getResult("images/bananas.png")],
		"frames": frames,
		"animations": {
			"banana-0": 40, // no banana
			"banana-1": [ // 1 banana
				0, 7, "banana-1", 1.0
			],
			"banana-2": [ // 2 bananas
				8, 15, "banana-2", 0.8
			],
			"banana-3": [ // 3 bananas
				16, 23, "banana-3", 0.6
			],
			"banana-4": [ // golden banana
				24, 31, "banana-4", 0.4
			],
			"banana-5": [ // Zwickohr
				32, 35, "banana-5", 0.8
			]
		}
	};
	let banana_sheet = new createjs.SpriteSheet(bananas);
	_graphics.bananas = new Array();
	for (let i = 0; i < 5; i++) {
		_graphics.bananas[i] = new createjs.Sprite(banana_sheet, "banana-0");
		let bounds = _graphics.bananas[i].getBounds();
		let middle_x = 0.125 + i * 0.25;
		let radius = 0.075;
		set_transform(
			_graphics.bananas[i], 
			scale_centered(_canvas, bounds, middle_x, 0, radius)
		);
	}
}

function create_barrels() {
	let frames = {
		"regX": 0, "regY": 0, "width": 256, "height": 256,
		"count": 16
	};
	let barrels = {
		framerate: 5,
		"images": [_loader.getResult("images/barrels.png")],
		"frames": frames,
		"animations": {
			"inactive": 4,
			"active": [
				0, 3, "inactive", 1.0
			],
			"overlay": [
				8, 11, "inactive", 1.0
			],
			"success": [
				12, 15, "inactive", 2.0
			]
		}
	};
	let barrel_sheet = new createjs.SpriteSheet(barrels);
	_graphics.barrels = new Array();
	_graphics.barrels_overlay = new Array();
	_graphics.circles = new Array();
	for (let i = 0; i < 4; i++) {
		_graphics.barrels[i] = new createjs.Sprite(barrel_sheet, "inactive");
		let bounds = _graphics.barrels[i].getBounds();
		let middle_x = 0.125 + i * 0.25;
		let middle_y = 0.75;
		let radius = 0.125;
		let scale = scale_centered(_canvas, bounds, middle_x, middle_y, radius);
		set_transform(_graphics.barrels[i], scale);
		_graphics.barrels_overlay[i] = new createjs.Sprite(barrel_sheet, "inactive");
		set_transform(_graphics.barrels_overlay[i], scale);
		let circle_offset = scale.middleX;
		_graphics.circles[i] = add_circle(circle_offset, scale.middleY, scale.w/2.0);
		_graphics.circles[i].on("mousedown", function(e) {
			click_barrel(i);
		});
	}
}

function create_info_text() {
	let font_size = get_font_size(_canvas, 0.035);
	_graphics.score = add_text(0, 0, font_size, "Score: 0");
	_graphics.info = add_text(_canvas.width-font_size, 0, font_size, "ⓘ");
	_graphics.info_circle = add_circle(
		_graphics.info.x+font_size/2.0, 
		_graphics.info.y+font_size/2.0, 
		font_size/2.0
	);
	_graphics.info_circle.on("mousedown", function(e) {
		window.open("https://github.com/Nicolodemus/bananenregen");
	});
	_graphics.info_circle.cursor = "pointer";
}

function create_stage() {
	_stage = new createjs.Stage(_canvas);
	_stage.addChild(_graphics.sky);
	_stage.addChild(_graphics.bg);
	for (object of _graphics.circles) {
		_stage.addChild(object);
	}
	for (object of _graphics.barrels) {
		_stage.addChild(object);
	}
	for (object of _graphics.bananas) {
		_stage.addChild(object);
	}
	for (object of _graphics.barrels_overlay) {
		_stage.addChild(object);
	}
	_stage.addChild(_graphics.score);
	_stage.addChild(_graphics.info);
	_stage.addChild(_graphics.info_circle);
	_stage.enableMouseOver(10);
}

function create_ticker() {
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.framerate = 30;
	createjs.Ticker.addEventListener("tick", tick);
}

function click_barrel(i) {
	_graphics.barrels[i].gotoAndPlay("active");
	_graphics.barrels_overlay[i].gotoAndPlay("overlay");
}

function tick(event) {
	let elapsed = event.delta / 1000.0;
	// Check if level is over
	let overflow = _current_level.clock + elapsed - _current_level.duration;
	if (overflow >= 0) {
		let id_next = _current_level.id + 1;
		if (id_next >= _current_level.ids) {
			if (_score >= 100) {
				_graphics.score.text = "Score: " + _score + ". Won!";
			} else {
				_graphics.score.text = "Score: " + _score + ". Lost.";
			}
			_stage.update(event);
			return; // game finished.
		}
		_current_level = create_level(id_next);
		elapsed = overflow;
		for (let i = 0; i < 4; i++) {
			_graphics.bananas[i].gotoAndPlay("banana-0");
		}
	}
	// Play new steps in level
	let steps = forward_time(elapsed);
	for (let step = steps.before + 1; step <= steps.now; step++) {
		let bananas = _current_level.bananas[step];
		for (let i = 0; i < 4; i++) {
			if (bananas[i] == 0) continue; // not a banana nor a Zwickohr
			_graphics.bananas[i].gotoAndPlay("banana-" + bananas[i]);
			let h = _graphics.bananas[i].getBounds().height;
			h *= _graphics.bananas[i].scaleY;
			_graphics.bananas[i].y = -h;
		}
	}
	move_bananas(elapsed);
	move_background(elapsed);
	_stage.update(event);
}

function forward_time(elapsed) {
	let step_before = _current_level.step;
	_current_level.clock += elapsed;
	_current_level.step = get_level_step(_current_level);
	return {
		before: step_before,
		now: _current_level.step
	};
}

function move_bananas(elapsed) {
	for (let i = 0; i < 4; i++) {
		if (_graphics.bananas[i].currentAnimation == "banana-0") continue;
		let pixels = banana_pixels_per_second(_current_level, _canvas);
		let position = _graphics.bananas[i].y + pixels * elapsed;
		_graphics.bananas[i].y = position;
		if (_graphics.barrels[i].currentAnimation == "active")
			if (_graphics.circles[i].hitTest(
				_graphics.bananas[i].x, 
				_graphics.bananas[i].y
			)) {
				let current_animation = _graphics.bananas[i].currentAnimation;
				if (current_animation == "banana-1") _score += 1;
				if (current_animation == "banana-2") _score += 2;
				if (current_animation == "banana-3") _score += 3;
				if (current_animation == "banana-4") _score += 4;
				if (current_animation == "banana-5") _score -= 100;
				_graphics.score.text = "Score: " + _score;
				_graphics.barrels_overlay[i].gotoAndPlay("inactive");
				_graphics.barrels[i].gotoAndPlay("success");
				_graphics.bananas[i].gotoAndPlay("banana-0");
			}
	}
}

function move_background(elapsed) {
	_graphics.bg.x -= elapsed * 5;
	if (_graphics.bg.x + _graphics.bg.image.width * _graphics.bg.scaleX <= 0)
		_graphics.bg.x = _canvas.width;
}
