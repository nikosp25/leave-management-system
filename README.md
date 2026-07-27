# Leave Management System

A full-stack monorepo for managing employee leave requests with role-based access control. Employees submit and track time off, managers review and approve requests, and administrators manage user accounts. The backend exposes a REST API secured with JWT cookies; the frontend is a React single-page application that consumes those endpoints.

## Main Features

- **Authentication** — Email/password login with HttpOnly JWT cookies and session restoration on page load
- **Leave requests** — Submit sick or personal leave, view paginated history, and cancel pending requests
- **Leave balance tracking** — Working-day calculation (weekends excluded), balance checks on submission, deduction on approval, and restoration on rejection or management cancellation
- **Manager workflow** — Review all leave requests, filter by status, approve or reject with optional comments, and cancel approved leave before it starts
- **User management (Admin)** — Create, update, and soft-delete users; search and filter by role; view deleted users
- **Employee directory (Manager)** — Search and browse active employees with pagination and sorting
- **Role-specific dashboards** — Overview pages tailored to Employee, Manager, and Admin roles
- **Soft delete** — Users and leave requests support soft deletion; deleted users cannot authenticate
- **API documentation** — Interactive Swagger UI powered by springdoc-openapi

## User Roles and Capability-Based Authorization

The system uses three roles (`EMPLOYEE`, `MANAGER`, `ADMIN`) defined in Flyway migration `V2__populate_lookup_tables.sql`. Authorization is enforced through **capabilities** assigned to roles via a many-to-many relationship (`roles_capabilities`), populated in `V6__populate_capabilities.sql`.

| Capability | Employee | Manager | Admin |
|---|---|---|---|
| `READ_OWN_LEAVE` | ✓ | ✓ | ✓ |
| `CREATE_LEAVE` | ✓ | ✓ | ✓ |
| `CANCEL_OWN_LEAVE` | ✓ | ✓ | ✓ |
| `READ_ALL_LEAVE` | | ✓ | ✓ |
| `APPROVE_REJECT_LEAVE` | | ✓ | ✓ |
| `READ_EMPLOYEES` | | ✓ | ✓ |
| `READ_MANAGERS` | | | ✓ |
| `READ_DELETED_USERS` | | | ✓ |
| `MANAGE_USERS` | | | ✓ |

Admin receives **all** capabilities. Backend endpoints use Spring Security `@PreAuthorize("hasAuthority('...')")` annotations. The frontend mirrors this with capability checks on routes (`CapabilityRoute`) and sidebar menu items (`dashboardMenu.ts`).

### Frontend Routes by Capability

| Route | Required Capability | Notes |
|---|---|---|
| `/dashboard` | — | Available to all authenticated users |
| `/dashboard/apply` | `CREATE_LEAVE` | Apply for leave |
| `/dashboard/manage-leave` | `READ_ALL_LEAVE` | Manager/Admin leave review |
| `/dashboard/employees` | `READ_EMPLOYEES` | Restricted to `MANAGER` role |
| `/dashboard/manage-users` | `MANAGE_USERS` | Admin user management |
| `/dashboard/manage-users/create` | `MANAGE_USERS` | Create user |
| `/dashboard/manage-users/:uuid/edit` | `MANAGE_USERS` | Edit user |

## Technology Stack

### Backend

| Technology | Version / Details |
|---|---|
| Java | 21 |
| Spring Boot | 3.5.16 |
| Spring Data JPA | Hibernate with `ddl-auto=validate` |
| Spring Security | JWT cookie authentication, method-level security |
| MySQL Connector/J | Runtime driver |
| Flyway | Schema migrations (`flyway-mysql`) |
| JJWT | 0.12.6 |
| springdoc-openapi | 2.8.9 (Swagger UI) |
| Lombok | Compile-time boilerplate reduction |
| Apache Commons Lang | 3.18.0 |
| Maven | 3.9.16 (wrapper included) |

### Frontend

| Technology | Version / Details |
|---|---|
| React | 19.2.7 |
| TypeScript | 6.0.3 |
| Vite | 8.1.1 |
| React Router | 8.2.0 |
| Tailwind CSS | 4.3.2 (`@tailwindcss/vite`) |
| Lucide React | 1.24.0 (icons) |
| ESLint | 10.6.0 |

## Project Structure

```
LeaveManagementSystem/
├── backend/
│   ├── src/main/java/com/example/leave_management_system/
│   │   ├── config/              # Swagger configuration
│   │   ├── controller/          # REST controllers (auth, users, leave requests)
│   │   ├── dto/                 # Request/response data transfer objects
│   │   ├── exceptions/          # Custom exceptions and global handler
│   │   ├── mapper/              # Entity ↔ DTO mappers
│   │   ├── model/               # JPA entities (User, Role, Capability, LeaveRequest, …)
│   │   ├── Repository/          # Spring Data JPA repositories
│   │   ├── security/            # JWT filter, security config, user details
│   │   └── service/             # Business logic
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── db/migration/        # Flyway SQL migrations (V1–V11)
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
├── frontend/
│   ├── src/
│   │   ├── components/          # Dashboard, layout, and feature components
│   │   ├── context/             # AuthContext provider
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Route-level page components
│   │   ├── routes/              # ProtectedRoute, CapabilityRoute
│   │   ├── services/            # API client modules
│   │   ├── shared/              # Shared layout (Header, Footer)
│   │   └── types/               # TypeScript type definitions
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Authentication and Security

- **Login** — `POST /api/v1/auth/login` accepts email and password, validates credentials via Spring Security's `AuthenticationManager`, and sets an HttpOnly cookie named `jwt_token` (15-minute expiry, path `/`).
- **JWT validation** — `JwtAuthenticationFilter` reads the cookie on each request, validates the token, and populates the Spring Security context with the user's role and capabilities.
- **Logout** — `POST /api/v1/auth/logout` deletes the `jwt_token` cookie and returns HTTP 204.
- **Password storage** — BCrypt hashing via `BCryptPasswordEncoder`.
- **Session model** — Stateless (`SessionCreationPolicy.STATELESS`); no server-side sessions.
- **CORS** — Allows `http://localhost:5173` with credentials for cross-origin cookie transmission.
- **CSRF** — Disabled (stateless JWT cookie API).
- **Soft-deleted users** — Accounts with `deleted = true` are locked and cannot authenticate.
- **Frontend** — All authenticated API calls use `credentials: 'include'` via the shared `apiFetch` helper. A 401 response triggers a session-expired event and redirects to login.

