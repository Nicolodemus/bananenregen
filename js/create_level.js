function create_level(i) {
	let level_ids = 7;
	switch (i) {
		case 0:
			return {
				"bananas":
					[
						[1, 0, 0, 0],
						[0, 2, 0, 0],
						[0, 0, 1, 0],
						[0, 0, 0, 1],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					],
					"duration": 7.5, // in seconds
					"clock": 0.0, "step": -1, "id": i, "ids": level_ids
			}

		case 1:
			return {
				"bananas":
					[
						[1, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 3, 0, 0],
						[0, 0, 3, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 1],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					],
					"duration": 7.0, // in seconds
					"clock": 0.0, "step": -1, "id": i, "ids": level_ids
			}

		case 2:
			return {
				"bananas":
					[
						[0, 4, 0, 0],
						[0, 0, 0, 4],
						[3, 0, 0, 0],
						[0, 0, 3, 0],
						[0, 4, 0, 0],
						[0, 0, 0, 4],
						[3, 0, 0, 0],
						[0, 0, 3, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					],
					"duration": 8.0, // in seconds
					"clock": 0.0, "step": -1, "id": i, "ids": level_ids
			}

		case 3:
			return {
				"bananas":
					[
						[4, 0, 0, 0],
						[0, 5, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 2, 0],
						[0, 0, 0, 1],
						[0, 0, 0, 0],
						[4, 0, 0, 0],
						[0, 5, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 2, 0],
						[0, 0, 0, 1],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					],
					"duration": 7.0, // in seconds
					"clock": 0.0, "step": -1, "id": i, "ids": level_ids
			}

		case 4:
			return {
				"bananas":
					[
						[5, 0, 0, 0],
						[0, 1, 0, 0],
						[0, 0, 5, 0],
						[0, 0, 0, 0],
						[5, 0, 0, 0],
						[0, 1, 0, 0],
						[0, 0, 5, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					],
					"duration": 5.0, // in seconds
					"clock": 0.0, "step": -1, "id": i, "ids": level_ids
			}

		case 5:
			return {
				"bananas":
					[
						[4, 0, 0, 0],
						[0, 0, 4, 0],
						[0, 4, 0, 0],
						[0, 0, 0, 4],
						[4, 0, 0, 0],
						[0, 0, 4, 0],
						[0, 4, 0, 0],
						[0, 0, 0, 4],
						[4, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
					],
					"duration": 7.0, // in seconds
					"clock": 0.0, "step": -1, "id": i, "ids": level_ids
			}

		case 6:
			return {
				"bananas":
					[
						[5, 5, 5, 5],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[5, 3, 5, 5],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[5, 5, 4, 5],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					],
					"duration": 4.0, // in seconds
					"clock": 0.0, "step": -1, "id": i, "ids": level_ids
			}

		default:
			return {
				"bananas":
					[
						[1, 0, 0, 0],
						[0, 2, 0, 0],
						[0, 0, 3, 0],
						[0, 0, 0, 4],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					],
					"duration": 7.5, // in seconds
					"clock": 0.0, "step": -1, "id": i, "ids": level_ids
			}
	}
}

function banana_pixels_per_second(level, canvas) {
	let step_duration = level.duration / level.bananas.length;
	let pixels_per_second = canvas.height / (step_duration * 4);
	return pixels_per_second;
}

function get_level_step(level) {
	let step_duration = level.duration / level.bananas.length;
	let step = Math.floor(level.clock / step_duration);
	return Math.min(step, level.bananas.length - 1);
}
