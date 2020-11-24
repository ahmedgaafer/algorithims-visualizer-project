const express    = require('express'); 
const router     = express.Router();


router.get('/', (req, res) => {
  res.sendFile('home.html',{root: './public'});
});

router.get('/graph', (req, res) => {
  res.sendFile('graph.html',{root: './public'});
});

router.get('/sorting', (req, res) => {
  res.sendFile('sorting.html',{root: './public'});
});

router.get('/aboutus', (req, res) => {
  res.sendFile('aboutus.html',{root: './public'});
});


module.exports = router;