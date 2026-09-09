const cursor = document.querySelector(".cursor-dot");
const mouseLight = document.querySelector(".mouse-light");
const navbar = document.querySelector(".navbar");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let lightX = mouseX;
let lightY = mouseY;

window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
});

function animateLight() {
    lightX += (mouseX - lightX) * 0.06;
    lightY += (mouseY - lightY) * 0.06;

    mouseLight.style.left = `${lightX}px`;
    mouseLight.style.top = `${lightY}px`;

    requestAnimationFrame(animateLight);
}

animateLight();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const target = document.querySelector(
            link.getAttribute("href")
        );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    },
    {
        threshold: 0.12
    }
);

document
    .querySelectorAll(".reveal-section")
    .forEach((section) => {
        observer.observe(section);
    });

window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

const heroCard =
    document.querySelector(".hero-card");

if (heroCard) {

    heroCard.addEventListener("mousemove", (event) => {

        const rect =
            heroCard.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        const rotateX =
            ((y / rect.height) - 0.5) * -5;

        const rotateY =
            ((x / rect.width) - 0.5) * 5;

        heroCard.style.transform =
            `perspective(1100px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-4px)`;
    });

    heroCard.addEventListener("mouseleave", () => {
        heroCard.style.transform = "";
    });
}

document
    .querySelectorAll(".project-card")
    .forEach((card) => {

        card.addEventListener("mousemove", (event) => {

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const rotateX =
                ((y / rect.height) - 0.5) * -4;

            const rotateY =
                ((x / rect.width) - 0.5) * 4;

            card.style.transform =
                `perspective(900px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-8px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

document.querySelectorAll(
    "a, .project-card, .skill"
).forEach((element) => {

    element.addEventListener("mouseenter", () => {
        document.body.style.cursor = "none";
        cursor.style.transform =
            "translate(-50%, -50%) scale(1.7)";
    });

    element.addEventListener("mouseleave", () => {
        cursor.style.transform =
            "translate(-50%, -50%) scale(1)";
    });

});

window.addEventListener("scroll", () => {

    const scrollY = window.scrollY;

    if (scrollY < window.innerHeight) {
        document.querySelector(".hero").style.transform =
            `translateY(${scrollY * 0.035}px)`;
    }

});