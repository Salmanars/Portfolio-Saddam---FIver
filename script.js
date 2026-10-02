const skillGroups = [
  { key: "technical", title: "Civil Engineering", className: "skill-group-technical" },
  { key: "software", title: "Software & Digital Tools", className: "skill-group-software" },
  { key: "soft", title: "Professional Skills", className: "skill-group-soft" }
];

const deck = document.querySelector("#horizontal-deck");
const slides = [...(deck?.querySelectorAll(":scope > section, :scope > footer") || [])];
const projectImageObserver = deck && "IntersectionObserver" in window
  ? new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.loading = "eager";
      observer.unobserve(entry.target);
    });
  }, { root: deck, rootMargin: "80px" })
  : null;

function goToSlide(slide) {
  if (!deck || !slide) return;
  deck.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
}

document.querySelector("#slide-previous")?.addEventListener("click", () => {
  deck?.scrollBy({ left: -deck.clientWidth, behavior: "smooth" });
});

document.querySelector("#slide-next")?.addEventListener("click", () => {
  deck?.scrollBy({ left: deck.clientWidth, behavior: "smooth" });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target || !deck?.contains(target)) return;
    event.preventDefault();
    goToSlide(target);
  });
});

document.addEventListener("keydown", (event) => {
  if (!deck || certificateLightbox?.open || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.target.closest?.("input, textarea, select, [contenteditable='true']")) return;

  const currentIndex = Math.round(deck.scrollLeft / deck.clientWidth);
  if (event.key === "ArrowLeft" && currentIndex > 0) {
    event.preventDefault();
    goToSlide(slides[currentIndex - 1]);
  } else if (event.key === "ArrowRight" && currentIndex < slides.length - 1) {
    event.preventDefault();
    goToSlide(slides[currentIndex + 1]);
  }
});

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element && value) element.textContent = value;
}

function renderContact(contact) {
  if (!contact) return;

  const email = document.querySelector("#hero-email");
  const phone = document.querySelector("#hero-phone");
  const linkedin = document.querySelector("#hero-linkedin");
  const whatsappCard = document.querySelector("#contact-whatsapp");
  const whatsappDetail = document.querySelector("#contact-phone-detail");
  const emailCard = document.querySelector("#contact-email");
  const emailDetail = document.querySelector("#contact-email-detail");
  const linkedinCard = document.querySelector("#contact-linkedin");

  const linkedinUrl = contact.linkedin
    ? `https://${contact.linkedin.replace(/^https?:\/\//, "")}`
    : "https://linkedin.com/in/saddamsandytia/";

  if (email) {
    email.textContent = contact.email;
    email.href = `mailto:${contact.email}`;
  }
  if (emailCard && contact.email) emailCard.href = `mailto:${contact.email}`;
  if (emailDetail && contact.email) emailDetail.textContent = contact.email;
  if (whatsappCard && contact.phone) {
    whatsappCard.href = `https://wa.me/${contact.phone.replace(/\D/g, "")}`;
  }
  if (whatsappDetail && contact.phone) {
    whatsappDetail.textContent = contact.phone;
  }
  if (phone) {
    phone.textContent = contact.phone;
    phone.href = `tel:${contact.phone.replace(/[\s()-]/g, "")}`;
  }
  if (linkedin) {
    linkedin.href = linkedinUrl;
  }
  if (linkedinCard) linkedinCard.href = linkedinUrl;
}

function renderAvatar(avatar) {
  const images = document.querySelectorAll("#profile-avatar, #hero-profile-image");
  if (images.length === 0 || typeof avatar !== "string" || !avatar.trim()) return;

  images.forEach((image) => {
    image.addEventListener("error", () => {
      image.hidden = true;
    }, { once: true });
    image.src = avatar;
    image.hidden = false;
  });
}

function renderCertifications(certifications) {
  const container = document.querySelector("#certification-list");
  if (!container) return;

  container.replaceChildren();
  const entries = Array.isArray(certifications) ? certifications : [];
  if (entries.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "certification-empty";
    emptyState.textContent = "Belum ada data sertifikasi.";
    container.append(emptyState);
    return;
  }

  entries.forEach((certification, index) => {
    if (!certification || typeof certification !== "object") return;

    const card = document.createElement("article");
    card.className = "certification-card";
    const number = document.createElement("span");
    number.className = "project-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const details = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = typeof certification.title === "string" ? certification.title : "Sertifikasi";
    const issuer = document.createElement("p");
    issuer.textContent = typeof certification.issuer === "string" ? certification.issuer : "";
    const year = document.createElement("span");
    year.className = "certification-year";
    year.textContent = certification.year == null ? "" : String(certification.year);
    details.append(title, issuer);

    if (typeof certification.credential === "string" && certification.credential) {
      const credential = document.createElement("p");
      credential.className = "certification-credential";
      credential.textContent = `No. sertifikat: ${certification.credential}`;
      details.append(credential);
    }

    if (typeof certification.note === "string" && certification.note) {
      const note = document.createElement("p");
      note.className = "certification-note";
      note.textContent = certification.note;
      details.append(note);
    }

    card.append(number, details, year);

    if (typeof certification.image === "string" && certification.image) {
      const preview = document.createElement("button");
      preview.className = "certification-preview";
      preview.type = "button";
      preview.dataset.image = certification.image;
      preview.dataset.title = typeof certification.title === "string" ? certification.title : "Sertifikat";
      preview.setAttribute("aria-label", `Lihat sertifikat: ${preview.dataset.title}`);

      const thumbnail = document.createElement("img");
      thumbnail.src = certification.image;
      thumbnail.alt = "";
      thumbnail.loading = "lazy";
      thumbnail.addEventListener("error", () => preview.classList.add("image-unavailable"), { once: true });
      preview.append(thumbnail);
      card.append(preview);
    }

    container.append(card);
  });
}

