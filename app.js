const enterButton = document.querySelector("#enter-gallery");

const toast = document.querySelector("#toast");

function enterSite(targetSelector = "#gallery") {
  scrollToTarget(targetSelector);
}

function scrollToTarget(targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  target.scrollIntoView({ block: "start" });
  requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
}

enterButton.addEventListener("click", () => {
  enterSite();
});

document.querySelectorAll(".entry-index a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetSelector = link.getAttribute("href");
    history.replaceState(null, "", targetSelector);
    enterSite(targetSelector);
  });
});


document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetSelector = link.getAttribute("href");
    if (!targetSelector) return;

    event.preventDefault();
    history.replaceState(null, "", targetSelector);
    scrollToTarget(targetSelector);
  });
});

document.querySelectorAll("[data-gallery-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.galleryFilter;
    document.querySelectorAll("[data-gallery-filter]").forEach((item) => {
      item.classList.toggle("is-active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });

    document.querySelectorAll(".gallery-card").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.status !== filter;
    });
  });
});

document.querySelectorAll(".piece-image-control").forEach((control) => {
  control.addEventListener("click", () => {
    const layout = control.closest(".piece-layout");
    const media = layout.querySelector(".piece-media");
    const mainImage = media.querySelector(".piece-art img");

    mainImage.src = control.dataset.image;
    mainImage.removeAttribute("srcset");
    mainImage.alt = control.dataset.alt;

    control.closest(".piece-dot-nav").querySelectorAll(".piece-image-control").forEach((item) => {
      item.classList.toggle("is-active", item === control);
      item.setAttribute("aria-pressed", String(item === control));
    });
  });
});

const pieceDetails = document.querySelectorAll("[data-piece-details]");
const pieceDetailsCollapse = window.matchMedia("(max-width: 780px)");

function syncPieceDetails() {
  pieceDetails.forEach((details) => {
    details.open = !pieceDetailsCollapse.matches;
  });
}

syncPieceDetails();
pieceDetailsCollapse.addEventListener("change", syncPieceDetails);

document.querySelectorAll("[data-image-previous], [data-image-next]").forEach((arrow) => {
  arrow.addEventListener("click", () => {
    const controls = [...arrow.closest(".piece-image-controls").querySelectorAll(".piece-image-control")];
    const activeIndex = controls.findIndex((control) => control.classList.contains("is-active"));
    const direction = arrow.hasAttribute("data-image-next") ? 1 : -1;
    const nextIndex = (activeIndex + direction + controls.length) % controls.length;

    controls[nextIndex].click();
  });
});

const ATELIER_EMAIL = "sales@xingyujiatelier.com";

const inquiryType = document.querySelector("#inquiry-type");
const measurementFields = document.querySelector("#measurement-fields");

inquiryType.addEventListener("change", () => {
  measurementFields.hidden = inquiryType.value !== "mto";
});

const inquiryLabels = {
  general: "General inquiry",
  portfolio: "Portfolio / press inquiry",
  mto: "Made to Order / fitting",
  collaboration: "Collaboration",
};

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const type = data.get("inquiry-type");

  const lines = [
    `Name: ${data.get("first-name")} ${data.get("last-name")}`,
    `Email: ${data.get("email")}`,
    `Inquiry type: ${inquiryLabels[type] || type}`,
  ];

  if (type === "mto") {
    lines.push(
      `Height: ${data.get("height") || "—"}`,
      `Weight: ${data.get("weight") || "—"}`,
      `Favorite color: ${data.get("favorite-color") || "—"}`
    );
  }

  lines.push("", "Message:", data.get("message"));

  window.location.href = `mailto:${ATELIER_EMAIL}?subject=${encodeURIComponent(
    `${inquiryLabels[type] || "Inquiry"} · ${data.get("first-name")} ${data.get("last-name")}`
  )}&body=${encodeURIComponent(lines.join("\n"))}`;

  showToast("Opening your email app with this inquiry ready to send.");
});

/* Social profiles. URL profiles open in a new tab; an icon carrying data-qr
   opens that dialog instead, so QR-only channels need no code of their own. */
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/xingyujiatelier",
  tiktok: "https://www.tiktok.com/@xingyujiatelier",
  etsy: "https://www.etsy.com/shop/XingyujiAtelier",
};

const socialLinks = document.querySelector(".social-links");
let qrTrigger = null;

if (socialLinks) {
  let anyVisible = false;

  socialLinks.querySelectorAll("[data-social]").forEach((link) => {
    const dialog = link.dataset.qr ? document.getElementById(link.dataset.qr) : null;

    if (link.dataset.qr) {
      if (!dialog) return;

      const label = `Open ${link.dataset.qrLabel || link.dataset.social} QR code`;
      link.setAttribute("role", "button");
      link.setAttribute("tabindex", "0");
      link.setAttribute("title", label);
      link.setAttribute("aria-label", label);
      link.addEventListener("click", (event) => {
        event.preventDefault();
        openQr(dialog, link);
      });
      link.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openQr(dialog, link);
        }
      });
      link.hidden = false;
      anyVisible = true;
      return;
    }

    const value = SOCIAL_LINKS[link.dataset.social];
    if (!value) return;

    link.href = value;
    link.rel = "me noopener";
    link.target = "_blank";
    link.hidden = false;
    anyVisible = true;
  });

  socialLinks.hidden = !anyVisible;
}

