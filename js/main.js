// Mengambil elemen halaman abu-abu
const aboutSection = document.querySelector(".main-content");

// ==========================================
// 0. RESET SCROLL TO TOP ON PAGE REFRESH
// ==========================================
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

// ==========================================
// 1. EFEK REVEAL BACKGROUND GELAP
// ==========================================
const heroSection = document.querySelector(".hero-section");

window.addEventListener("scroll", () => {
  const scrollPos = window.scrollY;
  const windowHeight = window.innerHeight;

  // Saat discroll, gambar Hero perlahan memudar
  // Karena memudar, warna gelap dari Body di belakangnya jadi terlihat!
  if (heroSection) {
    let opacityValue = 1 - scrollPos / windowHeight;
    heroSection.style.opacity = Math.max(0, opacityValue);
  }
});

// ==========================================
// 2. FUNGSI CUSTOM SCROLL (SMART EASING)
// ==========================================
function smoothScrollTo(targetPosition, duration, direction) {
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let startTime = null;

  // Kurva 1 (UNTUK TURUN): Cepat di awal, ngerem sangat halus di akhir
  function easeOutQuart(t, b, c, d) {
    t /= d;
    t--;
    return -c * (t * t * t * t - 1) + b;
  }

  // Kurva 2 (UNTUK NAIK): Lambat di awal (agar opacity pudar pelan), cepat di tengah, ngerem di akhir
  function easeInOutQuart(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t * t + b;
    t -= 2;
    return (-c / 2) * (t * t * t * t - 2) + b;
  }

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;

    let run;
    // Memilih kurva secara cerdas berdasarkan arah scroll
    if (direction === "down") {
      run = easeOutQuart(timeElapsed, startPosition, distance, duration);
    } else {
      run = easeInOutQuart(timeElapsed, startPosition, distance, duration);
    }

    window.scrollTo(0, run);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, targetPosition);
    }
  }
  requestAnimationFrame(animation);
}

// ==========================================
// 3. MAGNETIC SCROLL CONTROLLER
// ==========================================
let isAnimating = false;
const scrollDuration = 1500; // Durasi 1.5 detik andalan Anda

window.addEventListener(
  "wheel",
  (e) => {
    if (window.scrollY <= window.innerHeight + 10) {
      if (!isAnimating) {
        // SCROLL KE BAWAH (Menuju Halaman Abu-abu)
        if (e.deltaY > 0 && window.scrollY < window.innerHeight / 2) {
          e.preventDefault();
          isAnimating = true;

          // Panggil scroll dengan arah 'down'
          smoothScrollTo(window.innerHeight, scrollDuration, "down");

          setTimeout(() => {
            isAnimating = false;
          }, scrollDuration + 50);
        }

        // SCROLL KE ATAS (Kembali ke Header)
        else if (e.deltaY < 0 && window.scrollY > 0) {
          e.preventDefault();
          isAnimating = true;

          // Panggil scroll dengan arah 'up'
          smoothScrollTo(0, scrollDuration, "up");

          setTimeout(() => {
            isAnimating = false;
          }, scrollDuration + 50);
        }
      } else {
        e.preventDefault();
      }
    }
  },
  { passive: false },
);

// ==========================================
// 4. EFEK FADE IN TEXT & CARD
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  // HAPUS kodingan `aboutSection.style.opacity = 0;` yang lama di sini

  // Mesin pendeteksi: Jika elemen masuk layar, tambahkan class "visible"
  const fadeElements = document.querySelectorAll(".fade-up");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }, // Memicu animasi saat 10% elemen terlihat di layar
  );

  fadeElements.forEach((el) => observer.observe(el));
});

