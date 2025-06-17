import AdminLayout from '@/components/layout/AdminLayout';

export default function UsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola User</h1>
          <p className="text-gray-600 mt-1">Kelola pengguna dan hak akses sistem</p>
        </div>
        
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-500">Halaman Kelola User akan segera hadir.</p>
        </div>
      </div>
    </AdminLayout>
  );
} 