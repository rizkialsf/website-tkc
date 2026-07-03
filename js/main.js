// ==========================================
// PT. TRI KARYA CEMERLANG - MAIN JS
// Arsitektur: Modular & Single Entry Point
// ==========================================

// --- 0. SCROLL RESTORATION ---
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

// ==========================================
// MODUL 1: SCROLL EFFECTS & MAGNETIC SCROLL
// ==========================================
function initScrollEffects() {
  const heroSection = document.querySelector(".hero-section");
  const mainContent = document.querySelector(".main-content");
  let isAnimating = false;
  const scrollDuration = 1200;

  // A. Hero Fade Effect
  window.addEventListener("scroll", () => {
    if (!heroSection) return;
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    let opacityValue = 1 - scrollPos / windowHeight;
    heroSection.style.opacity = Math.max(0, opacityValue);
  });

  // B. Mesin Animasi Kustom
  function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function easeInOutQuart(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t * t + b;
      t -= 2;
      return (-c / 2) * (t * t * t * t - 2) + b;
    }

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      let run = easeInOutQuart(timeElapsed, startPosition, distance, duration);

      window.scrollTo(0, run);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        window.scrollTo(0, targetPosition);

        // Penyerap Kejut agar layar tidak meleset
        setTimeout(() => {
          isAnimating = false;
        }, 200);
      }
    }
    requestAnimationFrame(animation);
  }

  // Helper: Dapatkan titik Y absolut secara akurat
  function getTargetY() {
    return mainContent
      ? mainContent.getBoundingClientRect().top + window.scrollY
      : window.innerHeight;
  }

  // C. Wheel Event Manager (DIBUAT SEARAH / ONE-WAY)
  window.addEventListener(
    "wheel",
    (e) => {
      const currentScroll = window.scrollY;
      const targetDown = getTargetY();

      if (isAnimating) {
        e.preventDefault();
        return;
      }

      // HANYA mencegat jika posisi user masih di atas (Hero) dan sengaja scroll ke bawah
      if (currentScroll < targetDown - 50 && e.deltaY > 10) {
        e.preventDefault();
        isAnimating = true;
        smoothScrollTo(targetDown, scrollDuration);
      }
    },
    { passive: false },
  );

  // D. Tanda Panah Bawah
  const scrollDownBtn = document.querySelector(".scroll-down-container");
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener("click", () => {
      if (!isAnimating) {
        isAnimating = true;
        smoothScrollTo(getTargetY(), scrollDuration);
      }
    });
  }

  // E. Button Hero Section (Ditangani khusus oleh mesin custom)
  const btnHero = document.querySelector(".btn-hero");
  if (btnHero) {
    btnHero.addEventListener("click", (e) => {
      e.preventDefault();

      if (!isAnimating) {
        isAnimating = true;
        smoothScrollTo(getTargetY(), scrollDuration);
      }
    });
  }
}

// ==========================================
// MODUL 2: GLOBAL OBSERVER (FADE UP)
// ==========================================
function initFadeUp() {
  const fadeElements = document.querySelectorAll(".fade-up");

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -5% 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach((el) => observer.observe(el));
}

