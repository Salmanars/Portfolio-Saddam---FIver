const skillGroups = [
  { key: "technical", title: "Technical" },
  { key: "software", title: "Software" },
  { key: "soft", title: "Soft Skills" }
];

const projectList = document.querySelector("#project-list");
const projectTabs = [...document.querySelectorAll(".project-tab")];
let projects = [];

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element && value) element.textContent = value;
}

function renderContact(contact) {
  if (!contact) return;

  const email = document.querySelector("#hero-email");
  const phone = document.querySelector("#hero-phone");
  const linkedin = document.querySelector("#hero-linkedin");
  const footerEmail = document.querySelector("#footer-email");
  const footerLinkedin = document.querySelector("#footer-linkedin");

  if (email) {
    email.textContent = contact.email;
    email.href = `mailto:${contact.email}`;
  }
  if (footerEmail) {
    footerEmail.textContent = `${contact.email} ↗`;
    footerEmail.href = `mailto:${contact.email}`;
  }
  if (phone) {
    phone.textContent = contact.phone;
    phone.href = `tel:${contact.phone.replace(/[\s()-]/g, "")}`;
  }
  if (linkedin) {
    linkedin.href = `https://${contact.linkedin.replace(/^https?:\/\//, "")}`;
  }
  if (footerLinkedin) {
    footerLinkedin.href = `https://${contact.linkedin.replace(/^https?:\/\//, "")}`;
  }
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

const certificateLightbox = document.querySelector("#certificate-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");

document.querySelector("#certification-list")?.addEventListener("click", (event) => {
  const preview = event.target.closest(".certification-preview");
  if (!preview || !certificateLightbox || !lightboxImage || typeof certificateLightbox.showModal !== "function") return;

  openImagePreview(preview.dataset.image, preview.dataset.title, "sertifikat");
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
    section.className = "skill-group";
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

function renderProjects(role) {
  const matchingProjects = projects.filter((project) => project.role === role);
  projectList.replaceChildren();
  projectList.setAttribute("aria-labelledby", role === "Site Engineer" ? "tab-site" : "tab-quality");
  setText("#project-count", `${String(matchingProjects.length).padStart(2, "0")} PROYEK`);

  matchingProjects.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "project-card";

    const number = document.createElement("span");
    number.className = "project-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const details = document.createElement("div");
    details.className = "project-details";
    const title = document.createElement("h3");
    title.textContent = project.name;
    const location = document.createElement("p");
    location.textContent = project.location;
    details.append(title, location);

    const arrow = document.createElement("span");
    arrow.className = "project-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";

    if (typeof project.image === "string" && project.image) {
      card.tabIndex = 0;
      card.setAttribute("aria-label", `Lihat foto proyek: ${project.name}`);

      const preview = document.createElement("button");
      preview.className = "project-image-preview";
      preview.type = "button";
      preview.dataset.image = project.image;
      preview.dataset.title = project.name;
      preview.setAttribute("aria-label", `Lihat foto proyek: ${project.name}`);

      const image = document.createElement("img");
      image.src = project.image;
      image.alt = `Foto proyek ${project.name}`;
      image.loading = "lazy";
      image.addEventListener("error", () => preview.classList.add("image-unavailable"), { once: true });
      preview.append(image);
      card.append(preview);
    }

    card.append(number, details, arrow);
    projectList.append(card);
  });
}

projectList.addEventListener("click", (event) => {
  const card = event.target.closest(".project-card");
  if (!card) return;

  const preview = event.target.closest(".project-image-preview") || card.querySelector(".project-image-preview");
  if (!preview) return;
  openImagePreview(preview.dataset.image, preview.dataset.title, "foto proyek");
});

projectList.addEventListener("keydown", (event) => {
  const card = event.target.closest(".project-card");
  if (event.target !== card || !card?.querySelector(".project-image-preview")) return;
  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  const preview = card.querySelector(".project-image-preview");
  openImagePreview(preview.dataset.image, preview.dataset.title, "foto proyek");
});

projectTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    projectTabs.forEach((item) => {
      const isSelected = item === tab;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-selected", String(isSelected));
    });
    renderProjects(tab.dataset.role);
  });
});

async function loadPortfolio() {
  try {
    const response = await fetch("/data/projects.json");
    if (!response.ok) throw new Error(`API merespons ${response.status}`);
    const data = await response.json();

    setText("#education-detail", data.profile?.education);
    renderAvatar(data.profile?.avatar);
    renderContact(data.profile?.contact);
    renderSkills(data.skills);
    renderCertifications(data.certifications);
    const projectEntries = Array.isArray(data.projects) ? data.projects : [];
    const qualityControlProjects = Array.isArray(data.quality_control_projects)
      ? data.quality_control_projects
      : projectEntries.filter((project) => project.role === "Quality Control");
    projects = [
      ...projectEntries.filter((project) => project.role !== "Quality Control"),
      ...qualityControlProjects.map((project) => ({ ...project, role: "Quality Control" }))
    ];
    renderProjects(document.querySelector(".project-tab.is-active")?.dataset.role || "Site Engineer");
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