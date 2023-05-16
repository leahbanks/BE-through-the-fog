# Through the Fog API

## 📝 Description

Through the Fog API was built to serve as a back end to our React Native app. It is built using Javascropt, Node, Express and PostgreSQL in addition Google Auth and Bcrypt to ensure the security of user data. 

The end points are secured with Google Auth and can be viewed and tested on Swagger [here](https://fog-of-war-auth.onrender.com/api-docs/). 

## End Points


### Users
* `POST/api/users` creates a new user.
* `GET/api/users` gets a list of all users and associated info.
* `GET/api/users/{username}` gets user's details by username.
* `GET/api/users/id/{user_id}` gets user's details by user_id.
* `GET/api/profile` gets a users profile.
* `GET/api/users/me/geodata` gets all geodata posted by a single user.
* `/api/users/me/geodata` deletes all geodata associated with a specified user.

### Geodata

* `GET/api/geodata`gets all geodata stored in the database.
* `POST/api/geodata` creates a new geodata entry in the database.
* `GET/api/geodata/{geodata_id}` gets geodata by geodata_id.
* `DELETE/api/geodata/{geodata_id}` deletes geodata associated with a specified geodata_id.

### Trips

* `GET/api/geodata/{geodata_id}` gets a list of trips by user_id.
* `POST/api/trips/me` posts new trip data to database.
* `DELETE/api/trips/me` deletes trips by user_id.

### Authentication

* `POST/auth/signup` creates a new user account.
* `POST/auth/login` logs in a user.
* `GET/auth/logout` logs out user.


## ⌨️ Getting Started

In order to run this project locally, the following must be installed on your machine:

* Node.js v19.6.1 - Node Package Manager (npm)
* PostgreSQL v12.12 
* git (and a Github account)

1. Fork this repository.
2. Via your terminal, navigate to your desired directory or create a new directory using `mkdir <project-name>`. 
3. Clone your forked version of the repository to your local machine using the command `git clone <repo-url>`.
3. Naviagte into your new directory using `cd <project-name>` and open it with your chosen software, e.g. using the command `code .` to open it in VSCode.
4. In your terminal, run `npm install` to install the required dependencies.

## 💻 Run Locally

1. You will need to create a .env file in the main directory, with the following names and contents to connect the databases:

* .env.development - this file should contain PGDATABASE=fog_of_war

2. Run the following commands in your terminal to seed the local database:

* `npm run setup-dbs`
* `npm run seed`

3. Start the server using `npm start`. You can make requests using your browser or install an application such as Insomnia.

4. Run the tests using the command `npm test`.

Happy hacking!