// ==========================================
// MODUL 3: CAROUSEL INDUSTRIES
// ==========================================
function initIndustriesCarousel() {
  const industriesData = [
    {
      icon: "assets/industries/Icon/education.png",
      alt: "Education",
      image: "assets/industries/university.webp",
      title: "Education",
    },
    {
      icon: "assets/industries/Icon/healthcare.png",
      alt: "Healthcare",
      image: "assets/industries/hospital.webp",
      title: "Healthcare",
    },
    {
      icon: "assets/industries/Icon/corporate.png",
      alt: "Corporate",
      image: "assets/industries/office.webp",
      title: "Corporate",
    },
    {
      icon: "assets/industries/Icon/manufacture.png",
      alt: "Manufacturing",
      image: "assets/industries/manufacture.webp",
      title: "Manufacture",
    },
    {
      icon: "assets/industries/Icon/retail.png",
      alt: "Retail",
      image: "assets/industries/retail.webp",
      title: "Retail",
    },
  ];

  const iconImages = document.querySelectorAll(".carousel-icon-box img");
  const dots = document.querySelectorAll(".carousel-dots .dot");
  const mainImage = document.querySelector(".industries-right img");
  const titleElement = document.getElementById("industries-text-title"); // KOREKSI ID
  const textWrapper = document.querySelector(".industries-image-text");
  const prevBtn = document.querySelector(".carousel-prev-btn");
  const nextBtn = document.querySelector(".carousel-next-btn");
  const iconBoxes = document.querySelectorAll(".carousel-icon-box");

  // Jika struktur HTML tidak ditemukan (mungkin di halaman lain), hentikan fungsi
  if (!mainImage || !titleElement) return;

  let currentIndex = 2; // Mulai dari 'Corporate'

  function updateCarousel() {
    iconImages.forEach((imgElement, domIndex) => {
      let dataIndex =
        (currentIndex - 2 + domIndex + industriesData.length) %
        industriesData.length;
      imgElement.src = industriesData[dataIndex].icon;
      imgElement.alt = industriesData[dataIndex].alt;
    });

    dots.forEach((dot) => dot.classList.remove("active"));
    if (dots[currentIndex]) dots[currentIndex].classList.add("active");

    mainImage.style.opacity = 0;
    textWrapper.style.opacity = 0;

    setTimeout(() => {
      mainImage.src = industriesData[currentIndex].image;
      titleElement.textContent = industriesData[currentIndex].title;
      mainImage.style.opacity = 1;
      textWrapper.style.opacity = 1;
    }, 300);
  }

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      currentIndex =
        (currentIndex - 1 + industriesData.length) % industriesData.length;
      updateCarousel();
    });

  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % industriesData.length;
      updateCarousel();
    });

  dots.forEach((dot, index) =>
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
    }),
  );

  iconBoxes.forEach((box, domIndex) =>
    box.addEventListener("click", () => {
      currentIndex =
        (currentIndex - 2 + domIndex + industriesData.length) %
        industriesData.length;
      updateCarousel();
    }),
  );

  updateCarousel();
}

// ==========================================
// MODUL 4: SERVICES ACCORDION
// ==========================================
function initServicesAccordion() {
  const servicesData = [
    {
      title: "Cleaning Services",
      desc: "Maintaining clean, hygienic spaces requires the highest standards. We are committed to supporting the health, safety, and well-being of your employees, guests, and clients. Through a partnership built on transparency, we address hygiene concerns with expertise, visible cleaning presence, and precise testing and monitoring—always aligned with your business objectives.",
    },
    {
      title: "Security Services",
      desc: "Safeguarding your assets, people, and operations requires unwavering vigilance. We are committed to providing robust protection that ensures peace of mind for your workforce, visitors, and stakeholders. Through a partnership built on trust, we address security challenges with highly trained personnel, advanced monitoring technology, and proactive risk management—always tailored to protect your business objectives.",
    },
    {
      title: "Pest Control Services",
      desc: "Protecting your facility from pest-related risks requires a highly proactive approach. We are committed to preserving the integrity of your workspace and safeguarding the health of your employees, guests, and operations. Through a partnership built on reliability, we address pest challenges with certified expertise, safe and effective treatments, and continuous preventative monitoring—always aligned with your business objectives.",
    },
    {
      title: "Rope Access Services",
      desc: "Maintaining high-rise structures and hard-to-reach elevations requires uncompromising safety and precision. We are committed to delivering efficient vertical solutions that preserve the exterior integrity of your facility without disrupting daily operations. Through a partnership built on operational excellence, we address complex high-level challenges with certified rope access technicians, specialized equipment, and rigorous safety protocols—always aligned with your business objectives.",
    },
    {
      title: "Facility Management",
      desc: "Maintaining the seamless operation of your facility's core systems requires technical precision and proactive management. We are committed to optimizing building performance, minimizing operational downtime, and ensuring a safe, comfortable environment for your workforce and guests. Through a partnership built on technical excellence, we address complex engineering challenges with certified specialists, preventative maintenance strategies, and swift responsive solutions—always aligned with your business objectives.",
    },
    {
      title: "Reception & Concierge Services",
      desc: "Creating a positive first impression requires exceptional professionalism and seamless visitor management. We are committed to providing welcoming, efficient, and secure front-line support that reflects the high standards of your corporate identity. Through a partnership built on hospitality, we address front-of-house challenges with highly trained personnel, proactive communication, and administrative excellence—always aligned with your business objectives.",
    },
  ];

  const servicesSection = document.querySelector(".services-section");
  const accItems = document.querySelectorAll(".acc-item");
  const serviceTitle = document.getElementById("service-text-title"); // KOREKSI ID
  const serviceDesc = document.getElementById("service-text-description"); // KOREKSI ID
  const serviceInfoContainer = document.querySelector(".services-text-info");

  if (accItems.length === 0) return;

  let currentIndex = 0;
  let autoPlayTimer = null;
  let progress = 0;
  const duration = 10000;
  const tick = 10;

  function activateItem(index) {
    if (currentIndex === index && progress > 0 && progress < duration) return;

    accItems.forEach((el) => {
      el.classList.remove("active");
      const fill = el.querySelector(".acc-progress-fill");
      if (fill) fill.style.width = "0%";
    });

    accItems[index].classList.add("active");
    currentIndex = index;
    progress = 0;

    if (serviceInfoContainer) {
      serviceInfoContainer.style.opacity = 0;
      setTimeout(() => {
        if (serviceTitle) serviceTitle.textContent = servicesData[index].title;
        if (serviceDesc) serviceDesc.textContent = servicesData[index].desc;
        serviceInfoContainer.style.opacity = 1;
      }, 400);
    }
  }

  function startAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);

    autoPlayTimer = setInterval(() => {
      progress += tick;
      let percentage = (progress / duration) * 100;

      const activeItem = accItems[currentIndex];
      if (activeItem) {
        const fill = activeItem.querySelector(".acc-progress-fill");
        if (fill) fill.style.width = `${percentage}%`;
      }

      if (progress >= duration) {
        let nextIndex = (currentIndex + 1) % accItems.length;
        activateItem(nextIndex);
      }
    }, tick);
  }

  function pauseAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  if (servicesSection) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAutoPlay();
          } else {
            pauseAutoPlay();
          }
        });
      },
      {
        root: null,
        threshold: 0.15, // Cukup 15% masuk layar sudah nyala (lebih responsif)
      },
    );

    sectionObserver.observe(servicesSection);
  }

  accItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      activateItem(index);
      startAutoPlay();
    });
  });

  activateItem(0);
  pauseAutoPlay();
}

