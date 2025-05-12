
// Javascript for the New Canvas app

// hot key listener
document.addEventListener('keydown', function(event) {
    // prevent hot keys while typing 
    const tag = document.activeElement.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
  
    if (event.altKey) {
      switch (event.key) {
        case "1":
            window.location.href = "index.html";
            break;
        case "2":
            window.location.href = "Dashboard.html";
            break;
        case "3":
            window.location.href = "ListApps.html";
            break;
        case "4":
            window.location.href = "Settings.html";
            break;
      }
    }
});

// open sidebar
document.getElementById("classes-link").addEventListener("click", function() {
    var sidebar = document.getElementById("sidebar");
    
    // Check if the sidebar is currently at -200px (closed)
    if (sidebar.style.left === "190px") {
        // If the sidebar is open, close it by moving it off-screen
        sidebar.style.left = "-200px";
    } else {
        // If the sidebar is closed, open it by moving it to 190px
        sidebar.style.left = "190px";
    }
});

// App List Filters dropdown
function toggleFilters() {
    const row = document.getElementById("filterRow");
    const arrow = document.getElementById("arrow");
    
    if (row.style.display === 'flex') {
        row.style.display = 'none';
        arrow.classList.remove('rotate');
    } else {
        row.style.display = 'flex';
        arrow.classList.add('rotate');
    }
}