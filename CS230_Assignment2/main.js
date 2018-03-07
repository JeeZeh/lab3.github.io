var assignments = 1;
var dimensionsHistory = [];
var dataHistory = [];

function addRow(){
    var table = document.getElementById("table-results");
    var rows = table.rows.length;
    var cols = table.rows[0].cells.length;
    var row = table.insertRow(rows);
    for(var i = 0; i < cols; i++){
        var inserted = row.insertCell(i);
        switch(i){
            case 0: inserted.innerHTML = "<input class=\"table-input name\" type=\"text\" placeholder=\"-\" onblur=\"saveState();\">"; break;
            case 1: inserted.innerHTML = "<input class=\"table-input id\" type=\"text\" placeholder=\"-\" onblur=\"saveState();\">"; break;
            case (cols-1): inserted.outerHTML = "<td class=\"grade\">-</td>"; break;
            default: inserted.innerHTML = "<input class=\"table-input assignment\" type=\"number\" placeholder=\"-\" onblur=\"calculateAvg(); saveState();\">";
        }
    }
    calculateAvg();
}

function generateTable(rows, columns){
    document.getElementById("table-container").innerHTML = "<table id=\"table-results\">\n" +
        "        <tr id=\"table-header-row\">\n" +
        "            <th id=\"student-header\">Student Name</th>\n" +
        "            <th id=\"id-header\">ID</th>\n" +
        "            <th class=\"assignment-header\">Assignment 1</th>\n" +
        "            <th id=\"final-header\">Final Grade</th>\n" +
        "        </tr>\n" +
        "        <tr class=\"table-content-row\" id=\"row-template\">\n" +
        "            <td><input class=\"table-input name\" type=\"text\" placeholder=\"-\" onblur=\"saveState();\"></td>\n" +
        "            <td><input class=\"table-input id\" type=\"text\" placeholder=\"-\" onblur=\"saveState();\"></td>\n" +
        "            <td><input class=\"table-input assignment\" type=\"number\" placeholder=\"-\" onblur=\"calculateAvg(); saveState();\"></td>\n" +
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
            inserted.outerHTML = "<th class=\"assignment-header\">" + "Assignment " + (cols - 2) + "</th>";
            assignments+=1;
        }
        else{
            inserted.innerHTML = "<td><input class=\"table-input assignment\" type=\"number\" placeholder=\"-\" onblur=\"calculateAvg(); saveState();\"></td>";
        }
    }
    calculateAvg();
}

function calculateAvg() {
    normalise();
    var table = document.getElementById("table-results");
    for (var i = 1, row; row = table.rows[i]; i++) {
        var rowTotal = 0;
        for (var j = 2, col; col = row.cells[j], j < (table.rows[0].cells.length-1); j++) {
            rowTotal += parseFloat(col.children[0].value) || 0;
        }
        if(assignments > 0) {
            var mean = Math.round(rowTotal / assignments);
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
                    col.children[0].setAttribute('value', cellData[cell++]);
            }
        }
    }
    calculateAvg();
}

function readTable(){
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