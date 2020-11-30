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
    let isStart =  findItem(map, legend.start)
    let isEnd =  findItem(map, legend.end)
    const start = (isStart == -1)? findItem(map, legend['path-start']): isStart;
    const end = (isEnd == -1)? findItem(map, legend['path-end']): isEnd;

    const g = graphConstructor(map, legend);
    

    let path;
    let visited;
    let ans;

    switch(algorithm){
        case 'DFS':
            ans = graphAlgo.DFS(g.graph, start, end);
            path = ans[0];
            visited = ans[1];
            break;
        case 'BFS':
            ans = graphAlgo.BFS(g.graph, start, end);
            path = ans[0];
            visited = ans[1];
            break; 
        case "A*":
            ans = graphAlgo.AStar(g, start, end);
            path = ans[0];
            visited = ans[1];
            break;
        case "Dijkstra":
            ans = graphAlgo.Dijkstra(g, start, end);
            path = ans[0];
            visited = ans[1];
            break;
        default:
            console.log(algorithm)
            break;
    }

    path = ( path )? path.map(e => Number(e)): ['1-1'];
    path = path.map(e => {
        let  i = Math.floor(e / 75);
        let  j = e % 75;
        return `${i+1}-${j+1}`;
    });

    visited = (visited)? visited.map(e => Number(e)): [];
    visited = visited.map(e => {
        let  i = Math.floor(e / 75);
        let  j = e % 75;
        return `${i+1}-${j+1}`;
    })
    
    res.status(201).send({path, visited});
})

module.exports = router;