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
                Mewujudkan organisasi siswa yang unggul, kreatif, dan
                berkarakter untuk membangun generasi pemimpin masa depan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Misi</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>
                  Mengembangkan potensi kepemimpinan siswa melalui kegiatan
                  organisasi
                </li>
                <li>
                  Meningkatkan kreativitas dan inovasi dalam setiap program
                  kerja
                </li>
                <li>
                  Membangun karakter siswa yang berakhlak mulia dan bertanggung
                  jawab
                </li>
                <li>
                  Menjalin kerjasama yang baik antara siswa, guru, dan sekolah
                </li>
                <li>Mendukung kegiatan akademik dan non-akademik sekolah</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Struktur Organisasi</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold">Pembina OSIS</h3>
                    <p className="text-gray-600">Drs. Ahmad Syafii</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold">Ketua OSIS</h3>
                    <p className="text-gray-600">Muhammad Rizky</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold">Wakil Ketua</h3>
                      <p className="text-gray-600">Siti Nurhaliza</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold">Sekretaris</h3>
                      <p className="text-gray-600">Putri Ramadhani</p>
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
                  <h3 className="font-semibold mb-2">Leadership Camp</h3>
                  <p className="text-gray-600">
                    Program pelatihan kepemimpinan intensif untuk pengurus OSIS
                    dan siswa terpilih.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Gerakan Literasi</h3>
                  <p className="text-gray-600">
                    Program membaca dan menulis untuk meningkatkan minat
                    literasi siswa.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Green School</h3>
                  <p className="text-gray-600">
                    Program peduli lingkungan dan penghijauan sekolah.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Social Project</h3>
                  <p className="text-gray-600">
                    Program bakti sosial dan pengabdian masyarakat.
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
