const express    = require('express'),
      bodyParser = require('body-parser'),
      serverless = require('serverless-http'),
      app        = express(),
      nav        = require('./routes/nav'),
      path       = require('path'),
      PORT       = process.env.PORT || 8080;

/* Settings */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

/* APIS */
app.use('/', nav); //Navigation API

module.exports = app;
module.exports.handler = serverless(app);

if(process.env.NODE_ENV === "development"){
  app.listen(PORT, () => {
    console.log(`Server is runing on PORT: ${PORT} ENV: ${process.env.NODE_ENV}`);
  });
}
