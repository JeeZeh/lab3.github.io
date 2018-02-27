function addRow(){
    var table = document.getElementById("table-results");
    var rows = table.rows.length;
    var cols = table.rows[0].cells.length;
    var row = table.insertRow(rows);
    for(var i = 0; i < cols; i++){
        var inserted = row.insertCell(i);
        switch(i){
            case 0: inserted.innerHTML = "<input class=\"table-input name\" type=\"text\" placeholder=\"-\">"; break;
            case 1: inserted.innerHTML = "<input class=\"table-input id\" type=\"text\" placeholder=\"-\">"; break;
            case (cols-1): inserted.outerHTML = "<td class=\"grade\">-</td>"; break;
            default: inserted.innerHTML = "<input class=\"table-input assignment\" type=\"number\" placeholder=\"-\">";
        }
    }
}

function addColumn(){
    var table = document.getElementById("table-results");
    var cols = table.rows[0].cells.length;
    for(var i = 0, row; row = table.rows[i]; i++){
        var inserted = row.insertCell(cols-1);
        if(i === 0) {
            inserted.outerHTML = "<th class=\"assignment-header\">" + "Assignment " + (cols - 2) + "</th>";
        }
        else{
            inserted.innerHTML = "<input class=\"table-input assignment\" type=\"number\" placeholder=\"-\">";
        }
    }
}

function calculateAvg(){

}