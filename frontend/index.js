/* ===========================
   POPUP SECTION (unchanged)
=========================== */
document.addEventListener("DOMContentLoaded", function () {
  var popup = document.getElementById("popup");
  var popupBox = document.getElementById("popupBox");
  var closePopup = document.getElementById("closePopup");
  var popupIcon = document.getElementById("popupIcon");
  var popupImage = document.getElementById("popupImage");

  var images = [
    "frontend/assets/image/home/Popup/meadowex1.jpeg",
    "frontend/assets/image/home/Popup/meadowex3.jpeg",
    "frontend/assets/image/home/Popup/meadowex4.jpeg",
    "frontend/assets/image/home/Popup/meadowex5.jpeg",
    "frontend/assets/image/home/Popup/meadowex7.jpeg",
    "popup2.jpg",
  ];
  var currentIndex = 0;

  setTimeout(() => popup.classList.remove("hidden"), 2000);
  closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
    popupIcon.classList.remove("hidden");
  });
  popupIcon.addEventListener("click", () => {
    popup.classList.remove("hidden");
    popupIcon.classList.add("hidden");
  });

  setInterval(function () {
    popupImage.classList.add("fade-out");
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % images.length;
      popupImage.src = images[currentIndex];
      popupImage.classList.remove("fade-out");
      popupImage.classList.add("fade-in");
    }, 1000);
  }, 3000);
});

/* ===========================
   HERO IMAGE CHANGER
=========================== */
function changeHeroImage(category) {
  const heroSection = document.getElementById("hero-section");
  const heroHeading = document.getElementById("hero-heading");

  const images = {
    buy: "03.jpg",
    rent: "01.jpg",
    commercial: "02.jpg",
    plot: "04.jpg",
  };

  const headings = {
    buy: "Buy Properties in Bhubaneswar",
    rent: "Rental Properties in Bhubaneswar",
    commercial: "Commercial Properties in Bhubaneswar",
    plot: "Plots Available in Bhubaneswar",
  };

  heroSection.style.backgroundImage = `url('${images[category]}')`;
  heroHeading.textContent = headings[category];
}

/* ===========================
   LOAD PROPERTIES FROM BACKEND
=========================== */
let currentFilter = "buy"; // default filter

async function loadProperties(location = "", propertyFor = currentFilter) {
  try {
    let url = `https://dealinee.onrender.com/api/properties?propertyFor=${encodeURIComponent(
  propertyFor
)}`;
    if (location.trim() !== "") {
      url += `&location=${encodeURIComponent(location)}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    const container = document.getElementById("property-list");
    if (!container) return;

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = `
        <div class="text-center text-gray-600 py-8 text-sm sm:text-base">
          ❌ No ${propertyFor.toUpperCase()} properties found for "<b>${location}</b>"
        </div>`;
      return;
    }

    // Render property cards
    container.innerHTML = data
      .map((p, index) => {
        const images = Array.isArray(p.images) ? p.images : [p.images];
        const phoneNumber = "9876543210";

        return `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
          <div class="relative h-56 overflow-hidden">
            <div id="slider-${index}" class="h-56 w-full relative">
              ${images
                .map(
                  (img, i) => `
                <img 
                  src="https://dealinee.onrender.com${img}" 
                  class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    i === 0 ? "opacity-100" : "opacity-0"
                  }"
                />`
                )
                .join("")}
            </div>
            <span class="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow z-10">
              Available
            </span>
          </div>

          <div class="p-4 space-y-3 flex-grow">
            <h3 class="text-xl font-semibold text-gray-800">${p.title}</h3>
            <p class="text-gray-500">${p.location}</p>
            <p class="text-sm text-gray-600"><strong>${p.propertyFor}</strong> - ${p.furnishing}</p>
            <div class="flex flex-wrap gap-3 text-sm text-gray-600">
              <span class="bg-gray-100 px-2 py-1 rounded-lg">SBU: ${p.SBU}</span>
              <span class="bg-gray-100 px-2 py-1 rounded-lg">CA: ${p.CA}</span>
              <span class="bg-gray-100 px-2 py-1 rounded-lg">Type: ${p.type}</span>
            </div>
          </div>

          <div class="p-4 pt-0">
            <a href="tel:${phoneNumber}" class="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition">
              Book Now
            </a>
          </div>
        </div>`;
      })
      .join("");

    // Image slider
    data.forEach((p, index) => {
      const slides = document.querySelectorAll(`#slider-${index} img`);
      if (slides.length > 1) {
        let current = 0;
        setInterval(() => {
          slides[current].classList.remove("opacity-100");
          slides[current].classList.add("opacity-0");
          current = (current + 1) % slides.length;
          slides[current].classList.remove("opacity-0");
          slides[current].classList.add("opacity-100");
        }, 3000);
      }
    });
  } catch (err) {
    console.error("Error loading properties:", err);
  }
}

/* ===========================
   HANDLE FILTER BUTTONS
=========================== */
function setActiveButton(button) {
  document.querySelectorAll(".filter-btn").forEach((btn) =>
    btn.classList.remove("bg-red-500")
  );
  button.classList.add("bg-red-500");
}

function filterProperties(type) {
  currentFilter = type.toLowerCase();
  const localityInput = document.querySelector(
    'input[placeholder="Search Locality"]'
  );
  const location = localityInput ? localityInput.value.trim() : "";
  loadProperties(location, currentFilter);
}

/* ===========================
   HANDLE SEARCH BAR
=========================== */
document.addEventListener("DOMContentLoaded", () => {
  loadProperties("", currentFilter);

  const searchForm = document.querySelector("form");
  const localityInput = document.querySelector(
    'input[placeholder="Search Locality"]'
  );

  if (searchForm && localityInput) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const location = localityInput.value.trim();
      loadProperties(location, currentFilter);
    });
  }
});
