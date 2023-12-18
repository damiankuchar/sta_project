function translateButton() {
    const toggleButton = document.getElementById("hide-sidebar-btn");
    const arrowPath = document.getElementById("arrow-path");

    if (!toggleButton.style.transform || toggleButton.style.transform === "translateX(0px)") {
        toggleButton.style.transform = "translateX(244px)";
        arrowPath.setAttribute("transform", "rotate(180, 4, 7)");
    } else {
        toggleButton.style.transform = "translateX(0px)";
        arrowPath.setAttribute("transform", "rotate(0)");
    }
}