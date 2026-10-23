const SHOP_WHATSAPP = "15550123456";

const header = document.querySelector(".site-header");
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const repairForm = document.getElementById("repairForm");
const formError = document.getElementById("formError");

function onScroll() {
  header.classList.toggle("scrolled", window.scrollY > 8);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

function closeNav() {
  nav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
  document.body.classList.remove("nav-open");
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  if (isOpen) {
    closeNav();
  } else {
    nav.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("nav-open");
  }
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNav();
});

document.addEventListener("click", (event) => {
  if (!nav.classList.contains("open")) return;
  if (nav.contains(event.target) || navToggle.contains(event.target)) return;
  closeNav();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) closeNav();
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const siblings = Array.from(entry.target.parentElement.querySelectorAll(".reveal"));
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

if (repairForm) {
  const nameInput = document.getElementById("name");
  const contactInput = document.getElementById("contactInfo");
  const deviceInput = document.getElementById("device");
  const messageInput = document.getElementById("message");
  const fields = [nameInput, contactInput, deviceInput, messageInput];

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      field.classList.remove("field-error");
      formError.hidden = true;
    });
    field.addEventListener("change", () => {
      field.classList.remove("field-error");
      formError.hidden = true;
    });
  });

  repairForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formError.hidden = true;

    let valid = true;
    fields.forEach((field) => {
      const value = field.value.trim();
      const empty = value === "" || (field === deviceInput && field.selectedIndex === 0);
      field.classList.toggle("field-error", empty);
      if (empty) valid = false;
    });

    if (!valid) {
      formError.hidden = false;
      const firstInvalid = fields.find((field) => field.classList.contains("field-error"));
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const lines = [
      "Hi JTLB Repair Clinic, I'd like to book a repair.",
      "",
      `Name: ${nameInput.value.trim()}`,
      `Contact: ${contactInput.value.trim()}`,
      `Device: ${deviceInput.value}`,
      `Problem: ${messageInput.value.trim()}`,
      "",
      "Sent from the website.",
    ];

    const url = `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");
  });
}
