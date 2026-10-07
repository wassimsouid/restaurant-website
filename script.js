```javascript
// ===============================
// MOBILE MENU
// ===============================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


// Close mobile menu after clicking a link

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });

});


// ===============================
// MENU FILTER
// ===============================

const filterButtons = document.querySelectorAll(".filter-btn");
const menuCards = document.querySelectorAll(".menu-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active from all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Activate clicked button
        button.classList.add("active");

        const filter = button.dataset.filter;

        menuCards.forEach(card => {

            const category = card.dataset.category;

            if (filter === "all" || category === filter) {

                card.style.display = "block";

                setTimeout(() => {
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                }, 50);

            } else {

                card.style.opacity = "0";
                card.style.transform = "translateY(15px)";

                setTimeout(() => {
                    card.style.display = "none";
                }, 250);

            }

        });

    });

});


// ===============================
// RESERVATION
// ===============================

const reservationForm =
    document.getElementById("reservationForm");

reservationForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value;

    const date =
        document.getElementById("date").value;

    const guests =
        document.getElementById("guests").value;

    if (!name || !date) {
        alert("Please complete all required fields.");
        return;
    }

    alert(
        `Thank you ${name}! Your reservation for ${guests} guest(s) on ${date} has been received.`
    );

    reservationForm.reset();

});


// ===============================
// MINIMUM DATE
// ===============================

const dateInput = document.getElementById("date");

const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

dateInput.min = `${year}-${month}-${day}`;


// ===============================
// SCROLL REVEAL
// ===============================

const revealElements = document.querySelectorAll(
    ".feature, .menu-card, .about-content, .about-image"
);

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.15
    }
);

revealElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";

    observer.observe(element);

});
```
