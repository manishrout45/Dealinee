// ==============================
// 🏡 Existing loadProperties() function
// ==============================
async function loadProperties(propertyFor = "", location = "") {
  try {
    const queryParams = new URLSearchParams();

    if (propertyFor) queryParams.append("propertyFor", propertyFor);
    if (location) queryParams.append("location", location);

    const res = await fetch(`http://localhost:5000/api/properties?${queryParams.toString()}`);
    const data = await res.json();

    const container = document.getElementById("property-list");
    container.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = `<p class="text-gray-500 text-center py-6">No properties found.</p>`;
      return;
    }

    container.innerHTML = data
      .map((p, index) => {
        const images = Array.isArray(p.images) ? p.images : [p.images];
        const phoneNumber = "9876543210";
        return `
  <div class="group bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
    <!-- 🖼️ Property Image -->
    <div class="relative h-56 w-full overflow-hidden">
      <div id="slider-${index}" class="h-full w-full relative">
        ${images
          .map(
            (img, i) => `
            <img 
              src="http://localhost:5000${img}" 
              alt="${p.title}"
              class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === 0 ? "opacity-100" : "opacity-0"}"
            />`
          )
          .join("")}
      </div>

      <!-- Overlay Label -->
      <span class="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
        ${p.propertyFor}
      </span>

      <span class="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
        Available
      </span>

      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    <!-- 📄 Property Info -->
    <div class="p-5 space-y-3">
      <h3 class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
        ${p.title}
      </h3>
      <p class="text-gray-500 text-sm flex items-center gap-1">
        📍 <span>${p.location}</span>
      </p>
      <p class="text-sm text-gray-600">
        <strong>${p.type}</strong> • ${p.furnishing}
      </p>

      <!-- Badges -->
      <div class="flex flex-wrap gap-2 mt-3">
        <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
          SBU: ${p.SBU}
        </span>
        <span class="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
          CA: ${p.CA}
        </span>
      </div>
    </div>

    <!-- CTA -->
    <div class="px-5 pb-5">
      <a href="tel:9876543210" 
         class="block w-full text-center bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2 rounded-full shadow hover:shadow-lg hover:scale-105 transition-all duration-300">
        📞 Book Now
      </a>
    </div>
  </div>
`;

      })
      .join("");

    // image slider
    data.forEach((p, index) => {
      const images = Array.isArray(p.images) ? p.images : [p.images];
      if (images.length > 1) {
        const slides = document.querySelectorAll(`#slider-${index} img`);
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

// ==============================
// 🧠 Add this part BELOW the function
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  // Default load all properties
  loadProperties();

  // Buttons for Buy / Rent / Commercial / Plot
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const propertyFor = button.getAttribute("data-filter"); // e.g., "Buy" or "Rent"
      loadProperties(propertyFor);
    });
  });

  // Location search
  document.getElementById("search-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const location = document.getElementById("search-input").value.trim();
    loadProperties("", location);
  });
});
