```javascript
/* =========================================
   LA TAVOLA — PREMIUM JAVASCRIPT
========================================= */


/* =========================
   ELEMENTS
========================= */

const header = document.getElementById("header");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const filterButtons = document.querySelectorAll(".filter-btn");
const menuCards = document.querySelectorAll(".menu-card");

const reservationForm =
    document.getElementById("reservationForm");

const dateInput =
    document.getElementById("date");

const toast =
    document.getElementById("toast");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");

const toastClose =
    document.getElementById("toastClose");

const backToTop =
    document.getElementById("backToTop");


/* =========================
   MOBILE MENU
========================= */

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const isOpen =
            navLinks.classList.toggle("active");

        menuToggle.classList.toggle(
            "active",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

    });


    /* Close menu after clicking link */

    document
        .querySelectorAll(".nav-links a")
        .forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("active");

                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });


    /* Close when clicking outside */

    document.addEventListener("click", event => {

        const clickedInsideMenu =
            navLinks.contains(event.target);

        const clickedButton =
            menuToggle.contains(event.target);

        if (
            !clickedInsideMenu &&
            !clickedButton &&
            navLinks.classList.contains("active")
        ) {

            navLinks.classList.remove("active");

            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });

}


/* =========================
   HEADER SCROLL EFFECT
========================= */

function updateHeader() {

    if (!header) return;

    if (window.scrollY > 40) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

}

window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);

updateHeader();


/* =========================
   MENU FILTER
========================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        /* Active button */

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");


        /* Selected category */

        const filter =
            button.dataset.filter;


        /* Filter cards */

        menuCards.forEach(card => {

            const category =
                card.dataset.category;

            const shouldShow =
                filter === "all" ||
                category === filter;


            if (shouldShow) {

                card.style.display = "block";

                requestAnimationFrame(() => {

                    card.style.opacity = "1";

                    card.style.transform =
                        "translateY(0)";

                });

            } else {

                card.style.opacity = "0";

                card.style.transform =
                    "translateY(15px)";

                setTimeout(() => {

                    card.style.display = "none";

                }, 250);

            }

        });

    });

});


/* =========================
   RESERVATION DATE
========================= */

if (dateInput) {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    const todayString =
        `${year}-${month}-${day}`;

    dateInput.min = todayString;

}


/* =========================
   TOAST
========================= */

let toastTimer;


function showToast(
    title,
    message
) {

    if (!toast) return;

    toastTitle.textContent = title;

    toastMessage.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        hideToast();

    }, 5000);

}


function hideToast() {

    if (!toast) return;

    toast.classList.remove("show");

}


if (toastClose) {

    toastClose.addEventListener(
        "click",
        hideToast
    );

}


/* =========================
   RESERVATION FORM
========================= */

if (reservationForm) {

    reservationForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();

            const date =
                document
                    .getElementById("date")
                    .value;

            const time =
                document
                    .getElementById("time")
                    .value;

            const guests =
                document
                    .getElementById("guests")
                    .value;

            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            /* Basic validation */

            if (
                !name ||
                !date ||
                !time ||
                !guests ||
                !phone
            ) {

                showToast(
                    "Missing information",
                    "Please complete all reservation fields."
                );

                return;

            }


            /* Validate phone */

            const phonePattern =
                /^[+0-9\s()-]{7,20}$/;


            if (
                !phonePattern.test(phone)
            ) {

                showToast(
                    "Invalid phone",
                    "Please enter a valid phone number."
                );

                return;

            }


            /* Check date */

            const selectedDate =
                new Date(
                    date + "T00:00:00"
                );

            const today =
                new Date();

            today.setHours(
                0,
                0,
                0,
                0
            );


            if (
                selectedDate < today
            ) {

                showToast(
                    "Invalid date",
                    "Please choose a future date."
                );

                return;

            }


            /* Format date */

            const formattedDate =
                selectedDate.toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    }
                );


            /* Success */

            showToast(
                "Reservation received",
                `${name}, your table for ${guests} guest(s) on ${formattedDate} at ${time} has been requested.`
            );


            reservationForm.reset();


            /* Restore today's minimum date */

            if (dateInput) {

                const now =
                    new Date();

                const y =
                    now.getFullYear();

                const m =
                    String(
                        now.getMonth() + 1
                    ).padStart(2, "0");

                const d =
                    String(
                        now.getDate()
                    ).padStart(2, "0");

                dateInput.min =
                    `${y}-${m}-${d}`;

            }

        }
    );

}


/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


if (
    "IntersectionObserver" in window
) {

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(
        element => {

            revealObserver.observe(
                element
            );

        }
    );

} else {

    revealElements.forEach(
        element => {

            element.classList.add(
                "visible"
            );

        }
    );

}


/* =========================
   BACK TO TOP
========================= */

function updateBackToTop() {

    if (!backToTop) return;

    if (window.scrollY > 600) {

        backToTop.classList.add(
            "show"
        );

    } else {

        backToTop.classList.remove(
            "show"
        );

    }

}


window.addEventListener(
    "scroll",
    updateBackToTop,
    { passive: true }
);


if (backToTop) {

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


updateBackToTop();


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            navLinks &&
            navLinks.classList.contains("active")
        ) {

            navLinks.classList.remove(
                "active"
            );

            menuToggle.classList.remove(
                "active"
            );

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }
);


/* =========================
   CURRENT YEAR
========================= */

const footerYear =
    document.querySelector(
        "footer p"
    );

if (footerYear) {

    footerYear.textContent =
        `© ${new Date().getFullYear()} La Tavola. All rights reserved.`;

}
```
