const dropdown = document.getElementById("algorithm-list");
const startButton = document.getElementById("start");
const clearButton = document.getElementById("clear");
let speedSlider;
let grid = [];

let gridSize = 25;
let gridNumberX = 25;
let gridNumberY = 20;

//Position start of grid on canvus
let startPointX;
let startPointY;

let startPoint;
let endPoint;

let width;
let height;

let running = false;

startButton.onclick = () =>{
    if(!running){
        clearGrid(1);
        clearGrid(2)
        clearGrid(4);
        clearGrid(5);
        running = true;

        grid[startPoint.x][startPoint.y].gridType = 1;
        grid[endPoint.x][endPoint.y].gridType = 2;
        if(startPoint != null && endPoint != null){
            switch(dropdown.value){
                case "A*":
                    aStar(startPoint, []);
                    break;
                case "Dijkstra":
                    dijkstra(startPoint);
                    break;
                case "D*":
                    dStar([endPoint]);
                    break;
                case "Breadth First Search":
                    breadthFirst([startPoint]);
                case "Depth First Search":
                    depthFirst([startPoint]);
            }
        }
    }
}

function setup() {
    speedSlider = createSlider(1, 500, 100);
    width = windowWidth;
    height = windowHeight - 100;
    gridNumberX = Math.floor((width / gridSize) - 2);
    gridNumberY = Math.floor((height / gridSize) - 2);

    startPointX = (width / 2) - gridSize * gridNumberX / 2;
    startPointY = gridSize;

    createCanvas(width, height);

    
    for(let i = 0; i < gridNumberX; i ++){
        grid.push([]);
        for(let j = 0; j < gridNumberY; j ++){
            grid[i].push({
                x: i,
                y: j,
                gridType: 0
            });
        }
    }
    
    startPoint = {
        x: 1,
        y: Math.floor(gridNumberY / 2)
    }
    endPoint = {
        x: gridNumberX - 2,
        y: Math.floor(gridNumberY / 2)
    }
    grid[startPoint.x][startPoint.y].gridType = 1;
    grid[endPoint.x][endPoint.y].gridType = 2;
}
  
function draw() {
    background(220);
    startPointX = (width / 2) - gridSize * gridNumberX / 2;
    startPointY = gridSize;

    if(mouseIsPressed){
        changeSquare();
    }

    for(let i = 0; i < grid.length; i ++){
        for(let j = 0; j < grid[i].length; j ++){
            switch(grid[i][j].gridType){
                case 0:
                    fill(255, 255, 255);
                    break;
                case 1:
                    fill(0, 255, 0);
                    break;
                case 2:
                    fill(255, 0, 0);
                    break;
                case 3:
                    fill(0, 0, 0);
                    break;
                case 4:
                    fill(0, 0, 255);
                    break;
                case 5:
                    fill(0, 255, 255);
                    break;
                default:
                    break;
            }
            rect(startPointX + grid[i][j].x * gridSize, startPointY + grid[i][j].y * gridSize, gridSize, gridSize);
        }
    }
}

function changeSquare() {
    let clickedX = Math.floor((mouseX - startPointX) / gridSize);
    let clickedY = Math.floor((mouseY - startPointY) / gridSize);
    if(clickedX >= 0 && clickedX < gridNumberX && clickedY >= 0 && clickedY < gridNumberY){
        switch(document.getElementById("chosen-square").value){
            case "start":
                clearGrid(1);
                startPoint = {
                    x: clickedX,
                    y: clickedY
                }
                grid[clickedX][clickedY].gridType = 1;
                break;
            case "end":
                clearGrid(2);
                endPoint = {
                    x: clickedX,
                    y: clickedY
                }
                grid[clickedX][clickedY].gridType = 2;
                break;
            case "wall":
                grid[clickedX][clickedY].gridType = 3;
                break;
            default:
                grid[clickedX][clickedY].gridType = 0;
        }
    }
}

function clearGrid(type){
    for(let i = 0; i < grid.length; i ++){
        for(let j = 0; j < grid[i].length; j ++){
            if(grid[i][j].gridType == type){
                grid[i][j].gridType = 0;
            }
        }
    }
}

