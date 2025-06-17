'use client'

import AdminLayout from '@/components/layout/AdminLayout';
import SurveyTable from '@/components/survey/SurveyTable';
import CreateSurveyModal from '@/components/modals/CreateSurveyModal';
import { useSurveyStore } from '@/store/surveyStore';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SurveysPage() {
  const { 
    isCreateModalOpen, 
    setCreateModalOpen, 
    searchTerm, 
    setSearchTerm, 
    statusFilter, 
    setStatusFilter 
  } = useSurveyStore();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Survei</h1>
            <p className="text-gray-600 mt-1">Kelola dan pantau semua survei Anda</p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Tambah Survei</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari Survei..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'Aktif' | 'Nonaktif')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Survey Table */}
        <SurveyTable />

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 rounded-lg shadow">
          <div className="flex-1 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Tampil</span>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm text-gray-700">per halaman</span>
            </div>
            <div className="text-sm text-gray-700">
              Total: 5 Survei
            </div>
            <div className="flex items-center space-x-2">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  1
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Create Survey Modal */}
      <CreateSurveyModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
      />
    </AdminLayout>
  );
} 