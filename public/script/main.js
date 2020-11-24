
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
  this.nodeStaus = "normal";
  this.start = undefined;
  this.end = undefined;
  this.algorithm = undefined;
  this.speed = {
    'fast': 10,
    'medium': 150,
    'slow': 300
  }
  this.actualSpeed = this.speed.fast;
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
        if(this.board[i-1][j-1] == this.nodeValue.start || this.board[i-1][j-1] == this.nodeValue.end){
          this.nodeStaus = Object.keys(this.nodeValue).find(key => this.nodeValue[key] === this.board[i-1][j-1]);
        }
        else{
          this.nodeStaus = "normal";
          this.changeNormalNode(_id);
        }
      }

      elem.onmouseup = e => {
        this.mouseDown = false;
        if(this.nodeStaus == "start"){
          this.start = _id;
          this.reallocateSpecial('start');
        }
        if(this.nodeStaus == "end"){
          this.end =_id;
          this.reallocateSpecial('end');
        }
        this.nodeStaus = "normal";
      }

      elem.onmouseenter = e => {
        if(this.mouseDown){
          if(this.nodeStaus !== "normal"){
            if(this.nodeStaus == "start") this.start = _id;
            if(this.nodeStaus == "end") this.end = _id;
            this.reallocateSpecial(this.nodeStaus);
          }
          else{
            const elem = document.getElementById(_id).classList[0];
            if(elem == "unvisited" || elem == "wall") this.changeNormalNode(_id);
           
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
  if(Class == "start"){
    const oldPos = document.querySelector('.start');
    const oldIndex = oldPos.id.split('-').map(i => Number(i) - 1);

    const newPos = document.getElementById(this.start);
    const newIndex = newPos.id.split('-').map(i => Number(i) - 1);

    this.board[oldIndex[0]][oldIndex[1]] = this.nodeValue.unvisited;
    this.board[newIndex[0]][newIndex[1]] = this.nodeValue.start;

    oldPos.classList = ['unvisited'];
    newPos.classList = ['start'];

  }
  else{
    const oldPos = document.querySelector('.end');
    const oldIndex = oldPos.id.split('-').map(i => Number(i) - 1);

    const newPos = document.getElementById(this.end);
    const newIndex = newPos.id.split('-').map(i => Number(i) - 1);

    this.board[oldIndex[0]][oldIndex[1]] = this.nodeValue.unvisited;
    this.board[newIndex[0]][newIndex[1]] = this.nodeValue.end;

    oldPos.classList = ['unvisited'];
    newPos.classList = ['end'];
  }
  
  
}

/* Clear Board of all walls */
Board.prototype.clearBoard = function(){
  for(let i = 0; i < this.i; i++){
    for(let j = 0; j < this.j; j++){
      if(this.board[i][j] !== this.nodeValue.unvisited && this.board[i][j] !== this.nodeValue.start && this.board[i][j] !== this.nodeValue.end){
        const _id = `${i+1}-${j+1}`;
        document.getElementById(_id).classList = ['unvisited'];
        this.board[i][j] = this.nodeValue.unvisited;
      }
    }
  }

  this.reallocateSpecial('start');
  this.reallocateSpecial('end');
}

/* Sleep function to pause excecution */
Board.prototype.sleep = async function(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* Visualize given points */
Board.prototype.visualize = async function(visited, path){
  for(let i = 0; i < visited.length; i++){
    let tag = document.getElementById(visited[i]).classList[0]
    let v = visited[i].split('-').map(i => Number(i) - 1);

    if(tag == 'start' || tag == 'end'){
      if(tag == 'start'){
        this.board[v[0]][v[1]] = board.nodeValue["visited-start"];
        document.getElementById(visited[i]).classList = ["visited-start"];
      }
      else{
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
    let tag = document.getElementById(visited[i]).classList[0];
    let p = path[i].split('-').map(i => Number(i) - 1);
    if(tag == 'start' || tag == 'end'){
      if(tag == 'start'){
        this.board[p[0]][p[1]] = board.nodeValue["path-start"];
        document.getElementById(path[i]).classList = ["path-start"];
      }
      else{
        this.board[v[0]][v[1]] = board.nodeValue["path-end"];
        document.getElementById(path[i]).classList = ["path-end"];
      }
    }
    else{
      this.board[p[0]][p[1]] = board.nodeValue["shortest-path"];
      document.getElementById(path[i]).classList = ['shortest-path'];
    }
    await this.sleep(this.actualSpeed);
  }
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

const dijkstra  = document.getElementById('dijkstra');
const astar     = document.getElementById('a*');
const visualize = document.querySelector('.visualize');

dijkstra.addEventListener('click', e => {
  board.algorithm = 'dijkstra';
  document.querySelector('.algo').innerHTML = 'Dijkstra';
});

astar.addEventListener('click', e => {
  board.algorithm = 'a*';
  document.querySelector('.algo').innerHTML = 'A*';
});

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
      const { path } = data;
      board.visualize(path, path);
    })
    .catch(err => {
      alert(`ERROR: ${err}`);
    })
  }
  else{
    document.querySelector('.algo').innerHTML = 'Pick an algorithm';
  }
  
});

document.querySelector('.clear').addEventListener('click', e => {
  board.clearBoard();
});

 



//board.testViualize();