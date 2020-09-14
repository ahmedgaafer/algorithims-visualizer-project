const express    = require('express'); 
const router     = express.Router();

router.get('/', (req, res) => {
  res.render('pages/home');
});

router.get('/graph', (req, res) => {
  res.render('pages/graph');
});


module.exports = router;