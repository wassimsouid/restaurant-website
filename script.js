document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const header = document.getElementById("header");

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    const filterButtons = document.querySelectorAll(".filter-btn");
    const menuCards = document.querySelectorAll(".menu-card");

    const reservationForm = document.getElementById("reservationForm");
    const dateInput = document.getElementById("date");

    const toast = document.getElementById("toast");
    const toastTitle = document.getElementById("toastTitle");
    const toastMessage = document.getElementById("toastMessage");
    const toastClose = document.getElementById("toastClose");

    const backToTop = document.getElementById("backToTop");

    const cartButton = document.getElementById("cartButton");
    const cartPanel = document.getElementById("cartPanel");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartClose = document.getElementById("cartClose");

    const cartItems = document.getElementById("cartItems");
    const cartEmpty = document.getElementById("cartEmpty");

    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    const checkoutButton = document.getElementById("checkoutButton");
    const cartMenuButton = document.getElementById("cartMenuButton");

    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    const year = document.getElementById("year");


    /* =====================================================
       FOOTER YEAR
       ===================================================== */

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            navLinks.classList.toggle("active");

            const isOpen = navLinks.classList.contains("active");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        });


        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });


        document.addEventListener("click", (event) => {

            if (
                navLinks.classList.contains("active") &&
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                navLinks.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });


        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {

                navLinks.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });

    }


    /* =====================================================
       HEADER SCROLL
       ===================================================== */

    function handleHeader() {

        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }

    window.addEventListener("scroll", handleHeader);

    handleHeader();


    /* =====================================================
       MENU FILTERS
       ===================================================== */

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const filter = button.dataset.filter;

            menuCards.forEach(card => {

                const category = card.dataset.category;

                if (
                    filter === "all" ||
                    category === filter
                ) {

                    card.style.display = "block";

                    requestAnimationFrame(() => {

                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";

                    });

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


    /* =====================================================
       DATE — MINIMUM TODAY
       ===================================================== */

    if (dateInput) {

        const today = new Date();

        const yearValue = today.getFullYear();

        const monthValue = String(
            today.getMonth() + 1
        ).padStart(2, "0");

        const dayValue = String(
            today.getDate()
        ).padStart(2, "0");

        const todayString =
            `${yearValue}-${monthValue}-${dayValue}`;

        dateInput.min = todayString;

    }


    /* =====================================================
       TOAST
       ===================================================== */

    let toastTimer;


    function showToast(title, message) {

        if (!toast) return;

        toastTitle.textContent = title;
        toastMessage.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {

            toast.classList.remove("show");

        }, 5000);

    }


    function hideToast() {

        if (!toast) return;

        toast.classList.remove("show");

        clearTimeout(toastTimer);

    }


    if (toastClose) {

        toastClose.addEventListener(
            "click",
            hideToast
        );

    }


    /* =====================================================
       RESERVATION
       ===================================================== */

    if (reservationForm) {

        reservationForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const name =
                document.getElementById("name").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const date =
                document.getElementById("date").value;

            const time =
                document.getElementById("time").value;

            const guests =
                document.getElementById("guests").value;


            if (
                !name ||
                !phone ||
                !date ||
                !time ||
                !guests
            ) {

                showToast(
                    "Missing information",
                    "Please complete all reservation fields."
                );

                return;

            }


            const phonePattern =
                /^[+0-9\s()-]{7,20}$/;

            if (!phonePattern.test(phone)) {

                showToast(
                    "Invalid phone",
                    "Please enter a valid phone number."
                );

                return;

            }


            const selectedDate =
                new Date(date + "T00:00:00");

            const today =
                new Date();

            today.setHours(0, 0, 0, 0);


            if (selectedDate < today) {

                showToast(
                    "Invalid date",
                    "Please choose a future date."
                );

                return;

            }


            const formattedDate =
                selectedDate.toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    }
                );


            showToast(
                "Reservation Confirmed",
                `Table for ${guests} on ${formattedDate} at ${time}.`
            );


            reservationForm.reset();


            if (dateInput) {

                const now = new Date();

                const y = now.getFullYear();

                const m = String(
                    now.getMonth() + 1
                ).padStart(2, "0");

                const d = String(
                    now.getDate()
                ).padStart(2, "0");

                dateInput.min = `${y}-${m}-${d}`;

            }

        });

    }


    /* =====================================================
       CART DATA
       ===================================================== */

    let cart = [];


    /* =====================================================
       LOAD CART FROM LOCAL STORAGE
       ===================================================== */

    try {

        const savedCart =
            localStorage.getItem("laTavolaCart");

        if (savedCart) {

            cart = JSON.parse(savedCart);

            if (!Array.isArray(cart)) {
                cart = [];
            }

        }

    } catch (error) {

        cart = [];

    }


    /* =====================================================
       SAVE CART
       ===================================================== */

    function saveCart() {

        try {

            localStorage.setItem(
                "laTavolaCart",
                JSON.stringify(cart)
            );

        } catch (error) {

            console.log(
                "Could not save cart."
            );

        }

    }


    /* =====================================================
       OPEN CART
       ===================================================== */

    function openCart() {

        if (!cartPanel || !cartOverlay) return;

        cartPanel.classList.add("active");

        cartOverlay.classList.add("active");

        document.body.classList.add("cart-open");

    }


    /* =====================================================
       CLOSE CART
       ===================================================== */

    function closeCart() {

        if (!cartPanel || !cartOverlay) return;

        cartPanel.classList.remove("active");

        cartOverlay.classList.remove("active");

        document.body.classList.remove("cart-open");

    }


    if (cartButton) {

        cartButton.addEventListener(
            "click",
            openCart
        );

    }


    if (cartClose) {

        cartClose.addEventListener(
            "click",
            closeCart
        );

    }


    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            closeCart
        );

    }


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {
                closeCart();
            }

        }
    );


    /* =====================================================
       ADD PRODUCT
       ===================================================== */

    function addToCart(id) {

        const card =
            document.querySelector(
                `.menu-card[data-id="${id}"]`
            );


        if (!card) return;


        const name =
            card.dataset.name;

        const price =
            Number(card.dataset.price);


        const image =
            card.querySelector("img")?.src || "";


        const existingProduct =
            cart.find(item => item.id === id);


        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({

                id: id,
                name: name,
                price: price,
                image: image,
                quantity: 1

            });

        }


        saveCart();

        updateCart();


        showToast(
            "Added to Cart",
            `${name} has been added to your order.`
        );


        const button =
            document.querySelector(
                `.add-to-cart[data-id="${id}"]`
            );


        if (button) {

            button.classList.add("added");

            button.innerHTML =
                `Added ✓ <span>+</span>`;

            setTimeout(() => {

                button.classList.remove("added");

                button.innerHTML =
                    `Add to Cart <span>+</span>`;

            }, 1200);

        }

    }


    /* =====================================================
       ADD TO CART BUTTONS
       ===================================================== */

    addToCartButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    button.dataset.id;

                addToCart(id);

            }
        );

    });


    /* =====================================================
       UPDATE CART
       ===================================================== */

    function updateCart() {

        if (!cartItems) return;


        const totalQuantity =
            cart.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            );


        const totalPrice =
            cart.reduce(
                (total, item) =>
                    total +
                    (item.price * item.quantity),
                0
            );


        if (cartCount) {

            cartCount.textContent =
                totalQuantity;

        }


        if (cartTotal) {

            cartTotal.textContent =
                `$${totalPrice.toFixed(2)}`;

        }


        if (cart.length === 0) {

            cartItems.innerHTML = "";

            cartItems.appendChild(
                createEmptyCart()
            );

            return;

        }


        cartItems.innerHTML = "";


        cart.forEach(item => {

            const itemElement =
                createCartItem(item);

            cartItems.appendChild(
                itemElement
            );

        });

    }


    /* =====================================================
       EMPTY CART
       ===================================================== */

    function createEmptyCart() {

        const empty =
            document.createElement("div");

        empty.className = "cart-empty";


        empty.innerHTML = `

            <div class="cart-empty-icon">
                🛒
            </div>

            <h3>Your cart is empty</h3>

            <p>
                Add some delicious Italian dishes
                from our menu.
            </p>

            <button
                class="btn btn-primary"
                type="button"
                id="cartMenuButtonDynamic"
            >
                Explore Menu
            </button>

        `;


        const button =
            empty.querySelector(
                "#cartMenuButtonDynamic"
            );


        if (button) {

            button.addEventListener(
                "click",
                () => {

                    closeCart();

                    document
                        .getElementById("menu")
                        ?.scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );

        }


        return empty;

    }


    /* =====================================================
       CREATE CART ITEM
       ===================================================== */

    function createCartItem(item) {

        const element =
            document.createElement("div");

        element.className = "cart-item";


        element.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

            </div>


            <div class="cart-item-info">

                <h3>
                    ${item.name}
                </h3>

                <div class="cart-item-price">
                    $${item.price.toFixed(2)} each
                </div>


                <div class="cart-item-controls">

                    <button
                        class="quantity-btn decrease"
                        type="button"
                        data-id="${item.id}"
                    >
                        −
                    </button>

                    <span class="quantity">
                        ${item.quantity}
                    </span>

                    <button
                        class="quantity-btn increase"
                        type="button"
                        data-id="${item.id}"
                    >
                        +
                    </button>

                </div>


                <button
                    class="remove-item"
                    type="button"
                    data-id="${item.id}"
                >
                    Remove
                </button>

            </div>


            <div class="cart-item-total">

                $${(
                    item.price *
                    item.quantity
                ).toFixed(2)}

            </div>

        `;


        const decrease =
            element.querySelector(".decrease");

        const increase =
            element.querySelector(".increase");

        const remove =
            element.querySelector(".remove-item");


        if (decrease) {

            decrease.addEventListener(
                "click",
                () => {

                    changeQuantity(
                        item.id,
                        -1
                    );

                }
            );

        }


        if (increase) {

            increase.addEventListener(
                "click",
                () => {

                    changeQuantity(
                        item.id,
                        1
                    );

                }
            );

        }


        if (remove) {

            remove.addEventListener(
                "click",
                () => {

                    removeFromCart(
                        item.id
                    );

                }
            );

        }


        return element;

    }


    /* =====================================================
       CHANGE QUANTITY
       ===================================================== */

    function changeQuantity(id, amount) {

        const product =
            cart.find(
                item => item.id === id
            );


        if (!product) return;


        product.quantity += amount;


        if (product.quantity <= 0) {

            cart =
                cart.filter(
                    item => item.id !== id
                );

        }


        saveCart();

        updateCart();

    }


    /* =====================================================
       REMOVE FROM CART
       ===================================================== */

    function removeFromCart(id) {

        const product =
            cart.find(
                item => item.id === id
            );


        cart =
            cart.filter(
                item => item.id !== id
            );


        saveCart();

        updateCart();


        if (product) {

            showToast(
                "Removed",
                `${product.name} was removed from your cart.`
            );

        }

    }


    /* =====================================================
       CHECKOUT
       ===================================================== */

    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            () => {

                if (cart.length === 0) {

                    showToast(
                        "Cart is Empty",
                        "Please add an item before checkout."
                    );

                    return;

                }


                const total =
                    cart.reduce(
                        (sum, item) =>
                            sum +
                            (item.price * item.quantity),
                        0
                    );


                showToast(
                    "Checkout Coming Soon",
                    `Your order total is $${total.toFixed(2)}.`
                );

            }
        );

    }


    /* =====================================================
       CART MENU BUTTON
       ===================================================== */

    if (cartMenuButton) {

        cartMenuButton.addEventListener(
            "click",
            () => {

                closeCart();

                document
                    .getElementById("menu")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    }


    /* =====================================================
       INITIAL CART
       ===================================================== */

    updateCart();


    /* =====================================================
       REVEAL ANIMATION
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(element => {

            observer.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add("visible");

        });

    }


    /* =====================================================
       BACK TO TOP
       ===================================================== */

    function handleBackToTop() {

        if (!backToTop) return;


        if (window.scrollY > 600) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    }


    window.addEventListener(
        "scroll",
        handleBackToTop
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


    handleBackToTop();

});
