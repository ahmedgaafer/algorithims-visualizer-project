
/* Class deceleration */
function Board(n, m) {
  this.board = [...Array(n).fill(0).map(() => Array(m).fill(0))]
  this.nodeValue = {
    'unvisited': 0,
    'visited': 1,
    'shortest-path': 2,
    'start': 3,
    'end': 4,
    'wall': 5,
    'path-start': 6,
    'path-end': 7,
    'visited-start': 8,
    'visited-end': 9
  }
  this.i = n;//30
  this.j = m;//75
  this.mouseDown = false;
  this.nodeStatus = "normal";
  this.start = undefined;
  this.end = undefined;
  this.algorithm = undefined;
  this.speed = {
    'instant':1,
    'fast': 10,
    'medium': 100,
    'slow': 300,
  }
  this.actualSpeed = this.speed.fast;
  this.isRunning = false;
}

/* Initial Start, End random position setter */
Board.prototype.setStartEnd = function(){
  let sx = Math.floor((Math.random() * this.i) + 1);
  let sy = Math.floor((Math.random() * this.j) + 1);
  let ex = Math.floor((Math.random() * this.i) + 1);
  let ey = Math.floor((Math.random() * this.j) + 1);

  while(ex == sx && sy == ey){
    let ex = Math.floor((Math.random() * this.j) + 1);
    let ey = Math.floor((Math.random() * this.j) + 1);
  }

  this.board[sx-1][sy-1] = this.nodeValue.start;
  this.board[ex-1][ey-1] = this.nodeValue.end;
  this.start = [sx, sy];
  this.end = [ex, ey];
  let StartId = `${sx}-${sy}`;
  let EndId   = `${ex}-${ey}`;
  this.start = StartId;
  this.end = EndId;
  
  document.getElementById(StartId).classList = ['start']
  document.getElementById(EndId).classList = ['end']
  return this;
}

/* Handles Mouse Events that intaracts with grid */
Board.prototype.addEventListener = function(){
  for(let i = 1; i <= this.i; i++){
    for(let j = 1; j <= this.j; j++){
      let _id  = `${i}-${j}`;
      let elem = document.getElementById(_id);

      elem.onmousedown = e => {
        e.preventDefault();
        this.mouseDown = true;
        if(this.board[i-1][j-1] == this.nodeValue.start || this.board[i-1][j-1] == this.nodeValue.end || this.board[i-1][j-1] == this.nodeValue["path-start"] || this.board[i-1][j-1] == this.nodeValue["path-end"]){
          this.nodeStatus = Object.keys(this.nodeValue).find(key => this.nodeValue[key] === this.board[i-1][j-1]);
        }
        else{
          this.nodeStatus = "normal";
          this.changeNormalNode(_id);
        }
      }

      elem.onmouseup = e => {
        this.mouseDown = false;
        if(this.nodeStatus == "start" || this.nodeStatus == "path-start"){
          this.start = _id;
          this.reallocateSpecial(this.nodeStatus);
        }
        if(this.nodeStatus == "end" || this.nodeStatus == "path-end"){
          this.end =_id;
          this.reallocateSpecial(this.nodeStatus);
        }
        this.nodeStatus = "normal";
      }

      elem.onmouseenter = e => {
        if(this.mouseDown){
          const elem = document.getElementById(_id).classList[0];
          if(this.nodeStatus !== "normal"){
            if(elem != "start" && elem != "end" && elem != "path-start" && elem != "path-end"){
              if(this.nodeStatus == "start" || this.nodeStatus == "path-start") this.start = _id;
              if(this.nodeStatus == "end"  || this.nodeStatus == "path-end") this.end = _id;
              this.reallocateSpecial(this.nodeStatus);
            }
          }
          else{
            if(elem == "unvisited" || elem == "wall" || elem == "visited" || elem == "shortest-path") this.changeNormalNode(_id);
          }
        }
      }
    }
  }
  return this;
}

