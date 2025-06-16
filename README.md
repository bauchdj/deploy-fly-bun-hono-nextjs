# Deploy Bun, Hono, Next.js to Fly.io or any container platform

A modern full-stack application built with Next.js, Hono, and Bun, designed for deployment on any container platform, but with everything you need to deploy to Fly.io.

## 🚀 Tech Stack

-   **Frontend**: Next.js TypeScript, Tailwind CSS
-   **Backend**: Hono.js, TypeScript, Bun
-   **Database**: PostgreSQL (Drizzle)
-   **Deployment**: Docker, Fly.io
-   **Package Manager**: Bun

## 📦 Project Structure

```
.
├── apps/
│   ├── web/            # Next.js frontend application
│   └── server/         # Hono.js backend API server
├── packages/           # Shared packages
│   ├── config/        # Shared configuration
│   └── db/            # Database models and migrations
├── .env.example       # Example environment variables
└── package.json       # Root package.json with shared scripts
```

## 🛠️ Prerequisites

-   [Bun](https://bun.sh/) (v1.0.0 or later)
-   [Docker](https://www.docker.com/) (for local development)
-   [Orbstack](https://orbstack.dev/) (highly recommend this Mac DockerHub alternative)
-   [PostgreSQL](https://www.postgresql.org/) (for local development)
-   [Fly.io CLI](https://fly.io/docs/hands-on/install-flyctl/) (for deployment)

## 🚀 Getting Started

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/deploy-fly-bun-hono-nextjs.git
    cd deploy-fly-bun-hono-nextjs
    ```

2. **Install dependencies**

    ```bash
    bun install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env
    # Edit .env with your configuration
    ```

    The `.env` is used for local development and production deployment. The root package.json has these scripts to help you manage the environment variables:

    ```bash
    bun run env:sync
    bun run env:sync:dry-run
    bun run env:clean
    bun run env:clean:dry-run
    bun run env:clean-sync
    ```

    The `env:sync` script will copy the environment variables from the root `.env` to the child `.env` files. The `env:clean` script will remove the child `.env` files. The `env:clean-sync` script will remove the child `.env` files and then copy the environment variables from the root `.env` to the child `.env` files.

4. **Start the development servers**

    ```bash
    # Start both web and server in development mode
    bun run dev

    # Or start them separately
    bun run dev:web     # Start web app (port 3000)
    bun run dev:server  # Start API server (port 8080)
    ```

## 🏗️ Building for Production

```bash
# Build both web and server
bun run build

# Start the production servers
bun run start
```

## 🐳 Docker Development

```bash
# Build the docker images
bun run docker:build

# Build and start all services
bun run docker:up

# Stop all services
bun run docker:down

# Remove all images, containers, networks, and volumes
bun run docker:remove

# Reset everything and start fresh
bun run docker:reset
```

## ✈️ Deployment to Fly.io

Make sure you have the Fly.io CLI installed and are logged in:

```bash
fly auth login
```

### Deploy the Server and Web App

```bash
bun run fly:deploy
```

### Deploy the Server

```bash
# Navigate to server directory
cd apps/server

# Deploy to Fly.io
bun run fly:deploy
```

### Deploy the Web App

```bash
# Navigate to web directory
cd apps/web

# Deploy to Fly.io
bun run fly:deploy
```

## 🔄 Environment Variables

Copy `.env.example` to `.env` and update the values as needed:

```env
# Database
DATABASE_URL=postgres://user:password@host:port/dbname

# Server
SERVER_APP_NAME=your-app-name
SERVER_PORT=8080
NEXT_PUBLIC_SERVER_URL=https://your-api-url.com

# Web
WEB_APP_NAME=your-web-app
WEB_URL=https://your-web-url.com
WEB_PORT=3000

# Deployment
PLATFORM="linux/amd64"
REGISTRY="registry.fly.io"
```

## 📝 Available Scripts

-   `bun run dev` - Start both web and server in development mode
-   `bun run build` - Build both web and server for production
-   `bun run start` - Start both web and server in production mode
-   `bun run lint` - Run linter
-   `bun run db:migrate` - Run database migrations
-   `bun run fly:deploy` - Deploy both web and server to Fly.io

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [David Bauch](https://github.com/bauchdj)
