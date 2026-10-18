// ==========================================
// 1. KONFIGURASI SUPABASE
// ==========================================
const SUPABASE_URL = "https://ewilxrrjccapugcoprxj.supabase.co";
const SUPABASE_KEY = "sb_publishable_sIfwCQypUhThcwTO9DhfHQ_pO5p7dE_";

// Inisialisasi Supabase Client
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Data Cadangan Lokal (Pengaman jika koneksi Supabase bermasalah)
const localFallbackData = [
  {
    id: 1,
    nama: "Barokah Laundry",
    wilayah: "Semarang Barat",
    harga: "Rp 6.000/kg",
    is_express: true,
    no_wa: "6281234567890",
    link_maps: "https://maps.google.com",
    link_ig: "https://instagram.com",
    foto_url: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60"
  },
  {
    id: 2,
    nama: "Kilat Express Laundry",
    wilayah: "Semarang Tengah",
    harga: "Rp 8.000/kg",
    is_express: true,
    no_wa: "6289876543210",
    link_maps: "https://maps.google.com",
    link_ig: "",
    foto_url: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f"
  },
  {
    id: 3,
    nama: "Laundry Kos Murah",
    wilayah: "Semarang Barat",
    harga: "Rp 5.000/kg",
    is_express: false,
    no_wa: "6281122334455",
    link_maps: "https://maps.google.com",
    link_ig: "",
    foto_url: "https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5"
  }
];

let cachedLaundries = [];

// ==========================================
// 2. AMBIL DATA LAUNDRY DARI SUPABASE / LOCAL
// ==========================================
async function fetchLaundries(wilayahFilter = "all", searchQuery = "") {
  const container = document.getElementById("laundry-list");
  if (!container) return;

  // Jika belum ada data tersimpan, tampilkan status memuat
  if (cachedLaundries.length === 0) {
    container.innerHTML =
      '<div class="col-span-full text-center py-10 text-gray-500 font-medium"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Memuat data laundry...</div>';
  }

  let data = [];

  try {
    if (supabase) {
      let query = supabase.from("Laundry").select("*");

      if (wilayahFilter !== "all") {
        query = query.eq("wilayah", wilayahFilter);
      }

      const { data: dbData, error } = await query;

      if (!error && dbData && dbData.length > 0) {
        data = dbData;
      } else {
        data = filterLocalData(localFallbackData, wilayahFilter);
      }
    } else {
      data = filterLocalData(localFallbackData, wilayahFilter);
    }
  } catch (err) {
    console.warn("Koneksi Supabase terganggu, menampilkan data cadangan:", err);
    data = filterLocalData(localFallbackData, wilayahFilter);
  }

  // Simpan ke cache lokal
  cachedLaundries = data;

  // Filter Pencarian (Nama / Wilayah)
  let filteredData = data || [];
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filteredData = filteredData.filter(
      (item) =>
        (item.nama && item.nama.toLowerCase().includes(q)) ||
        (item.wilayah && item.wilayah.toLowerCase().includes(q))
    );
  }

  renderCards(filteredData);
}

// Helper Filter Data Lokal
function filterLocalData(list, wilayah) {
  if (wilayah === "all") return list;
  return list.filter((item) => item.wilayah === wilayah);
}

// ==========================================
// 3. TAMPILKAN KARTU LAUNDRY KE HTML
// ==========================================
function renderCards(laundries) {
  const container = document.getElementById("laundry-list");
  if (!container) return;

  container.innerHTML = "";

  if (!laundries || laundries.length === 0) {
    container.innerHTML =
      '<div class="col-span-full text-center py-10 text-gray-500 font-medium">Tidak ada laundry yang ditemukan.</div>';
    return;
  }

  laundries.forEach((item) => {
    // Format Pesan WhatsApp Otomatis
    const noWa = item.no_wa || "6281234567890";
    const namaLaundry = item.nama || "Laundry";
    const pesanWA = encodeURIComponent(
      `Halo ${namaLaundry}, saya mau tanya/order layanan cuci laundry via Nyuci Yuk.`
    );
    const urlWA = `https://wa.me/${noWa}?text=${pesanWA}`;

    const card = `
      <div class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col justify-between hover:shadow-lg transition">
        <div>
          <div class="relative">
            <img src="${item.foto_url || "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60"}" 
                 alt="${namaLaundry}" class="w-full h-48 object-cover">
            ${
              item.is_express
                ? '<span class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Express 🔥</span>'
                : ""
            }
          </div>
          
          <div class="p-4">
            <span class="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">${
              item.wilayah || "Semarang"
            }</span>
            <h3 class="text-lg font-bold text-gray-800 mt-2">${namaLaundry}</h3>
            <p class="text-sm text-gray-600 font-medium mt-1">💰 ${
              item.harga || "Harga disesuaikan"
            }</p>
          </div>
        </div>

        <div class="p-4 pt-0 space-y-2">
          <a href="${urlWA}" target="_blank" 
             class="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold text-center text-sm rounded-xl block shadow transition">
             💬 Chat WhatsApp
          </a>
          
          <div class="flex gap-2">
            ${
              item.link_maps
                ? `<a href="${item.link_maps}" target="_blank" 
                     class="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-center text-xs rounded-xl block transition">
                     📍 Maps
                  </a>`
                : ""
            }
            
            ${
              item.link_ig
                ? `<a href="${item.link_ig}" target="_blank" 
                     class="flex-1 py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 font-medium text-center text-xs rounded-xl block transition">
                     📸 Instagram
                  </a>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

// ==========================================
// 4. EVENT LISTENER (FILTER & SEARCH)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  fetchLaundries();

  // Event Filter Wilayah
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach((b) =>
        b.classList.remove("bg-blue-600", "text-white")
      );
      filterButtons.forEach((b) =>
        b.classList.add("bg-gray-200", "text-gray-700")
      );

      e.target.classList.remove("bg-gray-200", "text-gray-700");
      e.target.classList.add("bg-blue-600", "text-white");

      const wilayah = e.target.getAttribute("data-wilayah") || "all";
      fetchLaundries(wilayah);
    });
  });

  // Event Search Input
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      fetchLaundries("all", e.target.value);
    });
  }
});