//Algorithms

//A*
function aStar(currentSquare, explored){
    grid[currentSquare.x][currentSquare.y].gridType = 4;
    let smallestFCostSquare;
    
    explored.push.apply(explored, aStarSmallestFCost(currentSquare));
  
 
    for(let i = 0; i < explored.length; i ++){
        if(grid[explored[i].x][explored[i].y].gridType != 4){
            if(smallestFCostSquare == null || smallestFCostSquare.fCost > explored[i].fCost){
                smallestFCostSquare = explored[i]
            }else if (smallestFCostSquare.fCost == explored[i].fCost){
                if(smallestFCostSquare.hCost > explored[i].hCost){
                    smallestFCostSquare = explored[i]
                }
            }
        }
        
    }
    currentSquare = smallestFCostSquare;
   
    if((currentSquare.x != endPoint.x || currentSquare.y != endPoint.y) && running){
        setTimeout(() => {
            aStar(currentSquare, explored);
        }, 1000/speedSlider.value());
    }else if(running != true){
        clearGrid(4);
        clearGrid(5);
    } else{
        running = false;
        let cameFrom;
        while(currentSquare != null){
            currentSquare.cameFrom;
            grid[currentSquare.x][currentSquare.y].gridType = 1;
            currentSquare = currentSquare.cameFrom;
        }
    }
    
}

function aStarSmallestFCost(square){
    let smallestFCostSquare = null;

    let list = [];
    let gCost;
    let hCost;

    if(square.gCost == null){
        square.gCost = 0;
    }

    for(let i = square.x - 1; i <= square.x + 1; i ++){
        for(let j = square.y - 1; j <= square.y + 1; j ++){
            if(i >= 0 && i < gridNumberX && j >= 0 && j < gridNumberY && !(square.x == i && square.y == j)){
                if(grid[i][j].gridType != 3 && grid[i][j].gridType != 4){
                    
                    gCost = Math.floor(Math.sqrt(Math.pow(grid[i][j].x - square.x, 2) + Math.pow(grid[i][j].y - square.y, 2)) * 10) + square.gCost;
                    hCost = Math.floor(Math.sqrt(Math.pow(grid[i][j].x - endPoint.x, 2) + Math.pow(grid[i][j].y - endPoint.y, 2)) * 10);

                    if(grid[i][j].gridType == 5){
                        if(grid[i][j].gCost > gCost){
                            grid[i][j].gCost = gCost;
                            grid[i][j].fCost = grid[i][j].gCost + grid[i][j].hCost;
                            grid[i][j].cameFrom = square;                        }
                    }else{
                        list.push({
                            x: i,
                            y: j,
                            gCost: gCost,
                            hCost: hCost,
                            fCost: gCost + hCost,
                            cameFrom: square
                        })
                    }

                    

                    grid[i][j].gridType = 5;
                }
            }
        }
    }
  

    return list;
}

function dijkstra(startingPoint){
    let visited = [];
    for(let i = 0; i < grid.length; i ++){
        for(let j = 0; j < grid[i].length; j ++){
            if(i == startingPoint.x && j == startingPoint.y){
                grid[i][j].distance = 0;
                grid[i][j].gridType = 4;
                visited.push(grid[i][j]);

            }else{
                grid[i][j].distance = Infinity;
            }
        
        }
    }

    dijkstraLoop(visited)
}