// ==========================================
// MODUL 5: CLIENTS CAROUSEL
// ==========================================
function initClientsCarousel() {
  const container = document.getElementById("clientsMarquee");
  if (!container) return;

  const clientLogos = [
    {
      src: "assets/clients/Daya Adicipta Motora.png",
      alt: "Daya Adicipta Motora",
    },
    { src: "assets/clients/Honda.png", alt: "Honda" },
    { src: "assets/clients/Hyundai.png", alt: "Hyundai" },
    { src: "assets/clients/Lexus.png", alt: "Lexus" },
    { src: "assets/clients/Mercedes-Benz.png", alt: "Mercedes-Benz" },
    { src: "assets/clients/APL.png", alt: "Agung Podomoro Land" },
    { src: "assets/clients/Grab.png", alt: "Grab" },
    { src: "assets/clients/Jiva.png", alt: "Jiva" },
    { src: "assets/clients/Kalla.png", alt: "Kalla" },
    { src: "assets/clients/Mandiri.png", alt: "Mandiri" },
    { src: "assets/clients/Pertamina.png", alt: "Pertamina" },
    { src: "assets/clients/Sinarmas.png", alt: "Sinarmas" },
    { src: "assets/clients/Arnott.png", alt: "Arnott" },
    { src: "assets/clients/Cimory.png", alt: "Cimory" },
    { src: "assets/clients/Mayora.png", alt: "Mayora" },
    { src: "assets/clients/Mowilex.png", alt: "Mowilex" },
    { src: "assets/clients/Nabati.png", alt: "Nabati" },
    { src: "assets/clients/Sari Roti.png", alt: "Sari Roti" },
    { src: "assets/clients/Eiger.png", alt: "Eiger" },
    { src: "assets/clients/Grand Lucky.png", alt: "Grand Lucky" },
    { src: "assets/clients/Hero.png", alt: "Hero" },
    { src: "assets/clients/Holland Bakery.png", alt: "Holland Bakery" },
    { src: "assets/clients/Indogrosir.png", alt: "Indogrosir" },
    { src: "assets/clients/Kopi Kenangan.png", alt: "Kopi Kenangan" },
    { src: "assets/clients/Lotte Mart.png", alt: "Lotte Mart" },
    { src: "assets/clients/Mitra 10.png", alt: "Mitra 10" },
    { src: "assets/clients/Superindo.png", alt: "Superindo" },
    { src: "assets/clients/Eka Hospital.png", alt: "Eka Hospital" },
    { src: "assets/clients/RS Griya Husada.png", alt: "RS Griya Husada" },
    { src: "assets/clients/Sequislife.png", alt: "Sequislife" },
    { src: "assets/clients/Watsons.png", alt: "Watsons" },
    { src: "assets/clients/Ipeka Sekolah.png", alt: "Ipeka Sekolah" },
    { src: "assets/clients/JW Mariott.png", alt: "JW Mariott" },
    { src: "assets/clients/Lippo Plaza.png", alt: "Lippo Plaza" },
    { src: "assets/clients/Swiss Belhotel.png", alt: "Swiss Belhotel" },
    { src: "assets/clients/The Park.png", alt: "The Park" },
    { src: "assets/clients/Trans Studio.png", alt: "Trans Studio" },
    { src: "assets/clients/Sicepat.png", alt: "Sicepat" },
  ];

  const track = document.createElement("div");
  track.className = "clients-marquee-track";

  let groupHTML = '<div class="marquee-group">';
  clientLogos.forEach((logo) => {
    groupHTML += `<div class="client-logo-box"><img src="${logo.src}" alt="${logo.alt}" loading="lazy" decoding="async"/></div>`;
  });
  groupHTML += "</div>";

  track.innerHTML = groupHTML + groupHTML;
  container.innerHTML = "";
  container.appendChild(track);

  let isDown = false;
  let startX;
  let scrollLeft;
  let reqId;

  const clientsSection = document.querySelector(".clients-section");
  let lastTime = 0;
  const pixelsPerSecond = 45;

  const autoScroll = (timestamp) => {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (!isDown) {
      container.scrollLeft += (pixelsPerSecond * deltaTime) / 1000;

      if (container.scrollLeft >= track.scrollWidth / 2) {
        container.scrollLeft -= track.scrollWidth / 2;
      }
    }
    reqId = requestAnimationFrame(autoScroll);
  };

  reqId = requestAnimationFrame(autoScroll);

  container.addEventListener("mousedown", (e) => {
    isDown = true;
    if (clientsSection) clientsSection.classList.add("is-dragging");

    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    cancelAnimationFrame(reqId);
  });

  if (clientsSection) {
    clientsSection.addEventListener("mouseup", () => {
      if (!isDown) return;
      isDown = false;
      clientsSection.classList.remove("is-dragging");
      reqId = requestAnimationFrame(autoScroll);
    });

    clientsSection.addEventListener("mouseleave", () => {
      if (!isDown) return;
      isDown = false;
      clientsSection.classList.remove("is-dragging");
      reqId = requestAnimationFrame(autoScroll);
    });

    clientsSection.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();

      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1;
      container.scrollLeft = scrollLeft - walk;

      if (container.scrollLeft >= track.scrollWidth / 2) {
        container.scrollLeft = 0;
        startX = x;
        scrollLeft = 0;
      } else if (container.scrollLeft <= 0) {
        container.scrollLeft = track.scrollWidth / 2;
        startX = x;
        scrollLeft = track.scrollWidth / 2;
      }
    });
  }
}
// ==========================================
// MODUL 6: NAVBAR, SCROLL TOP & HAMBURGER (OPTIMIZED)
// ==========================================
function initNavigation() {
  const navbar = document.querySelector(".navbar");
  const navLogoImg = document.querySelector(".logo img");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  // Variabel untuk Hamburger Menu
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".main-nav-links");

  const logoLight = "assets/logo/Main-Logo-Block.png";
  const logoDark = "assets/logo/Main.png";
  let lastScrollTop = 0;
  const colorChangeThreshold = 100;
  let ticking = false;

  // --- A. LOGIKA SCROLL NAVBAR & SCROLL-TOP ---
  window.addEventListener("scroll", () => {
    let currentScroll = window.scrollY || document.documentElement.scrollTop;
    let windowHeight = window.innerHeight;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Ganti warna Navbar dan Logo
        if (currentScroll > colorChangeThreshold) {
          if (navbar) navbar.classList.add("scrolled");
          if (navLogoImg) navLogoImg.src = logoDark;
        } else {
          if (navbar) navbar.classList.remove("scrolled");
          if (navLogoImg) navLogoImg.src = logoLight;
        }

        // Sembunyikan Navbar saat scroll ke bawah, munculkan saat scroll ke atas
        if (currentScroll > lastScrollTop && currentScroll > windowHeight) {
          if (navbar && !navLinks.classList.contains("active")) {
            navbar.classList.add("hidden");
          }
        } else if (
          currentScroll < lastScrollTop ||
          currentScroll <= windowHeight
        ) {
          if (navbar) navbar.classList.remove("hidden");
        }

        // Tombol Scroll to Top
        if (scrollTopBtn) {
          if (currentScroll > windowHeight / 2)
            scrollTopBtn.classList.add("visible");
          else scrollTopBtn.classList.remove("visible");
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  // --- B. LOGIKA HAMBURGER MENU (UPDATE TERBARU) ---
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      // Toggle class 'active' pada hamburger dan menu links
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");

      // Mencegah background scroll saat menu terbuka di HP
      if (navLinks.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    });

    // Auto-close: Menutup menu jika user mengklik salah satu link
    const links = navLinks.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        // 1. Cek apakah link ini adalah "Induk" dari dropdown
        const isDropdownParent =
          link.parentElement.classList.contains("dropdown-link");

        // 2. Cek apakah link ini berada di DALAM submenu dropdown
        const isInsideDropdown = link.closest(".dropdown-menu");

        // JIKA yang diklik adalah Induk Dropdown, HENTIKAN fungsi (jangan tutup hamburger)
        // Biarkan Modul 7 yang mengambil alih untuk membuka submenu
        if (isDropdownParent && !isInsideDropdown) {
          return;
        }

        // SELAIN ITU (jika yang diklik link biasa, atau link anak di dalam submenu),
        // Tutup menu hamburger dengan rapi
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.style.overflow = "auto";
      });
    });
  }

  window.dispatchEvent(new Event("scroll"));
}

