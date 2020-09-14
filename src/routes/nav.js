const express    = require('express');

const router     = express.Router();
const PATH       = "../../public/";

router.get('/', (req, res) => {
  res.render(`${PATH}index.html`);
});

router.get('/graph', (req, res) => {
  res.send('hi')
  //res.render(`${PATH}pages/graph.html`)
})


module.exports = router;