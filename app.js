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
    });

    document.querySelectorAll(".gallery-card").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.status !== filter;
    });
  });
});

document.querySelectorAll(".piece-image-control").forEach((control) => {
  control.addEventListener("click", () => {
    const media = control.closest(".piece-layout").querySelector(".piece-media");
    const mainImage = media.querySelector(".piece-art img");
    const caption = media.querySelector(".piece-photo-id");

    mainImage.src = control.dataset.image;
    mainImage.removeAttribute("srcset");
    mainImage.alt = control.dataset.alt;
    caption.textContent = `Photo ID · ${control.dataset.photoId}`;

    control.closest(".piece-dot-nav").querySelectorAll(".piece-image-control").forEach((item) => {
      item.classList.toggle("is-active", item === control);
    });
  });
});

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
    return;
  }

  const image = dialog.querySelector("img");
  if (image) window.open(image.getAttribute("src"), "_blank", "noopener");
}

function closeQr(dialog) {
  if (!dialog?.open) return;

  dialog.close();
  qrTrigger?.focus();
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

/* The mobile header wraps to a second row on narrow screens, and the webfont
   swapping in can change its height after first paint. Publish the measured
   height so anchored scrolling always clears the header. */
const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  const publishHeaderHeight = () => {
    const height = Math.round(siteHeader.getBoundingClientRect().height);

    if (height > 0) {
      document.documentElement.style.setProperty("--header-height-actual", `${height}px`);
    } else {
      document.documentElement.style.removeProperty("--header-height-actual");
    }
  };

  publishHeaderHeight();
  new ResizeObserver(publishHeaderHeight).observe(siteHeader);
}