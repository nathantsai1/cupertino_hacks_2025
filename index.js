navigator.mediaDevices.getUserMedia({video: true})
function checkMediaDevices() {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        console.log("enumerateDevices supported.");

        // Access the camera
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                // Get the video element from the HTML
                const videoElement = document.getElementById('video');
                if (videoElement) {
                    // Set the video source to the stream
                    videoElement.srcObject = stream;
                    videoElement.play();
                } else {
                    console.error("Video element not found in the HTML.");
                }
            })
            .catch(err => {
                console.error("Error accessing media devices.", err);
            });

        // List available devices
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                devices.forEach(device => {
                    console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
                });
            })
            .catch(err => {
                console.error("Error enumerating devices.", err);
            });

    } else {
        console.log("enumerateDevices not supported.");
    }
}

checkMediaDevices();