const express    = require('express'),
      bodyParser = require('body-parser'),
      serverless = require('serverless-http'),
      app        = express(),
      nav        = require('./routes/nav'),
      graph       = require('./routes/graph'),
      PORT       = process.env.PORT || 8080;

/* Settings */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

/* APIS */
app.use('/.netlify/functions/api', nav); //Navigation API
app.use('/.netlify/functions/api/api/graph', graph); // Graph algorithms

module.exports = app;
module.exports.handler = serverless(app);

if(process.env.NODE_ENV === "development"){
  app.listen(PORT, () => {
    console.log(`Server is runing on PORT: ${PORT} ENV: ${process.env.NODE_ENV}`);
  });
  app.use('/', nav);
  app.use('/api/graph', graph);
}
