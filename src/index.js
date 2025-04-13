// // const {success, error, options } = require("geolocation.js");
// var facingMode = "user"
// navigator.mediaDevices.getUserMedia({video: true})
// const startButton = document.getElementById('capture-buttons')
// // const flipButton = document.getElementById('flip-buttons');
// const width = 320;
// const height = 240;


// photo = document.getElementById("photo");
// // add event listner to flip button
// startButton.addEventListener(
//     "click",
//     (ev) => {
//       takePicture();
//       ev.preventDefault();
//     },
//     false,
//   );
// flipButton.addEventListener(
//     "click",
//     (ev) => {
//         flipCamera();
//         ev.preventDefault();
//       },
//       false,
//     );

// async function main() {
//     // start the camera
//     if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
//         console.log("enumerateDevices supported.");

//         // Access the camera
//         navigator.mediaDevices.getUserMedia({ video: true })
//             .then(stream => {
//                 // Get the video element from the HTML
//                 const videoElement = document.getElementById('video');
//                 if (videoElement) {
//                     // Set the video source to the stream
//                     videoElement.srcObject = stream;
//                     videoElement.play();
//                 } else {
//                     console.error("Video element not found in the HTML.");
//                 }
//             })
//             .catch(err => {
//                 console.error("Error accessing media devices.", err);
//             });

//         // List available devices
//         navigator.mediaDevices.enumerateDevices()
//             .then(devices => {
//                 devices.forEach(device => {
//                     console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
//                 });
//             })
//             .catch(err => {
//                 console.error("Error enumerating devices.", err);
//             });

//     } else {
//         console.log("enumerateDevices not supported.");
//     }
// }

// async function takePicture() {
//     const context = canvas.getContext("2d");
//     if (width && height) {
//       canvas.width = width;
//       canvas.height = height;
//       context.drawImage(video, 0, 0, width, height);
//     // get the data from the canvas as 64-bit encoded PNG
//       const data = canvas.toDataURL("image/png");
//       photo.setAttribute("src", data);
//     // const plant_type = await fetch(data);
//     // get gps location
//     navigator.geolocation.getCurrentPosition(
//         async (position) => {
//             const crd = position.coords;
//             console.log('Latitude : ' + crd.latitude);
//             console.log('Longitude: ' + crd.longitude);
//             console.log(crd);

//             // You can now send the image and coordinates to the backend
//             const result = await plant_backend(data, [crd.latitude, crd.longitude]);
//             // console.log('end_result' + result);
//             // TODO: send the result to the frontend
//             return result;
//         },
//         (err) => {
//             console.error("Error getting location:", err);
//         },
//         options
//     );
//     } else {
//       clearPhoto();
//     }
// }  

// async function flipCamera() {
//     console.log(true)
//     // Get the current video stream
//     const stream = video.srcObject;

//     // Get the video tracks from the stream
//     const tracks = stream.getVideoTracks();

//     // Stop all tracks
//     tracks.forEach(track => track.stop());

//     facingMode = (facingMode === "user") ? "environment" : "user";
//     // Switch the camera (front to back or back to front)
//     const newConstraints = {
//         video: {
//             facingMode: (facingMode === "user") ? "environment" : "user"
//         }
//     };

//     // Restart the camera with new constraints
//     navigator.mediaDevices.getUserMedia(newConstraints)
//         .then(newStream => {
//             video.srcObject = newStream;
//             video.play();
//         })
//         .catch(err => {
//             console.error("Error accessing media devices.", err);
//         });
// }
// // start the camera
// main();
