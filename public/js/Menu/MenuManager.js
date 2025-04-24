export default class MenuManager {
    /**
     *
     * @type {null|Function}
     */
    static callback = null;
    /**
     *
     * @param {Function|null} callback
     */
    static init(callback = null) {
        MenuManager.callback = callback;

        // Toggle mobile menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a navigation link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Account for fixed header
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add submenu toggle for mobile
        document.querySelectorAll('.has-submenu > a').forEach(link => {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 767) {
                    e.preventDefault();
                    const submenu = this.nextElementSibling;
                    submenu.classList.toggle('active');
                }
            });
        });



        // Handle Menu Actions
        document.addEventListener(
            "menuAction",
            (e) => {
                MenuManager.onMenuItem(e.detail);
            },
            false,
        );
    }

    /**
     *
     * @param {string} action
     */
    static onMenuItem(action) {
        //console.log(`onMenuItem ${action}`);
        MenuManager.callback&&MenuManager.callback(action);
    }
}

window.MenuManager = MenuManager;

/**
 *
 * @param {Function|null} callback
 */
window.initMenuManager = function(callback = null) {
    window.MenuManager.init(callback);
}