const express    = require('express'); 
const router     = express.Router();

router.get('/', (req, res) => {
  res.render('../public/pages/home.html');
});

router.get('/graph', (req, res) => {
  res.render('../public/pages/graph.html');
});


module.exports = router;