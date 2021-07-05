# akademik API

This application is REST API for faculty portal application.
It uses `NestJS` framework with `Typescript`.

## Prerequisites

In order to run this application you need to install:
- Node.js
- PostgreSQL database

## Installation

To install all needed packages run:
```bash
$ npm install
```

## Application parameters

In order to function properly this application needs some environment variables to be set.

Create `.env` file in project root directory and set those variables.
You can see how that file is supposed to look like in `.env.example`.

## Development

To populate database with dummy data for testing purposes run:
```bash
$ npm run db:seed
```

This will populate database and create users.
It will create admin user with email `admin@akademik.com` and password `admin`.
All other users have password `password` (their emails are random).

Note: Please run seeder only on empty database.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run start:prod
```