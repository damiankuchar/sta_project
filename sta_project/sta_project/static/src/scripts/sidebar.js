let isArrowRotated = false;

function toggleSidebar() {
    const sidebar = document.getElementById('default-sidebar');
    const hideSidebarButton = document.getElementById("hide-sidebar-btn");
    const arrowPath = document.getElementById("arrow-path");

    sidebar.classList.toggle('sm:translate-x-0');
    hideSidebarButton.classList.toggle("-right-6")
    hideSidebarButton.classList.toggle("-right-3")

    isArrowRotated = !isArrowRotated;
    if (isArrowRotated) {
        arrowPath.setAttribute("transform", "rotate(180, 4, 7)");
    } else {
        arrowPath.setAttribute("transform", "rotate(0)");
    }
}