const express    = require('express'); 
const router     = express.Router();
const { graphAlgo } = require('js-alogrithims');
const graphConstructor = require('./helper/graphConstructor');
const findItem = require('./helper/findItem');

router.post('/', (req, res) => {
    const {algorithm, legend, map} = req.body;
    let isStart =  findItem(map, legend.start)
    let isEnd =  findItem(map, legend.end)
    const start = (isStart == -1)? findItem(map, legend['path-start']): isStart;
    const end = (isEnd == -1)? findItem(map, legend['path-end']): isEnd;

    const g = graphConstructor(map, legend);
    const convertTo1D = e => {
        const y = Math.floor(e / 75);
        const x = e % 75;
        return `${y+1}-${x+1}`;
    }

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

    path = (Array.isArray(path) && path.length !== 0 )? path.map(e => Number(e)): [];
    path = path.map(convertTo1D);

    visited = (Array.isArray(visited) && visited !== 0)? visited.map(e => Number(e)): [];
    visited = visited.map(convertTo1D)
    
    
    res.status(201).send({path, visited});
})

module.exports = router;