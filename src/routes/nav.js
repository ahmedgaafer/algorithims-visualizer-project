const express    = require('express'); 
const router     = express.Router();
const path       = `${__dirname}/../../public/`

router.get('/', (req, res) => {
  res.sendFile('home.html', {root: path});
});

router.get('/graph', (req, res) => {
  res.sendFile('graph.html', {root: path});
});


module.exports = router;