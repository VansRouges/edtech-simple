# EdTech SaaS

## Overview
This is the **frontend** for the **EdTech SaaS platform**, a web-based application that facilitates communication between School Admins, teachers and students. The platform provides a dashboard for tracking **academic performance, event updates, and attendance records**.

The frontend is built using **Next.js, ShadCN UI, and TailwindCSS**, offering a seamless user experience with a modern UI. It integrates with **Appwrite** for authentication and data storage, and **Permit.io** for authorization.

## Features
- **User Authentication & Role Management:** Powered by **Appwrite** for authentication and **Permit.io** for fine-grained role-based access control (RBAC).
- **Multi-Tenant Support:** Schools can manage their own students, teachers, and school Administrators within their unique environments.
- **Student & Assignment Management:** Teachers can add students and assignments, track academic progress, and share performance reports.
- **Mobile-Responsive UI:** Built with **TailwindCSS** for a fully responsive experience.
- **Containerized Deployment:** Dockerized for ease of deployment and scalability.

## Tech Stack
- **Frontend Framework:** Next.js
- **UI Components:** ShadCN, TailwindCSS
- **Authorization:** Permit.io
- **Authentication & Backend Services:** Appwrite (for database & API integration)
- **State Management:** Zustand (with persistence enabled)
- **Containerization:** Docker

## Getting Started
### Prerequisites
Ensure you have the following installed:
- **Node.js** (v18+)
- **pnpm** (preferred) or npm/yarn
- **Permit Account**
- **Appwrite Project ID**
- **Docker** (for containerized deployment, optional)

### Installation
Clone the repository and install dependencies:
```sh
# Clone the repository
git clone https://github.com/your-repo/edtech-frontend.git
cd edtech-frontend

# Install dependencies
pnpm install  # or npm install / yarn install
```

### Environment Variables
Create a `.env.local` file in the root directory and configure the following:
```sh
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-appwrite-project-id
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-appwrite-instance
NEXT_PUBLIC_PERMIT_API_KEY=your-permit-api-key
```

### Running the Development Server
Start the development server:
```sh
pnpm dev  # or npm run dev / yarn dev
```
The application will be available at **http://localhost:3000**.

The application Backend will be available at **http://localhost:8080**.

### Building for Production
To generate an optimized production build:
```sh
pnpm build  # or npm run build / yarn build
```
To start the production server:
```sh
pnpm start  # or npm start / yarn start
```

## Docker Deployment
To run the app inside a Docker container:
```sh
docker build -t edtech-frontend .
docker run -p 3000:3000 edtech-frontend
```

## Contributing
We welcome contributions! Please follow these steps:
1. **Fork the repository** and create a new branch.
2. Implement your feature or fix.
3. Ensure all tests pass (`pnpm test`).
4. Open a **pull request** with a detailed description of your changes.

## Issues & Support
If you encounter any issues, feel free to open an issue in the GitHub repository or reach out to the maintainers.

## License
This project is licensed under the **MIT License**. See `LICENSE` for more details.

---

