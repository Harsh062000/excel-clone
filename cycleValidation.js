//Stroage => 2D array (Basic neede)
let graphComponentMatrix = [];

for (let i = 0; i < rows; i++) {
       let row = [];
       for (let j = 0; j < cols; j++) {
              //why array => More than one child relation (dependency)
              row.push([]);
       }
       graphComponentMatrix.push(row);
}

//true => cyclic, false => not cyclic
function isGraphCyclic(graphComponentMatrix) {
       //Dependency => visited, dfsVisited (2D array)
       let visited = [];  //node visited trace
       let dfsVisited = []; //stack visited trace

       for (let i = 0; i < rows; i++) {

              let visitedRow = [];
              let dfsVisitedRow = [];
              for (let j = 0; j < cols; j++) {
                     visitedRow.push(false);
                     dfsVisitedRow.push(false);
              }
              visited.push(visitedRow);
              dfsVisited.push(dfsVisitedRow);
       }

       for (let i = 0; i < rows; i++) {
              for (let j = 0; j < cols; j++) {
                     if (visited[i][j] === false) {
                            let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                            //found cycle so return immidiatly, noneed to explore more path
                            if (response === true) {
                                   return true;
                            }
                     }

              }
       }

       return false;
}

//start => visited(true); dfsVisited(true);
//end => dfsVisited(false);
//if(visited[i][j] === true) => already explored path, so go back no use to explore again
//cycle detectioncondition => if(visited[i][j] === true && dfsVisited[i][j] === true) => cycle
//return => true/false
//true => cyclic, false => not cyclic
function dfsCycleDetection(graphComponentMatrix, srcR, srcC, visited, dfsVisited) {
       visited[srcR][srcC] = true;
       dfsVisited[srcR][srcC] = true;

       //A1 => [[0,1], [1,0], [5,0], [5,10], ....]
       for (let children = 0; children < graphComponentMatrix[srcR][srcC].length; children++) {
              let [neighbourRid, neighbourCid] = graphComponentMatrix[srcR][srcC][children];
              if (visited[neighbourRid][neighbourCid] == false) {
                     let response = dfsCycleDetection(graphComponentMatrix, neighbourRid, neighbourCid, visited, dfsVisited);
                     if (response === true) {
                            //found cycle so return immidiatly, noneed to explore more path
                            return true;
                     }
              } else if (visited[neighbourRid][neighbourCid] === true && dfsVisited[neighbourRid][neighbourCid] === true) {
                     //found cycle so return immidiatly, noneed to explore more path
                     return true;
              }
       }

       dfsVisited[srcR][srcC] = false;
       return false;
}