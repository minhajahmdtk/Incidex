# INCIDEX — Crime Incident Reporting & Case Tracking System

INCIDEX is a full-stack web application for reporting crime incidents and tracking their case status through a structured workflow.

The system provides separate interfaces and functionality for **Users** and **Administrators**. Users can submit crime reports, track their cases, receive notifications, view status history, access resolution details, download final reports, and submit feedback. Administrators can manage users and cases, update case statuses, resolve cases, view dashboard statistics, manage notifications, and review feedback.

---


# Features

## User Features

### Authentication

* User registration
* User login
* Password hashing using bcrypt
* JWT-based authentication
* Protected user routes

### User Profile

Users can:

* View their profile
* Update their profile information

### Crime Reporting

Users can submit crime reports with:

* Crime category
* Incident description
* Incident location
* Latitude
* Longitude
* Automatically generated Case ID
* Report date and time

### Supported Crime Categories

* Theft
* Fraud
* Cybercrime
* Assault
* Vandalism
* Missing Person
* Accident
* Other

### Case Tracking

Each case follows the workflow:

```text
New
 ↓
Acknowledged
 ↓
In Progress
 ↓
Resolved
```

Users can:

* View their submitted cases
* View individual case details
* View the current case status
* View complete status history
* View resolution details after resolution

### Notifications

Users receive notifications when:

* Their case is acknowledged
* Their case moves to In Progress
* Their case is resolved

Users can:

* View notifications
* Mark one notification as read
* Mark all notifications as read
* Delete notifications

### Final Case Report

After a case is resolved, the user can:

* View final details
* View action taken
* View resolution details
* Download the final case report as a PDF

### Feedback

Users can submit feedback for resolved cases.

---

# Administrator Features

## Admin Authentication

* Admin login
* JWT authentication
* Admin-only protected routes
* Role-based authorization

## User Management

Administrators can:

* View all registered users
* View individual user details

User passwords are excluded from admin user responses.

## Case Management

Administrators can:

* View all crime cases
* View individual case details
* Update case status
* Resolve cases
* View case information

### Case Status Workflow

Administrators control the case status progression:

```text
New
  ↓
Acknowledged
  ↓
In Progress
  ↓
Resolved
```

The backend prevents invalid status transitions.

For example:

```text
New → In Progress
```

is not allowed.

The correct transition is:

```text
New → Acknowledged → In Progress
```

---

# Status History

Whenever an administrator changes a case status, the change is stored in the `StatusHistory` collection.

Example:

```text
New
↓
Acknowledged
↓
In Progress
↓
Resolved
```

Each history record contains:

* Case ID
* Status
* Updated date and time

The **administrator changes the case status**, while the **user can view the complete status history**.

---

# Admin Notifications

When a user creates a new crime report, an admin notification is created in MongoDB.

Example:

```text
New crime report received.
Case ID: INC-0001
```

Administrators can:

* View notifications
* Mark one notification as read
* Mark all notifications as read

Real-time Socket.IO notifications are planned for the frontend integration stage.

---

# Admin Dashboard

The backend provides dashboard statistics including:

* Total users
* Total cases
* New cases
* Acknowledged cases
* In Progress cases
* Resolved cases

Additional statistics include:

### Cases by Category

Crime reports are grouped by:

* Theft
* Fraud
* Cybercrime
* Assault
* Vandalism
* Missing Person
* Accident
* Other

### Monthly Case Statistics

Cases are grouped by:

* Year
* Month
* Number of cases

These statistics will later be displayed using charts in the Admin Dashboard frontend.

---

# Feedback Management

Administrators can access feedback submitted by users for resolved cases.

Feedback contains:

* Case
* User
* Feedback details
* Submission date and time

---

# PDF Final Report

For resolved cases, the system generates a PDF containing information such as:

* User name
* Email
* Phone number
* Case ID
* Crime category
* Incident description
* Incident location
* Report date and time
* Current status
* Final details
* Action taken
* Resolution details
* Resolved date and time

---

# Technology Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* PDFKit

## Frontend — Planned

* React.js
* Vite
* JavaScript
* Tailwind CSS
* Axios
* React Router
* React Leaflet
* OpenStreetMap

## Planned Deployment

* Docker
* Jenkins
* AWS EC2
* Nginx
* MongoDB Atlas

---

# Project Architecture

