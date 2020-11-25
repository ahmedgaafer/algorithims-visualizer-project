const { Graph } = require('@ahmeds.gaafer/js-data-structures');

const getIndex = (width, row, col) => (width*row)+col

module.exports = function graphConstructor(array, legend){
    const isUnidirectional = true;
    const isWeighted = false;
    const wall = legend.wall;
    const n = array.length;
    const m = array[0].length;

    const g = new Graph(isUnidirectional, isWeighted);

    for(let i = 0; i < n*m; i++){
        g.addVertex(i);
    }
    
    for(let i = 0; i < n; i++){
        for(let j = 0; j < m;j++){
            if(array[i][j] != wall){
                const currentIndex = getIndex(m,i,j);
                if(i + 1 < n && array[i+1][j] != wall)  g.addEdge(currentIndex, getIndex(m, i+1, j))//below
                if(i - 1 >= 0 && array[i-1][j] != wall) g.addEdge(currentIndex, getIndex(m, i-1, j))//above 
                if(j - 1 >= 0 && array[i][j-1] != wall) g.addEdge(currentIndex, getIndex(m, i, j-1))//left
                if(j + 1 < m && array[i][j+1] != wall)  g.addEdge(currentIndex, getIndex(m, i, j+1))//right
            }
        }   
    }

    return g;
}

