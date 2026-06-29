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

      // Catatan: Logika "else if" untuk mencegat scroll ke atas telah DIHAPUS.
      // Dengan begini, browser akan mengambil alih scroll ke atas secara natural.
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

  // E. Button Hero Section
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

  // Konfigurasi area pantau
  const observerOptions = {
    root: null,
    // rootMargin "-100px" menciptakan garis imajiner 100px dari bawah layar.
    // Elemen harus melewati garis ini baru animasi "fade-up" akan terpicu.
    rootMargin: "0px 0px -60px 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry) => {
      // Jika elemen sudah melewati garis imajiner 100px dari bawah layar
      if (entry.isIntersecting) {
        // Nyalakan animasi
        entry.target.classList.add("visible");

        // KUNCI OPTIMASI: Lepaskan elemen ini dari radar pantauan browser.
        // Karena elemen hanya perlu muncul satu kali, kita matikan observer-nya
        // untuk menghemat resource CPU/GPU dan mempercepat kinerja halaman.
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Daftarkan semua elemen yang punya class .fade-up ke dalam radar
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
  const titleElement = document.getElementById("industries-title");
  const textWrapper = document.querySelector(".industries-image-text");
  const prevBtn = document.querySelector(".carousel-prev-btn");
  const nextBtn = document.querySelector(".carousel-next-btn");
  const iconBoxes = document.querySelectorAll(".carousel-icon-box");

  if (!mainImage || !titleElement) return; // Mencegah error jika elemen tidak ada di halaman

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
  const serviceTitle = document.getElementById("service-title");
  const serviceDesc = document.getElementById("service-desc");
  const serviceInfoContainer = document.querySelector(".services-text-info");

  if (accItems.length === 0) return;

  let currentIndex = 0;
  let autoPlayTimer = null;
  let progress = 0;
  const duration = 10000; // 10 Detik
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
    progress = 0; // Reset waktu ke 0 setiap ganti item

    if (serviceInfoContainer) {
      serviceInfoContainer.style.opacity = 0;
      setTimeout(() => {
        if (serviceTitle) serviceTitle.textContent = servicesData[index].title;
        if (serviceDesc) serviceDesc.textContent = servicesData[index].desc;
        serviceInfoContainer.style.opacity = 1;
      }, 400);
    }
  }

  // Fungsi menyalakan loading
  function startAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer); // Proteksi timer ganda

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

  // Fungsi membekukan loading (Pause)
  function pauseAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // KUNCI SOLUSI: Pasang mata-mata khusus untuk area Service
  if (servicesSection) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // loading HANYA jalan ketika section masuk layar monitor
          if (entry.isIntersecting) {
            startAutoPlay();
          } else {
            // Otomatis PAUSE (membeku) jika user scroll menjauh
            pauseAutoPlay();
          }
        });
      },
      {
        root: null,
        // Pemicu aktif saat minimal 15% dari total tinggi seksi Service sudah nampil di monitor
        threshold: 0.85,
      },
    );

    sectionObserver.observe(servicesSection);
  }

  // Klik Manual
  accItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      activateItem(index);
      // Jika diklik manual, langsung paksa start ulang (asalkan sedang tertampil)
      startAutoPlay();
    });
  });

  // Setelan Awal: Siapkan item pertama, tapi biarkan membeku sampai tertangkap radar monitor
  activateItem(0);
  pauseAutoPlay();
}

