function calculateAvg(){
    var table = document.getElementById("table-results");
    for (var i = 1, row; row = table.rows[i]; i++){
        var rowTotal = 0;
        var entries = 0;
        for (var j = 0, col; col = row.cells[j]; j++){
            console.log(col.innerText);
            if(j > 1 && col.innerText !== "- %" && col.innerText !== "-" && col.className !== "table-final-grade"){
                if(col.innerText.length > 2){
                    rowTotal = rowTotal + parseFloat(col.innerText.slice(0, -2));
                    entries = entries + 1;
                }
            }
            if(col.className === "table-final-grade"){
                var mean = 0;
                if(entries > 0){
                    mean = Math.round(rowTotal/entries);
                }
                if(mean < 40){
                    col.style.backgroundColor = "#de7d74";
                    col.style.color = "white";
                }else{
                    col.style.backgroundColor = "#ffffff";
                    col.style.color = "black";
                }
                col.innerText = mean.toString();
            }
        }
    }

}