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
      desc: "Maintaining clean, hygienic spaces requires the highest standards. We are committed to supporting the health, safety, and well-being of your employees, guests, and clients...",
    },
    {
      title: "Security Services",
      desc: "Safeguarding your assets, people, and operations requires unwavering vigilance. We are committed to providing robust protection that ensures peace of mind...",
    },
    {
      title: "Pest Control Services",
      desc: "Protecting your facility from pest-related risks requires a highly proactive approach. We are committed to preserving the integrity of your workspace...",
    },
    {
      title: "Rope Access Services",
      desc: "Maintaining high-rise structures and hard-to-reach elevations requires uncompromising safety and precision. We are committed to delivering efficient vertical solutions...",
    },
    {
      title: "Facility Management",
      desc: "Maintaining the seamless operation of your facility's core systems requires technical precision and proactive management. We are committed to optimizing building performance...",
    },
    {
      title: "Reception & Concierge Services",
      desc: "Creating a positive first impression requires exceptional professionalism and seamless visitor management. We are committed to providing welcoming front-line support...",
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
function initClientsCarousel() {
  const track = document.querySelector(".clients-track");
  if (!track) return;

  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".next-client");
  const prevButton = document.querySelector(".prev-client");
  const dotsNav = document.querySelector(".clients-dots");
  const dots = Array.from(dotsNav.children);
  let currentIndex = 0;

  const moveToSlide = (index) => {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide) => slide.classList.remove("current-slide"));
    if (slides[index]) slides[index].classList.add("current-slide");
    dots.forEach((dot) => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
    currentIndex = index;
  };

  if (nextButton)
    nextButton.addEventListener("click", () => {
      let nextIndex = currentIndex + 1 >= slides.length ? 0 : currentIndex + 1;
      moveToSlide(nextIndex);
    });

  if (prevButton)
    prevButton.addEventListener("click", () => {
      let prevIndex =
        currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;
      moveToSlide(prevIndex);
    });

  dots.forEach((dot, index) =>
    dot.addEventListener("click", () => moveToSlide(index)),
  );
}

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
  initClientsCarousel();
  initNavigation();
});
