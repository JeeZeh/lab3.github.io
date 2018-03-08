var dimensionsHistory = [];
var assignments;
var dataHistory = [];
var highlightedColumn = [];
var highlighted = "";
var selected = "red";
var deSelected = "white";

function addRow(){
    var table = document.getElementById("table-results");
    var rows = table.rows.length;
    var cols = table.rows[0].cells.length;
    var row = table.insertRow(rows);
    for(var i = 0; i < cols; i++){
        var inserted = row.insertCell(i);
        switch(i){
            case 0: inserted.innerHTML = "<td><input class=\"table-input name\" type=\"text\" placeholder=\"-\" onclick=\"toggleRow(this.parentElement.parentElement);\"></td>"; break;
            case 1: inserted.innerHTML = "<input class=\"table-input id\" type=\"text\" placeholder=\"-\" >"; break;
            case (cols-1): inserted.outerHTML = "<td class=\"grade\">-</td>"; break;
            default: inserted.innerHTML = "<input class=\"table-input assignment\" type=\"number\" placeholder=\"-\" onblur=\"calculateAvg();\">";
        }
    }
    calculateAvg();
}

function generateTable(rows, columns){
    highlighted = "";
    document.getElementById("table-container").innerHTML = "<table id=\"table-results\">\n" +
        "        <tr id=\"table-header-row\">\n" +
        "            <th id=\"student-header\">Student Name</th>\n" +
        "            <th id=\"id-header\">ID</th>\n" +
        "            <th class=\"assignment-header\" onclick=\"toggleColumn(this);\">Assignment 1</th>\n" +
        "            <th id=\"final-header\">Final Grade</th>\n" +
        "        </tr>\n" +
        "        <tr class=\"table-content-row\" id=\"row-template\">\n" +
        "            <td><input class=\"table-input name\" type=\"text\" placeholder=\"-\" onclick=\"toggleRow(this.parentElement.parentElement);\"></td>\n" +
        "            <td><input class=\"table-input id\" type=\"text\" placeholder=\"-\" ></td>\n" +
        "            <td><input class=\"table-input assignment\" type=\"number\" placeholder=\"-\" onblur=\"calculateAvg();\"></td>\n" +
        "            <td class=\"grade\">-</td>\n" +
        "        </tr>\n" +
        "    </table>";

    for(var i = 0; i < rows; i++){
        addRow();
    }
    for(var j = 0; j < columns; j++){
        addColumn();
    }
    console.log(document.getElementById("table-results"));
}

function addColumn(){
    var table = document.getElementById("table-results");
    var cols = table.rows[0].cells.length;
    for(var i = 0, row; row = table.rows[i]; i++){
        var inserted = row.insertCell(cols-1);
        if(i === 0) {
            inserted.outerHTML = "<th class=\"assignment-header\" onclick=\"toggleColumn(this)\">" + "Assignment " + (cols - 2) + "</th>";
        }
        else{
            inserted.innerHTML = "<td><input class=\"table-input assignment\" type=\"number\" placeholder=\"-\" onblur=\"calculateAvg();\"></td>";
        }
    }
    calculateAvg();
}

function calculateAvg() {
    normalise();
    var table = document.getElementById("table-results");
    assignments = table.rows[0].cells.length - 3;
    for (var i = 1, row; row = table.rows[i]; i++) {
        var rowTotal = 0;
        for (var j = 2, col; col = row.cells[j], j < (table.rows[0].cells.length-1); j++) {
            rowTotal += parseFloat(col.children[0].value) || 0;
        }
        if(assignments > 0) {
            var mean = Math.round(rowTotal /assignments);
            row.cells[table.rows[0].cells.length-1].innerText = mean.toString();
        }
    }
}

function normalise(){
    var table = document.getElementById("table-results");
    for (var i = 1, row; row = table.rows[i]; i++) {
        for (var j = 2, col; col = row.cells[j], j < (table.rows[0].cells.length-1); j++) {
            if(col.children[0].value > 100){
                col.children[0].value = 100;
            }
            if(col.children[0].value < 0){
                col.children[0].value = 0;
            }
        }
    }
}

function writeTable(dimensions, data) {
    var rows = parseInt(dimensions.split("|")[0]);
    var columns = parseInt(dimensions.split("|")[1]);
    var cellData = data.split("|");
    assignments = columns - 3;
    console.log("This makes no sense: " + (rows-1));
    generateTable((rows-1), (columns-4));
    var table = document.getElementById("table-results");
    var cell = 0;
    for(var i = 1, row; row = table.rows[i]; i++){
        for(var j = 0, col; col = row.cells[j]; j++){
            if(j < columns-1){
                if(cellData[cell] !== "-")
                    col.children[0].setAttribute('value', cellData[cell]);
                cell++;
            }
        }
    }
    calculateAvg();
}

