const body = document.body;

const navContainer = document.querySelector(".nav-container");
const mainNav = document.querySelector(".main-nav");

if (navContainer && mainNav) {
    if (!mainNav.id) {
        mainNav.id = "site-navigation";
    }

    const menuButton = document.createElement("button");
    menuButton.className = "nav-toggle";
    menuButton.type = "button";
    menuButton.textContent = "Menu";
    menuButton.setAttribute("aria-controls", mainNav.id);
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    navContainer.insertBefore(menuButton, mainNav);

    const closeMenu = () => {
        mainNav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
    };

    menuButton.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    mainNav.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

}

document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
        return;
    }

    const anchor = event.target.closest('a[href^="#"]');

    if (!anchor || anchor.getAttribute("href") === "#") {
        return;
    }

    const target = document.getElementById(anchor.getAttribute("href").slice(1));

    if (!target) {
        return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
});

const projectFilters = document.querySelectorAll(".project-filter");
const portfolioCards = document.querySelectorAll(".portfolio-card[data-category]");

projectFilters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
        const selectedFilter = filterButton.dataset.filter;

        projectFilters.forEach((button) => {
            const isSelected = button === filterButton;
            button.classList.toggle("is-active", isSelected);
            button.setAttribute("aria-pressed", String(isSelected));
        });

        portfolioCards.forEach((card) => {
            const isVisible =
                selectedFilter === "all" || card.dataset.category === selectedFilter;
            card.hidden = !isVisible;
            if (isVisible) {
                card.classList.add("is-visible");
            }
        });
    });
});

const backToTop = document.createElement("button");
backToTop.className = "back-to-top";
backToTop.type = "button";
backToTop.textContent = "↑";
backToTop.setAttribute("aria-label", "Back to top");
document.body.appendChild(backToTop);

const updateBackToTop = () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 450);
};

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealElements = document.querySelectorAll(
    ".service-card, .project-card, .tool-item, .process-card, .focus-card, .portfolio-card, .contact-card"
);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal");
        revealObserver.observe(element);
    });
}

const contactForm = document.querySelector(".contact-form");

if (contactForm instanceof HTMLFormElement) {
    const formFields = contactForm.querySelectorAll("input, textarea");
    const status = contactForm.querySelector(".form-status");

    formFields.forEach((field) => {
        field.addEventListener("input", () => field.setCustomValidity(""));
    });

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameField = contactForm.elements.namedItem("name");
        const emailField = contactForm.elements.namedItem("email");
        const messageField = contactForm.elements.namedItem("message");

        if (
            !(nameField instanceof HTMLInputElement) ||
            !(emailField instanceof HTMLInputElement) ||
            !(messageField instanceof HTMLTextAreaElement)
        ) {
            console.error("Contact form is missing a required field.");
            if (status) {
                status.textContent = "The form is unavailable right now. Please use the email link above.";
            }
            return;
        }

        [nameField, emailField, messageField].forEach((field) => {
            field.setCustomValidity(field.value.trim() ? "" : "Please fill out this field.");
        });

        if (!contactForm.reportValidity()) {
            return;
        }

        const subject = `Portfolio contact from ${nameField.value.trim()}`;
        const message = [
            messageField.value.trim(),
            "",
            `Reply to: ${emailField.value.trim()}`
        ].join("\n");
        const emailDraft =
            `mailto:masalarhoda@gmail.com?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(message)}`;

        if (status) {
            status.textContent = "Your email app should open with a draft. Review it and press Send to deliver your message.";
        }

        window.location.href = emailDraft;
    });
}