function renderProjectGallery(containerSelector, projects, role) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.replaceChildren();
  const entries = Array.isArray(projects) ? projects : [];
  if (entries.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "project-gallery-empty";
    emptyState.textContent = "Belum ada proyek untuk ditampilkan.";
    container.append(emptyState);
    return;
  }

  entries.forEach((project, index) => {
    if (!project || typeof project !== "object") return;

    const card = document.createElement("article");
    card.className = "project-gallery-card glass-panel";

    const imageButton = document.createElement("button");
    imageButton.className = "project-gallery-image";
    imageButton.type = "button";
    imageButton.dataset.image = project.image || "";
    imageButton.dataset.title = project.name || `Proyek ${index + 1}`;
    imageButton.setAttribute("aria-label", `Lihat gambar proyek: ${imageButton.dataset.title}`);

    if (project.image) {
      const image = document.createElement("img");
      image.src = project.image;
      image.alt = `Foto ${project.name || "proyek konstruksi"}`;
      image.loading = "lazy";
      image.addEventListener("error", () => imageButton.classList.add("image-unavailable"), { once: true });
      imageButton.append(image);
      if (projectImageObserver) projectImageObserver.observe(image);
      else image.loading = "eager";
    } else {
      imageButton.classList.add("image-unavailable");
    }

    const cardContent = document.createElement("div");
    cardContent.className = "project-gallery-content";
    const title = document.createElement("h3");
    title.textContent = project.name || `Proyek ${index + 1}`;

    const badges = document.createElement("div");
    badges.className = "project-gallery-badges";
    const location = document.createElement("span");
    location.className = "project-location-badge";
    location.textContent = project.location || "Lokasi tidak dicantumkan";
    const roleBadge = document.createElement("span");
    roleBadge.className = "project-role-badge";
    roleBadge.textContent = role;

    badges.append(location, roleBadge);
    cardContent.append(title, badges);
    card.append(imageButton, cardContent);
    container.append(card);
  });
}

const certificateLightbox = document.querySelector("#certificate-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");

document.querySelector("#certification-list")?.addEventListener("click", (event) => {
  const preview = event.target.closest(".certification-preview");
  if (!preview || !certificateLightbox || !lightboxImage || typeof certificateLightbox.showModal !== "function") return;

  openImagePreview(preview.dataset.image, preview.dataset.title, "sertifikat");
});

deck?.addEventListener("click", (event) => {
  const preview = event.target.closest(".project-gallery-image");
  if (!preview?.dataset.image) return;
  openImagePreview(preview.dataset.image, preview.dataset.title, "proyek");
});

function openImagePreview(image, title, type) {
  if (!image || !certificateLightbox || !lightboxImage || typeof certificateLightbox.showModal !== "function") return;

  lightboxImage.src = image;
  lightboxImage.alt = `Pratinjau ${type}: ${title}`;
  lightboxTitle.textContent = title;
  certificateLightbox.showModal();
}

document.querySelector("#lightbox-close")?.addEventListener("click", () => certificateLightbox?.close());

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && certificateLightbox?.open) certificateLightbox.close();
});

certificateLightbox?.addEventListener("click", (event) => {
  if (event.target === certificateLightbox) certificateLightbox.close();
});

lightboxImage?.addEventListener("error", () => {
  lightboxImage.alt = "Gambar tidak dapat dimuat.";
});

function renderSkills(skills) {
  const container = document.querySelector("#skills-list");
  if (!container || !skills) return;

  container.replaceChildren();
  for (const group of skillGroups) {
    const items = skills[group.key];
    if (!Array.isArray(items)) continue;

    const section = document.createElement("section");
    section.className = `skill-group ${group.className}`;
    const heading = document.createElement("h3");
    heading.textContent = group.title;
    const list = document.createElement("ul");

    for (const item of items) {
      const entry = document.createElement("li");
      entry.textContent = item;
      list.append(entry);
    }

    section.append(heading, list);
    container.append(section);
  }
}

async function loadPortfolio() {
  try {
    const response = await fetch("/data/projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`API merespons ${response.status}`);
    const data = await response.json();

    setText("#education-detail", data.profile?.education);
    renderAvatar(data.profile?.avatar);
    renderContact(data.profile?.contact);
    renderSkills(data.skills);
    renderCertifications(data.certifications);
    renderProjectGallery("#site-project-list", data.projects, "Site Engineer");
    renderProjectGallery("#quality-project-list", data.quality_control_projects, "Quality Control");
  } catch (error) {
    console.error("Gagal memuat data portofolio:", error);
    document.querySelectorAll(".loading-note").forEach((element) => {
      element.className = "error-note";
      element.textContent = "Data belum dapat dimuat. Silakan muat ulang halaman.";
    });
  }
}

setText("#current-year", String(new Date().getFullYear()));
loadPortfolio();