# Project Overview: Cupertino Hacks 2025

Welcome to the **Cupertino Hacks 2025** project! This document will guide you through the folder structure and explain how to read and understand the files in this repository.

---

## Folder Structure

### 1. **`templates/`**
This folder contains all the HTML templates used in the project. These are the frontend pages served by the backend.

- **`index.html`**: The main landing page of the project.
- **`process.html`**: Displays plant identification results and related information.
- **`projects.html`**: A page for project-related interactions, such as capturing images.
- **`slideshow.html`**: A slideshow page for showcasing content.
- **`404.html`**: A custom 404 error page.

---

### 2. **`src/`**
This folder contains the core JavaScript files for both frontend and backend functionality.

#### **Frontend Files**
- **`projects.js`**: Handles camera interactions, image capture, and sending data to the backend.
- **`geolocation.js`**: Manages geolocation functionality for capturing GPS coordinates.

#### **Backend Files**
- **`backend/`**
  - **`gemini.js`**: Integrates with Google Generative AI to process plant descriptions and care instructions.
  - **`photos.js`**: Connects to the Unsplash API to fetch raw photo links for plant names.
  - **`plantid.js`**: Handles plant identification using the Plant.ID API.

---

### 3. **`styles/`**
This folder contains CSS files for styling the frontend.

- **`styles.css`**: General styles for the project.
- **`projects.css`**: Specific styles for the projects page.
- **`contacts.css`**: Styles for the contact page.

---

### 4. **`txt/`**
This folder contains text files used for data storage or testing.

- **`gemini.txt`**: Stores sample plant data for testing the Google Generative AI integration.
- **`index.txt`**: Contains text content for the `/temp` route.
- **`plantid.txt`**: Stores sample plant identification data for testing the Plant.ID API.

---

### 5. **Root Files**
- **`main.js`**: The main backend server file. It defines routes, serves static files, and handles API requests.
- **`package.json`**: Contains project metadata and dependencies.
- **`README.md`**: This file, which explains the folder structure and how to navigate the project.
- **`script.js`**: Contains frontend scripts for interactive features like background color changes and fun facts.

---

## How to Read the Files

1. **Frontend to Backend Flow**:
   - The frontend files (e.g., `projects.js`) send data (e.g., images and GPS coordinates) to backend routes defined in `main.js`.
   - The backend processes the data using APIs (e.g., Plant.ID, Unsplash) and returns results to the frontend.

2. **Backend to Frontend Flow**:
   - The backend serves HTML templates (e.g., `process.html`) and dynamically injects data (e.g., plant information) into the frontend.

3. **Testing and Debugging**:
   - Use the `txt/` files for testing backend functionality without relying on live API calls.
   - Check the console logs in `main.js` and `projects.js` for debugging information.

---

## Example Workflow

1. **Capture an Image**:
   - The user captures an image using the camera on the `projects.html` page.
   - The image and GPS coordinates are sent to the `/identify` backend route.

2. **Process the Data**:
   - The backend uses `plantid.js` to identify the plant and `gemini.js` to generate a description and care instructions.

3. **Display Results**:
   - The results are displayed on the `process.html` page, including plant details and care tips.

---

## Additional Notes

- **Environment Variables**:
  - API keys (e.g., for Unsplash and Plant.ID) are stored in a `.env` file and accessed using `dotenv`.

- **Dependencies**:
  - Install dependencies using `npm install` before running the project.

- **Start the Server**:
  - Use `npm start` to start the backend server.

---

Feel free to explore the files and reach out if you have any questions. Happy coding!