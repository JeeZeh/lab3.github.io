typeText = "Web Developer | Programmer | Graphics Artist | Musician";
typeIterator = 0;

window.onload = function(){
    this.setTimeout(() => {
        typeIt(this.document.getElementById("heading-sub"), 60);
    }, 750)
}

function typeIt(element, speed){
    if(element.classList.contains("hide"))
        element.classList.remove("hide");
    if(typeText === ""){
        typeText = element.innerHTML;
        element.innerHTML = "";
    }
    if(typeIterator < typeText.length){
        element.innerHTML += typeText.charAt(typeIterator);
        typeIterator++;
        setTimeout(() => {
            typeIt(element, speed);
        }, speed);
    }
    else{
        typeIterator = 0;
        typeText = "";
    }
}

