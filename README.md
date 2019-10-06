# stackoverflow-api

[![Build Status](https://travis-ci.org/kenzdozz/stackoverflow-api.svg?branch=master)](https://travis-ci.org/kenzdozz/stackoverflow-api)

Stackoverflow-api is an API implementing lite version of stackoverflow

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.


### Prerequisites

What things you need to install the software and how to install them
To get the project up and running, you need to have mongodb, nodejs and npm installed on your local machine.
- [Download and install Nodejs here](https://nodejs.org/en/download/)
- [Download and install MongoDB](https://www.mongodb.com/)

Run the following commands to confirm installations.
```
node -v
```
 - should display Node version
```
npm -v
```
 - should display npm version
```
mongo --version
```
 - should display mongdb version


### Installing

 - Clone the repository `git clone https://github.com/kenzdozz/stackoverflow-api.git`
 - Navigate to the location of the folder
 - Run `npm install` to install dependencies
 - Run `npm start` to get the app started on your local machine

### Set Environment Variables
Rename `.env.example` to `.env` and update the variables accordingly


## Running the tests

To run the tests, run the command
```
npm run test
```
The tests, test the api endpoints to ensure that it works and returns the required data.


## Built With

* [Nodejs](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine
* [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
* [MongoDB](https://www.mongodb.org/) - The World's Most Advanced Open Source Relational Database
* [JWT](https://www.npmjs.com/package/jsonwebtoken) - JSON Web Token for aunthentication

## Authors

* **Onah Kenneth** - *Initial work* - [stackoverflow-api](https://github.com/kenzdozz/stackoverflow-api)

## License

This project is licensed under the MIT License

