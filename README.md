# CarUserManagementFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.11.

## Development Server

Run `ng serve` for a dev server. Navigate to [http://localhost:4200/](http://localhost:4200/). The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use:

- `ng generate directive`
- `ng generate pipe`
- `ng generate service`
- `ng generate class`
- `ng generate guard`
- `ng generate interface`
- `ng generate enum`
- `ng generate module`

## Running Unit Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running End-to-End Tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Project Structure 

src/ 
├── app/ 
│   ├── components/         # Main components 
│   ├── guards/             # Route guards for protected routes 
│   ├── interceptors/       # HTTP interceptors 
│   ├── services/           # Centralized business logic 
│   ├── app.component.ts    # Main application component 
│   ├── app.routes.ts       # Route definitions 
│   └── app.config.ts       # Application configuration 
├── assets/                 # Static resources 
└── environments/           # Environment configurations (dev/prod) 
     


## Technologies Used

- **Angular Material**: For modern and responsive design.
- **RxJS**: For managing asynchronous events.
- **HTTP Client**: For backend communication.
- **Angular Standalone Components**: To simplify module dependencies.

## Features Implemented

- **Authentication**:
  - Login with JWT token storage.
  - Protected route redirection via `AuthGuard`.
- **User Registration**:
  - Client-side validation for form fields.
- **Dashboard**:
  - Initial data display post-login.
- **HTTP Interceptor**:
  - Automatic token management for headers.
- **Testing**:
  - A test component (`TesteComponent`) for validating interceptors.

## Future Improvements

- Integrate the car management API.
- Enhance visual aspects of the dashboard. 
- Comprehensive unit testing using Karma. 

## Getting Started 

To get started, clone the repository and install dependencies: 

```bash
git clone https://github.com/luigigenova/car-user-management-frontend.git 
cd car-user-management-frontend 
npm install 
```

Start the development server: 

```bash
ng serve
``` 

Ensure the backend is running at `http://localhost:8080.`