"use strict";

// Configuración principal. Se conserva el número incluido en el código original.
// Número recuperado del código original. Verifícalo antes de publicar.
const WHATSAPP_NUMBER = "573174343071";
const WEDDING_DATE = new Date("2026-09-26T13:00:00-03:00");

const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
const openInvitationButton = document.getElementById("open-invitation");
const song = document.getElementById("wedding-song");
const musicControl = document.getElementById("music-control");

song.volume = 0.55;

async function startMusic() {
    try {
        await song.play();
        musicControl.classList.remove("is-paused");
        musicControl.setAttribute("aria-label", "Pausar música");
    } catch (error) {
        // Algunos navegadores pueden bloquear la reproducción. El control queda visible para iniciarla manualmente.
        musicControl.classList.add("is-paused");
        musicControl.setAttribute("aria-label", "Reproducir música");
    }
}

openInvitationButton.addEventListener("click", async () => {
    invitation.classList.add("is-open");
    invitation.setAttribute("aria-hidden", "false");
    document.body.classList.remove("cover-visible");
    musicControl.hidden = false;

    await startMusic();

    cover.classList.add("is-closing");
    window.setTimeout(() => {
        cover.hidden = true;
        invitation.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: "auto" });
    }, 800);
});

musicControl.addEventListener("click", async () => {
    if (song.paused) {
        await startMusic();
    } else {
        song.pause();
        musicControl.classList.add("is-paused");
        musicControl.setAttribute("aria-label", "Reproducir música");
    }
});

// Cuenta regresiva
const countdownElements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
    message: document.getElementById("countdown-message")
};

function pad(value) {
    return String(value).padStart(2, "0");
}

function updateCountdown() {
    const now = new Date();
    const difference = WEDDING_DATE.getTime() - now.getTime();

    if (difference <= 0) {
        countdownElements.days.textContent = "00";
        countdownElements.hours.textContent = "00";
        countdownElements.minutes.textContent = "00";
        countdownElements.seconds.textContent = "00";
        countdownElements.message.textContent = "¡Llegó nuestro gran día!";
        return;
    }

    const days = Math.floor(difference / 86_400_000);
    const hours = Math.floor((difference % 86_400_000) / 3_600_000);
    const minutes = Math.floor((difference % 3_600_000) / 60_000);
    const seconds = Math.floor((difference % 60_000) / 1_000);

    countdownElements.days.textContent = pad(days);
    countdownElements.hours.textContent = pad(hours);
    countdownElements.minutes.textContent = pad(minutes);
    countdownElements.seconds.textContent = pad(seconds);
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

// Carrusel automático, con flechas, indicadores y gesto de deslizamiento
const carousel = document.getElementById("carousel");
const track = document.getElementById("carousel-track");
const slides = Array.from(track.children);
const previousButton = carousel.querySelector(".carousel__button--prev");
const nextButton = carousel.querySelector(".carousel__button--next");
const dotsContainer = document.getElementById("carousel-dots");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let currentSlide = 0;
let carouselTimer = null;
let pointerStartX = 0;
let pointerDeltaX = 0;

slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel__dot";
    dot.setAttribute("aria-label", `Ir a la fotografía ${index + 1}`);
    dot.addEventListener("click", () => {
        goToSlide(index);
        restartCarousel();
    });
    dotsContainer.appendChild(dot);
});

const dots = Array.from(dotsContainer.children);

function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    slides.forEach((slide, slideIndex) => {
        slide.setAttribute("aria-hidden", String(slideIndex !== currentSlide));
    });

    dots.forEach((dot, dotIndex) => {
        const active = dotIndex === currentSlide;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
    });
}

function stopCarousel() {
    if (carouselTimer) {
        window.clearInterval(carouselTimer);
        carouselTimer = null;
    }
}

function startCarousel() {
    if (prefersReducedMotion || slides.length < 2) return;
    stopCarousel();
    carouselTimer = window.setInterval(() => goToSlide(currentSlide + 1), 5500);
}

function restartCarousel() {
    stopCarousel();
    startCarousel();
}

previousButton.addEventListener("click", () => {
    goToSlide(currentSlide - 1);
    restartCarousel();
});

nextButton.addEventListener("click", () => {
    goToSlide(currentSlide + 1);
    restartCarousel();
});

carousel.addEventListener("mouseenter", stopCarousel);
carousel.addEventListener("mouseleave", startCarousel);
carousel.addEventListener("focusin", stopCarousel);
carousel.addEventListener("focusout", startCarousel);

carousel.addEventListener("pointerdown", (event) => {
    pointerStartX = event.clientX;
    pointerDeltaX = 0;
    carousel.setPointerCapture(event.pointerId);
    stopCarousel();
});

carousel.addEventListener("pointermove", (event) => {
    if (!carousel.hasPointerCapture(event.pointerId)) return;
    pointerDeltaX = event.clientX - pointerStartX;
});

carousel.addEventListener("pointerup", (event) => {
    if (Math.abs(pointerDeltaX) > 45) {
        goToSlide(pointerDeltaX > 0 ? currentSlide - 1 : currentSlide + 1);
    }
    carousel.releasePointerCapture(event.pointerId);
    restartCarousel();
});

carousel.addEventListener("pointercancel", restartCarousel);

goToSlide(0);
startCarousel();

// Animaciones suaves al entrar en pantalla
const revealElements = document.querySelectorAll(".reveal");
if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
}

// Formulario de confirmación
const dialog = document.getElementById("rsvp-dialog");
const openRsvpButton = document.getElementById("open-rsvp");
const closeRsvpButton = document.getElementById("close-rsvp");
const rsvpForm = document.getElementById("rsvp-form");
const attendance = document.getElementById("attendance");
const guestCountField = document.getElementById("guest-count-field");
const guestCount = document.getElementById("guest-count");

function openDialog() {
    if (typeof dialog.showModal === "function") {
        dialog.showModal();
    } else {
        dialog.setAttribute("open", "");
    }
}

function closeDialog() {
    if (typeof dialog.close === "function") {
        dialog.close();
    } else {
        dialog.removeAttribute("open");
    }
}

openRsvpButton.addEventListener("click", openDialog);
closeRsvpButton.addEventListener("click", closeDialog);

dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const clickedOutside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (clickedOutside) closeDialog();
});

attendance.addEventListener("change", () => {
    const attending = attendance.value === "Sí, asistiré";
    guestCountField.hidden = !attending;
    guestCount.required = attending;
});

rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!rsvpForm.reportValidity()) return;

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const attendanceValue = attendance.value;
    const message = document.getElementById("guest-message").value.trim();
    const attending = attendanceValue === "Sí, asistiré";

    const lines = [
        "¡Hola, Yelena y Guillermo!",
        `Soy ${firstName} ${lastName}.`,
        attending
            ? `Confirmo mi asistencia a su matrimonio. Número de asistentes: ${guestCount.value}.`
            : "Lamentablemente no podré asistir a su matrimonio."
    ];

    if (message) {
        lines.push(`Mensaje: ${message}`);
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});
