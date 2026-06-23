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
  let isAnimating = false;
  const scrollDuration = 1500;

  // A. Hero Fade Effect
  window.addEventListener("scroll", () => {
    if (!heroSection) return;
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    let opacityValue = 1 - scrollPos / windowHeight;
    heroSection.style.opacity = Math.max(0, opacityValue);
  });

  // B. Smooth Scroll Engine
  function smoothScrollTo(targetPosition, duration, direction) {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function easeOutQuart(t, b, c, d) {
      t /= d;
      t--;
      return -c * (t * t * t * t - 1) + b;
    }

    function easeInOutQuart(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t * t + b;
      t -= 2;
      return (-c / 2) * (t * t * t * t - 2) + b;
    }

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      let run =
        direction === "down"
          ? easeOutQuart(timeElapsed, startPosition, distance, duration)
          : easeInOutQuart(timeElapsed, startPosition, distance, duration);

      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
      else window.scrollTo(0, targetPosition);
    }
    requestAnimationFrame(animation);
  }

  // C. Magnetic Wheel Event
  window.addEventListener(
    "wheel",
    (e) => {
      if (window.scrollY <= window.innerHeight + 10 && !isAnimating) {
        if (e.deltaY > 0 && window.scrollY < window.innerHeight / 2) {
          e.preventDefault();
          isAnimating = true;
          smoothScrollTo(window.innerHeight, scrollDuration, "down");
          setTimeout(() => {
            isAnimating = false;
          }, scrollDuration + 50);
        } else if (e.deltaY < 0 && window.scrollY > 0) {
          e.preventDefault();
          isAnimating = true;
          smoothScrollTo(0, scrollDuration, "up");
          setTimeout(() => {
            isAnimating = false;
          }, scrollDuration + 50);
        }
      }
    },
    { passive: false },
  );
}

// ==========================================
// MODUL 2: GLOBAL OBSERVER (FADE UP)
// ==========================================
function initFadeUp() {
  const fadeElements = document.querySelectorAll(".fade-up");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.1 },
  );

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
  const titleElement = document.getElementById("industry-title");
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

  const accItems = document.querySelectorAll(".acc-item");
  const serviceTitle = document.getElementById("service-title");
  const serviceDesc = document.getElementById("service-desc");
  const serviceInfoContainer = document.querySelector(".services-text-info");

  if (accItems.length === 0) return;

  accItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("active")) return;

      accItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");

      serviceInfoContainer.style.opacity = 0;
      setTimeout(() => {
        if (serviceTitle) serviceTitle.textContent = servicesData[index].title;
        if (serviceDesc) serviceDesc.textContent = servicesData[index].desc;
        serviceInfoContainer.style.opacity = 1;
      }, 400);
    });
  });
}

// ==========================================
// MODUL 5: CLIENTS CAROUSEL
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
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

  // Masukkan 2 grup berjejer agar rotasi tidak pernah terputus (infinite loop)
  track.innerHTML = groupHTML + groupHTML;
  container.innerHTML = "";
  container.appendChild(track);

  // 3. MESIN ANIMASI & DRAG KURSOR
  let isDown = false;
  let startX;
  let scrollLeft;
  let scrollSpeed = 1; // Kecepatan jalan otomatis
  let reqId;

  // Fungsi jalan otomatis
  const autoScroll = () => {
    if (!isDown) {
      container.scrollLeft += scrollSpeed;
      // Jika sudah jalan sejauh 1 grup, reset ke posisi 0 tanpa disadari mata
      if (container.scrollLeft >= track.scrollWidth / 2) {
        container.scrollLeft = 0;
      }
    }
    reqId = requestAnimationFrame(autoScroll);
  };

  // Jalankan mesin
  reqId = requestAnimationFrame(autoScroll);

  // Logika Tarik (Drag)
  container.addEventListener("mousedown", (e) => {
    isDown = true;
    container.classList.add("active");
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    cancelAnimationFrame(reqId); // Hentikan auto-scroll
  });

  container.addEventListener("mouseup", () => {
    isDown = false;
    container.classList.remove("active");
    reqId = requestAnimationFrame(autoScroll); // Nyalakan lagi
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1; // Angka 2 adalah kecepatan geser kursor
    container.scrollLeft = scrollLeft - walk;

    // Loop infinite juga berlaku saat didrag manual
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
});

// ==========================================
// MODUL 6: NAVBAR, SCROLL TOP & HAMBURGER
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

  window.addEventListener("scroll", () => {
    let currentScroll = window.scrollY || document.documentElement.scrollTop;
    let windowHeight = window.innerHeight;

    // A. Warna Navbar
    if (currentScroll > colorChangeThreshold) {
      if (navbar) navbar.classList.add("scrolled");
      if (navLogoImg) navLogoImg.src = logoDark;
    } else {
      if (navbar) navbar.classList.remove("scrolled");
      if (navLogoImg) navLogoImg.src = logoLight;
    }

    // B. Smart Hide Navbar
    if (currentScroll > lastScrollTop && currentScroll > windowHeight + 400) {
      if (navbar) navbar.classList.add("hidden");
    } else if (currentScroll < lastScrollTop || currentScroll <= windowHeight) {
      if (navbar) navbar.classList.remove("hidden");
    }

    // C. Scroll Top Button
    if (scrollTopBtn) {
      if (currentScroll > windowHeight / 2)
        scrollTopBtn.classList.add("visible");
      else scrollTopBtn.classList.remove("visible");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
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

  // Pancing event scroll sekali saat load
  window.dispatchEvent(new Event("scroll"));
}

// ==========================================
// 🚀 SINGLE ENTRY POINT (MASTER INITIALIZER)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initScrollEffects();
  initFadeUp();
  initIndustriesCarousel();
  initServicesAccordion();
  initNavigation();
});
