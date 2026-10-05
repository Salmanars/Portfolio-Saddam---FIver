(() => {
  "use strict";

  const slides = [
    { file: "Slide 1.png", alt: "Cover portfolio Saddam Saktya Sandytia dan menu navigasi." },
    { file: "Slide 2.png", alt: "Halo dan perkenalan Saddam Saktya Sandytia." },
    { file: "Slide 3.png", alt: "Education Background and Skills." },
    { file: "Slide 4.png", alt: "Professional Experience." },
    { file: "Slide 5.png", alt: "Projects Workdone as Site Engineer." },
    { file: "Slide 6.png", alt: "Main Responsibilities as Site Engineer, dokumentasi foto." },
    { file: "Slide 7png.png", alt: "Main Responsibilities as Site Engineer, daftar tanggung jawab." },
    { file: "Slide 8.png", alt: "Projects Workdone as Quality Control." },
    { file: "Slide 9.png", alt: "Main Responsibilities as Quality Control, dokumentasi foto." },
    { file: "Slide 10 .png", alt: "Main Responsibilities as Quality Control, daftar tanggung jawab." },
    { file: "Slide 11.png", alt: "Certificate: Copyright Certificate Thesis." },
    { file: "Slide 12.png", alt: "Certificate: BIM, TOEFL, Quality Control." },
    { file: "Slide 13.png", alt: "Thank You dan informasi kontak Saddam Saktya Sandytia." }
  ];

  const contactLinks = [
    { label: "Telepon Saddam Saktya Sandytia", href: "tel:+6282134704526" },
    { label: "Email Saddam Saktya Sandytia", href: "mailto:saddamsandytia@gmail.com" },
    {
      label: "LinkedIn Saddam Saktya Sandytia",
      href: "https://linkedin.com/in/saddamsandytia/",
      target: "_blank"
    }
  ];

  const coverMenu = [
    { label: "Introduction", slide: 2, left: 2, width: 14 },
    { label: "Education Background and Skills", slide: 3, left: 17, width: 19 },
    { label: "Professional Experience", slide: 4, left: 38, width: 19 },
    { label: "Projects Workdone & Key Responsibilities", slide: 5, left: 59, width: 23 },
    { label: "Certificate", slide: 11, left: 83, width: 15 }
  ];

  const track = document.querySelector("#carousel");
  const counter = document.querySelector("#slide-counter");
  const progress = document.querySelector("#progress-track");
  const progressValue = document.querySelector("#progress-value");
  const status = document.querySelector("#viewer-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const slidesInDom = [];

  if (!track || !counter || !progress || !progressValue || !status) {
    throw new Error("The portfolio slide viewer could not initialize.");
  }

  if (new URLSearchParams(window.location.search).has("debug")) {
    document.body.classList.add("debug");
  }

  function makeHotspot(slide, label, href, bounds, target) {
    const link = document.createElement("a");
    link.className = "hotspot";
    link.href = href;
    link.setAttribute("aria-label", label);
    link.style.left = `${bounds.left}%`;
    link.style.top = `${bounds.top}%`;
    link.style.width = `${bounds.width}%`;
    link.style.height = `${bounds.height}%`;

    if (target) {
      link.target = target;
      link.rel = "noopener";
    }

    if (slide === 0) {
      link.dataset.slide = String(Number(href.slice(1)));
    }

    return link;
  }

  slides.forEach((item, index) => {
    const slide = document.createElement("section");
    slide.className = "slide";
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", `${index + 1} dari ${slides.length}`);

    const image = document.createElement("img");
    image.className = "slide-image";
    image.src = `/image/${encodeURIComponent(item.file)}`;
    image.alt = item.alt;
    image.decoding = "async";
    image.loading = "lazy";
    image.draggable = false;
    slide.append(image);

    if (index === 0) {
      coverMenu.forEach(({ label, slide: destination, left, width }) => {
        slide.append(
          makeHotspot(
            index,
            label,
            `#${destination}`,
            { left, top: 50, width, height: 13 }
          )
        );
      });
    } else if (index < 12) {
      const contactPositions = [
        { left: 1.5, top: 86.1, width: 31, height: 3.7 },
        { left: 1.5, top: 90, width: 31, height: 3.7 },
        { left: 1.5, top: 93.8, width: 31, height: 4.1 }
      ];

      contactLinks.forEach((contact, contactIndex) => {
        slide.append(
          makeHotspot(index, contact.label, contact.href, contactPositions[contactIndex], contact.target)
        );
      });
    } else {
      const contactPositions = [
        { left: 31, top: 61, width: 40, height: 4.5 },
        { left: 31, top: 65.4, width: 40, height: 4.5 },
        { left: 31, top: 69.8, width: 40, height: 4.5 }
      ];

      contactLinks.forEach((contact, contactIndex) => {
        slide.append(
          makeHotspot(index, contact.label, contact.href, contactPositions[contactIndex], contact.target)
        );
      });
    }

    track.append(slide);
    slidesInDom.push({ element: slide, image });
  });

  let currentIndex = getInitialIndex();
  let animationFrame = 0;
  let animationGeneration = 0;
  let pointerStart = null;
  let suppressClick = false;
  let statusTimeout = 0;

  function getInitialIndex() {
    const match = window.location.hash.match(/^#(\d+)$/);
    if (!match) return 0;

    return Math.min(slides.length - 1, Math.max(0, Number(match[1]) - 1));
  }

  function updateImageLoading(index) {
    slidesInDom.forEach(({ image }, slideIndex) => {
      image.loading = Math.abs(slideIndex - index) <= 1 ? "eager" : "lazy";
    });
  }

  function updateSlide(index, updateHash = true) {
    currentIndex = Math.min(slides.length - 1, Math.max(0, index));
    counter.value = `${currentIndex + 1} / ${slides.length}`;
    counter.textContent = counter.value;
    progress.setAttribute("aria-valuenow", String(currentIndex + 1));
    progressValue.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;

    slidesInDom.forEach(({ element }, slideIndex) => {
      element.inert = slideIndex !== currentIndex;
      element.setAttribute("aria-hidden", String(slideIndex !== currentIndex));
    });

    updateImageLoading(currentIndex);

    if (updateHash) {
      window.history.replaceState(window.history.state, "", `#${currentIndex + 1}`);
    }
  }

  function stopAnimation() {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      animationGeneration += 1;
      track.classList.remove("is-animating");
    }
  }

  function goToSlide(index) {
    const destination = Math.min(slides.length - 1, Math.max(0, index));
    stopAnimation();
    updateSlide(destination);

    const start = track.scrollLeft;
    const end = destination * track.clientWidth;
    const distance = end - start;

    if (reducedMotion.matches || Math.abs(distance) < 1) {
      track.scrollLeft = end;
      return;
    }

    const duration = 450;
    const startedAt = performance.now();
    const generation = animationGeneration;
    track.classList.add("is-animating");

    function animate(now) {
      if (generation !== animationGeneration) return;

      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      track.scrollLeft = start + distance * eased;

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
        return;
      }

      track.scrollLeft = end;
      animationFrame = 0;
      window.requestAnimationFrame(() => {
        if (generation === animationGeneration) {
          track.classList.remove("is-animating");
        }
      });
    }

    animationFrame = window.requestAnimationFrame(animate);
  }

  function goToNearestSlide() {
    goToSlide(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)));
  }

  function announceFullscreenError(error) {
    console.error("Unable to change fullscreen mode:", error);
    window.clearTimeout(statusTimeout);
    status.hidden = false;
    status.textContent = "Layar penuh tidak tersedia di browser ini.";
    statusTimeout = window.setTimeout(() => {
      status.hidden = true;
      status.textContent = "";
    }, 4500);
  }

  track.addEventListener(
    "scroll",
    () => {
      const nearestIndex = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      if (nearestIndex !== currentIndex) {
        updateSlide(nearestIndex);
      }
    },
    { passive: true }
  );

  track.addEventListener("click", (event) => {
    if (suppressClick) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }
  }, true);

  track.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-slide]");
    if (!link || event.defaultPrevented) return;

    event.preventDefault();
    goToSlide(Number(link.dataset.slide) - 1);
    track.focus({ preventScroll: true });
  });

  track.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;

      stopAnimation();
      pointerStart = { id: event.pointerId, x: event.clientX, scrollLeft: track.scrollLeft, dragged: false };
    },
    { passive: true }
  );

  window.addEventListener(
    "pointermove",
    (event) => {
      if (!pointerStart || event.pointerId !== pointerStart.id) return;

      const distance = event.clientX - pointerStart.x;
      if (!pointerStart.dragged && Math.abs(distance) < 5) return;

      pointerStart.dragged = true;
      track.classList.add("is-dragging");
      track.scrollLeft = pointerStart.scrollLeft - distance;
      event.preventDefault();
    },
    { passive: false }
  );

  function finishPointer(event) {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;

    if (pointerStart.dragged) {
      suppressClick = true;
      window.requestAnimationFrame(() => {
        suppressClick = false;
      });
    }

    pointerStart = null;
    track.classList.remove("is-dragging");
  }

  window.addEventListener("pointerup", finishPointer);
  window.addEventListener("pointercancel", finishPointer);
  track.addEventListener("touchstart", stopAnimation, { passive: true });
  track.addEventListener("wheel", stopAnimation, { passive: true });

  document.addEventListener("keydown", handleKeyboard);

  function handleKeyboard(event) {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.target.isContentEditable ||
      /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)
    ) {
      return;
    }

    const actions = {
      ArrowLeft: () => currentIndex - 1,
      ArrowRight: () => currentIndex + 1,
      PageUp: () => currentIndex - 1,
      PageDown: () => currentIndex + 1,
      Home: () => 0,
      End: () => slides.length - 1,
      " ": () => currentIndex + 1
    };
    const action = actions[event.key];
    if (!action) return;

    event.preventDefault();
    goToSlide(action());
  }

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.dataset.action === "previous") {
        goToSlide(currentIndex - 1);
      } else if (button.dataset.action === "next") {
        goToSlide(currentIndex + 1);
      } else if (button.dataset.action === "fullscreen") {
        try {
          if (document.fullscreenElement) {
            await document.exitFullscreen();
          } else {
            await document.documentElement.requestFullscreen();
          }
        } catch (error) {
          announceFullscreenError(error);
        }
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    if (link.hasAttribute("data-slide")) return;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      goToSlide(0);
    });
  });

  window.addEventListener("hashchange", () => {
    const match = window.location.hash.match(/^#(\d+)$/);
    if (match) {
      goToSlide(Number(match[1]) - 1);
    }
  });

  window.addEventListener(
    "resize",
    () => {
      stopAnimation();
      track.scrollLeft = currentIndex * track.clientWidth;
    },
    { passive: true }
  );

  const startingSlide = currentIndex;
  currentIndex = -1;
  updateSlide(startingSlide, false);
  window.requestAnimationFrame(() => {
    track.scrollLeft = startingSlide * track.clientWidth;
  });
})();
