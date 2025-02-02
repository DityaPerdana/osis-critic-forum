import React from "react";
import Navbar from "../layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";

const ekstrakurikulerList = [
  {
    name: "Bahasa Jepang",
    description:
    "Kegiatan ekstrakurikuler yang mempelajari bahasa dan budaya Jepang, termasuk percakapan dasar, penulisan huruf kana, dan pengenalan budaya",
    schedule: "Sabtu, 10:00 - 12:00",
    image:
      "/japan.webp",
  },
  {
    name: "Bahasa Jerman",
    description:
    "Kegiatan ekstrakurikuler yang fokus pada pembelajaran bahasa Jerman, meliputi tata bahasa dasar, percakapan sehari-hari, dan pengenalan budaya Jerman",
    schedule: "",
    image:
      "hitler.webp",
  },
];

const EkstrakurikulerPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-auto">
      <Navbar />
      <div className="pt-16">
        <div className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Ekstrakurikuler</h1>
            <p className="text-xl text-blue-100">
              Mengembangkan Bakat dan Minat Siswa SMKN 4 Payakumbuh
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ekstrakurikulerList.map((ekskul) => (
              <Card
                key={ekskul.name}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${ekskul.image})` }}
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{ekskul.name}</h3>
                  <p className="text-gray-600 mb-4">{ekskul.description}</p>
                  <div className="text-sm text-gray-500">
                    <strong>Jadwal:</strong> {ekskul.schedule}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">
              Pendaftaran Ekstrakurikuler
            </h2>
            <p className="text-gray-600 mb-4">
              Untuk bergabung dengan kegiatan ekstrakurikuler, silakan hubungi
              pembina masing-masing atau kunjungi ruang OSIS pada jam istirahat.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Persyaratan Umum:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Siswa aktif SMKN 4 Payakumbuh</li>
                <li>Memiliki minat dan komitmen</li>
                <li>Mengisi formulir pendaftaran</li>
                <li>Mendapat izin dari orang tua</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EkstrakurikulerPage;
