const express = require('express');
const path =  require('path');
const bodyParser =  require('body-parser');
const cookieParser =  require('cookie-parser');
const expressValidator =  require('express-validator');
const logger =  require('morgan');
const mongoose =  require('mongoose');
const app = express();
const port = process.env.port || 3000;
const Database = require('./config/exports').MongoHost
var expressSession = require('express-session');
const fileUpload  = require('express-fileupload')

const posts = require('./router/posts');





mongoose.connect(Database);

mongoose.connection.on('open', (err,done)=>{
    if(err) {throw err}
    else{console.log('mongo connected')}
})

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs')
app.use(logger('dev'))




app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
}));



app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
   
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    },

    customValidators:{
      isImage : function (value, filename) {
        var extention = (path.extname(filename)).toLowerCase();
        switch (extention) {
          case '.jpg':
            return '.jpg';
          case '.jpeg':
            return '.jpeg';
          case '.png':
            return '.png';  
          case '':
            return '.jpg';
          default:
            return false;
        }
      }
    }
  }));

app.use(fileUpload())
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  res.locals.errors = null
  next();
});






app.use('/posts', posts);




app.listen(port, (err)=>{
    if(err) throw err;
    console.log('it\'s good !!!')
})