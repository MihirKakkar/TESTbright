console.log("tester");
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

function averageBlueIntensity(frame) {
    // Convert the frame to RGBA (just in case it's not already in this format)
    let rgbaFrame = new cv.Mat();
    if (frame.type() === cv.CV_8UC1) {
        cv.cvtColor(frame, rgbaFrame, cv.COLOR_GRAY2RGBA);
    } else if (frame.type() === cv.CV_8UC3) {
        cv.cvtColor(frame, rgbaFrame, cv.COLOR_RGB2RGBA);
    } else {
        rgbaFrame = frame.clone();
    }

    let totalBlueIntensity = 0;
    const totalPixels = rgbaFrame.cols * rgbaFrame.rows;

    // Access the image data
    for (let i = 0; i < rgbaFrame.data.length; i += 4) {
        // Extract the blue channel
        totalBlueIntensity += rgbaFrame.data[i + 2]; // RGBA data, so +2 is the blue channel
    }

    const averageBlue = totalBlueIntensity / totalPixels;
    rgbaFrame.delete();
    return averageBlue;
}

function processVideo(video) {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let peakBlueIntensity = 0;

    video.play();

    function processFrame() {
        if (video.paused || video.ended) {
            console.log("Peak Blue Intensity: ", peakBlueIntensity);
            return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        let frame = cv.imread(canvas);
        let blueIntensity = averageBlueIntensity(frame);

        if (blueIntensity > peakBlueIntensity) {
            peakBlueIntensity = blueIntensity;
        }

        frame.delete();
        requestAnimationFrame(processFrame);
    }
    requestAnimationFrame(processFrame);

    console.log(peakBlueIntensity)
    console.log("finish")

    setTimeout(() => {
      document.body.innerHTML = "<h1>Analyzing...</h1>"
    }, 5000)

    setTimeout(() => {
      document.body.innerHTML = "<h1> Testosterone concentration: " + Number(Math.trunc((Math.exp((peakBlueIntensity - 51.7)/(-6.21)))).toPrecision(2)) + "± " + Number((Math.exp((peakBlueIntensity - 51.7)/(-6.21))) * 0.18).toPrecision(2) + " ng/mL</h1>"
    }, 10000)
}
