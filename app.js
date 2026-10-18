const SUPABASE_URL = 'https://rzqgnoysthpxgfxscruo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6cWdub3lzdGhweGdmeHNjcnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNjMwMjEsImV4cCI6MjEwNzYzOTAyMX0.-6Ces2KK3JBvWBiX-KuN_dyg3NxYzG1nuxg9fhSuir0';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allLaundries = [];

async function fetchLaundries() {
  const listContainer = document.getElementById('laundry-list');

  try {
    const { data, error } = await supabase.from('laundry').select('*');

    if (error) {
      console.error('Error fetching data:', error);
      listContainer.innerHTML = `
        <div class="col-span-full text-center text-red-500 py-8">
          <p class="font-bold">Gagal memuat data laundry.</p>
          <p class="text-sm mt-1">Pastikan RLS Policy di Supabase sudah di-enable (Read / SELECT access for everyone).</p>
        </div>
      `;
      return;
    }

    allLaundries = data || [];
    renderLaundries(allLaundries);

  } catch (err) {
    console.error('Error:', err);
  }
}

function renderLaundries(data) {
  const listContainer = document.getElementById('laundry-list');

  if (!data || data.length === 0) {
    listContainer.innerHTML = `
      <div class="col-span-full text-center text-gray-500 py-10">
        <i class="fa-solid fa-box-open text-3xl mb-2 text-gray-400"></i>
        <p>Tidak ada data laundry yang ditemukan.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = data.map(item => `
    <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden flex flex-col justify-between">
      <div>
        <div class="relative">
          <img 
            src="${item.image_url || 'https://via.placeholder.com/400x250?text=Foto+Laundry'}" 
            alt="${item.name}" 
            class="w-full h-48 object-cover"
          />
          ${item.rating ? `
            <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm flex items-center gap-1">
              ⭐ ${item.rating} <span class="text-gray-400 font-normal">(${item.reviews_count || 0})</span>
            </div>
          ` : ''}
        </div>

        <div class="p-5">
          <h3 class="font-bold text-lg text-gray-800 mb-1">${item.name || 'Nama Laundry'}</h3>
          <p class="text-xs text-gray-500 mb-3 flex items-center gap-1">
            <i class="fa-solid fa-location-dot text-red-500"></i> ${item.address || 'Semarang'}
          </p>

          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md">
              🛠️ ${item.services || 'Kiloan & Express'}
            </span>
            <span class="text-sm font-bold text-green-600">
              ${item.price ? `Rp ${item.price.toLocaleString('id-ID')}/kg` : ''}
            </span>
          </div>

          ${item.review_text ? `
            <div class="bg-gray-50 p-3 rounded-xl text-xs text-gray-600 italic border-l-2 border-blue-500 mb-3">
              "${item.review_text}"
            </div>
          ` : ''}
        </div>
      </div>

      <div class="p-5 pt-0 flex flex-col gap-2">
        ${item.phone ? `
          <a 
            href="https://wa.me/${item.phone}" 
            target="_blank" 
            class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-center text-sm transition flex items-center justify-center gap-2 shadow-sm"
          >
            <i class="fa-brands fa-whatsapp text-lg"></i> Chat WhatsApp
          </a>
        ` : ''}

        <div class="flex gap-2 text-xs">
          ${item.maps_url ? `
            <a href="${item.maps_url}" target="_blank" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-center font-medium transition">
              📍 Maps
            </a>
          ` : ''}
          ${item.instagram_url ? `
            <a href="${item.instagram_url}" target="_blank" class="flex-1 bg-pink-50 hover:bg-pink-100 text-pink-600 py-2 rounded-lg text-center font-medium transition">
              📷 Instagram
            </a>
          ` : ''}
          ${item.website_url ? `
            <a href="${item.website_url}" target="_blank" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-center font-medium transition">
              🌐 Website
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// FITUR SEARCH & FILTER
document.addEventListener('DOMContentLoaded', () => {
  fetchLaundries();

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase();
      const filtered = allLaundries.filter(item => 
        (item.name && item.name.toLowerCase().includes(keyword)) ||
        (item.address && item.address.toLowerCase().includes(keyword)) ||
        (item.services && item.services.toLowerCase().includes(keyword))
      );
      renderLaundries(filtered);
    });
  }

  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow');
        b.classList.add('bg-gray-200', 'text-gray-700');
      });
      btn.classList.remove('bg-gray-200', 'text-gray-700');
      btn.classList.add('bg-blue-600', 'text-white', 'shadow');

      const wilayah = btn.getAttribute('data-wilayah');
      if (wilayah === 'all') {
        renderLaundries(allLaundries);
      } else {
        const filtered = allLaundries.filter(item => 
          item.address && item.address.toLowerCase().includes(wilayah.toLowerCase())
        );
        renderLaundries(filtered);
      }
    });
  });
});
