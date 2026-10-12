# INCIDEX — Crime Incident Reporting System

**Report. Track. Resolve.**

INCIDEX is a web-based Crime Incident Reporting System designed to help users submit crime incident reports and track their progress while allowing administrators to review reports, manage cases, update statuses, and maintain resolution records.

The project is developed using the MERN stack. Backend development was prioritized first, and frontend components are being developed and integrated with the backend APIs progressively.

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Objectives](#2-objectives)
3. [Project Status](#3-project-status)
4. [Features](#4-features)
5. [User Roles](#5-user-roles)
6. [Case Management Workflow](#6-case-management-workflow)
7. [Technology Stack](#7-technology-stack)
8. [System Architecture](#8-system-architecture)
9. [Project Structure](#9-project-structure)
10. [Database](#10-database)
11. [Authentication and Security](#11-authentication-and-security)
12. [API Overview](#12-api-overview)
13. [Environment Variables](#13-environment-variables)
14. [Installation and Setup](#14-installation-and-setup)
15. [Running the Application](#15-running-the-application)
16. [Deployment](#16-deployment)
17. [Testing](#17-testing)
18. [Limitations](#18-limitations)
19. [Future Enhancements](#19-future-enhancements)
20. [Contributing](#20-contributing)
21. [License](#21-license)

---

## 1. Project Overview

Crime incident information can be difficult to organize and track when reporting, case updates, notifications, and resolution details are handled separately.

INCIDEX aims to provide a centralized application for managing crime incident reports. Users can report incidents and follow their case progress, while administrators can review submitted reports and maintain case information.

The system is being developed as an academic full-stack web development project using MongoDB, Express.js, React, and Node.js.

## 2. Objectives

The main objectives of INCIDEX are:

- Provide a centralized platform for submitting crime incident reports.
- Support user registration and authentication.
- Allow users to view their submitted reports and case statuses.
- Enable administrators to review and manage reported incidents.
- Maintain case status history and resolution information.
- Provide relevant application notifications.
- Support administrative dashboards and case statistics.
- Explore additional functionality such as map-based incident locations, email notifications, PDF reports, appeals, and fine payments where implemented.
- Develop a maintainable backend API that can be integrated with the React frontend.

## 3. Project Status

INCIDEX is under development.

| Component | Current status |
|---|---|
| Backend | Developed first; API functionality is being integrated and verified |
| Database | MongoDB integration configured |
| Frontend | React components are being developed; frontend pages and integration are in progress |
| Authentication | Backend authentication functionality is available in the project code |
| Case management | Backend routes and models have been developed; verify individual workflows |
| Notifications | Backend notification functionality has been developed; verify each notification channel |
| Additional features | Implementation and integration must be verified individually |
| Hosting | The project has been hosted on Render |
| Testing | Features should be tested in the relevant local or hosted environment |

This table describes the development approach and should be updated as functionality is completed and tested. It does not imply that every feature is currently available in the hosted application.

## 4. Features

### 4.1 User functionality

The planned user workflow includes:

- User registration and login.
- Viewing and updating profile information.
- Submitting crime incident reports.
- Selecting a crime category.
- Providing incident descriptions and location details.
- Viewing submitted reports and case details.
- Tracking case status and status history.
- Viewing application notifications.
- Viewing resolution information.
- Downloading PDF reports for resolved cases.
- Submitting feedback after case resolution.

The availability of each function depends on the current frontend implementation and backend integration.

### 4.2 Administrator functionality

The administrator workflow includes the following intended capabilities:

- Administrator authentication.
- Viewing registered users.
- Viewing dashboard statistics.
- Reviewing crime reports.
- Searching and filtering cases.
- Viewing complete case information.
- Receiving notifications about submitted reports.
- Acknowledging reports and updating case statuses.
- Recording action taken and resolution details.
- Maintaining resolved-case history.
- Reviewing feedback submitted by users.

### 4.3 Additional functionality under verification

The project has also explored or developed additional functionality beyond the original requirements. Each item should be documented as implemented only after checking the relevant source code and testing the workflow.

- **Map-based incident locations:** React Leaflet, Leaflet, OpenStreetMap tiles, and location-search functionality where configured.
- **Email notifications:** Email delivery for supported application events where the email service is configured.
- **Fake-report handling:** Recording an administrative decision and its associated reason where implemented.
- **Appeals:** Allowing users to challenge a decision and administrators to review the appeal where implemented.
- **Fine management:** Recording fines associated with eligible decisions where implemented.
- **Payment integration:** Razorpay integration for supported payment workflows, subject to payment verification and testing.
- **PDF reports:** Generating downloadable case reports where supported.
- **Dashboard statistics:** Displaying case-related statistics where the relevant dashboard endpoints and components are available.

These additional features do not change the original Software Requirements Specification (SRS). They should be treated as subsequent development work.

## 5. User Roles

INCIDEX uses two primary roles.

### User

A user can access authorized user functionality, including profile management, incident reporting, case tracking, notifications, and resolution-related features where available.

### Administrator

An administrator can access authorized administrative functionality, including report review, case-status management, dashboard information, notification management, and case-resolution operations where available.

Administrative functions must not be accessible to ordinary users without the required authorization.

## 6. Case Management Workflow

The original case-status workflow is:

1. **New:** A crime report has been submitted.
2. **Acknowledged:** The report has been acknowledged by an administrator.
3. **In Progress:** The case is being processed.
4. **Resolved:** The case has been marked as resolved.

Typical workflow:

```text
User submits an incident report
              |
              v
       Case is created
              |
              v
       Status: New
              |
              v
   Administrator reviews report
              |
              v
    Status: Acknowledged
              |
              v
     Status: In Progress
              |
              v
    Administrator records
    resolution information
              |
              v
       Status: Resolved
              |
              v
 User views resolution information
 and accesses available report
```

The actual transition rules and validation must be confirmed against the backend route implementation.

## 7. Technology Stack

The project uses the MERN stack and associated libraries where configured.

| Technology | Purpose |
|---|---|
| MongoDB | Database for application records |
| Mongoose | MongoDB object modelling and schema validation |
| Express.js | Backend API and route handling |
| Node.js | Backend JavaScript runtime |
| React | Frontend component development |
| Vite | Frontend development and build tooling |
| JavaScript | Application logic |
| Axios | HTTP requests between frontend and backend |
| JSON Web Token (JWT) | Token-based authentication where configured |
| bcryptjs | Password hashing where configured |
| Tailwind CSS | Utility-based styling where configured |
| shadcn/ui | Reusable interface components where configured |
| Lucide React | Interface icons where configured |
| Recharts | Charts and dashboard visualizations where configured |
| React Leaflet and Leaflet | Map interfaces where configured |
| OpenStreetMap | Map tile source where configured |
| Nodemailer | Email delivery where configured |
| PDFKit | PDF document generation where configured |
| Razorpay | Payment integration where configured |
| Git and GitHub | Version control and source-code hosting |
| Render | Application hosting |

The table lists the project's technologies and intended uses. Check the current dependency files and source code before treating every optional library or integration as active.

## 8. System Architecture

INCIDEX follows a client-server architecture.

```text
+---------------------------+
|      React Frontend       |
| Components and UI         |
+-------------+-------------+
              |
              | HTTP requests
              v
+---------------------------+
|      Express.js API       |
| Routes and validation     |
| Authentication and logic  |
+-------------+-------------+
              |
              | Mongoose
              v
+---------------------------+
|         MongoDB           |
| Application data          |
+---------------------------+
```

### Request flow

1. The user interacts with an available frontend component.
2. The frontend sends an HTTP request to the backend API.
3. Express processes the request through the relevant route.
4. Authentication, authorization, validation, and business rules are applied as implemented.
5. Mongoose communicates with MongoDB when database access is required.
6. The backend returns an HTTP response.
7. The frontend displays the response or updates its state.

The architecture may be extended as the frontend and additional backend functionality are completed.

## 9. Project Structure

The following is an illustrative structure based on the known project organization. Confirm it against the current repository before using it as an exact directory listing.

```text
Incidex/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── user.js
│   │   ├── admin.js
│   │   ├── crimeReport.js
│   │   ├── statusHistory.js
│   │   ├── userNotification.js
│   │   ├── adminNotification.js
│   │   └── ...
│   ├── router/
│   │   ├── authRouter.js
│   │   ├── userRouter.js
│   │   ├── adminRouter.js
│   │   ├── adminAuthRouter.js
│   │   ├── adminDashboardRouter.js
│   │   ├── adminNotificationRouter.js
│   │   ├── caseRouter.js
│   │   ├── userNotificationRouter.js
│   │   └── userFeedbackRouter.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── ...
│   │   └── axiosInterceptor.js
│   ├── public/
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

The frontend tree is intentionally abbreviated because the frontend pages are still being developed. The exact filenames and directories should match the current GitHub repository.

## 10. Database

INCIDEX uses MongoDB with Mongoose for database access.

The following logical entities are associated with the project's functionality. Confirm the actual model definitions, fields, and references in the source code.

| Entity | Purpose |
|---|---|
| User | Stores registered user information |
| Admin | Stores administrator account information |
| CrimeReport | Stores incident reports and case information |
| StatusHistory | Records case-status changes |
| UserNotification | Stores notifications associated with users |
| AdminNotification | Stores notifications intended for administrators |
| Feedback | Stores user feedback where implemented |
| Appeal and payment records | Document separately if corresponding models or persisted records exist |

The exact collection names, required fields, optional fields, indexes, enumerations, and relationships are determined by the Mongoose schemas and application code.

### Database configuration

The backend database configuration reads the MongoDB connection string from an environment variable.

```js
const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = db;
```

This example represents the earlier local-server configuration. If the backend is adapted for serverless hosting, use the connection-handling implementation appropriate to that deployment rather than copying this example without review.

## 11. Authentication and Security

Security is an important part of an incident-reporting application.

The backend includes or is intended to include the following controls, subject to verification against the current code:

- Token-based authentication using JWT.
- Password hashing using bcryptjs.
- Separate user and administrator authorization checks.
- Protected endpoints for authenticated operations.
- Ownership validation for user-specific records.
- Input validation and error handling.
- Environment variables for sensitive configuration.
- Server-side validation of payment results where payment integration is used.

### Security practices

- Do not commit `.env` files to GitHub.
- Never expose database credentials, email passwords, JWT secrets, or payment secrets in source code or documentation.
- Use test accounts for demonstrations.
- Validate sensitive operations on the backend rather than relying only on frontend checks.
- Verify payment signatures or other provider-required verification data on the server.
- Restrict database access and use appropriate hosting environment variables.

No claim of a complete security audit or production-grade security certification is made.

## 12. API Overview

The backend provides route groups mounted through Express. The prefixes below are based on the known server configuration.

| API prefix | Purpose |
|---|---|
| `/user` | User authentication and profile-related routes |
| `/admin` | Administrator authentication and management |
| `/admin/dashboard` | Dashboard-related endpoints |
| `/admin/notifications` | Administrator notification endpoints |
| `/cases` | Crime-report and case-management endpoints |
| `/user-notifications` | User notification endpoints |
| `/feedback` | Feedback-related endpoints |

### Example endpoints

The following examples describe known route patterns. Confirm the exact HTTP methods and endpoint paths inside the corresponding router files.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/user/login` | User login, if defined in `authRouter.js` |
| GET | `/user/profile` | Retrieve the authenticated user's profile |
| POST | `/cases/report` | Submit a crime incident report |
| GET | `/cases` | Use only if this listing route exists in `caseRouter.js` |
| GET | `/admin/dashboard` | Access dashboard information if the mounted router defines this route |
| GET | `/user-notifications` | Access notifications if the router defines this endpoint |
| POST | `/feedback` | Submit feedback if this route is defined |

A mounted prefix does not guarantee that the same path exists as a complete endpoint. Consult the route definitions for exact paths, parameters, request bodies, and authorization requirements.

## 13. Environment Variables

The application uses environment variables to configure database access and external services.

Possible variables, depending on the features enabled, include:

### Backend

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Email and payment integrations may require additional variables, depending on the current implementation:

```env
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
RAZORPAY_KEY_ID=your_razorpay_test_or_live_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Use the exact variable names referenced in the current backend code. The examples above are placeholders, not real credentials.

### Frontend

```env
VITE_API_URL=http://localhost:3000
VITE_GEOAPIFY_API_KEY=your_geoapify_api_key
```

`VITE_API_URL` should point to the backend origin appropriate for the environment. `VITE_GEOAPIFY_API_KEY` is required only if the current frontend uses Geoapify.

**Important:** Vite exposes variables prefixed with `VITE_` to frontend code. Never put private database, JWT, email, or payment secrets in frontend environment variables.

## 14. Installation and Setup

### Prerequisites

Install the following tools before running the project:

- Node.js and npm.
- Git.
- MongoDB Atlas access or another supported MongoDB deployment.
- A code editor such as Visual Studio Code.

### Clone the repository

```bash
git clone https://github.com/minhajahmdtk/Incidex.git
cd Incidex
```

### Install backend dependencies

```bash
cd backend
npm install
```

Configure the backend environment variables in a local `.env` file using the names required by the current source code.

### Install frontend dependencies

Open another terminal from the repository root:

```bash
cd frontend
npm install
```

Configure the frontend `.env` file with the appropriate local API URL and any required public configuration.

## 15. Running the Application

### Start the backend

From the backend directory, use the script defined in `backend/package.json`.

For the original local-server configuration:

```bash
npm start
```

For development, if the development script is configured:

```bash
npm run dev
```

The backend typically listens on port `3000` unless another port is configured.

### Start the frontend

From the frontend directory:

```bash
npm run dev
```

Vite displays the local development URL in the terminal, commonly `http://localhost:5173`.

### Local development flow

1. Start the backend.
2. Confirm that the database connection succeeds.
3. Start the frontend development server.
4. Confirm that the frontend API base URL points to the local backend.
5. Test available API routes and frontend components.
6. Verify each feature before marking it as completed.

If the backend is later converted to a serverless deployment, its startup and database-connection configuration must be adjusted for that environment.

## 16. Deployment

INCIDEX has been hosted on Render. The current status of each deployed service should be confirmed before publishing live URLs.

### Backend deployment

The backend requires:

- The correct backend root directory.
- An appropriate Node.js runtime and start command for the current backend architecture.
- Environment variables configured in the hosting dashboard.
- Working MongoDB connectivity.
- Appropriate CORS configuration for the frontend origin.

For a conventional Express server, the start command may be:

```bash
npm start
```

Use this command only if the current `package.json` and hosting setup support it.

### Frontend deployment

The frontend requires:

- The correct frontend root directory.
- A successful production build.
- The appropriate API base URL.
- Any required public environment variables.
- SPA routing configuration if React Router routes must work after a browser refresh.

For a Vite frontend, the usual build command is:

```bash
npm run build
```

The output directory is commonly `dist`.

### Deployment URLs

- **Frontend URL:** Add the verified public frontend URL.
- **Backend URL:** Add the verified public backend URL.
- **Repository:** https://github.com/minhajahmdtk/Incidex

Do not publish a placeholder as though it were a working live URL. Update these fields after confirming that the deployed services are accessible.

## 17. Testing

Testing should cover both backend APIs and their integration with the frontend.

Recommended test areas include:

- User registration and login.
- Invalid credentials and invalid input.
- Authentication and authorization.
- User profile retrieval and updates.
- Crime-report submission.
- Case-status changes and status history.
- User and administrator notifications.
- Resolution details and PDF generation.
- Feedback eligibility.
- Appeal and fine workflows, where implemented.
- Payment initiation and server-side verification, where implemented.
- Email delivery, where configured.
- Database connectivity.
- Frontend-to-backend communication.
- Direct navigation and page refresh on the hosted frontend.

Postman or another API client can be used to test backend routes.

Record actual results for each test. Features that have not been tested should be marked **Not yet verified** rather than reported as successful.

## 18. Limitations

The current project has limitations that should be documented as development progresses:

- Frontend pages and components are still being completed and integrated.
- The availability of each feature depends on its implementation and testing status.
- Email delivery depends on correct service configuration.
- Payment functionality requires appropriate credentials and server-side verification.
- Map functionality depends on the configured mapping and location-search services.
- Deployment availability and behavior depend on hosting configuration.
- The application should not be represented as an official police reporting service unless formally authorized.

## 19. Future Enhancements

Potential future improvements include:

- Completing and refining frontend pages.
- Improving accessibility and responsive design.
- Expanding automated testing.
- Improving API documentation.
- Strengthening validation and error handling.
- Improving monitoring and deployment reliability.
- Expanding analytics where justified by available data.
- Adding real-time notifications with Socket.IO if required and implemented in a future version.
- Improving map-based incident visualization where appropriate.

These are potential enhancements, not claims about completed functionality.

## 20. Contributing

Contributions and suggestions can help improve the project.

1. Fork the repository.
2. Create a branch for your changes.
3. Make focused changes and test them.
4. Commit your changes with a clear message.
5. Submit a pull request describing the changes.

When contributing, preserve existing functionality and avoid committing credentials or other sensitive information.

## 21. License

No specific open-source license is stated here. Add a license only after selecting one and including the corresponding license file in the repository.

---

**INCIDEX — Report. Track. Resolve.**
