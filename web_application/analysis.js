console.log("tester")
  // This function runs after OpenCV.js has fully loaded
  cv['onRuntimeInitialized'] = () => {
    console.log('OpenCV.js is ready.');

    document.getElementById('videoInput').addEventListener('change', function() {
        const file = this.files[0];
        const url = URL.createObjectURL(file);
        const video = document.getElementById('video');
        video.src = url;
        video.onloadedmetadata = () => {
            processVideo(video);
        };
    });
};

function calculateLuminescence(frame) {
    let grayFrame = new cv.Mat();
    cv.cvtColor(frame, grayFrame, cv.COLOR_RGBA2GRAY, 0);
    let meanValue = cv.mean(grayFrame);
    grayFrame.delete();
    return meanValue[0];
}

function processVideo(video) {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let peakLuminescence = 0;

    video.play();

    function processFrame() {
        if (video.paused || video.ended) {
            console.log("Peak Luminescence: ", peakLuminescence);
            return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        let frame = cv.imread(canvas);
        let luminescence = calculateLuminescence(frame);

        if (luminescence > peakLuminescence) {
            peakLuminescence = luminescence;
        }

        frame.delete();
        requestAnimationFrame(processFrame);
    }
    requestAnimationFrame(processFrame);

    console.log(peakLuminescence)
    console.log("finish")

    setTimeout(() => {
      document.body.innerHTML = "<h1>Analyzing...</h1>"
    }, 5000)

    setTimeout(() => {
      document.body.innerHTML = "<h1> Testosterone concentration: " + Number((Math.exp((peakLuminescence - 23.6)/(-8.46)))).toPrecision(3) + " ng/mL</h1>"
    }, 10000)
}