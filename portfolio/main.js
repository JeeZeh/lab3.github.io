var about = document.getElementById("about-content");
var showcase = document.getElementById("showcase-content");

function toggle(elementID){
    if(elementID == "showcase"){
        if(!about.classList.contains("hidden")){
            about.classList.toggle("hidden");
            showcase.classList.toggle("hidden");
            document.getElementById("about").classList.toggle("can-click");
            document.getElementById("showcase").classList.toggle("can-click");
        }
    }
    else{
        if(!showcase.classList.contains("hidden")){
            showcase.classList.toggle("hidden");
            about.classList.toggle("hidden");
            document.getElementById("about").classList.toggle("can-click");
            document.getElementById("showcase").classList.toggle("can-click");
        }
    }
   
}