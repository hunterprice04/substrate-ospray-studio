var editor = null;
var frames = [];
var currFrame = null;
var currFrameIndex = 0;
var framesContainer = null;

function main() {
  framesContainer = $("#frames-div");
  // create the editor
  const container = document.getElementById("jsoneditor");
  const options = {
    onChange: () => {
      currFrame = editor.get();
      frames[currFrameIndex] = currFrame;
    },
  };

  editor = new JSONEditor(container, options);
  setupCallbacks();

  // set json
  const sceneGraph = get_scene_graph();
  sceneGraph.then(function (result) {
    // currFrame = result;
    addFrame(result);
    // editor.set(currFrame);
  });
}

function setupCallbacks() {
  // general single frame callabacks
  $("#save-frame").click(function () {
    saveObj(JSON.stringify(editor.get()));
  });
  $("#load-frame").click(function () {
    loadObj((content) => {
      frames[currFrameIndex] = JSON.parse(content);
      currFrame = frames[currFrameIndex];
      re_render(currFrame);
    });
  });
  $("#render-frame").click(function () {
    re_render(currFrame);
  });

  // general movie callbacks
  $("#save-movie").click(function () {
    saveObj(JSON.stringify(frames));
  });
  $("#load-movie").click(function () {
    loadObj((content) => {
      framesArr = JSON.parse(content);
      frames = [];
      console.log(frames);
      framesContainer.empty();
      for (let i = 0; i < framesArr.length; i++) {
        addFrame(framesArr[i]);
      }
    });
  });
  $("#render-movie").click(function () {
    render_movie(frames);
  });

  // frame-movie selection callbacks
  $("#movie-add-frame").click(function () {
    addFrame(editor.get());
  });
  $("#movie-remove-frame").click(function () {
    removeCurrentFrame();
  });
}

function saveObj(obj) {
  // Save Dialog
  let fname = window.prompt("Save as...");

  // Check json extension in file name
  if (fname.indexOf(".") === -1) {
    fname = fname + ".json";
  } else {
    if (fname.split(".").pop().toLowerCase() === "json") {
      // Nothing to do
    } else {
      fname = fname.split(".")[0] + ".json";
    }
  }
  const blob = new Blob([obj], {
    type: "application/json;charset=utf-8",
  });
  saveAs(blob, fname);
}

function loadObj(resolve) {
  var input = document.createElement("input");
  input.type = "file";
  input.onchange = (e) => {
    // getting a hold of the file reference
    var file = e.target.files[0];

    // setting up the reader
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");

    // here we tell the reader what to do when it's done reading...
    reader.onload = (readerEvent) => {
      var content = readerEvent.target.result; // this is the content!
      resolve(content);
    };
  };
  input.click();
}

function setFrame(index) {
  currFrameIndex = index;
  currFrame = frames[currFrameIndex];
  editor.set(currFrame);
  setFrameIndexToActive(index);
}
function addFrame(frame) {
  // add frame to frames
  frames.push(frame);

  // create a new frame div
  let frameDiv = document.createElement("div");
  frameDiv.className = "col-4";
  frameDiv.id = "frame-" + (frames.length - 1);
  frameDiv.innerHTML = frames.length - 1;

  // add onclick callback
  frameDiv.onclick = function (e) {
    const frameNum = e.target.id.split("-")[1];
    setFrame(frameNum);
  };

  // add frame to frames container
  framesContainer.append(frameDiv);
  // set the current frame to the last frame
  setFrame(frames.length - 1);
}

function removeCurrentFrame(){
    if (frames.length <= 1)
        return;
    
    // remove the current frame from the frames array
    frames.splice(currFrameIndex, 1);
    // remove the current frame from the frames container
    const frameDiv = document.getElementById("frame-" + currFrameIndex);
    frameDiv.remove();

    // fix the frame numbers
    for (let i = 0; i < framesContainer.children().length; i++) {
        const frameDiv = framesContainer.children()[i];
        frameDiv.id = "frame-" + i;
        frameDiv.innerHTML = i;
    }

    // set the current frame to the last frame
    setFrame(frames.length - 1);

}

function setFrameIndexToActive(index) {
  // set all frames to inactive
  for (let i = 0; i < frames.length; i++) {
    const frameDiv = document.getElementById("frame-" + i);
    frameDiv.className = "col-4 inactive-frame";
  }
  // set the current frame to active
  const frameDiv = document.getElementById("frame-" + index);
  frameDiv.className = "col-4 active-frame";
}

window.onload = function () {
  initial_render(true);
  main();
};
