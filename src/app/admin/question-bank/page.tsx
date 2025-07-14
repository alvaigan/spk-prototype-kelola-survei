'use client';

import { useState, useRef } from 'react';
import { useQuestionBankStore, QuestionBankItem } from '@/store/questionBankStore';
import { QuestionType } from '@/types/question';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  DocumentArrowUpIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

const questionTypeLabels: Record<QuestionType, string> = {
  'short_answer': 'Jawaban Singkat',
  'paragraph': 'Paragraf',
  'multiple_choice': 'Pilihan Ganda',
  'checkbox': 'Kotak Centang',
  'dropdown': 'Dropdown'
};

export default function QuestionBankPage() {
  const {
    questions,
    isLoading,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    importQuestions,
    setLoading,
    searchQuestions
  } = useQuestionBankStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionBankItem | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    questionType: 'short_answer' as QuestionType
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter questions based on search and type
  const filteredQuestions = () => {
    let result = searchQuery ? searchQuestions(searchQuery) : questions;
    if (selectedType !== 'all') {
      result = result.filter(q => q.questionType === selectedType);
    }
    return result;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim()) return;

    if (editingQuestion) {
      updateQuestion(editingQuestion.id, formData);
      setEditingQuestion(null);
    } else {
      addQuestion(formData);
    }

    setFormData({ question: '', questionType: 'short_answer' });
    setShowAddForm(false);
  };

  const handleEdit = (question: QuestionBankItem) => {
    setFormData({
      question: question.question,
      questionType: question.questionType
    });
    setEditingQuestion(question);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) {
      deleteQuestion(id);
    }
  };

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip header row and process data
        const questionsData = jsonData.slice(1).map((row) => {
          const rowArray = row as unknown[];
          return {
            question: (rowArray[0] as string) || '',
            questionType: ((rowArray[1] as string) || 'short_answer') as QuestionType
          };
        }).filter(item => item.question.trim());

        if (questionsData.length > 0) {
          importQuestions(questionsData);
          alert(`Berhasil mengimpor ${questionsData.length} pertanyaan`);
        } else {
          alert('Tidak ada data yang valid untuk diimpor');
        }
      } catch (error) {
        console.error('Error importing Excel file:', error);
        alert('Terjadi kesalahan saat mengimpor file Excel');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsBinaryString(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportTemplate = () => {
    const templateData = [
      ['Question', 'Question Type'],
      ['Contoh pertanyaan 1', 'short_answer'],
      ['Contoh pertanyaan 2', 'multiple_choice'],
      ['Contoh pertanyaan 3', 'paragraph']
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'template_bank_soal.xlsx');
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingQuestion(null);
    setFormData({ question: '', questionType: 'short_answer' });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bank Soal</h1>
          <p className="text-gray-600 mt-1">Kelola koleksi pertanyaan survei</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportTemplate}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
            Download Template
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Tambah Pertanyaan
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {editingQuestion ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
          </h2>
          <form onSubmit={handleSubmitForm} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pertanyaan
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Masukkan pertanyaan..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Pertanyaan
              </label>
              <select
                value={formData.questionType}
                onChange={(e) => setFormData({ ...formData, questionType: e.target.value as QuestionType })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {Object.entries(questionTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
              >
                {editingQuestion ? 'Update' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative min-w-0">
              <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as QuestionType | 'all')}
                className="w-full sm:w-auto pl-10 pr-8 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="all">Semua Tipe</option>
                {Object.entries(questionTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleExcelImport}
                accept=".xlsx,.xls"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                Import Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Daftar Pertanyaan ({filteredQuestions().length})
          </h2>
        </div>
        
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Memuat data...
          </div>
        ) : filteredQuestions().length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-gray-400 mb-4">
              {searchQuery || selectedType !== 'all' ? (
                <div>
                  <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-4" />
                  <p>Tidak ada pertanyaan yang sesuai dengan filter</p>
                </div>
              ) : (
                <div>
                  <QuestionMarkCircleIcon className="h-12 w-12 mx-auto mb-4" />
                  <p>Belum ada pertanyaan. Tambahkan pertanyaan pertama Anda!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pertanyaan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Tipe
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Dibuat
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuestions().map((question) => (
                  <tr key={question.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md break-words">
                        {question.question}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {questionTypeLabels[question.questionType]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(question.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(question)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(question.id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1"
                          title="Hapus"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </AdminLayout>
  );
} 