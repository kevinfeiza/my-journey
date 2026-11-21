document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       01. CURSOR GLOW
    ===================================== */

    const cursor = document.querySelector(".cursor-glow");

    if (cursor) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let initialized = false;
        let animationFrame = null;

        function animateCursor() {
            currentX += (mouseX - currentX) * 0.12;
            currentY += (mouseY - currentY) * 0.12;

            cursor.style.left = currentX + "px";
            cursor.style.top = currentY + "px";

            const distance = Math.hypot(
                mouseX - currentX,
                mouseY - currentY
            );

            if (distance > 0.1) {
                animationFrame = requestAnimationFrame(animateCursor);
            } else {
                currentX = mouseX;
                currentY = mouseY;

                cursor.style.left = currentX + "px";
                cursor.style.top = currentY + "px";

                animationFrame = null;
            }
        }

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!initialized) {
                currentX = mouseX;
                currentY = mouseY;
                initialized = true;
            }

            cursor.style.opacity = "1";

            if (animationFrame === null) {
                animationFrame = requestAnimationFrame(animateCursor);
            }
        });

        document.addEventListener("mouseleave", () => {
            cursor.style.opacity = "0";
        });

        document.addEventListener("mouseenter", () => {
            cursor.style.opacity = "1";
        });
    }


    /* =====================================
       02. SCROLL REVEAL
    ===================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                } else {
                    entry.target.classList.remove("revealed");
                }

            });

        }, {
            threshold: 0.15
        });

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("revealed");
        });
    }


    /* =====================================
       03. ACTIVE NAVBAR
    ===================================== */

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach((link) => {

        const href = link.getAttribute("href");

        if (!href) return;

        const linkPage = href.split("/").pop().split("?")[0].split("#")[0];

        if (linkPage === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }

    });


    /* =====================================
       04. BACK TO TOP
    ===================================== */

    const backToTop = document.createElement("button");

    backToTop.className = "back-to-top";
    backToTop.textContent = "↑";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.setAttribute("type", "button");

    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }

    }, { passive: true });

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    /* =====================================
       05. MOBILE NAVIGATION
    ===================================== */

    const navMenu = document.querySelector(".nav-links");
    const menuToggle = document.querySelector(".menu-toggle");

    if (navMenu && menuToggle) {

        function closeMenu() {
            menuToggle.classList.remove("active");
            navMenu.classList.remove("open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        }

        function openMenu() {
            menuToggle.classList.add("active");
            navMenu.classList.add("open");

            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close navigation menu");
        }

        menuToggle.addEventListener("click", () => {

            if (navMenu.classList.contains("open")) {
                closeMenu();
            } else {
                openMenu();
            }

        });

        navMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (e) => {

            if (
                !menuToggle.contains(e.target) &&
                !navMenu.contains(e.target) &&
                navMenu.classList.contains("open")
            ) {
                closeMenu();
            }

        });

        document.addEventListener("keydown", (e) => {

            if (e.key === "Escape") {
                closeMenu();
            }

        });

        window.addEventListener("resize", () => {

            if (window.innerWidth > 700) {
                closeMenu();
            }

        });

    }


    /* =====================================
       06. PAGE TRANSITION
    ===================================== */

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion) {

        document.addEventListener("click", (e) => {

            const link = e.target.closest("a");

            if (!link) return;

            const href = link.getAttribute("href");

            if (!href) return;

            if (
                e.defaultPrevented ||
                e.button !== 0 ||
                e.ctrlKey ||
                e.shiftKey ||
                e.altKey ||
                e.metaKey ||
                link.target === "_blank" ||
                link.hasAttribute("download")
            ) {
                return;
            }

            const destination = new URL(href, window.location.href);

            if (destination.origin !== window.location.origin) {
                return;
            }

            if (
                destination.pathname === window.location.pathname &&
                destination.search === window.location.search
            ) {
                return;
            }

            e.preventDefault();

            document.body.classList.add("page-leaving");

            setTimeout(() => {
                window.location.href = destination.href;
            }, 100);

        });

    }

});