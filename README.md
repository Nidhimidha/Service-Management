
# Service Management

##  Installation

1. Clone the repository ` https://github.com/Nidhimidha/Service-Management.git`
2. Install [docker](https://www.docker.com/products/docker-desktop/) to run postgres
3. Run the command - ` docker run --name <DOCKER_CONTAINER_NAME> -p 5432:5432 -e POSTGRES_PASSWORD=<PASSWORD> -d <CONTAINER_NAME> `
4. Use tool such as [DBeaver](https://dbeaver.io/download/) or [pgAdmin](https://www.pgadmin.org/download/) to manage and observe the database
5. Create Database using DB tool
6. Update environment variables in `.env.dev` as per your configurations


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Installation



## Database

### user

| Column Name        | Data Type           |
| ------------- | ------------- |
| id      | uuid |
| username      | varchar      |
| password | varchar      |


### service

| Column Name        | Data Type           |
| ------------- | ------------- |
| id      | uuid |
| name      | varchar      |
| description | varchar      |
| versionCount      | int4      |
| lastModifiedAt | timestamp      |


### version

| Column Name        | Data Type           |
| ------------- | ------------- |
| id      | uuid |
| versions      |  _text      |
| serviceId | varchar      |


## Project Structure
```
src/
├── app.module.ts                        # Application root module
├── config.schema.ts                     # Schema for the environment variables
├── auth/
|   └── dto/
|       ├── auth-credentials.dto.ts      # DTO for sign in and sign up request payloads
|       └── jwt-payload.interface.ts     # Interface for JWT payload validation
│   ├── auth.controller.ts               # Controller for auth to handle the requests
│   ├── auth.module.ts                   # Module for auth
|   ├── auth.service.ts                  # Service for auth handling
│   ├── get-user-decorator.ts            # Decorator to return the user information upon successful authorization validation
|   ├── jwt-strategy.ts                  # JWT Validation logic
|   ├── user.entity.ts                   # User login entity
│   └── users.repository.ts              # Repository for auth/user sign up
├── services/
|   └── dto/
|       ├── add-service.dto.ts           # DTO for adding a new service
|       ├── filter-service.dto.ts        # DTO for filtering the services
|       └── pagination.dto.ts            # DTO for pagination and sorting of services
│   ├── service.entity.ts                # Service entity
│   ├── services.controller.ts           # Controller for Services to handle the requests
│   ├── services.module.ts               # Module for Services
│   ├── services.repository.ts           # Services Repository
│   └── services.service.ts              # Service for handling the operations of services
├── versions/
|   └── tests/
|       └── versions.service.spec.ts     # Tests for versions
│   ├── version.entity.ts                # Version entity
│   ├── versions.controller.ts           # Controller for Version to handle the requests
│   ├── versions.module.ts               # Module for versions
│   └── versions.repository.ts           # Versions Repository
|   └── versions.service.ts              # Service for handling the operations of versions
└── main.ts                              # Application entry point

```

## Assumptions

- Version includes just the version number (e.g., 1.0.0)
- Deleting a service ID should delete the record from version table as well


## Major Items Pending
- Return current page number and total number of records in the GET SERVICES response
- Add unit tests for all controllers, repository and services
- Consider using cursor based pagination instead of offset based pagination


## Design

### Event driven updates

When a new service is added/updated, the version count is updated for the service. 'version.set' event is emitted to the versions service. New version is pushed to to already existing list of versions for the added/updated service ID in the versions entity


## APIs

### AUTH

#### /signup - Signs up user

```
POST http://localhost:3000/auth/signup

REQUEST PAYLOAD
{
    "username": "nidhim",
    "password": "Secret%%%"
}
```


#### /signin - Signs in User and generates JWT access token

```
POST http://localhost:3000/auth/signin

REQUEST PAYLOAD
{
    "username": "nidhim",
    "password": "Secret%%%"
}
```

### SERVICES (PROTECTED - BEARER TOKEN)

#### GET /services - Fetches all the services

```
GET http://localhost:3000/services

SAMPLE RESPONSE -
[
    {
        "id": "3eff63b9-5261-4757-b801-0675bb08dba9",
        "name": "Contact Us",
        "description": "Lorem Ipsum",
        "versionCount": 1,
        "createdAt": "2024-11-07T08:41:12.997Z"
    },
]
```

#### GET /services - Applies filter of the search text(name and description), pagination and sorting


```
GET http://localhost:3000/services?searchText=contact&page=1&limit=1&sortBy=name&sortOrder=DESC

SAMPLE RESPONSE -

[
    {
        "id": "6b86c249-f82b-4718-b117-9af081d8c054",
        "name": "About Us",
        "description": "Lorem Ipsum",
        "versionCount": 1,
        "lastModifiedAt": "2024-11-07T10:10:40.468Z"
    }
]
```

#### POST /services - creates new servuce

```
POST http://localhost:3000/services

REQUEST PAYLOAD

{
    "name": "About Us",
    "description": "Lorem Ipsum",
    "version": "1.0.0"
}

SAMPLE RESPONSE

{
    "name": "About Us",
    "description": "Lorem Ipsum",
    "id": "6b86c249-f82b-4718-b117-9af081d8c054",
    "versionCount": 1,
    "lastModifiedAt": "2024-11-07T10:10:40.468Z"
}
```


#### DELETE /services/:id - deletes the service for the service id in the request param

```
DELETE http://localhost:3000/services/6b86c249-f82b-4718-b117-9af081d8c054

SAMPLE RESPONSE
1

```


#### PATCH /services/:id - updates the service for the service id in the request param, with data in request payload

```
PATCH http://localhost:3000/services/ed5d5954-a1ae-4c57-9df4-2ad07922a789

REQUEST PAYLOAD
{
    "name": "Contact Us 3",
    "description": "Lorem Ipsum 3",
    "version": "1.0.1"
}

SAMPLE RESPONSE

{
    "id": "ed5d5954-a1ae-4c57-9df4-2ad07922a789",
    "name": "Contact Us 3",
    "description": "Lorem Ipsum 3",
    "versionCount": 2,
    "createdAt": "2024-11-07T09:40:33.368Z"
}

```

### VERSIONS (PROTECTED - BEARER TOKEN)

#### GET /versions/:id - fetches versions for the given service id in the request param

```

GET http://localhost:3000/versions/1d465673-5417-4134-b87d-f74fc9950a5b

SAMPLE RESPONSE -

[
    "1.0.0"
]

```