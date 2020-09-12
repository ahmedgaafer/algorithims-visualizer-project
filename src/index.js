const express    = require('express'),
      bodyParser = require('body-parser'),
      serverless = require('serverless-http'),
      app        = express(),
      PORT       = process.env.PORT || 8080;

/* Settings */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./public'));

/* APIS */

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index.html');
});

app.use('/.netlify/functions/api', router);

module.exports = app;
module.exports.handler = serverless(app);

if(process.env.NODE_ENV === "development"){
  app.listen(PORT, () => {
    console.log(`Server is runing on PORT: ${PORT} ENV: ${process.env.NODE_ENV}`);
  });
}
