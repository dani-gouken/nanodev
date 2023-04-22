# Requirements

* NodeJS 16 or higher + npm/yarn
* go 1.20 or higher
* docker + docker-compose

# Glossary

- Request: a citizen request
- Category: the category of a citizen request

# Project organization
- `/admin` : strapi administration for authentification and data management
- `/front` : ViteJS + React web ui
- `/api` : go (Gin Gonic+Gorm) api

# Run the project

* *1- Start the database and mailer*
    - run `docker-compose up -d` to start the database and the mail server
    - It will start a `mysql` on port 3301 and `maildev` on port 1080/1025
    - The web ui of the mailer is accessible on port 1080
    - 2 Setup the environment variable

* *2- Install dependencies*
    - open `admin/` and run `yarn or npm i`
    - open `front/` and run `yarn or npm i`
    - open `api/` and run `go get -u`

* *2- Start the development servers*
    - open `admin/` and run `yarn start or npm run start`. It will the development server on port `1337`
    - open `front/` and run `yarn dev or npm run dev`. It will start the ui development server on port `5173`
    - open `api/` and run `go run main.go`. It will start the api on port `8080`

#  Test the project

## Web UI/API
- Open http://localhost:5173/login.
- Register an account
- Login
- Enter the OTP, you getit by opening the mailer ui on port 1080
- Create a request
## Administration
- open http://localhost:1337
- Login
    - The default credentials are: demo@example.com/demo
- Categories and user roles are populated automatically on server start
- Change the status of the created request to REJECTED/ACCEPTED
- An email is sent to the client

# Missing feature
- [] Kubernetes configuration
- [] Deployment
- [] Automatic assignment of requests
