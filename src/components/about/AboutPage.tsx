import React from "react";
import Navbar from "../layout/Navbar";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-auto">
      <Navbar />
      <div className="pt-16">
        <div className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">
              Tentang OSIS SMKN 4 Payakumbuh
            </h1>
            <p className="text-xl text-blue-100">
              Membangun Generasi Unggul dan Berkarakter
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4">Visi</h2>
              <p className="text-gray-600">
                Menjadikan OSIS sebagai organisasi yang memimpin perubahan,
                tempat setiap siswa bisa berkembang tanpa batasan, dan membangun
                sekolah yang lebih seru, kreatif, dan penuh prestasi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Misi</h2>
              <ul className="list-inside space-y-2 text-gray-600">
                <li>
                  Menjadi jembatan nyata antara siswa dan pihak sekolah, dengan
                  mendengarkan dan mewujudkan aspirasi dari berbagai sisi.
                </li>
                <li>Membuat komunikasi di OSIS lebih terbuka dan transparan</li>
                <li>
                  Melibatkan teknologi untuk mempermudah dan mempercepat
                  penyebaran informasi, serta menciptakan kegiatan yang lebih
                  modern dan efisien.
                </li>
                <li>Menghadirkan kegiatan yang kolaboratif dan bermanfaat</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Struktur Organisasi</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold">Pembina OSIS</h3>
                    <p className="text-gray-600">Debby Marisha.spd</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold">Ketua OSIS</h3>
                    <p className="text-gray-600">Habib Herdiansyah</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold">Ketua MPK</h3>
                    <p className="text-gray-600">Aidil Pratama</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold">Wakil Ketua</h3>
                      <p className="text-gray-600">Dani Alfayet Rodes</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold">Sekretaris</h3>
                      <p className="text-gray-600">Diva Rahmadani</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                Program Kerja Unggulan
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Forum Diskusi</h3>
                  <p className="text-gray-600">
                    Membuat forum diskusi dengan mengajak perwakilan kelas untuk
                    ikut rapat dengan osis membahas perancangan
                    ekstrakurikuler/fasilitas lainnya sehingga osis menjadi
                    lebih dekat dengan para murid
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Saluran Pemberitahuan</h3>
                  <p className="text-gray-600">
                    Membuat Channel/Media Komunikasi Untuk Memberitahukan
                    Informasi Rambut Sehingga Tidak Terjadi Pencolakan Mendadak.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Event Proyek</h3>
                  <p className="text-gray-600">
                    Mengadakan Event Project Reward Di Akhir Semester
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">podcast</h3>
                  <p className="text-gray-600">
                    Membuat program podcast dengan mengundang narasumber dari
                    tokoh-tokoh berhasil di kota payakumbuh atau alumni dari SMK
                    4
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">
                    program osis berkembang
                  </h3>
                  <p className="text-gray-600">
                    Membuat Program OSIS Berkembang yang dimana siswa memberikan
                    kritik dan saran melalui sebuah form online
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
