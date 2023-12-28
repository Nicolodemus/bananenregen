/** Set width and height attributes */
function set_size(canvas, width, height) {
	let attribute = "width: " + width + "px;" + " ";
	attribute += "height: " + height + "px;";
	canvas.setAttribute("style", attribute);
	// Also set width and height directly
	canvas.width = width;
	canvas.height = height;
}

/** Resize the canvas to fit well the device */
function resize_canvas(canvas) {
	let window_size = {
		w: window.innerWidth, 
		h: window.innerHeight
	};
	// Ratio of the window and the desired canvas
	let window_ratio = window_size.w/window_size.h;
	let canvas_ratio = canvas.width/canvas.height; // desired size
	// Case: Window is longer in height, we must adjust the height
	if (window_ratio < canvas_ratio) {
		set_size(canvas, window_size.w, window_size.w/canvas_ratio);
	}
	// Case: Window is wider, we must adjust the width
	else if (window_ratio > canvas_ratio) {
		set_size(canvas, window_size.h*canvas_ratio, window_size.h);
	}
}

/** Scale pixels into canvas using relative bounds */
function scale_to_canvas(canvas, pixels, left, top, width, height) {
	let w = width * canvas.width;
	let h = height * canvas.height;
	let x = left * canvas.width;
	let y = top * canvas.height;
	return {
		"x": x,
		"y": y,
		"w": w,
		"h": h,
		"scaleX": w / pixels.width,
		"scaleY": h / pixels.height
	};
}

/** Scale pixels while centering */
function scale_centered(canvas, pixels, middle_x, middle_y, radius) {
	let w = 2.0 * radius * canvas.width;
	let h = w * pixels.height / pixels.width;
	let middleX = middle_x * canvas.width;
	let middleY = middle_y * canvas.height;
	return {
		"x": middleX - w / 2.0,
		"y": middleY - h / 2.0,
		"w": w,
		"h": h,
		"middleX": middleX,
		"middleY": middleY,
		"scaleX": w / pixels.width,
		"scaleY": h / pixels.height
	};
}

function set_transform(display_object, scale) {
	display_object.setTransform(
		scale.x, scale.y, scale.scaleX, scale.scaleY
	);
}

/** Get a font size according to given relative size */
function get_font_size(canvas, relative_size) {
	return Math.round(relative_size * canvas.height);
}
