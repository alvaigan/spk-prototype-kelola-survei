'use client'

import Link from 'next/link';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <DocumentTextIcon className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Serikat Pekerja Kampus</h1>
          <p className="text-blue-100 mt-2">Survey Management System</p>
        </div>

        {/* Login Form */}
        <div className="p-6">
          <div className="text-center mb-6">
            <DocumentTextIcon className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Masuk ke akun Anda</h2>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat email
              </label>
              <input
                type="email"
                placeholder="john@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kata sandi
              </label>
              <input
                type="password"
                placeholder="Masukkan Kata Sandi"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Lupa kata sandi Anda?
              </a>
            </div>

            <Link 
              href="/admin"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Masuk
            </Link>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 text-white p-6">
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Survei Serikat Pekerja Kampus
              </h3>
              <p className="text-gray-300 text-xs">
                Wujudkan Aksi Kolektif yang Lebih Kuat dengan Wawasan Berbasis Data
              </p>
              <div className="flex space-x-3 mt-2">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017 0z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Quick Links</h4>
              <div className="space-y-1 text-xs">
                <a href="#" className="block text-gray-300 hover:text-white">Home</a>
                <a href="#" className="block text-gray-300 hover:text-white">Login</a>
                <a href="#" className="block text-gray-300 hover:text-white">Register</a>
              </div>
              
              <h4 className="font-semibold mt-4 mb-2">Contact Us</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <p>📍 Jl. D No.21, RT.3/RW.2, Tegal Parang, Kec. Mampang Prpt., Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12790</p>
                <p>📞 (555) 123-4567</p>
                <p>✉️ info@mail.org</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-400">
            © 2025 Survei Serikat Pekerja Kampus • All rights reserved.
            <br />
            Version dev.7c77579
          </div>
        </div>
      </div>
    </div>
  );
}
