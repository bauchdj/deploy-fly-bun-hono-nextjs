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

## ✈️ First-Time Deployment to Fly.io

Follow these steps to deploy your application for the first time:

### Prerequisites

-   [Fly.io CLI](https://fly.io/docs/hands-on/install-flyctl/) installed and authenticated
-   [Docker](https://www.docker.com/) running locally
-   Root `.env` file configured with your environment variables

### Step 1: Run the Server Deployment Script

Navigate to server directory

```bash
cd apps/server
```

Run the deploy script

```bash
bun run fly:deploy
```

### Step 2: Configure Your Server and Postgres Fly.io Apps

1. **Create a new Fly.io app**

    - **IMPORTANT**: Run the recommended command that the deploy script generated for you
        - Example: `fly launch --no-deploy --name bun-hono-api --internal-port 8080 --vm-cpu-kind shared --vm-cpus 1 --vm-memory 256`
    - Type `y` to use the existing configuration
    - Type `y` again to configure it. This will open a browser tab.

2. **Configure Postgres in Browser**

    - Select a Postgres option
    - Give it a name. It has to be unique.
        - Example: `bun-hono-api-pg`
    - For development, you may want to scale down resources
    - Adjust CPU, memory, and other settings as needed

3. **Docker Configuration**
    - **IMPORTANT**: Type `n` when asked to create `.dockerignore` from `.gitignore`. It will ask after the postgres app finishes.

### Step 3: Save Database Connection Info

After the Postgres app is created, **carefully save the connection information** displayed in the terminal. You'll need these details for your `.env` file.

Example connection info:

```console
Postgres cluster bun-hono-api-pg created
  Username:    postgres
  Password:    DrHjcNSjz1c7wN7
  Hostname:    bun-hono-api-pg.internal
  Flycast:     fdaa:a:1733:0:1::6
  Proxy port:  5432
  Postgres port:  5433
  Connection string: postgres://postgres:DrHjcNSjz1c7wN7@bun-hono-api-pg.flycast:5432
```

### Step 4: Verify Deployment of Server and Postgres

Once the Postgres deployment completes, your postgres app will be available at the name you configured. You can see it and your server app by running `fly apps list`.

Example output:

```console
% fly apps list
NAME           	OWNER   	STATUS  	LATEST DEPLOY
bun-hono-api   	personal	pending
bun-hono-api-pg	personal	deployed
```

### Step 6: Create / Update .env file

Navigate to root

```bash
cd ../../
```

Create and edit .env file

```bash
cp .env.example .env
```

**IMPORTANT**: Update the database variables based on the info it gave you. Change the `DATABASE_URL` temporarily so that the `<postgres-app-name>.flycast` is `localhost`.

Example database env variables:

```env
DATABASE_URL=postgres://postgres:DrHjcNSjz1c7wN7@localhost:5432
DATABASE_HOST=bun-hono-api-pg.internal
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=DrHjcNSjz1c7wN7
POSTGRES_DB=bun-hono-api
```

Then copy .env file to child directories

```bash
bun run env:sync
```

### Step 7: Proxy the Database on Fly.io and Run Migrations

Open a new terminal or tab and proxy the database on Fly.io

```bash
fly proxy 5432 -a <postgres-app-name>
```

Run migrations from root directory

```bash
bun run db:push
```

### Step 8: Revert .env file for final deployment

Edit .env file. Revert the `DATABASE_URL` so the host is `<postgres-app-name>.flycast` again.

Example database env variables:

```env
DATABASE_URL=postgres://postgres:DrHjcNSjz1c7wN7@bun-hono-api-pg.flycast:5432
DATABASE_HOST=bun-hono-api-pg.internal
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=DrHjcNSjz1c7wN7
POSTGRES_DB=bun-hono-api
```

Then copy .env file to child directories

```bash
bun run env:sync
```

### Step 9: Run the Web Deployment Script

Navigate to web directory

```bash
cd apps/web
```

Run the deploy script

```bash
bun run fly:deploy
```

### Step 10: Configure Your Web Fly.io App

1. **Create a new Fly.io app**

    - **IMPORTANT**: Run the recommended command that the deploy script generated for you
        - Example: `fly launch --no-deploy --name bun-nextjs-web --internal-port 3000 --vm-cpu-kind shared --vm-cpus 1 --vm-memory 256`
    - Type `y` to use the existing configuration
    - Type `y` again to configure it. This will open a browser tab.

2. **Docker Configuration**
    - **IMPORTANT**: Type `n` when asked to create `.dockerignore` from `.gitignore`

### Step 11: Verify App Creation

Now your postgres, server, and web app will be available on Fly.io at the name you configured. You can see them by running `fly apps list`.

Example output:

```console
% fly apps list
NAME           	OWNER   	STATUS  	LATEST DEPLOY
bun-hono-api   	personal	pending
bun-hono-api-pg	personal	deployed
bun-nextjs-web 	personal	pending
```

### Step 12: Deploy Server and Web apps

Navigate to root

```bash
cd ../../
```

```bash
bun run fly:deploy
```

This does the following:

-   First it bumps all the `versions` by 0.0.1+ by `default`
-   Then it will delete all `.env` files in child directories and copy the root `.env` files to the child directories.
-   Then it will update the `secrets` and `stage` them on fly based on the env file.
-   Then it will `build` and `deploy` the **server** app
-   Then it will `build` and `deploy` the **web** app

### Step 15: Verify Deployment and Celebrate! 🎉

List your apps

```bash
fly apps list
```

Example output:

```console
% fly apps list
NAME           	OWNER   	STATUS   	LATEST DEPLOY
bun-hono-api   	personal	deployed 	58s ago
bun-hono-api-pg	personal	deployed
bun-nextjs-web 	personal	suspended
```

If everything was successful, you should be able to navigate to `<web-app-name>.fly.dev`, for ex. [bun-nextjs-web.fly.dev](https://bun-nextjs-web.fly.dev), and see `"Hello Hono!"`

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
