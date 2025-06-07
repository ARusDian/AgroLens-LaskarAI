import Image from "next/image";
import Link from "next/link";

export default function ClassifyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header>
          <Link href="/">
          <h1 className="text-3xl font-bold text-green-400">AgroLens</h1>
          </Link>
        </header>
        <div className="flex flex-col justify-center mt-10">
          <h2 className="text-3xl font-bold mb-8 text-center">Upload Gambar untuk Diagnosa</h2>
          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-gray-300 mb-2">Seret dan lepas gambar di sini atau klik untuk memilih file</p>
              <p className="text-sm text-gray-500 mb-4">Format yang didukung: JPG, PNG, atau JPEG (maks. 5MB)</p>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md">
                Pilih Gambar
              </button>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Atau gunakan contoh gambar:</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="cursor-pointer hover:opacity-90 transition-opacity">
                      <div className="relative h-32 bg-gray-700 rounded-lg overflow-hidden">
                        <Image 
                          src={`/example_${item}.jpg`}
                          alt={`Contoh ${item}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
