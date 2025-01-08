# Exercise Tracker API

An Express.js API that creates a username and gets a list of exercises for that unique username as well as logs new exercises.

Inspired by the [Exercise Tracker challenge](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker) as part of the curriculum for the [Back End Development and APIs Certification](https://www.freecodecamp.org/learn/back-end-development-and-apis) on [freeCodeCamp](https://www.freecodecamp.org).

---

## Built With
* [Express.js](https://expressjs.com)
* [Mongoose](https://mongoosejs.com)
* [MongoDB](https://www.mongodb.com)
* [EJS](https://ejs.co)
* CSS3
* JavaScript
* [Moment.js](https://momentjs.com)
* [validator.js](https://github.com/validatorjs/validator.js)
* [dotenv](https://github.com/motdotla/dotenv)
* [Normalize.css](https://necolas.github.io/normalize.css)
* [Google Fonts](https://fonts.google.com)
* [FontAwesome](https://fontawesome.com)
* [nodemon](https://nodemon.io)

## Demo

View project demo at [https://autumnchris-exercise-tracker-api.onrender.com/api](https://autumnchris-exercise-tracker-api.onrender.com/api).

## Instructions

After forking and cloning, navigate to the repository in your command line and install the NPM packages:
```
npm install
```

Create a `.env` file in the root of the repository and add the following environment variables:
```
MONGO_URI=<your-mongodb-uri>
```

Run the following script in your command line if starting the repository in development mode:
```
npm run dev
```

Run the following script in your command line if starting the repository in production mode:
```
npm start
```

Once the server is running, go to `http://localhost:3000` in your browser.
