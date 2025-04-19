const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const capturedImage = document.getElementById('captured-image'); // Ensure this exists in your HTML
const flipButton = document.getElementById('flip-button');
const captureButton = document.getElementById('capture-button');
const retakeButton = document.getElementById('retake-button');

let currentStream = null;
let facingMode = 'environment'; // Default to back camera

async function startCamera() {
    try {
        // Stop any existing video stream
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }

        // Start a new video stream with the selected facing mode
        currentStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode }
        });
        video.srcObject = currentStream;
        captureButton.disabled = false;
        flipButton.disabled = false;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Unable to access camera. Please ensure permissions are granted.');
    }
}

// Flip camera button functionality
flipButton.addEventListener('click', () => {
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    startCamera();
});

// Capture button functionality
captureButton.addEventListener('click', async () => {
    // Capture the image from the video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');
    capturedImage.src = imageData;
    capturedImage.style.display = 'block';
    video.style.display = 'none';
    captureButton.style.display = 'none';
    flipButton.style.display = 'none';
    retakeButton.style.display = 'inline-block';

    // Get GPS location
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const crd = position.coords;

            // Send the image and coordinates to the backend
            try {
                // Show loading indicators
                const loadingElements = document.getElementsByClassName('loading'); // Get all elements with the 'loading' class
                for (let i = 0; i < loadingElements.length; i++) {
                    loadingElements[i].style.display = 'block'; // Show each loading element
                }
                capturedImage.style.left = '50%'; // Center the image
                capturedImage.style.top = '50%'; // Center the image
                capturedImage.style.opacity = '0.5'; // Dim the captured image
                const result = await plant_backend(imageData, [crd.latitude, crd.longitude]);
                console.log('Result from backend:', result.json());
                console.log('Result from plain backend:', result);
                // TODO: Handle the result (e.g., display it on the frontend)
                window.location.href = '/results';
            } catch (error) {
                console.error('Error sending data to backend:', error);
            }
        },
        (err) => {
            console.error('Error getting location:', err);
        }
    );
});

// Retake button functionality
retakeButton.addEventListener('click', () => {
    capturedImage.style.display = 'none';
    video.style.display = 'block';
    captureButton.style.display = 'inline-block';
    flipButton.style.display = 'inline-block';
    retakeButton.style.display = 'none';
    startCamera();
});

// Start the camera on page load
startCamera();

// Intersection Observer for animations
const pageSections = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });
pageSections.forEach(section => observer.observe(section));