// ==========================================
// 5. CAROUSEL INDUSTRIES (ROTARY & IMAGE SYNC)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  // 1. DATABASE INDUSTRI
  // Siapkan 5 gambar ruangan besar di folder Anda sesuai dengan industri ini
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
    }, // Ini yang di tengah pertama kali
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

  const iconImages = document.querySelectorAll(".carousel-icon-box img"); // Mengambil tag <img> di dalam kotak
  const dots = document.querySelectorAll(".carousel-dots .dot");
  const mainImage = document.querySelector(".industries-right img");
  const titleElement = document.getElementById("industry-title");
  const textWrapper = document.querySelector(".industries-image-text");

  // Index 2 adalah "Corporate", sehingga akan muncul di kotak ke-3 (tengah) pertama kali
  let currentIndex = 2;

  function updateCarousel() {
    // A. Putar Ikon di Dalam Kotak
    iconImages.forEach((imgElement, domIndex) => {
      // Rumus matematika untuk menggeser urutan array (membuat efek roda putar)
      let dataIndex =
        (currentIndex - 2 + domIndex + industriesData.length) %
        industriesData.length;

      // Mengganti gambar dan teks alt di dalam kotak
      imgElement.src = industriesData[dataIndex].icon;
      imgElement.alt = industriesData[dataIndex].alt;
    });

    // B. Update Titik Indikator (Dots)
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[currentIndex].classList.add("active");

    // C. Update Gambar Besar Kanan dengan Efek Fade
    mainImage.style.opacity = 0; // Pudar dulu
    textWrapper.style.opacity = 0; // Pudar teksnya dulu

    setTimeout(() => {
      mainImage.src = industriesData[currentIndex].image; // Ganti gambar
      titleElement.textContent = industriesData[currentIndex].title; // Ganti judul

      mainImage.style.opacity = 1; // Munculkan lagi
      textWrapper.style.opacity = 1; // Munculkan teksnya
    }, 300); // Jeda 300ms sesuai CSS transition
  }

  // Event Listener: Tombol Prev & Next
  const prevBtn = document.querySelector(".carousel-prev-btn");
  const nextBtn = document.querySelector(".carousel-next-btn");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      // Mundur 1 langkah (putar ke kiri)
      currentIndex =
        (currentIndex - 1 + industriesData.length) % industriesData.length;
      updateCarousel();
    });

    nextBtn.addEventListener("click", () => {
      // Maju 1 langkah (putar ke kanan)
      currentIndex = (currentIndex + 1) % industriesData.length;
      updateCarousel();
    });
  }

  // Event Listener: Klik Langsung pada Titik Indikator
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  // Event Listener: Klik Langsung pada Kotak Ikon
  const iconBoxes = document.querySelectorAll(".carousel-icon-box");
  iconBoxes.forEach((box, domIndex) => {
    box.addEventListener("click", () => {
      // Cari tahu data industri apa yang ada di kotak yang diklik, lalu jadikan dia active
      let dataIndex =
        (currentIndex - 2 + domIndex + industriesData.length) %
        industriesData.length;
      currentIndex = dataIndex;
      updateCarousel();
    });
  });

  // Jalankan pertama kali saat halaman dirender
  updateCarousel();
});

// ==========================================
// 6. SERVICES ACCORDION INTERACTION
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  // Siapkan teks penjelasan untuk masing-masing servis
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

  accItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      // Abaikan jika gambar yang diklik sudah aktif
      if (item.classList.contains("active")) return;

      // 1. Ubah class active pada gambar (mekar/ciut)
      accItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");

      // 2. Ganti teks dengan efek pudar
      serviceInfoContainer.style.opacity = 0; // Pudar hilang

      setTimeout(() => {
        serviceTitle.textContent = servicesData[index].title;
        serviceDesc.textContent = servicesData[index].desc;
        serviceInfoContainer.style.opacity = 1; // Pudar muncul lagi
      }, 400); // Waktu jeda 400ms disamakan dengan CSS
    });
  });
});

