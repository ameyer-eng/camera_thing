//the whole script is wrapped in an anon function to avoid global variables
//...idk why everyone hates global variables...
( () => {
    const width = 320;  //we will scale the photo to this
    let height = 0;  //this will be computed based on the input stream

    let streaming = false;

    let video = null;
    let canvas = null;
    let photo = null;
    let startbutton = null;

    function showViewLiveResultButton() {
        if (window.self !== window.top) {
          // Ensure that if our document is in a frame, we get the user
          // to first open it in its own tab or window. Otherwise, it
          // won't be able to request permission for camera access.
          document.querySelector(".contentarea").remove();
          const button = document.createElement("button");
          button.textContent = "View live result of the example code above";
          document.body.append(button);
          button.addEventListener("click", () => window.open(location.href));
          return true;
        }
        return false;
      }

    //The startup() function is run when the page has finished loading, courtesy of EventTarget.addEventListener.
    //This function's job is to request access to the user's webcam, initialize the output <img> to a default state, 
    //and to establish the event listeners needed to receive each frame of video from the camera and react when the button 
    //is clicked to capture an image

    function startup(){
        if (showViewLiveResultButton()) {return;}

        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');

        navigator.mediaDevices
            .getUserMedia({video: true, audio: false})
            .then((stream) => {
                video.srcObject = stream;
                video.play();
            })
            .catch((err) =>{
                console.error(`An error occured: ${err}`);
            });
        
        video.addEventListener(
            "canplay",
            (ev) => {
                if(!streaming){
                    height = video.videoHeight/(video.videoWidth/width);

                      // Firefox currently has a bug where the height can't be read from
                     // the video, so we will make assumptions if this happens.

                     if (isNaN(height)) {
                        height = width / (4 / 3);
                      }

                    video.setAttribute("width", width);
                    video.setAttribute("height", height);
                    canvas.setAttribute("width", width);
                    canvas.setAttribute("height", height);
                    streaming = true;
                }
            }, false
        );

    startbutton.addEventListener(
        "click",
        (ev) => {
            takepicture();
            ev.preventDefault();
        },
        false
    );

    clearphoto();
    }

    function clearphoto(){
        const context = canvas.getContext("2d");
        context.fillStyle = "#AAA";
        context.fillRect(0,0, canvas.width, canvas.height);

        const data = canvas.toDataURL("image/png");
        photo.setAttribute("src", data);
    }

    // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    const context = canvas.getContext("2d");
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        const data = canvas.toDataURL("image/png");
        photo.setAttribute("src", data);
    } else {
        clearphoto();
    }
  }
  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener("load", startup, false);

}) ();//end of anon wrapper function
