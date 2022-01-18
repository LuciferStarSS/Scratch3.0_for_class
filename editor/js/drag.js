function drag(elementToDrag, event, level) {
    var startX = event.clientX, startY = event.clientY;

    var origX;
    if (level == 1) {
        origX = elementToDrag.parentElement.parentElement.parentElement.parentElement.offsetLeft, origY = elementToDrag.parentElement.parentElement.parentElement.parentElement.offsetTop;
    }
    else {
        origX = elementToDrag.parentElement.parentElement.offsetLeft, origY = elementToDrag.parentElement.parentElement.offsetTop;
    }
    var deltaX = startX - origX, deltaY = startY - origY;
    if (document.addEventListener) {
        document.addEventListener("mousemove", moveHandler, true);
        document.addEventListener("mouseup", upHandler, true);
    }
    else {
        if (level == 1) {
            elementToDrag.parentElement.parentElement.parentElement.parentElement.setCapture();
            elementToDrag.parentElement.parentElement.parentElement.parentElement.attachEvent("onmousemove", moveHandler);
            elementToDrag.parentElement.parentElement.parentElement.parentElement.attachEvent("onmouseup", upHandler);
            elementToDrag.parentElement.parentElement.parentElement.parentElement.attachEvent("onlosecapture", upHandler);
        }
        else {
            elementToDrag.parentElement.parentElement.setCapture();
            elementToDrag.parentElement.parentElement.attachEvent("onmousemove", moveHandler);
            elementToDrag.parentElement.parentElement.attachEvent("onmouseup", upHandler);
            elementToDrag.parentElement.parentElement.attachEvent("onlosecapture", upHandler);
        }
    }
    if (event.stopPropagation) event.stopPropagation();
    else event.cancelBubble = true;
    if (event.preventDefault) event.preventDefault();
    else event.returnValue = false;

    function moveHandler(e) {
        if (!e) e = window.event;
        if (level == 1) {
            elementToDrag.parentElement.parentElement.parentElement.parentElement.style.left = (e.clientX - deltaX) + "px";
            elementToDrag.parentElement.parentElement.parentElement.parentElement.style.top = (e.clientY - deltaY) + "px";
            //elementToDrag.parentElement.parentElement.parentElement.parentElement.style.zIndex="10";
        }
        else {
            elementToDrag.parentElement.parentElement.style.left = (e.clientX - deltaX) + "px";
            elementToDrag.parentElement.parentElement.style.top = (e.clientY - deltaY) + "px";
            //elementToDrag.parentElement.parentElement.style.zIndex="10";
        }
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
    }
    function upHandler(e) {
        if (!e) e = window.event;
        if (level == 1) {
            //elementToDrag.parentElement.parentElement.parentElement.parentElement.style.zIndex="1";
        }
        else {
            //elementToDrag.parentElement.parentElement.style.zIndex="1";
        }
        if (document.removeEventListener) {
            document.removeEventListener("mouseup", upHandler, true);
            document.removeEventListener("mousemove", moveHandler, true);
        }
        else {
            if (level == 1) {
                elementToDrag.parentElement.parentElement.parentElement.parentElement.detachEvent("onlosecapture", upHandler);
                elementToDrag.parentElement.parentElement.parentElement.parentElement.detachEvent("onmouseup", upHandler);
                elementToDrag.parentElement.parentElement.parentElement.parentElement.detachEvent("onmousemove", moveHandler);
                elementToDrag.parentElement.parentElement.parentElement.parentElement.releaseCapture();
            }
            else {
                elementToDrag.parentElement.parentElement.detachEvent("onlosecapture", upHandler);
                elementToDrag.parentElement.parentElement.detachEvent("onmouseup", upHandler);
                elementToDrag.parentElement.parentElement.detachEvent("onmousemove", moveHandler);
                elementToDrag.parentElement.parentElement.releaseCapture();
            }
        }
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
        // if(document.getElementById("form").onsubmit()!=false) document.getElementById("form").submit();
    }
}