```text
INCIDEX
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── user.js
│   │   ├── admin.js
│   │   ├── crimeReport.js
│   │   ├── statusHistory.js
│   │   ├── userNotification.js
│   │   ├── adminNotification.js
│   │   └── feedback.js
│   │
│   ├── router/
│   │   ├── authRouter.js
│   │   ├── userRouter.js
│   │   ├── adminAuthRouter.js
│   │   ├── adminRouter.js
│   │   ├── adminDashboardRouter.js
│   │   ├── adminNotificationRouter.js
│   │   ├── caseRouter.js
│   │   ├── notificationRouter.js
│   │   └── feedbackRouter.js
│   │
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# API Structure

## User APIs

### Authentication

```text
POST /user/register
POST /user/login
```

### User Profile

```text
GET /user/profile
PUT /user/profile
```

### Crime Cases

```text
POST /cases/report
GET /cases/my-cases
GET /cases/:id
GET /cases/history/:id
GET /cases/resolution/:id
GET /cases/pdf/:id
DELETE /cases/:id
```

### User Notifications

```text
GET /notifications
PUT /notifications/read/:id
PUT /notifications/read-all
DELETE /notifications/:id
```

### Feedback

```text
POST /feedback
```

---

# Admin APIs

## Authentication

```text
POST /admin/login
```

## User Management

```text
GET /admin/users
GET /admin/users/:id
```

## Case Management

```text
GET /admin/cases
GET /admin/cases/:id

PATCH /admin/cases/status/:id
PATCH /admin/cases/resolve/:id
```

## Admin Notifications

```text
GET /admin/notifications
PATCH /admin/notifications/read/:id
PATCH /admin/notifications/read-all
```

## Dashboard

```text
GET /admin/dashboard
GET /admin/dashboard/category
GET /admin/dashboard/monthly
```

## Feedback

```text
GET /admin/feedback
```

---

# Authentication

INCIDEX uses JWT authentication.

The token is sent through the request header:

```text
token: YOUR_JWT_TOKEN
```

User routes verify:

```text
role: user
```

Admin routes verify:

```text
role: admin
```

This prevents users from accessing administrator functionality and prevents administrators from using user-only functionality.

---

# Database Collections

The application currently uses the following MongoDB collections:

```text
Users
Admins
CrimeReports
StatusHistory
UserNotifications
AdminNotifications
Feedback
```

### Relationships

```text
User
 │
 └── CrimeReports
       │
       └── StatusHistory

CrimeReport
 │
 ├── UserNotification
 ├── AdminNotification
 └── Feedback
```

---

# Case Workflow

The complete case workflow is:

```text
User submits crime report
          │
          ▼
     Case Created
          │
          ▼
        New
          │
          ▼
    Acknowledged
          │
          ▼
     In Progress
          │
          ▼
       Resolved
          │
          ├── Resolution Details
          ├── Final Details
          ├── Action Taken
          ├── PDF Report
          └── User Feedback
```

Every status change is recorded in `StatusHistory`.

---

# Security

The backend includes:

* JWT authentication
* Role-based authorization
* Password hashing using bcrypt
* Protected user routes
* Protected admin routes
* User-specific case access
* Admin-only case management
* User-specific notifications
* Validation for user input

---

# Current Backend Architecture Principle

INCIDEX follows a simple Express architecture.

Route logic is maintained directly inside router files.

```text
Router
  │
  ├── Authentication
  ├── Validation
  ├── Database Operations
  ├── Authorization
  └── Response
```

The current backend intentionally does not use separate:

```text
controllers/
middleware/
services/
```

This keeps the project structure simple and suitable for the current project requirements.

---

# Future Development

The next major stage is frontend development.

Planned frontend functionality includes:

* User login and registration UI
* User dashboard
* Crime report form
* Leaflet map
* Location selection
* Case tracking interface
* Status history timeline
* Notification interface
* Resolution page
* PDF download
* Feedback form
* Admin dashboard
* Admin case management
* Admin notifications
* Charts and statistics
* Google Maps navigation
* Dark/white theme
* Protected routes

After frontend integration, Socket.IO will be added for real-time administrator notifications when a new crime report is submitted.

---

# Project Goal

The goal of INCIDEX is to provide a structured digital platform where citizens can report incidents and track their case progress while administrators can efficiently manage reports, update case statuses, monitor statistics, and provide resolution information.
