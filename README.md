Project Overview
This React project is a frontend application designed for monitoring website statuses. It provides an interface to track the availability and downtime of websites, displaying the data in both tabular and graphical formats. Users can manage (add, edit, delete) websites and view their status updates in real-time. It also features a dark mode toggle for better accessibility.

Key Technologies Used
React.js:

Framework for building the interactive UI components and managing the application's state.
Use of hooks like useState and useEffect for state management and lifecycle logic.
Material-UI (MUI):

Utilized for UI components such as tables, buttons, switches, and input fields.
Themes are dynamically toggled between light and dark modes using Material-UI's theming capabilities.
Chart.js:

Integrated through react-chartjs-2 for visualizing data.
Used Bar and Doughnut charts to represent website downtimes and statuses.
Fetch API:

Handles communication with the backend for CRUD operations (Create, Read, Update, Delete) on website data.
Custom Themes:

createTheme from Material-UI defines light and dark themes for the application, ensuring a cohesive and visually appealing user experience.
CSS Baseline:

Applied through Material-UI's CssBaseline for consistent cross-browser styling.
How It Works
Data Fetching and Updates:

The fetchSiteStatus function fetches website data from a /api/websites endpoint.
Sites are sorted based on their statuses, prioritizing those with "down" statuses.
The function runs on component mount and refreshes every 30 seconds using setInterval.
Website Management:

Add: Users can add new websites by providing a name and URL. The app sends a POST request to the backend with the website details.
Edit: Users can double-click a website URL to edit it. An input field appears, and changes are saved via a PUT request.
Delete: Websites can be deleted from the list, sending a DELETE request to the backend.
Charts:

Bar Chart: Displays the downtime duration (in minutes) for each website. Websites with no downtime are highlighted in light green, while others are marked in red.
Doughnut Chart: Shows the proportion of websites experiencing downtime versus those without issues.
Dynamic Row Styling:

Table rows are dynamically styled based on each website's status and downtime duration. A gradient of red shades indicates varying levels of downtime.
Pagination:

The table supports pagination, allowing users to view a specific number of rows per page with options to adjust the display count.
Dark Mode:

A Switch component toggles between light and dark themes, dynamically applying the appropriate theme across the UI.
Responsive Design:

The layout is structured to adapt to different screen sizes, ensuring usability across devices.
How to Run
Install dependencies using npm install or yarn.
Start the application with npm start or yarn start.
Ensure the backend API (/api/websites) is running and accessible for the frontend to fetch and manipulate data.
This setup ensures a seamless and interactive user experience while effectively visualizing and managing website statuses.


### Explanation of Backend Code for Website Monitoring Application

This Node.js backend application is designed for monitoring the status of websites. It provides a set of APIs to manage a list of websites and periodically checks their availability. Below is a breakdown of its key features, structure, and technologies:

---

### **Key Technologies:**
- **Node.js:** Core runtime environment for executing JavaScript on the server side.
- **Express.js:** Lightweight web framework for building APIs.
- **Body-Parser:** Middleware for parsing incoming request bodies in JSON format.
- **File System (fs):** Module for reading and writing data to a JSON file that stores website information.
- **Got:** HTTP client for making requests to check website availability.
- **Moment-Timezone:** Library for managing and formatting timestamps with timezone support.
- **HTTPS:** Module to handle secure HTTP requests.

---

### **File Structure:**
- **webSites.json:** Stores the list of websites with their metadata (e.g., ID, name, URL, status, downtime).
- **mailSender.js:** Custom module responsible for sending email notifications during downtime (imported but not shown in this code).
- **server.js (main file):** Implements the backend logic and API endpoints.

---

### **Functionalities:**

#### 1. **Middleware Configuration:**
- **Body-Parser:** Parses incoming JSON request payloads.
- **CORS Headers:** Allows cross-origin requests by setting appropriate headers.

#### 2. **API Endpoints:**

**a. Add a New Website** (`POST /api/websites`)
- Accepts `name` and `url` in the request body.
- Generates a unique ID for the website and adds it to `webSites.json`.
- Returns the newly created website object.

**b. Delete a Website** (`DELETE /api/websites/:id`)
- Deletes a website by ID from `webSites.json`.
- Responds with a success message if the site is found and removed, or a 404 error if not found.

**c. Get All Websites** (`GET /api/websites`)
- Returns the list of all websites stored in `webSites.json`.

**d. Update Website URL** (`PUT /api/websites/:id`)
- Updates the URL of a specific website by ID.
- Automatically checks the new URL's status after the update.

**e. Health Check** (`GET /`)
- Simple health check endpoint to verify the API is running.

#### 3. **Periodic Website Monitoring:**
- A function, `checkSingleWebsite`, periodically checks the status of each website:
  - Uses **Got** to make an HTTP/HTTPS request to the website.
  - Handles potential issues like redirects, timeouts, and SSL errors.
  - Updates the status (`up` or `down`), downtime duration, and error type in `webSites.json`.
  - Sends email notifications using the `mailSender` module when a website is down.

- The `checkWebsites` function checks all websites at a fixed interval (30 seconds in this case).

#### 4. **Helper Functions:**
- **loadWebsites:** Reads and parses `webSites.json`.
- **saveWebsites:** Writes updated data to `webSites.json`.
- **generateUniqueId:** Generates a unique ID for a new website.

---

### **Flow of Execution:**
1. The server starts and initializes website monitoring using `checkWebsites`.
2. Periodically (every 30 seconds), all websites are checked for availability.
3. Users can interact with the API to manage websites (add, delete, update) or fetch the list of monitored websites.
4. If a website is down, its downtime and error details are logged, and an email notification is triggered.

---

### **Potential Improvements:**
- Implement robust validation for URLs.
- Add user authentication for secure API access.
- Enhance error handling with detailed logs.
- Provide real-time status updates via WebSocket or Server-Sent Events (SSE).
- Store website data in a database instead of a JSON file for scalability.

---

### **How to Run:**
1. Install dependencies: `npm install`
2. Start the server: `node server.js`
3. Use tools like Postman to test API endpoints or integrate with a frontend application.
