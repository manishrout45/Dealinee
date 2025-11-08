// ==============================
// 🏡 Existing loadProperties() function
// ==============================
async function loadProperties(propertyFor = "", location = "") {
  try {
    const queryParams = new URLSearchParams();

    if (propertyFor) queryParams.append("propertyFor", propertyFor);
    if (location) queryParams.append("location", location);

    const res = await fetch(`https://dealinee.onrender.com/api/properties?${queryParams.toString()}`);
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
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div class="relative h-56 overflow-hidden">
              <div id="slider-${index}" class="h-56 w-full relative">
                ${images
                  .map(
                    (img, i) => `
                  <img src="https://dealinee.onrender.com${img}"
                       class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === 0 ? "opacity-100" : "opacity-0"}" />`
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
