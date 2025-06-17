import AdminLayout from '@/components/layout/AdminLayout';

export default function ProfilePage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
          <p className="text-gray-600 mt-1">Kelola profil dan pengaturan akun Anda</p>
        </div>
        
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-500">Halaman Profil akan segera hadir.</p>
        </div>
      </div>
    </AdminLayout>
  );
} 