/*Handles Drawing of Wall nodes*/
Board.prototype.changeNormalNode = function(id){
  const cell = document.getElementById(id);
  const Index = cell.id.split('-').map(i => Number(i) - 1);
  if(cell.classList.contains('wall')){
    cell.classList = ['unvisited'];
    this.board[Index[0]][Index[1]] = this.nodeValue.unvisited;
  }
  else{
    cell.classList = ['wall'];
    this.board[Index[0]][Index[1]] = this.nodeValue.wall;
  }
}

/* Hanles Drawing of Special Nodes */
Board.prototype.reallocateSpecial = function(Class){
  const className =`.${Class}`;

  const oldPos = document.querySelector(className);
  const oldIndex = oldPos.id.split('-').map(i => Number(i) - 1);
  
  const newPos = document.getElementById(this[(Class.includes('-')? Class.split('-')[1] : Class)]);
  const newIndex = newPos.id.split('-').map(i => Number(i) - 1);
  
  this.board[oldIndex[0]][oldIndex[1]] = this.nodeValue.unvisited;
  this.board[newIndex[0]][newIndex[1]] = this.nodeValue[Class];

  oldPos.classList = ['unvisited'];
  newPos.classList = [Class]; 
}

/* Clear Board of all walls */
Board.prototype.clearBoard = async function(fromVisualize = false){
  for(let i = 0; i < this.i; i++){
    for(let j = 0; j < this.j; j++){
      if(this.board[i][j] !== this.nodeValue.unvisited && this.board[i][j] !== this.nodeValue.start && this.board[i][j] !== this.nodeValue.end){
        const _id = `${i+1}-${j+1}`;
        if(this.board[i][j] == this.nodeValue.visited || this.board[i][j] == this.nodeValue["shortest-path"]){
          document.getElementById(_id).classList = ['unvisited'];
          this.board[i][j] = this.nodeValue.unvisited;
        }
        if( this.board[i][j] == this.nodeValue.wall && !fromVisualize){
          document.getElementById(_id).classList = ['unvisited'];
          this.board[i][j] = this.nodeValue.unvisited;
        }
        else if(this.board[i][j] == this.nodeValue["path-start"] || this.board[i][j] == this.nodeValue["visited-start"]){
          document.getElementById(_id).classList = ['start'];
          this.board[i][j] = this.nodeValue.start;
        }
        else if(this.board[i][j] == this.nodeValue["path-end"]){
          document.getElementById(_id).classList = ['end'];
          this.board[i][j] = this.nodeValue.end;
        }
      }
    }
  }
}

