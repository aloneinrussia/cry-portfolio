const cursor = document.querySelector(".cursor-dot");
const mouseLight = document.querySelector(".mouse-light");
const navbar = document.querySelector(".navbar");
const musicToggle = document.getElementById("musicToggle");
const backgroundMusic = document.getElementById("backgroundMusic");
const volumeSlider = document.getElementById("volumeSlider");
const projectModal = document.getElementById("projectModal");
const closeModalButton = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalType = document.getElementById("modalType");
const modalDescription = document.getElementById("modalDescription");
const modalTags = document.getElementById("modalTags");
const visitCount = document.getElementById("visitCount");
const loader = document.querySelector(".loader");

let audioContext = null;
let musicGainNode = null;
let musicLoop = null;
let isMusicPlaying = true;

const projectContent = {
    discord: {
        type: "DISCORD",
        title: "custom bot",
        description: "A custom automation and moderation system focused on clean workflows, server UX, and dependable daily utility.",
        tags: ["Discord", "Automation", "Moderation"]
    },
    roblox: {
        type: "ROBLOX",
        title: "game systems",
        description: "Gameplay systems built around progression, UI polish, and smooth interaction loops that make game experiences feel alive.",
        tags: ["Roblox", "Systems", "UI"]
    },
    web: {
        type: "WEB",
        title: "websites",
        description: "Responsive product experiences designed with visual clarity, thoughtful motion, and streamlined user flows.",
        tags: ["Design", "Web", "Interaction"]
    }
};

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
        const hash = link.getAttribute("href");

        if (!hash || hash === "#") return;

        const target = document.querySelector(hash);

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

if (loader) {
    window.addEventListener("load", () => {
        setTimeout(() => {
            loader.classList.add("fade-complete");
        }, 1200);
    });
}

if (musicToggle && backgroundMusic) {
    const setMusicState = (isPlaying) => {
        isMusicPlaying = isPlaying;
        musicToggle.classList.toggle("is-playing", isPlaying);
        musicToggle.setAttribute("aria-pressed", String(isPlaying));
        musicToggle.innerHTML = isPlaying
            ? '<i class="fa-solid fa-pause"></i><span>pause</span>'
            : '<i class="fa-solid fa-music"></i><span>music</span>';
    };

    const startMusic = async () => {
        if (volumeSlider) {
            backgroundMusic.volume = Number(volumeSlider.value);
        } else {
            backgroundMusic.volume = 0.45;
        }

        backgroundMusic.loop = true;

        try {
            await backgroundMusic.play();
            setMusicState(true);
        } catch (error) {
            console.warn("Autoplay was blocked by the browser, but the toggle is ready.", error);
            setMusicState(false);
        }
    };

    const stopMusic = () => {
        backgroundMusic.pause();
        setMusicState(false);
    };

    musicToggle.addEventListener("click", () => {
        if (isMusicPlaying) {
            stopMusic();
            return;
        }

        startMusic();
    });

    musicToggle.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            musicToggle.click();
        }
    });

    if (volumeSlider) {
        volumeSlider.addEventListener("input", (event) => {
            backgroundMusic.volume = Number(event.target.value);
        });
    }

    startMusic();
}

const openProjectModal = (projectKey) => {
    const project = projectContent[projectKey];

    if (!project || !projectModal) return;

    modalType.textContent = project.type;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalTags.innerHTML = project.tags
        .map((tag) => `<span>${tag}</span>`)
        .join("");

    projectModal.classList.remove("hidden");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
};

const closeProjectModal = () => {
    if (!projectModal) return;

    projectModal.classList.add("hidden");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
};

const projectLinks = {
    discord: "https://discord.gg/Nu2ffBCJXm",
    roblox: "https://www.roblox.com/users/3701974180/profile"
};

document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", (event) => {
        event.preventDefault();

        const projectKey = card.dataset.project;

        if (projectKey === "discord" || projectKey === "roblox") {
            window.open(projectLinks[projectKey], "_blank", "noopener,noreferrer");
            return;
        }

        openProjectModal(projectKey);
    });
});

if (closeModalButton) {
    closeModalButton.addEventListener("click", closeProjectModal);
}

if (projectModal) {
    projectModal.addEventListener("click", (event) => {
        if (event.target === projectModal) {
            closeProjectModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && projectModal && !projectModal.classList.contains("hidden")) {
        closeProjectModal();
    }
});

if (visitCount) {
    fetch('/api/visits')
        .then((response) => response.json())
        .then((data) => {
            if (typeof data.visits === 'number') {
                visitCount.textContent = data.visits.toLocaleString();
            }
        })
        .catch(() => {
            visitCount.textContent = '1,240';
        });
}
