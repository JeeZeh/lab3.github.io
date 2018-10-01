typeText = "Web Developer | Programmer | Graphics Designer | Musician";
typeIterator = 0;

window.onload = function () {
    this.setTimeout(() => {
        typeIt(this.document.getElementById("heading-sub"), 60);
    }, 150)
}

function typeIt(element, speed) {
    if (element.innerHTML === "&nbsp;") {
        element.innerHTML = "";
    }
    if (typeText === "") {
        typeText = element.innerHTML;
        element.innerHTML = "";
    }
    if (typeIterator < typeText.length) {

        element.innerHTML += typeText.charAt(typeIterator);
        typeIterator++;
        setTimeout(() => {
            typeIt(element, speed);
        }, speed);
    } else {
        typeIterator = 0;
        typeText = "";
    }
}