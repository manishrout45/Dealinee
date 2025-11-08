const form = document.getElementById("propertyForm");
const propertyList = document.getElementById("property-list");
const updateModal = document.getElementById("updateModal");
const closeModal = document.getElementById("closeModal");
const updateForm = document.getElementById("updateForm");

// ✅ Token
let token = localStorage.getItem("adminToken");

// ✅ Redirect if not logged in
if (!token) {
  alert("Unauthorized! Please login first.");
  window.location.href = "login.html";
}

// ✅ Load Properties
async function loadProperties() {
  try {
    const res = await fetch("https://dealinee.onrender.com/api/admin/properties", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      propertyList.innerHTML = `<p class="text-gray-500 text-center col-span-full">No properties found.</p>`;
      return;
    }

    propertyList.innerHTML = data.map(p => `
      <div class="border rounded-lg shadow bg-white overflow-hidden relative">

        <span class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Available</span>

        <div class="relative w-full h-48 overflow-hidden">
          ${p.images?.length ? p.images.map((img,i)=>`
            <img src="https://dealinee.onrender.com${img}"
            class="property-slide w-full h-full object-cover absolute transition-opacity duration-700 ${i===0 ? 'opacity-100':'opacity-0'}"/>
          `).join("") : `<p class="text-center text-gray-400 p-10 text-sm">No images</p>`}
        </div>

        <div class="p-4">
          <h3 class="text-lg font-semibold">${p.title}</h3>
          <p class="text-gray-600">${p.location}</p>
          <p><strong>${p.propertyFor}</strong> - ${p.furnishing}</p>
          <p class="text-sm text-gray-500">SBU: ${p.SBU} | CA: ${p.CA}</p>
          <p class="text-sm text-gray-500">Type: ${p.type}</p>
        </div>

        <div class="flex justify-between p-4 border-t">
          <button data-id="${p._id}" class="update-btn bg-yellow-500 text-white px-3 py-1 rounded">Update</button>
          <button data-id="${p._id}" class="delete-btn bg-red-500 text-white px-3 py-1 rounded">Delete</button>
        </div>
      </div>
    `).join("");

    startAutoSlides();
  } catch {
    propertyList.innerHTML = "<p class='text-red-500 text-center'>Failed to load properties.</p>";
  }
}

// ✅ Auto Slider
function startAutoSlides() {
  const cards = document.querySelectorAll("#property-list > div");
  cards.forEach(card => {
    const slides = card.querySelectorAll(".property-slide");
    if (slides.length <= 1) return;

    let current = 0;
    setInterval(() => {
      slides[current].classList.replace("opacity-100", "opacity-0");
      current = (current + 1) % slides.length;
      slides[current].classList.replace("opacity-0", "opacity-100");
    }, 3000);
  });
}

// ✅ Add Property
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    const res = await fetch("https://dealinee.onrender.com/api/admin/properties", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Property Added");
      form.reset();
      loadProperties();
    } else {
      alert(data.message);
    }
  });
}

// ✅ Update & Delete
propertyList.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;

  // Edit
  if (e.target.classList.contains("update-btn")) {
    const res = await fetch(`https://dealinee.onrender.com/api/admin/properties/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const prop = await res.json();
    updateModal.classList.remove("hidden");

    updateForm.id.value = prop._id;
    updateForm.title.value = prop.title;
    updateForm.location.value = prop.location;
    updateForm.sbu.value = prop.SBU;
    updateForm.ca.value = prop.CA;
    updateForm.furnishing.value = prop.furnishing;
    updateForm.propertyFor.value = prop.propertyFor;
    updateForm.type.value = prop.type;
  }

  // Delete
  if (e.target.classList.contains("delete-btn")) {
    if (!confirm("Delete property?")) return;

    const res = await fetch(`https://dealinee.onrender.com/api/admin/properties/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    alert(data.message);
    loadProperties();
  }
});

// ✅ Close Modal
closeModal.addEventListener("click", () => updateModal.classList.add("hidden"));

// ✅ Update Property
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = updateForm.id.value;
  const fd = new FormData(updateForm);

  const res = await fetch(`https://dealinee.onrender.com/api/admin/properties/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: fd
  });

  const data = await res.json();
  if (res.ok) {
    alert("✅ Updated Successfully");
    updateModal.classList.add("hidden");
    loadProperties();
  } else {
    alert(data.message);
  }
});

// ✅ Load properties on start
document.addEventListener("DOMContentLoaded", loadProperties);
