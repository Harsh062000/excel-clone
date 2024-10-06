for (let i = 0; i < rows; i++) {
       for (let j = 0; j < cols; j++) {
              let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
              cell.addEventListener("blur", (e) => {
                     let address = addressBar.value;
                     let [cell, cellProp] = getCellAndCellProp(address);
                     let enteredDate = cell.innerText;

                     if (enteredDate === cellProp.value) return;
                     cellProp.value = enteredDate;

                     //if data modifies remove Parent-Child(P-C) relation, formula empty, update children with new hardcoded (modified) value
                     removeChildFromParent(cellProp.formula);
                     cellProp.formula = "";
                     updateChildrenCell(address)
              })
       }
}

let formulaBar = document.querySelector('.formula-bar');
formulaBar.addEventListener("keydown", (e) => {
       let inputFormula = formulaBar.value;
       if (e.key === "Enter" && inputFormula) {

              //if change in formula, break old Parent-Child(P-C) relation, evaluate new formula, add new P-C relation
              let address = addressBar.value;
              let [cell, cellProp] = getCellAndCellProp(address);
              if (inputFormula !== cellProp.formula) {
                     removeChildFromParent(cellProp.formula);
              }

              addChildToGraphComponent(inputFormula, address);
              //check if formula is cyclic or not, then only evaluate

              //true => cyclic, false => not cyclic
              let isCyclic = isGraphCyclic(graphComponentMatrix);

              if (isCyclic === true) {
                     alert("Your formula is cyclic");
                     removeChildFromGraphComponent(inputFormula, address);
                     return;
              }

              let evaluatedValue = evaluateFormula(inputFormula);

              //To update UI and CellProp in DB
              setCellUIAndCellProp(evaluatedValue, inputFormula, address);
              addChildToParent(inputFormula);
              console.log(sheetDB);
              updateChildrenCell(address);
       }
});

function addChildToGraphComponent(formula, childAddress) {
       let [childRid, childCid] = decodeRidCidFromAddress(childAddress);
       let encodedFormula = formula.split(" ");

       for (let i = 0; i < encodedFormula.length; i++) {
              let asciiValue = encodedFormula[i].charCodeAt(0);
              if (asciiValue >= 65 && asciiValue <= 90) {
                     let [parentRid, parentCid] = decodeRidCidFromAddress(encodedFormula[i]);
                     //B1: A1 + 10;
                     //rid => i, cid => j
                     graphComponentMatrix[parentRid][parentCid].push([childRid, childCid]);
              }
       }
}

function removeChildFromGraphComponent(formula, childAddress) {
       let [childRid, childCid] = decodeRidCidFromAddress(childAddress);
       let encodedFormula = formula.split(" ");

       for (let i = 0; i < encodedFormula.length; i++) {
              let asciiValue = encodedFormula[i].charCodeAt(0);
              if (asciiValue >= 65 && asciiValue <= 90) {
                     let [parentRid, parentCid] = decodeRidCidFromAddress(encodedFormula[i]);
                     //B1: A1 + 10;
                     //rid => i, cid => j
                     graphComponentMatrix[parentRid][parentCid].pop();
              }
       }

}

function updateChildrenCell(parentAddress) {
       let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
       let children = parentCellProp.children;

       for (let i = 0; i < children.length; i++) {
              let childAddress = children[i];
              let [childCell, childCellProp] = getCellAndCellProp(childAddress);
              let childFormula = childCellProp.formula;

              let evaluatedValue = evaluateFormula(childFormula);
              setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
              updateChildrenCell(childAddress);
       }
}

function addChildToParent(formula) {
       let childAddress = addressBar.value;
       let encodedFormula = formula.split(" ");
       for (let i = 0; i < encodedFormula.length; i++) {
              let asciiValue = encodedFormula[i].charCodeAt(0);
              if (asciiValue >= 65 && asciiValue <= 90) {
                     let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
                     parentCellProp.children.push(childAddress);
              }
       }
}

function removeChildFromParent(formula) {
       let childAddress = addressBar.value;
       let encodedFormula = formula.split(" ");
       for (let i = 0; i < encodedFormula.length; i++) {
              let asciiValue = encodedFormula[i].charCodeAt(0);
              if (asciiValue >= 65 && asciiValue <= 90) {
                     let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
                     let index = parentCellProp.children.indexOf(childAddress);
                     parentCellProp.children.splice(index, 1);
              }
       }
}

function evaluateFormula(formula) {
       let encodedFormula = formula.split(" ");
       for (let i = 0; i < encodedFormula.length; i++) {
              let asciiValue = encodedFormula[i].charCodeAt(0);
              if (asciiValue >= 65 && asciiValue <= 90) {
                     let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
                     encodedFormula[i] = cellProp.value;
              }
       }
       let decodedFormula = encodedFormula.join(" ");
       return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
       let [cell, cellProp] = getCellAndCellProp(address);

       //UI updated
       cell.innerText = evaluatedValue;
       //DB updated
       cellProp.value = evaluatedValue;
       cellProp.formula = formula
}

