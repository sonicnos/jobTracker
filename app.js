require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;
const dbURI  = process.env.MONGODB_URI;
const routes = require('./routes/routes')
const cookieParser = require('cookie-parser')
const upload = require("./uploads/multer");


// LES MIDDLEWARES ON VERRA PLUS TARD


/* const { requireAuth, checkUser }= require('./middlewares/authMiddleware') */

const app = express();



// middleware
/* app.use(express.static('public')); */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// database connection

mongoose.connect(dbURI)
  .then(() => app.listen(PORT, (err, data) => {
    console.log('listening to port ' + PORT);
  }))
  .catch((err) => console.log(err));
// routes
app.use(upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'cv', maxCount: 1 }]));

app.get('/', (req, res) => res.redirect('dashboard'));
app.use(routes);



module.exports = app