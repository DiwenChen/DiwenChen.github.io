
// Make sure the html is fully loaded before running this script
document.addEventListener('DOMContentLoaded', function() {

    // Get all menu toggles
    const toggles = document.querySelectorAll('.menu-toggle');

    // Add click listener for every submenu 
    toggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(event) {

            // Get the current submenu
            event.stopPropagation();
            const targetID = this.getAttribute('data-target');
            const submenu = document.getElementById(targetID);

            // Close all other submenus
            document.querySelectorAll('.submenu').forEach(function(menu) {
                if (menu.id !== targetID) {
                    menu.classList.remove('show');
                }
            });

            // Toggle the current submenu
            submenu.classList.toggle('show');
        });
    });

    // Close submenus when clicking anywhere else
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.menu-item')) {
            document.querySelectorAll('.submenu').forEach(function(menu) {
                menu.classList.remove('show');
            });
        }
    });


});