function dijkstraLoop(visited){
    let shortestDistance = Infinity;
    let bestIndex;
    
    for(let i = 0; i < visited.length; i ++){
        if(visited[i].distance <= shortestDistance){
            bestIndex = i;
            shortestDistance = visited[i].distance;
        }
    }
    let currentPoint = visited[bestIndex];
    visited.splice(bestIndex, 1);

    if(currentPoint.x == endPoint.x && currentPoint.y == endPoint.y){
        running = false;
        grid[currentPoint.x][currentPoint.y].gridType = 1;
        while(currentPoint.previousPoint != null){
            currentPoint = currentPoint.previousPoint;
            grid[currentPoint.x][currentPoint.y].gridType = 1;
        }
        grid[currentPoint.x][currentPoint.y].gridType = 1;
    }else if(running != true){
        clearGrid(4);
        clearGrid(5);
    }else{
        for(let i = currentPoint.x - 1; i <= currentPoint.x + 1; i ++){
            for(let j = currentPoint.y - 1; j <= currentPoint.y + 1; j ++){
                if(i >= 0 && i < gridNumberX && j >= 0 && j < gridNumberY && !(currentPoint.x == i && currentPoint.y == j)){
                    if(grid[i][j].gridType != 3 && grid[i][j].gridType != 4 ){
                        let newDistance = currentPoint.distance + sqrt(pow(i - currentPoint.x, 2) + pow(j - currentPoint.y, 2));
                        if(grid[i][j].distance > newDistance){
                            grid[i][j].distance = newDistance;
                            grid[i][j].previousPoint = grid[currentPoint.x][currentPoint.y];
                            visited.push(grid[i][j]);
                        }
                        
                        grid[i][j].gridType = 4;
                    }
                }
            }
        }

        if(visited.length != 0){
            setTimeout(() => {
                dijkstraLoop(visited);
        }, 500/(speedSlider.value() * 10));
        }else{

        }
        
    }

    
}


function breadthFirst(queue){

    let current = queue[0];
    queue.splice(0, 1);

    grid[current.x][current.y].gridType = 4;
    //console.log(current);

    for(let i = current.x - 1; i <= current.x + 1; i ++){
        for(let j = current.y - 1; j <= current.y + 1; j ++){
            if(i >= 0 && i < gridNumberX && j >= 0 && j < gridNumberY && (current.x == i || current.y == j) && !(current.x == i && current.y == j) && grid[i][j].gridType != 3 && grid[i][j].gridType != 4 && grid[i][j].gridType != 5){
                grid[i][j].previousPoint = current;
                grid[i][j].gridType = 5;
                queue.push(grid[i][j]);
            }
        }
    }

    if(current.x == endPoint.x && current.y == endPoint.y){
        running = false;
        grid[current.x][current.y].gridType = 1;
        while(current.previousPoint != null){
            current = current.previousPoint;
            grid[current.x][current.y].gridType = 1;
        }
        grid[current.x][current.y].gridType = 1;
    }else if(running != true){
        clearGrid(4);
        clearGrid(5);
    }else{
        setTimeout(() => {
            breadthFirst(queue);
        }, 500/(speedSlider.value() * 10))
    }
  
}

function depthFirst(stack){
    let current = stack[stack.length - 1];
    let addedToStack = false;
    grid[current.x][current.y].gridType = 4;
    for(let i = current.x + 1; i >= current.x - 1; i --){
        for(let j = current.y - 1; j <= current.y + 1; j ++){
            if(i >= 0 && i < gridNumberX && j >= 0 && j < gridNumberY && (current.x == i || current.y == j) && !(current.x == i && current.y == j) && grid[i][j].gridType != 3 && grid[i][j].gridType != 4 && grid[i][j].gridType != 5){
                if(!addedToStack){
                    grid[i][j].gridType = 5;
                    stack.push(grid[i][j]);
                    addedToStack = true;
                }
            }
        }
    }

    if(addedToStack == false){
        stack.splice(stack.length - 1, 1);
    }

    if(current.x == endPoint.x && current.y == endPoint.y){
        running = false;
        for(let i = 0; i < stack.length; i ++){
            grid[stack[i].x][stack[i].y].gridType = 1;
        }
        clearGrid(4);
    }else if(running != true){
        clearGrid(4);
        clearGrid(5);
    }else{
        setTimeout(() => {
            depthFirst(stack);
        }, 500/(speedSlider.value() * 10))
    }
}

function finished(){
   
}

//Generates Maze
clearButton.onclick = () => {
    running = false;
    clearGrid(1);
    clearGrid(2)
    clearGrid(3);
    clearGrid(4);
    clearGrid(5);

    grid[startPoint.x][startPoint.y].gridType = 1;
    grid[endPoint.x][endPoint.y].gridType = 2;
}