/* Sleep function to pause excecution */
Board.prototype.sleep = async function(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* Visualize given points */
Board.prototype.visualize = async function(visited, path){
  this.isRunning = true;
  await this.clearBoard(true);
  for(let i = 0; i < visited.length; i++){
    let tag = document.getElementById(visited[i]).classList[0]
    let v = visited[i].split('-').map(i => Number(i) - 1);

    if(tag == 'start' || tag == 'end' || tag == "visited-start" || tag == "visited-end"){
      if(tag == 'start' || tag == "visited-start"){
        this.board[v[0]][v[1]] = board.nodeValue["visited-start"];
        document.getElementById(visited[i]).classList = ["visited-start"];
      }
      else{
        console.log( v)
        this.board[v[0]][v[1]] = board.nodeValue["visited-end"];
        document.getElementById(visited[i]).classList = ["visited-end"];
      }
    }
    else{
      this.board[v[0]][v[1]] = board.nodeValue.visited;
      document.getElementById(visited[i]).classList = ['visited'];
    }
    await this.sleep(this.actualSpeed);
  }

  for(let i = 0; i < path.length; i++){
    let p = path[i].split('-').map(i => Number(i) - 1);
    if(i == path.length - 1){
        this.board[p[0]][p[1]] = board.nodeValue["path-end"];
        document.getElementById(path[i]).classList = ["path-end"];
    }
    else if(i == 0){  
      this.board[p[0]][p[1]] = board.nodeValue["path-start"];
      document.getElementById(path[i]).classList = ["path-start"];  
    }
    else{
      this.board[p[0]][p[1]] = board.nodeValue["shortest-path"];
      document.getElementById(path[i]).classList = ['shortest-path'];
    }
    await this.sleep(this.actualSpeed);
  }
  this.isRunning = false;
}

Board.prototype.testVisualize = async function(){
  const v = [];
  const p = [];
  for(let i = 1; i <= this.i; i++){
    for(let j = 1; j <= this.j; j++){
      if(i <= this.i/2 && j <= this.j/2)p.push(`${i}-${j}`);
      v.push(`${i}-${j}`);
    }
  }

  
  await this.visualize(v, p);

}

/* Main Program */

const board = new Board(30, 75);
board.setStartEnd().addEventListener();

const visualize = document.querySelector('.visualize');
const notes = document.getElementById('notes');

/* Algorithm */
const algoTitle = document.querySelector('.algo');
const dijkstra  = document.getElementById('dijkstra');
const astar     = document.getElementById('a*');
const BFS     = document.getElementById('BFS');
const DFS     = document.getElementById('DFS');

dijkstra.addEventListener('click', e => {
  board.algorithm = 'Dijkstra';
  algoTitle.innerHTML = 'Dijkstra';
  notes.innerHTML = "<p>Dijkstra's Algorithm is <strong><em> weighted </em></strong> and <strong><em> guarantees </em></strong> the shortest path!</p>"
  visualize.innerHTML = `Visualize ${board.algorithm}`;
});

astar.addEventListener('click', e => {
  board.algorithm = 'A*';
  algoTitle.innerHTML = 'A*';
  notes.innerHTML = "<p>A* Search is <strong><em> weighted </em></strong> and <strong><em> guarantees </em></strong> the shortest path!</p>"
  visualize.innerHTML = `Visualize ${board.algorithm}`;
});

BFS.addEventListener('click', e => {
  board.algorithm = 'BFS';
  algoTitle.innerHTML = 'BFS';
  notes.innerHTML = "<p>Breath-first Search is <strong><em> unweighted </em></strong> and <strong><em> guarantees </em></strong> the shortest path!</p>"
  visualize.innerHTML = `Visualize ${board.algorithm}`;
});

DFS.addEventListener('click', e => {
  board.algorithm = 'DFS';
  algoTitle.innerHTML = 'DFS';
  notes.innerHTML = "<p>Depth-first Search is <strong><em> unweighted </em></strong> and <strong><em> does not guarantee </em></strong> the shortest path!</p>"
  visualize.innerHTML = `Visualize ${board.algorithm}`;
});

/* SPEED */
const slow     = document.getElementById('slow');
const medium     = document.getElementById('medium');
const fast     = document.getElementById('fast');

visualize.addEventListener('click', e => {
  if(board.algorithm){
    const body = {
      algorithm: board.algorithm,
      legend: board.nodeValue,
      map: board.board
    }
    fetch('/api/graph', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => {
      let { path, visited } = data;
      
      board.visualize(visited, path);
    })
    .catch(err => {
      alert(`ERROR: ${err}`);
    })
  }
  else{
    algoTitle.innerHTML = 'Pick an algorithm';
  }
  
});

slow.addEventListener('click', e => {
  board.actualSpeed = board.speed.slow;
  document.querySelector('.speed').innerHTML = "Slow";
});

medium.addEventListener('click', e => {
  board.actualSpeed = board.speed.medium;
  document.querySelector('.speed').innerHTML = "Medium";
});

fast.addEventListener('click', e => {
  board.actualSpeed = board.speed.fast;
  document.querySelector('.speed').innerHTML = "Fast";
});

document.querySelector('.clear').addEventListener('click', e => {
  board.clearBoard();
});

/* periodic check ups */
setInterval(() => {
  document.getElementById('visualize-btn').classList = (board.isRunning)? ['visualize-disabled'] : ['visualize']
  document.getElementById('board').classList = (board.isRunning)? ['disabled'] : ['']
  document.getElementById('clear').classList = (board.isRunning)? ['visualize-disabled']: ['clear']
}, 100);