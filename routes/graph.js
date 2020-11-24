const express    = require('express'); 
const router     = express.Router();
const { graphAlgo } = require('js-alogrithims');
const graphConstructor = require('./helper/graphConstructor');
const findItem = require('./helper/findItem');


router.get('/', (req, res) => {
    res.status(201).send('success');
});

router.post('/', (req, res) => {
    const {algorithm, legend, map} = req.body;
    const start = findItem(map, legend.start);
    const end = findItem(map, legend.end);
    const g = graphConstructor(map);

    let path;
    switch(algorithm){
        case 'a*':
            path = graphAlgo.DFS(g.graph,start, end);
            break;
        default:
            break;
    }
    path = path.map(e => Number(e));
    path = path.map(e => {
        let  i = Math.floor(e / 75);
        let  j = e % 75;
        return `${i+1}-${j+1}`;
    })
    console.log(path)
    res.status(201).send({path});
})

module.exports = router;