function openQr(dialog, trigger) {
  if (!dialog) return;

  qrTrigger = trigger;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
    /* Without this the browser focuses the dismiss line, which then wears a
       focus ring the moment the code appears. Focusing the dialog keeps the
       panel clean while Escape, Tab and the accessible name still work. */
    dialog.focus();
    return;
  }

  const image = dialog.querySelector("img");
  if (image) window.open(image.getAttribute("src"), "_blank", "noopener");
}

/* The browser returns focus to whatever was focused before showModal(), which
   for a real click or keypress is the trigger itself, so no manual restore is
   needed — an explicit focus() call here only races the browser's own. */
function closeQr(dialog) {
  if (!dialog?.open) return;

  dialog.close();
}

document.querySelectorAll(".qr-dialog").forEach((dialog) => {
  dialog.querySelector("[data-close-qr]")?.addEventListener("click", () => closeQr(dialog));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeQr(dialog);
    }
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("is-visible"), 3500);
}

/* The mobile header collapses to a single row, and the webfont swapping in
   can change its height after first paint. Publish the measured height so
   anchored scrolling always clears the header. The banner is published the
   same way: it sits in normal flow above the entry screen, so the entry has
   to subtract it to stay exactly one viewport tall. */
function publishMeasuredHeight(element, property) {
  if (!element) return;

  const publish = () => {
    const height = Math.round(element.getBoundingClientRect().height);

    if (height > 0) {
      document.documentElement.style.setProperty(property, `${height}px`);
    } else {
      document.documentElement.style.removeProperty(property);
    }
  };

  publish();
  new ResizeObserver(publish).observe(element);
}

publishMeasuredHeight(document.querySelector(".site-header"), "--header-height-actual");
publishMeasuredHeight(document.querySelector(".prototype-banner"), "--banner-height-actual");

/* Below 781px the piece title is the card's display line and must not wrap.
   Measure its natural single-line width against the space available and
   publish a scale, so each title is set as large as it can be while still
   fitting. Above 780px the title sits in the meta column and wraps normally,
   so the scale is cleared. */
const pieceTitles = document.querySelectorAll(".piece-layout-available .piece-meta > strong");
const titleCollapses = window.matchMedia("(max-width: 780px)");

function fitPieceTitles() {
  pieceTitles.forEach((title) => {
    title.style.removeProperty("--title-scale");
    title.style.removeProperty("white-space");

    if (!titleCollapses.matches) return;

    title.style.whiteSpace = "nowrap";

    const available = title.clientWidth;
    const natural = title.scrollWidth;

    if (!available || !natural || natural <= available) return;

    title.style.setProperty("--title-scale", (available / natural).toFixed(4));
  });
}

fitPieceTitles();
titleCollapses.addEventListener("change", fitPieceTitles);

let titleFitFrame = 0;
window.addEventListener("resize", () => {
  cancelAnimationFrame(titleFitFrame);
  titleFitFrame = requestAnimationFrame(fitPieceTitles);
});

/* The webfont swaps in after first paint and changes the measured width. */
document.fonts?.ready.then(fitPieceTitles);

/* Below 781px the three section names cannot share a row with the wordmark,
   so they live in a panel behind this toggle. At or above 781px the desktop
   rail shows them all and the nav must never be left hidden. */
const navToggle = document.querySelector("#nav-toggle");
const siteNav = document.querySelector("#site-nav");
const navCollapses = window.matchMedia("(max-width: 780px)");

function setNavOpen(open) {
  if (!navToggle || !siteNav) return;

  siteNav.hidden = !open;
  navToggle.setAttribute("aria-expanded", String(open));
}

function syncNav() {
  if (!siteNav) return;

  if (navCollapses.matches) {
    setNavOpen(false);
  } else {
    siteNav.hidden = false;
    navToggle?.setAttribute("aria-expanded", "false");
  }
}

if (navToggle && siteNav) {
  syncNav();
  navCollapses.addEventListener("change", syncNav);

  navToggle.addEventListener("click", () => setNavOpen(siteNav.hidden));

  siteNav.addEventListener("click", (event) => {
    if (navCollapses.matches && event.target.closest("a")) setNavOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !navCollapses.matches || siteNav.hidden) return;

    setNavOpen(false);
    navToggle.focus();
  });

  document.addEventListener("click", (event) => {
    if (!navCollapses.matches || siteNav.hidden) return;
    if (event.target.closest(".site-header")) return;

    setNavOpen(false);
  });
}