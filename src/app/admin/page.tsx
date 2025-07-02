import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';

export default function AdminDashboard() {
  // Mock data for more realistic statistics
  const currentDate = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
          <p className="text-gray-600 mt-2">Selamat datang di CWU Survey Admin - {currentDate}</p>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Survei</p>
                <p className="text-3xl font-bold">12</p>
                <p className="text-blue-100 text-xs mt-1">+2 minggu ini</p>
              </div>
              <div className="p-3 bg-blue-400 bg-opacity-30 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Respons Dikirim</p>
                <p className="text-3xl font-bold">1,049</p>
                <p className="text-green-100 text-xs mt-1">+127 minggu ini</p>
              </div>
              <div className="p-3 bg-green-400 bg-opacity-30 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Responden</p>
                <p className="text-3xl font-bold">1,247</p>
                <p className="text-purple-100 text-xs mt-1">+89 hari ini</p>
              </div>
              <div className="p-3 bg-purple-400 bg-opacity-30 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Respons Belum Dikirim</p>
                <p className="text-3xl font-bold">198</p>
                <p className="text-orange-100 text-xs mt-1">↘ -23 dari minggu lalu</p>
              </div>
              <div className="p-3 bg-orange-400 bg-opacity-30 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Survey Status & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Survey Status Breakdown */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Survei</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Aktif</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">8</p>
                  <p className="text-xs text-gray-500">66.7%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Nonaktif</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">4</p>
                  <p className="text-xs text-gray-500">33.3%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Draft</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">3</p>
                  <p className="text-xs text-gray-500">25%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Verification Status */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Verifikasi</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Pending Verifikasi</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">23</p>
                  <p className="text-xs text-gray-500">Perlu ditinjau</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Terverifikasi</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">156</p>
                  <p className="text-xs text-gray-500">87.2% verified</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                href="/admin/respondents" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Lihat semua responses →
              </Link>
            </div>
          </div>

          {/* Recent Responses */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Terbaru</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Response dari John Doe</p>
                  <p className="text-xs text-gray-500">2 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Response dari Alice Brown</p>
                  <p className="text-xs text-gray-500">4 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Response dari Bob Johnson</p>
                  <p className="text-xs text-gray-500">1 hari yang lalu</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Surveys */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Survei Terpopuler</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Survei Kepuasan Pelanggan 2024</p>
                  <p className="text-sm text-gray-600">324 respons • 92% completion rate</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">324</p>
                  <p className="text-xs text-gray-500">respons</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Evaluasi Layanan Akademik</p>
                  <p className="text-sm text-gray-600">267 respons • 88% completion rate</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">267</p>
                  <p className="text-xs text-gray-500">respons</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Feedback Program Mahasiswa</p>
                  <p className="text-sm text-gray-600">189 respons • 76% completion rate</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">189</p>
                  <p className="text-xs text-gray-500">respons</p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Trends (Mock Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tren Respons (7 Hari Terakhir)</h3>
            <div className="space-y-2">
              {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, index) => {
                const responses = [45, 67, 23, 89, 56, 34, 78][index];
                const maxWidth = Math.max(45, 67, 23, 89, 56, 34, 78);
                const widthPercentage = (responses / maxWidth) * 100;
                
                return (
                  <div key={day} className="flex items-center space-x-3">
                    <div className="w-8 text-sm text-gray-600 font-medium">{day}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${widthPercentage}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-sm text-gray-900 font-semibold text-right">{responses}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              <span>Total: 392 respons minggu ini</span>
              <span>Rata-rata: 56 respons/hari</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/surveys"
              className="group p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 block"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-700">Kelola Survei</h3>
                  <p className="text-sm text-gray-600">Buat dan kelola survei</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/respondents"
              className="group p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 block"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 group-hover:bg-green-200 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-green-700">Verifikasi Respons</h3>
                  <p className="text-sm text-gray-600">Tinjau & verifikasi</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/users"
              className="group p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 block"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-purple-700">Kelola User</h3>
                  <p className="text-sm text-gray-600">Management pengguna</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/references"
              className="group p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 block"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 group-hover:bg-orange-200 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-orange-700">Data Referensi</h3>
                  <p className="text-sm text-gray-600">Master data sistem</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 