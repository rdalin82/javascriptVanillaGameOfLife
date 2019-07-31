var sides = 20;


createCell = function(x, y) {
  this.x = x
  this.y = y
  this.on = false
}

cells = []

function draw(cells, start=true) {
  var shouldEvaluate = cells.length > 0 ? true : false
  var container = document.getElementById('container')
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  for (var x = 0; x <= sides; x++){
    var row = `<div class='row' data-x='${x}'></div>`
    container.insertAdjacentHTML( 'beforeEnd', row );
    for (var y = 0; y <= sides; y++){
      var nodes = document.getElementsByClassName('row')
      var targetRow = nodes[nodes.length-1]
      var existingCell = findCell(x, y, cells)
      if (typeof existingCell == "undefined") {
        cells.push(new createCell(x, y))
      }
      var filled = existingCell && existingCell.on ? 'filled' : ''
      var cellNode = `<div class='cell ${filled}' data-x=${x} data-y=${y}></div>`
      targetRow.insertAdjacentHTML('beforeEnd', cellNode)
      var cellList = document.getElementsByClassName('cell')
      var targetCell = cellList[cellList.length-1]
      targetCell.addEventListener("click", function(){
        this.classList.toggle("fill")
        var data = this.dataset
        var c = findCell(parseInt(data.x), parseInt(data.y), cells)
        flipCell(c)
      })
    }
  }
  return cells
}

function filled(cells) {
  return cells.filter( function(x) { return x.on } )
}

function findCell(x, y, cells){
  return cells.filter(function(cell) {
    return (cell.x == x && cell.y == y)
  })[0]
}

function flipCell(c) {
  c.on = c.on ? false : true
  return c
}

function evaluate(cell, cells) {
  var shouldBeAlive = shouldLive(cell, cells)
  var x = cell.x
  var y = cell.y
  var domCell = findDomCell(x, y)
  var newCell
  if (shouldBeAlive) {
    newCell = new createCell(x, y)
    newCell.on = true
    if (typeof domCell != "undefined" && !domCell.classList.contains("fill")) {
      domCell.classList.add("fill")
    }
  } else {
    newCell = new createCell(x, y)
    if (typeof domCell != "undefined" && domCell.classList.contains("fill")) {
      domCell.classList.remove("fill")
    }
  }
  return newCell
}

function findDomCell(dataX, dataY) {
  var cellList = document.getElementsByClassName('cell')
  var foundCells = []
  for (let idx in cellList) {
    var cell = cellList[parseInt(idx)]
    if (typeof cell != "undefined" && parseInt(cell.getAttribute('data-x')) == dataX && parseInt(cell.getAttribute('data-y')) == dataY) {
      foundCells.push(cell)
    }
  }
  return foundCells[0]
}

function evaluateAll(cells) {
  var newCells = []
  var currentState = cells.slice(0)
  for (let idx in cells) {
    var cell = cells[idx];
    newCells.push(evaluate(cell, currentState))
  }
  return newCells
}

function shouldLive(cell, cells) {
  var neighbors = findNeighbors(cell, cells)
  var alive = neighbors.filter(x => x.on )
  var aliveCount = alive.length
  if (aliveCount < 2 && cell.on ) {
    return false
  } else if (aliveCount > 3 && cell.on) {
    return false
  } else if ((aliveCount == 2 || aliveCount == 3) && cell.on) {
    return true
  } else if (aliveCount == 3 && !cell.on) {
    return true
  } else {
    return false
  }
}

function findNeighbors(cell, cells) {
  return [
    find0thposition(cell, cells),
    find1stposition(cell, cells),
    find2ndposition(cell, cells),
    find3rdposition(cell, cells),
    find5thposition(cell, cells),
    find6thposition(cell, cells),
    find7thposition(cell, cells),
    find8thposition(cell, cells)
  ].filter( x => x != undefined)
}

/*

find neighbors in following positions

0 1 2
3 x 5
6 7 8

-1 -1 | 0 -1 | +1 -1
0 -1  | 0 0  | 0 + 1
-1 +1 | 0 + 1| + 1 + 1
*/
//top row
function find0thposition(cell, cells) {
  return findCell(cell.x-1, cell.y-1, cells)
}
function find1stposition(cell, cells) {
  return findCell(cell.x, cell.y-1, cells)
}
function find2ndposition(cell, cells) {
  return findCell(cell.x+1, cell.y-1, cells)
}
//middle row
function find3rdposition(cell, cells) {
  return findCell(cell.x-1, cell.y, cells)
}
function find5thposition(cell, cells) {
  return findCell(cell.x+1, cell.y, cells)
}
//bottom row
function find6thposition(cell, cells) {
  return findCell(cell.x-1, cell.y+1, cells)
}
function find7thposition(cell, cells) {
  return findCell(cell.x, cell.y+1, cells)
}
function find8thposition(cell, cells) {
  return findCell(cell.x+1, cell.y+1, cells)
}

function start() {
  setInterval(function() {
    cells = evaluateAll(cells);
  }, 500)
}

cells = draw(cells)
// start()

