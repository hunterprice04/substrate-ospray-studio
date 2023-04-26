// const RAAS_LOCATION = 'http://172.19.54.56:8000';
const RAAS_LOCATION = 'http://127.0.0.1:5000';

// var loadingDiv = document.getElementById('loading');

function showSpinner() {
	console.log('showSpinner')

	document.getElementById('loading').style.visibility = 'visible';
  }
  
function hideSpinner() {
	console.log('hideSpinner')
	document.getElementById('loading').style.visibility = 'hidden';
}

function initial_render() {
	// showSpinner();

	fetch(`${RAAS_LOCATION}/render/`).then((response) => response.blob()).then((blob) => {
		// hideSpinner()
		document.querySelector('.render').src = URL.createObjectURL(blob);
	});
}

function get_scene_graph() {
	return fetch(`${RAAS_LOCATION}/sg/`).then((response) => response.json()).then((scene_graph) => {
		// NOTE: These commands add extra options to configure OSPRay Studio beyond the normal SceneGraph.
		// To modify the camera, you should use these vectors rather than the transformation vectors.
		scene_graph.camera.position = [0.0, 0.0, 1.0];
		scene_graph.camera.up = [0.0, 1.0, 0.0];
		scene_graph.camera.view = [0.0, 0.0, -1.0];

		scene_graph.resolution = '720p'; // This can be a description of the resolution such as 720p, 4K, 8K, etc, or a width by height such as 1920x1080.
		scene_graph.samples_per_pixel = 1; // The number of samples per pixel to use when rendering.
		
		return scene_graph;
	});
}

function re_render(scene_graph) {
	const options = {
		body: JSON.stringify(scene_graph),
		headers: {'Content-Type': 'application/json'},
		method: 'POST'
	};
	// showSpinner();

	fetch(`${RAAS_LOCATION}/render/`, options).then((response) => response.blob()).then((blob) => {
		// hideSpinner()
		document.querySelector('.render').src = URL.createObjectURL(blob);
	});
}

function render_movie(key_frames) {
	const options = {
		body: JSON.stringify({
			fps: 10,
			frames: key_frames,
			length: 2
		}),
		headers: {'Content-Type': 'application/json'},
		method: 'POST'
	};

	fetch(`${RAAS_LOCATION}/renderMovie/`, options).then((response) => response.blob()).then((blob) => {
		const movie_url = URL.createObjectURL(blob);
		// This approach can be used to download the movie: https://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link
	});
}