// ==========================================
// MODUL 7: DROPDOWN INTERACTION MANAGER (FIXED)
// ==========================================
function initDropdowns() {
  const dropdownLinks = document.querySelectorAll(".dropdown-link");

  if (dropdownLinks.length === 0) return;

  dropdownLinks.forEach((link) => {
    const anchor = link.querySelector("a");

    anchor.addEventListener("click", (e) => {
      e.preventDefault();

      const isAlreadyActive = link.classList.contains("is-clicked");

      dropdownLinks.forEach((otherLink) => {
        otherLink.classList.remove("is-clicked");
        const otherAnchor = otherLink.querySelector("a");
        if (otherAnchor) otherAnchor.blur();
      });

      if (!isAlreadyActive) {
        link.classList.add("is-clicked");
      } else {
        link.classList.remove("is-clicked");
        anchor.blur();
      }
    });

    link.addEventListener("mouseenter", () => {
      dropdownLinks.forEach((otherLink) => {
        if (otherLink !== link) {
          otherLink.classList.remove("is-clicked");
          const otherAnchor = otherLink.querySelector("a");
          if (otherAnchor) otherAnchor.blur();
        }
      });
    });
  });

  document.addEventListener("click", (e) => {
    const isClickInsideNavbar =
      e.target.closest(".main-nav-links") ||
      e.target.closest(".side-nav-links");

    if (!isClickInsideNavbar) {
      dropdownLinks.forEach((link) => {
        link.classList.remove("is-clicked");
        const anchor = link.querySelector("a");
        if (anchor) anchor.blur();
      });
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      dropdownLinks.forEach((link) => {
        if (
          link.classList.contains("is-clicked") ||
          link.matches(":focus-within")
        ) {
          link.classList.remove("is-clicked");
          const anchor = link.querySelector("a");
          if (anchor) anchor.blur();
        }
      });
    },
    { passive: true },
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (document.activeElement) {
        document.activeElement.blur();
      }

      dropdownLinks.forEach((link) => {
        link.classList.remove("is-clicked");

        const menu = link.querySelector(".dropdown-menu");
        if (menu) {
          menu.style.display = "none";

          link.addEventListener(
            "mouseleave",
            () => {
              menu.style.display = "";
            },
            { once: true },
          );

          link.addEventListener(
            "focusout",
            () => {
              setTimeout(() => {
                menu.style.display = "";
              }, 100);
            },
            { once: true },
          );
        }
      });
    }
  });
}

// ==========================================
// MODUL 8 : GLOBAL ANCHOR SCROLL MANAGER
// Mengatasi efek lompat & membersihkan URL dari "#"
// ==========================================
function initSmoothScroll() {
  // Tangkap SEMUA link yang berawalan "#" di seluruh halaman
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      // 1. KUNCI SOLUSI: Jika href-nya "#0", batalkan klik sepenuhnya agar URL bersih, lalu stop proses.
      if (targetId === "#0") {
        e.preventDefault();
        return;
      }

      // 2. Abaikan tombol khusus Hero karena sudah ditangani oleh Modul 1
      if (this.classList.contains("btn-hero")) return;

      // 3. Untuk link anchor biasa (misal: href="#contact")
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault(); // Mencegah browser melompat & mencegah "#" masuk ke URL

        // Lakukan scroll mulus ke target
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
}

// ==========================================
// 🚀 SINGLE ENTRY POINT (MASTER INITIALIZER)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();
  initScrollEffects();
  initFadeUp();
  initIndustriesCarousel();
  initServicesAccordion();
  initClientsCarousel();
  initNavigation();
  initDropdowns();
});
