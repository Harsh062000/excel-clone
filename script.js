let rows = 100;
let cols = 26;

let addressColCont = document.querySelector(".address-col-container");
let addressRowCont = document.querySelector(".address-row-container");
let cellsContainer = document.querySelector(".cells-container");
let addressBar = document.querySelector(".address-bar");

for (let i = 0; i < rows; i++) {
       let addressCol = document.createElement("div");
       addressCol.setAttribute("class", "address-col");
       addressCol.innerText = i + 1;
       addressColCont.appendChild(addressCol);
}

for (let i = 0; i < cols; i++) {
       let addressRow = document.createElement("div");
       addressRow.setAttribute("class", "address-row");
       addressRow.innerText = String.fromCharCode(65 + i);
       addressRowCont.appendChild(addressRow);
}

for (let i = 0; i < rows; i++) {
       let rowContainer = document.createElement("div");
       rowContainer.setAttribute("class", "row-container")
       for (let j = 0; j < cols; j++) {
              let cell = document.createElement("div");
              cell.setAttribute("class", "cell");
              cell.setAttribute("contenteditable", "true");
              rowContainer.appendChild(cell);
              addListenerForAddressBarDisplay(cell, i, j);
       }

       cellsContainer.appendChild(rowContainer);
}

function addListenerForAddressBarDisplay(cell, i, j) {
       cell.addEventListener("click", (e) => {
              let rowId = i + 1;
              let colId = String.fromCharCode(65 + j);
              addressBar.value = `${colId}${rowId}`
       })
}