const express    = require('express'),
      bodyParser = require('body-parser'),
      app        = express(),
      nav        = require('./routes/nav'),
      graph       = require('./routes/graph'),
      PORT       = process.env.PORT || 8080;

/* Settings */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

/* APIS */
app.use('/', nav); //Navigation API
app.use('/api/graph', graph); // Graph algorithms



app.listen(PORT, () => {
  console.log(`Server is runing on PORT: ${PORT} ENV: ${process.env.NODE_ENV}`);
});

