'use client';

import { useState, useRef, useCallback, ChangeEvent } from 'react';
import Image from "next/image";
import Link from "next/link";

type DiseasePrediction = {
  prediction: string;
  description: string;
};

const DISEASE_DESCRIPTIONS = {
  "BacterialBlight": "Penyakit akibat bakteri yang menyebabkan bercak air dan layu.",
  "Blast": "Penyakit jamur yang menyerang leher malai dan daun.",
  "Brownspot": "Terdapat bercak coklat bulat di permukaan daun.",
  "Healthy": "Tanaman padi dalam kondisi sehat tanpa gejala penyakit.",
  "Leaf_Scald": "Daun mengering dari ujung dan terbakar karena patogen atau cuaca ekstrem.",
  "Tungro": "Penyakit virus yang membuat daun menguning dan pertumbuhan terhambat.",
};

export default function DiagnosaPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiseasePrediction | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      alert('Hanya file gambar yang diizinkan');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    // Display preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload and classify
    try {
      setIsLoading(true);
      setResult(null);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/classify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal mengklasifikasikan gambar');
      }

      const data = await response.json();
      setResult({
        prediction: data.prediction,
        description: DISEASE_DESCRIPTIONS[data.prediction as keyof typeof DISEASE_DESCRIPTIONS] || data.description
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat memproses gambar');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleExampleClick = (exampleNumber: number) => {
    // Simulate file selection for example images
    fetch(`/example_${exampleNumber}.jpg`)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `example_${exampleNumber}.jpg`, { type: 'image/jpeg' });
        handleFileChange(file);
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <header className="px-8 md:px-20 lg:px-32 mb-8">
        <Link href="/">
          <h1 className="text-3xl font-bold text-green-400">AgroLens</h1>
        </Link>
      </header>
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-center">Upload Gambar untuk Diagnosa</h1>
        
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-green-500 bg-gray-700' : 'border-gray-600'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileInputChange}
            />
            <div className="flex flex-col items-center justify-center space-y-4">
              <svg 
                className={`w-12 h-12 ${isDragging ? 'text-green-500' : 'text-gray-400'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
              <div>
                <p className="text-gray-300 font-medium">
                  {isDragging ? 'Lepaskan gambar di sini' : 'Seret dan lepas gambar di sini'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  atau klik untuk memilih file (JPG, PNG, atau JPEG, maks. 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Preview and Result Section */}
          {(selectedImage || isLoading || result) && (
            <div className="mt-8 bg-gray-700 p-6 rounded-lg">
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image Preview */}
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                    {selectedImage && (
                      <Image
                        src={selectedImage}
                        alt="Gambar yang diupload"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Result */}
                <div className="w-full md:w-1/2">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  ) : result ? (
                    <div className="space-y-4">
                      <div>
                      <h2 className="text-xl font-semibold mb-4">Hasil Diagnosa</h2>
                        <p className="text-2xl font-bold text-green-400 capitalize">
                          {result.prediction.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Deskripsi</h3>
                        <p className="text-gray-300">{result.description}</p>
                      </div>
                      <button 
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                        onClick={() => {
                          setSelectedImage(null);
                          setResult(null);
                        }}
                      >
                        Coba Lagi
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Example Images */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Contoh Gambar</h2>
          <p className="text-gray-400 mb-4">Klik pada gambar di bawah untuk mencoba dengan contoh:</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                className="cursor-pointer hover:opacity-90 transition-opacity group"
                onClick={() => handleExampleClick(item)}
              >
                <div className="relative aspect-[4/3] bg-gray-700 rounded-lg overflow-hidden">
                  <Image 
                    src={`/example_${item}.jpg`}
                    alt={`Contoh ${item}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