function readTable(){
    highlighted = "";
    eraseCookie("tableData");
    eraseCookie("tableDimensions");
    var table = document.getElementById("table-results");
    var columns = table.rows[0].cells.length;
    var dimensions = (table.rows.length-1) + "|" + columns;
    var output = "";
    for(var i = 1, row; row = table.rows[i]; i++){
        if(i > 1)
            output += "|";
        for(var j = 0, col; col = row.cells[j]; j++) {
            if (j < columns - 1) {
                if (col.children[0].value === "")
                    output += "-";
                else
                    output += col.children[0].value.toString().replace("|", "");
            }
            if(j < columns-2)
                output += "|";
        }
    }
    setCookie("tableDimensions", dimensions, 1);
    console.log("Cookie Set: Dimensions = " + dimensions);
    setCookie("tableData", output, 1);
    console.log("Cookie Set: Data = " + output);
}

function saveState(){
    var table = document.getElementById("table-results");
    var columns = table.rows[0].cells.length;
    var output = "";
    for(var i = 1, row; row = table.rows[i]; i++){
        if(i > 1)
            output += "|";
        for(var j = 0, col; col = row.cells[j]; j++) {
            if (j < columns - 1) {
                if (col.children[0].value === "")
                    output += "-";
                else
                    output += col.children[0].value.toString().replace("|", "");
            }
            if(j < columns-2)
                output += "|";
        }
    }
    if(dataHistory[dataHistory.length-1] !== output || dimensionsHistory[dimensionsHistory.length-1] !== ((table.rows.length-1) + "|" + columns)) {
        dimensionsHistory.push((table.rows.length - 1) + "|" + columns);
        dataHistory.push(output);
    }
}

function undo() {
    writeTable(dimensionsHistory[dimensionsHistory.length-2],dataHistory[dataHistory.length-2]);
    document.getElementById("btn-undo").disabled = true;
    highlighted = "";
    highlightedColumn = [];
}

function toggleRow(row){
    if(highlighted === "") {
        highlighted = row;
        for(var i = 0; i < row.cells.length; i++){
            row.cells[i].style.background = selected;
        }
        document.getElementById("btn-del-row").disabled = false;
    }
    else if(highlighted === row){
        highlighted = "";
        for(var i = 0; i < row.cells.length; i++){
            row.cells[i].style.background = deSelected;
        }

        document.getElementById("btn-del-row").disabled = false;
    }
    else{
        toggleRow(highlighted);
        toggleRow(row);
    }
}

function toggleColumn(cell){
    var table = document.getElementById("table-results");
    var index = parseInt(cell.innerText.split(" ")[1])+1;
    console.log(index);
    if(highlightedColumn.length === 0) {
        for (var i = 0, row; row = table.rows[i]; i++) {
            for (var j = 0, col; col = row.cells[j]; j++) {
                if (j === index) {
                    col.style.background = selected;
                    highlightedColumn.push(col);
                    document.getElementById("btn-del-col").disabled = false;
                }
            }
        }
    }
    else if(cell.innerText === highlightedColumn[0].innerText){
        for (var i = 0, row; row = table.rows[i]; i++) {
            for (var j = 0, col; col = row.cells[j]; j++) {
                if (j === index) {
                    col.style.background = deSelected;
                    highlightedColumn = [];
                    document.getElementById("btn-del-col").disabled = true;
                }
            }
        }
    }
    else{
        toggleColumn(highlightedColumn[0]);
        toggleColumn(cell);
    }
}

function deleteColumn(){
    saveState();
    for(var i = 0; i < highlightedColumn.length; i++){
        var cell = highlightedColumn[i]; 
        cell.parentElement.removeChild(cell);
    }
    saveState();
    document.getElementById("btn-undo").disabled = false;
    document.getElementById("btn-del-col").disabled = true;
    highlightedColumn = [];
}

function deleteRow(){
    saveState();
    if(highlighted !== null || highlighted !== ""){
        highlighted.parentElement.removeChild(highlighted);
    }
    saveState();
    document.getElementById("btn-undo").disabled = false;
    document.getElementById("btn-del-row").disabled = true;
    highlighted = ""
}

/*-------------------------*/

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}