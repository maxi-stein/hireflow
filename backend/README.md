<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# HireFlow Backend

A NestJS backend application for managing job candidates and employees.

## Description

This project is built with [NestJS](https://github.com/nestjs/nest) framework and provides APIs for:

- User authentication and authorization (JWT + Passport)
- Candidate profile management
- Employee management
- Education records for candidates

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Docker
- npm or yarn

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd hireflow/backend

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Environment
NODE_ENV=development
PORT=3000

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=root
POSTGRES_PASSWORD=a-very-secure-password
POSTGRES_DB=hireflow_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRATION_TIME=1d
```

### 3. Start Database with Docker

```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d

# Verify containers are running
docker ps
```

**Database Access:**

- **PostgreSQL**: `localhost:5432`
- **pgAdmin**: `http://localhost:5050`
  - Email: `root@admin.com`
  - Password: `a-very-secure-password`

### 4. Run Database Migrations

```bash
# Apply migrations (creates tables and initial data)
npm run migration:up

# Check migration status
npm run migration:show
```

### 5. Start the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:3550`

## Database Management

### Migration Commands

```bash
# Apply all pending migrations
npm run migration:up

# Revert the last migration
npm run migration:down

# Check migration status
npm run migration:show
```

## Running the Application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Project Structure

```
src/
├── app/                    # Main application module
├── config/                 # Configuration files
├── infrastructure/         # Database and external services
│   └── database/          # Database configuration and migrations
├── modules/               # Feature modules
│   ├── auth/             # Authentication module (JWT + Passport)
│   └── users/            # Users, candidates, employees module
└── shared/               # Shared constants and utilities
```

## License

This project is [MIT licensed](LICENSE).