// ==========================================
// 7. CLIENTS LOGO CAROUSEL (FLEXBOX PERCENTAGE)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".clients-track");
  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".next-client");
  const prevButton = document.querySelector(".prev-client");
  const dotsNav = document.querySelector(".clients-dots");
  const dots = Array.from(dotsNav.children);

  let currentIndex = 0;

  // Fungsi canggih untuk menggeser berdasarkan persentase 100%
  const moveToSlide = (index) => {
    // Geser panggung (track) ke kiri sejauh (index * 100%)
    track.style.transform = `translateX(-${index * 100}%)`;

    // Update class current-slide pada HTML
    slides.forEach((slide) => slide.classList.remove("current-slide"));
    if (slides[index]) slides[index].classList.add("current-slide");

    // Update class active pada titik (dots)
    dots.forEach((dot) => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");

    currentIndex = index;
  };

  // Tombol Kanan
  nextButton.addEventListener("click", () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slides.length) nextIndex = 0; // Balik ke awal jika sudah mentok
    moveToSlide(nextIndex);
  });

  // Tombol Kiri
  prevButton.addEventListener("click", () => {
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = slides.length - 1; // Lompat ke akhir jika di awal
    moveToSlide(prevIndex);
  });

  // Klik Titik (Dots) Langsung
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      moveToSlide(index);
    });
  });
});

// ==========================================
// 8. DYNAMIC NAVBAR & SCROLL TO TOP CONTROLLER
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const navLogoImg = document.querySelector(".logo img");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  // Sesuaikan nama file logo Anda
  const logoLight = "assets/logo/Main-Logo-Block.png";
  const logoDark = "assets/logo/Main.png";

  let lastScrollTop = 0;
  const colorChangeThreshold = 100; // Titik di mana navbar berubah jadi putih

  window.addEventListener("scroll", () => {
    let currentScroll = window.scrollY || document.documentElement.scrollTop;
    let windowHeight = window.innerHeight;

    // --- A. LOGIKA PERUBAHAN TAMPILAN (GELAP KE PUTIH / FULL WIDTH) ---
    if (currentScroll > colorChangeThreshold) {
      navbar.classList.add("scrolled");
      if (navLogoImg) navLogoImg.src = logoDark;
    } else {
      navbar.classList.remove("scrolled");
      if (navLogoImg) navLogoImg.src = logoLight;
    }

    // --- B. LOGIKA SEMBUNYI/MUNCUL (SMART HIDE) ---
    // KUNCI PERBAIKAN: Gunakan zona aman "windowHeight + 400"
    // Navbar HANYA akan sembunyi jika user benar-benar scroll jauh ke bawah (melewati zona pendaratan awal)
    if (currentScroll > lastScrollTop && currentScroll > windowHeight + 400) {
      navbar.classList.add("hidden");
    }
    // Muncul seketika jika user scroll naik (currentScroll < lastScrollTop)
    // ATAU jika user kembali ke area atas (currentScroll < windowHeight)
    else if (currentScroll < lastScrollTop || currentScroll <= windowHeight) {
      navbar.classList.remove("hidden");
    }

    // --- C. LOGIKA TOMBOL SCROLL TO TOP ---
    if (currentScroll > windowHeight / 2) {
      if (scrollTopBtn) scrollTopBtn.classList.add("visible");
    } else {
      if (scrollTopBtn) scrollTopBtn.classList.remove("visible");
    }

    // Simpan posisi scroll terakhir untuk deteksi arah (naik/turun)
    // Set minimal 0 agar tidak error di Safari/Mac yang punya efek "bouncing" di ujung atas layar
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });

  // --- D. AKSI KLIK TOMBOL SCROLL TO TOP ---
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  window.dispatchEvent(new Event("scroll"));
});

// ==========================================
// 9. HAMBURGER MENU TOGGLE
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navbar = document.querySelector(".navbar");

  if (hamburger && navbar) {
    hamburger.addEventListener("click", () => {
      navbar.classList.toggle("active");

      // Opsional: Animasi ikon hamburger jadi tanda X (Silang)
      hamburger.classList.toggle("is-active");
    });
  }
});
