const express    = require('express'); 
const router     = express.Router();
const graphConstructor = require('./helper/graphConstructor');
const { graphAlgo } = require('js-alogrithims');
router.get('/', (req, res) => {
    res.status(201).send('success');
});

router.post('/', (req, res) => {
    const {algorithm, legend, map} = req.body;
    const g = graphConstructor(map);
    let path;
    switch(algorithm){
        case 'a*':
            path = graphAlgo.BFS(g.graph,1, 10);
            break;
        default:
            break;
    }
    

    res.status(201).send({path});
})

module.exports = router;