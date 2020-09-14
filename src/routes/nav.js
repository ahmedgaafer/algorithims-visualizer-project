const express    = require('express'); 
const router     = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/graph', (req, res) => {
  res.render('graph');
});


module.exports = router;