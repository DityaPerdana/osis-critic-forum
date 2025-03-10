import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../layout/Navbar";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white overflow-auto">
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white dark:text-white">
        <div className="container mx-auto px-4 pt-20 pb-12 sm:py-24">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              OSIS SMKN 4 Payakumbuh
            </h1>
            <p className="text-base sm:text-xl md:text-2xl mb-2 sm:mb-4 text-blue-100">
              Organisasi Siswa Intra Sekolah yang mewadahi kreativitas dan
              kepemimpinan siswa-siswi SMKN 4 Payakumbuh
            </p>
          </div>
        </div>
        <div className="absolute inset-0 z-0" />
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tentang OSIS</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kepemimpinan</h3>
              <p className="text-gray-600">
                Mengembangkan jiwa kepemimpinan dan kemampuan berorganisasi
                siswa melalui berbagai kegiatan.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prestasi</h3>
              <p className="text-gray-600">
                Mendorong siswa untuk berprestasi dan aktif dalam kegiatan
                akademik maupun non-akademik.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Program Kerja</h3>
              <p className="text-gray-600">
                Menyelenggarakan berbagai kegiatan yang bermanfaat untuk
                pengembangan diri siswa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bergabung dalam Diskusi OSIS
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sampaikan ide, kritik, dan saranmu untuk kemajuan OSIS dan sekolah
            kita.
          </p>
          <Link to="/forum">
            <Button
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Masuk ke Forum
            </Button>
          </Link>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Galeri Kegiatan OSIS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
              <img
                src="/isra.webp"
                alt="Kegiatan 1"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
              <img
                src="digital.webp"
                alt="Kegiatan 2"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">OSIS SMKN 4 Payakumbuh</h3>
              <p className="text-gray-400">
                Jl. Koto Kaciak, Padang Sikabu <br />
                Kec. Lamposi Tigo Nagori <br />
                Kota Payakumbuh, Sumatera Barat
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Kontak</h3>
              <p className="text-gray-400">
                Email: expduta@gmail.com <br />
                Instagram: @osismpk_bluetech
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © {new Date().getFullYear()} OSIS SMKN 4 Payakumbuh. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
