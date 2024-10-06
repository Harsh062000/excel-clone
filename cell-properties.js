//Storage
let sheetDB = [];

for (let i = 0; i < rows; i++) {
       let sheetRow = [];
       for (let j = 0; j < cols; j++) {
              let cellProp = {
                     bold: false,
                     italic: false,
                     underline: false,
                     alignment: "left",
                     fontFamily: "monospace",
                     fontSize: "14",
                     fontColor: "#000000",
                     bgColor: "#000000", // just for idication purpose only
                     value: "",
                     formula: "",
                     children: [],
              }
              sheetRow.push(cellProp);
       }
       sheetDB.push(sheetRow);
}

//Selectors for cell properties

let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let bgColor = document.querySelector(".bg-color-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

//Application of two-way data binding

//Attach property listeners 
bold.addEventListener('click', (e) => {
       let address = addressBar.value;
       let [cell, cellProp] = getCellAndCellProp(address);

       //Modification
       cellProp.bold = !cellProp.bold; //Data changed
       cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; // UI also changed for cell only
       bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp; //UI also changed for menubar visibility
});

italic.addEventListener('click', (e) => {
       let address = addressBar.value;
       let [cell, cellProp] = getCellAndCellProp(address);

       //Modification
       cellProp.italic = !cellProp.italic; //Data changed
       cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; // UI also changed for cell only
       italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp; //UI also changed for menubar visibility
});

underline.addEventListener('click', (e) => {
       let address = addressBar.value;
       let [cell, cellProp] = getCellAndCellProp(address);

       //Modification
       cellProp.underline = !cellProp.underline; //Data changed
       cell.style.textDecoration = cellProp.underline ? "underline" : "none"; // UI also changed for cell only
       underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp; //UI also changed for menubar visibility
});

fontSize.addEventListener("change", (e) => {
       let address = addressBar.value;
       let [cell, cellProp] = getCellAndCellProp(address);

       cellProp.fontSize = fontSize.value; //Data changed
       cell.style.fontSize = cellProp.fontSize + "px";
       fontSize.value = cellProp.fontSize;
});

fontFamily.addEventListener("change", (e) => {
       let address = addressBar.value;
       let [cell, cellProp] = getCellAndCellProp(address);

       cellProp.fontFamily = fontFamily.value; //Data changed
       cell.style.fontFamily = cellProp.fontFamily;
       fontFamily.value = cellProp.fontFamily;
});

fontColor.addEventListener("change", (e) => {
       let address = addressBar.value;
       let [cell, cellProp] = getCellAndCellProp(address);

       cellProp.fontColor = fontColor.value; //Data changed
       cell.style.color = cellProp.fontColor;
       fontColor.value = cellProp.fontColor;
});

bgColor.addEventListener("change", (e) => {
       let address = addressBar.value;
       let [cell, cellProp] = getCellAndCellProp(address);

       cellProp.bgColor = bgColor.value; //Data changed
       cell.style.backgroundColor = cellProp.bgColor;
       bgColor.value = cellProp.bgColor;
});

alignment.forEach((alignElement) => {
       alignElement.addEventListener("click", (e) => {
              let address = addressBar.value;
              let [cell, cellProp] = getCellAndCellProp(address);

              let alignValue = e.target.classList[0];

              cellProp.alignment = alignValue; //data changed
              cell.style.textAlign = cellProp.alignment; //UI change 
              switch (alignValue) { //UI change for all 3 alignment
                     case "left":
                            leftAlign.style.backgroundColor = activeColorProp;
                            centerAlign.style.backgroundColor = inactiveColorProp;
                            rightAlign.style.backgroundColor = inactiveColorProp;
                            break;
                     case "center":
                            centerAlign.style.backgroundColor = activeColorProp;
                            leftAlign.style.backgroundColor = inactiveColorProp;
                            rightAlign.style.backgroundColor = inactiveColorProp;
                            break;
                     case "right":
                            rightAlign.style.backgroundColor = activeColorProp;
                            centerAlign.style.backgroundColor = inactiveColorProp;
                            leftAlign.style.backgroundColor = inactiveColorProp;
                            break;
              }
       })
})

//to make all property visible for each cell or inactive to perticular cells

let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++) {
       addListenerToAttachCellProperties(allCells[i]);

}

function addListenerToAttachCellProperties(cell) {
       cell.addEventListener("click", (e) => {
              let address = addressBar.value;
              let [rid, cid] = decodeRidCidFromAddress(address);
              let cellProp = sheetDB[rid][cid];

              //cell properties
              cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
              cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
              cell.style.textDecoration = cellProp.underline ? "underline" : "none";
              cell.style.fontSize = cellProp.fontSize + "px";
              cell.style.fontFamily = cellProp.fontFamily;
              cell.style.color = cellProp.fontColor;
              cell.style.backgroundColor = cellProp.bgColor === "#000000" ? "transparent" : cellProp.bgColor;
              cell.style.textAlign = cellProp.alignment;


              //apply properties for UI container
              bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
              italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
              underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
              fontSize.value = cellProp.fontSize;
              fontFamily.value = cellProp.fontFamily;
              fontColor.value = cellProp.fontColor;
              bgColor.value = cellProp.bgColor;
              switch (cellProp.alignment) { //UI change for all 3 alignment
                     case "left":
                            leftAlign.style.backgroundColor = activeColorProp;
                            centerAlign.style.backgroundColor = inactiveColorProp;
                            rightAlign.style.backgroundColor = inactiveColorProp;
                            break;
                     case "center":
                            centerAlign.style.backgroundColor = activeColorProp;
                            leftAlign.style.backgroundColor = inactiveColorProp;
                            rightAlign.style.backgroundColor = inactiveColorProp;
                            break;
                     case "right":
                            rightAlign.style.backgroundColor = activeColorProp;
                            centerAlign.style.backgroundColor = inactiveColorProp;
                            leftAlign.style.backgroundColor = inactiveColorProp;
                            break;
              }
              let formulaBar = document.querySelector(".formula-bar");
              formulaBar.value = cellProp.formula;
              cell.value = cellProp.formula;
       })
}

function getCellAndCellProp(address) {
       let [rid, cid] = decodeRidCidFromAddress(address);
       //access cell and storage object
       let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
       let cellProp = sheetDB[rid][cid];
       return [cell, cellProp];
}

function decodeRidCidFromAddress(address) {
       //address -> "A1"
       let rid = Number(address.slice(1) - 1); // "1" => 0
       let cid = Number(address.charCodeAt(0)) - 65; // "A" => 65 - 65 => 0

       return [rid, cid];
}