// ==========================================
// MODUL 5: CLIENTS CAROUSEL
// ==========================================
function initClientsCarousel() {
  const container = document.getElementById("clientsMarquee");
  if (!container) return;

  // 1. DATA MASTER LOGO
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

  // 2. BANGUN HTML SECARA OTOMATIS
  const track = document.createElement("div");
  track.className = "clients-marquee-track";

  let groupHTML = '<div class="marquee-group">';
  clientLogos.forEach((logo) => {
    groupHTML += `<div class="client-logo-box"><img src="${logo.src}" alt="${logo.alt}" loading="lazy" /></div>`;
  });
  groupHTML += "</div>";

  track.innerHTML = groupHTML + groupHTML;
  container.innerHTML = "";
  container.appendChild(track);

  // 3. MESIN ANIMASI & DRAG KURSOR (EXTENDED BOUNDARY)
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

  // Mousedown pada Logo
  container.addEventListener("mousedown", (e) => {
    isDown = true;
    if (clientsSection) clientsSection.classList.add("is-dragging");

    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    cancelAnimationFrame(reqId);
  });

  // Sensor lepas & keluar dipasang pada area abu-abu (Section Utama)
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
  const hamburger = document.querySelector(".hamburger");

  const logoLight = "assets/logo/Main-Logo-Block.png";
  const logoDark = "assets/logo/Main.png";
  let lastScrollTop = 0;
  const colorChangeThreshold = 100;
  let ticking = false;

  window.addEventListener("scroll", () => {
    let currentScroll = window.scrollY || document.documentElement.scrollTop;
    let windowHeight = window.innerHeight;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        // A. Warna Navbar
        if (currentScroll > colorChangeThreshold) {
          if (navbar) navbar.classList.add("scrolled");
          if (navLogoImg) navLogoImg.src = logoDark;
        } else {
          if (navbar) navbar.classList.remove("scrolled");
          if (navLogoImg) navLogoImg.src = logoLight;
        }

        // B. Smart Hide Navbar
        if (currentScroll > lastScrollTop && currentScroll > windowHeight) {
          if (navbar && !navbar.classList.contains("active")) {
            navbar.classList.add("hidden");
          }
        } else if (
          currentScroll < lastScrollTop ||
          currentScroll <= windowHeight
        ) {
          if (navbar) navbar.classList.remove("hidden");
        }

        // C. Scroll Top Button
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

  if (hamburger && navbar) {
    hamburger.addEventListener("click", () => {
      navbar.classList.toggle("active");
      hamburger.classList.toggle("is-active");
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

    // 1. Event saat menu diklik
    anchor.addEventListener("click", (e) => {
      e.preventDefault();

      const isAlreadyActive = link.classList.contains("is-clicked");

      // Reset semua menu lain terlebih dahulu
      dropdownLinks.forEach((otherLink) => {
        otherLink.classList.remove("is-clicked");
        const otherAnchor = otherLink.querySelector("a");
        if (otherAnchor) otherAnchor.blur();
      });

      // Buka/Tutup menu yang sedang diklik
      if (!isAlreadyActive) {
        link.classList.add("is-clicked");
      } else {
        link.classList.remove("is-clicked");
        anchor.blur();
      }
    });

    // 2. Event saat kursor hover ke menu baru
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

  // 3. Klik di sembarang tempat (luar navbar) akan menutup semua dropdown
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

  // 4. KUNCI SOLUSI: Tutup dropdown otomatis saat layar di-scroll
  window.addEventListener(
    "scroll",
    () => {
      dropdownLinks.forEach((link) => {
        // Cek apakah ada dropdown yang sedang terbuka karena diklik
        if (
          link.classList.contains("is-clicked") ||
          link.matches(":focus-within")
        ) {
          link.classList.remove("is-clicked");
          const anchor = link.querySelector("a");
          if (anchor) anchor.blur(); // Bersihkan sisa fokus agar animasi panah & garis mereset
        }
      });
    },
    { passive: true },
  ); // passive: true memastikan scroll tetap mulus tanpa terbebani JS

  // ========================================================
  // 5. TAMBAHAN BARU: Tutup pakai tombol ESC (Anti CSS Hover)
  // ========================================================
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // 5a. KUNCI SOLUSI: Buang fokus dari elemen APA PUN yang sedang disorot (Home, Contact, dll)
      if (document.activeElement) {
        document.activeElement.blur();
      }

      // 5b. Tutup semua dropdown dan paksa CSS :hover takluk
      dropdownLinks.forEach((link) => {
        link.classList.remove("is-clicked");

        const menu = link.querySelector(".dropdown-menu");
        if (menu) {
          menu.style.display = "none";

          // Kembalikan style normal saat mouse bergerak menjauh
          link.addEventListener(
            "mouseleave",
            () => {
              menu.style.display = "";
            },
            { once: true },
          );

          // Kembalikan style normal saat user lanjut menekan Tab ke menu lain
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
// MODUL 8 : SMOOTH SCROLL KHUSUS NAVBAR
// Mencegah konflik dengan animasi Hero Section
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('.navbar a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      // Abaikan jika href-nya "#" atau "#0" (seperti pada tombol dropdown)
      if (targetId === "#" || targetId === "#0") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault(); // Matikan efek lompat instan bawaan HTML

        // Scroll mulus khusus saat klik menu navbar
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
