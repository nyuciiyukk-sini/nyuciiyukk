// 1. Inisialisasi Kredensial Supabase Project Nyuci Yuk
const SUPABASE_URL = 'https://rzqgnoysthpxgfxscruo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6cWdub3lzdGhweGdmeHNjcnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNjMwMjEsImV4cCI6MjEwNzYzOTAyMX0.-6Ces2KK3JBvWBiX-KuN_dyg3NxYzG1nuxg9fhSuir0';

// Inisialisasi Client Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Fungsi Utama untuk Mengambil Data dari Tabel 'laundry'
async function fetchLaundries() {
  const listContainer = document.getElementById('laundry-list');

  try {
    // Ambil semua data dari tabel 'laundry'
    const { data: laundries, error } = await supabase
      .from('laundry')
      .select('*');

    if (error) {
      console.error('Terjadi error saat mengambil data:', error);
      listContainer.innerHTML = `
        <div class="col-span-full text-center text-red-500 py-8">
          <p class="font-bold">Gagal memuat data laundry.</p>
          <p class="text-sm text-gray-500 mt-1">Pastikan RLS Policy di Supabase sudah di-enable untuk Read/SELECT.</p>
        </div>
      `;
      return;
    }

    // Jika data kosong di database
    if (!laundries || laundries.length === 0) {
      listContainer.innerHTML = `
        <div class="col-span-full text-center text-gray-500 py-8">
          <p>Belum ada data laundry yang dimasukkan ke database Supabase.</p>
        </div>
      `;
      return;
    }

    // Render / Tampilkan data laundry ke bentuk HTML
    listContainer.innerHTML = laundries.map(item => `
      <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col justify-between">
        <div>
          <!-- Gambar Laundry -->
          <img 
            src="${item.image_url || 'https://via.placeholder.com/400x250?text=Foto+Laundry'}" 
            alt="${item.name}" 
            class="w-full h-48 object-cover"
          />

          <div class="p-5">
            <!-- Nama & Rating -->
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-lg text-gray-900">${item.name || 'Nama Laundry'}</h3>
              ${item.rating ? `
                <span class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                  ⭐ ${item.rating} (${item.reviews_count || 0})
                </span>
              ` : ''}
            </div>

            <!-- Alamat & Harga -->
            <p class="text-sm text-gray-600 mb-3">${item.address || 'Alamat tidak tersedia'}</p>
            <p class="text-blue-600 font-bold text-sm mb-3">
              ${item.price ? `Rp ${item.price.toLocaleString('id-ID')} / kg` : 'Harga bervariasi'}
            </p>

            <!-- Layanan -->
            ${item.services ? `
              <div class="mb-4">
                <span class="inline-block bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                  🛠️ ${item.services}
                </span>
              </div>
            ` : ''}

            <!-- Kata-kata Review -->
            ${item.review_text ? `
              <div class="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500 mb-4 text-xs text-gray-600 italic">
                "${item.review_text}"
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Tombol Aksi (WA, Maps, IG, Web) -->
        <div class="p-5 pt-0 border-t border-gray-50 mt-auto flex flex-col gap-2">
          ${item.phone ? `
            <a 
              href="https://wa.me/${item.phone}" 
              target="_blank" 
              class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg text-center text-sm transition-colors flex items-center justify-center gap-2"
            >
              💬 Hubungi via WhatsApp
            </a>
          ` : ''}

          <div class="flex gap-2 text-xs">
            ${item.maps_url ? `
              <a href="${item.maps_url}" target="_blank" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded text-center font-medium">
                📍 Google Maps
              </a>
            ` : ''}
            ${item.instagram_url ? `
              <a href="${item.instagram_url}" target="_blank" class="flex-1 bg-pink-50 hover:bg-pink-100 text-pink-700 py-1.5 rounded text-center font-medium">
                📷 Instagram
              </a>
            ` : ''}
            ${item.website_url ? `
              <a href="${item.website_url}" target="_blank" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded text-center font-medium">
                🌐 Website
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error('Error tidak terduga:', err);
  }
}

// Jalankan fungsi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', fetchLaundries);