## Database and Flyway Migrations

- **Database name:** `leave_management`
- **Schema management:** Flyway runs automatically on startup; Hibernate validates the schema (`spring.jpa.hibernate.ddl-auto=validate`).
- **Open Session in View:** Disabled (`spring.jpa.open-in-view=false`).

| Migration | Description |
|---|---|
| `V1__init_schema.sql` | Creates `roles`, `role_capabilities`, `users`, `leave_types`, `leave_statuses`, `leave_requests` |
| `V2__populate_lookup_tables.sql` | Seeds roles (`EMPLOYEE`, `MANAGER`, `ADMIN`), leave types (`SICK_LEAVE`, `PERSONAL_LEAVE`), statuses (`PENDING`, `APPROVED`, `REJECTED`) |
| `V3__change_uuid_to_binary.sql` | Converts user UUID column to `BINARY(16)` |
| `V4__make_leave_request_reason_optional.sql` | Makes leave request `reason` nullable |
| `V5__upgrade_to_many_to_many_capabilities.sql` | Replaces role_capabilities with `capabilities` and `roles_capabilities` tables |
| `V6__populate_capabilities.sql` | Seeds nine capabilities and maps them to roles |
| `V7__add_uuid_to_leave_requests.sql` | Adds UUID column to leave requests |
| `V8__add_manager_comment_to_leave_requests.sql` | Adds `manager_comment` column |
| `V9__add_available_leave_days_to_users.sql` | Adds `available_leave_days` (default 25) |
| `V10__seed_demo_users.sql` | Seeds three demo accounts |
| `V11__add_cancelled_leave_status.sql` | Adds `CANCELLED` leave status |

### Leave Statuses

`PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`

### Leave Types

`SICK_LEAVE`, `PERSONAL_LEAVE`

## Requirements

- **Java 21** (JDK)
- **Maven** — included via wrapper (`mvnw` / `mvnw.cmd`)
- **Node.js and npm** — for the frontend
- **MySQL 8.x** — running locally on port 3306

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd LeaveManagementSystem
```

### 2. MySQL database setup

Create the database and a user matching `application.properties`:

```sql
CREATE DATABASE leave_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'cf9'@'localhost' IDENTIFIED BY '12345';
GRANT ALL PRIVILEGES ON leave_management.* TO 'cf9'@'localhost';
FLUSH PRIVILEGES;
```

Ensure MySQL is running on `localhost:3306` before starting the backend. Flyway will create and populate all tables on first startup.

### 3. Run the backend

From the `backend` directory:

**Windows (PowerShell / CMD):**

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

**macOS / Linux:**

```bash
cd backend
./mvnw spring-boot:run
```

The API starts at **http://localhost:8080** (Spring Boot default port).

### 4. Run the frontend

From the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```

The UI starts at **http://localhost:5173** (Vite default port).

## Swagger / OpenAPI

Interactive API documentation is available once the backend is running:

| Resource | URL |
|---|---|
| Swagger UI | http://localhost:8080/swagger-ui/index.html |
| OpenAPI JSON | http://localhost:8080/v3/api-docs |

Swagger UI and OpenAPI endpoints are publicly accessible (no authentication required). Protected endpoints document the `jwt_token` cookie security scheme — log in first so the browser receives the cookie, then use **Authorize** in Swagger UI if needed. All API endpoints can be viewed and tested through Swagger UI.

## Demo Accounts

Three users are seeded by Flyway migration `V10__seed_demo_users.sql`. Emails and roles below are confirmed from that migration. Passwords are provided for local testing (BCrypt hashes in the database cannot be reversed).

| Role | Email | Password |
|---|---|---|
| Admin | `admin@leave-demo.local` | `Admin123!` |
| Manager | `manager@leave-demo.local` | `Manager123!` |
| Employee | `employee@leave-demo.local` | `Employee123!` |

Each demo account starts with **25 available leave days**.

## Security Notice

> **This is a local student portfolio project.** Database credentials (`cf9` / `12345`), the JDBC connection string, and the JWT secret key in `backend/src/main/resources/application.properties` are intentionally visible for demonstration and evaluation purposes only.
>
> **Do not reuse these values in production.** Before any real deployment, replace them with environment variables or a secrets manager, use HTTPS (`jwtCookie.setSecure(true)`), and generate a strong, unique JWT signing key.

## Screenshots

<!-- Replace placeholder paths with actual screenshot files when available -->

| Screen | Preview |
|---|---|
| Login | _Screenshot placeholder — login page_ |
| Employee Dashboard | _Screenshot placeholder — leave balance and request history_ |
| Apply for Leave | _Screenshot placeholder — leave submission form_ |
| Manage Leave (Manager) | _Screenshot placeholder — approval workflow_ |
| Manage Users (Admin) | _Screenshot placeholder — user management table_ |
| Employee Search (Manager) | _Screenshot placeholder — employee directory_ |
