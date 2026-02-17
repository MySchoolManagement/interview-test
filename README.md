## Summary

This is a very basic application for the purposes of conducting a one-to-one interview. You will be asked to implement one or more features in this application. This is not representative of our production codebase. Think of it as a safe playground where we can explore how you approach problems, structure improvements, and collaborate.

Familiarize yourself with the project, learn the flow and what it is trying to achieve.

## Tech Stack

### Backend
- Framework: Symfony 8 (PHP 8.4)
- Database: PostgreSQL 15
- Real-Time: Symfony Mercure (Server-Sent Events / WebSockets)

### Frontend
- Library: React 18
- Language: TypeScript
- Build Tool: Vite
- Styling: Tailwind CSS
- State: React Hooks

### Infrastructure
- Containerization: Docker & Docker Compose
- Web Server: Nginx (Reverse Proxy for PHP-FPM)

## Installation

We assume a working docker environment with docker compose installed. You can follow these installation guides if you don't have docker installed: [here](https://docs.docker.com/engine/install) and [here](https://docs.docker.com/compose/install). 

```
# From within the application directory run the following commands.

# Start the application
docker-compose up -d --build

# Create Database Schema
docker-compose exec php bin/console doctrine:schema:update --force
```

## Debugging

XDebug is available and will attempt to connect to the debugger on your local machine at the start of every request. `xdebug.idekey` is configured as `XDEBUG`.