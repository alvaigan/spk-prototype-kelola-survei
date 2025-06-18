'use client'

import { useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useSurveyStore } from '@/store/surveyStore';
import { InstrumentLevel } from '@/types/survey';

interface CreateSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSurveyModal({ isOpen, onClose }: CreateSurveyModalProps) {
  const { createSurvey } = useSurveyStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: false
  });
  const [instrumentStructure, setInstrumentStructure] = useState<InstrumentLevel[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [collapsedItems, setCollapsedItems] = useState<Set<string>>(new Set());

  // Auto-generate codes based on structure
  const generateCode = (level: number, parentCode?: string, siblingIndex: number = 0) => {
    if (level === 1) {
      return `L${String(1001 + siblingIndex).padStart(4, '0')}`;
    } else if (level === 2) {
      return `${parentCode}.${String(201 + siblingIndex).padStart(3, '0')}`;
    } else if (level === 3) {
      return `${parentCode}.${String(301 + siblingIndex).padStart(3, '0')}`;
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Survey title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Please fill out this field.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createSurvey({
      title: formData.title,
      description: formData.description,
      isActive: formData.isActive,
      instrumentStructure
    });

    handleClose();
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', isActive: false });
    setInstrumentStructure([]);
    setErrors({});
    setCollapsedItems(new Set());
    onClose();
  };

  const addInstrumentLevel = (level: 1 | 2 | 3, parentId?: string) => {
    let siblingIndex = 0;
    let parentCode = '';

    if (level === 1) {
      siblingIndex = instrumentStructure.length;
    } else {
      // Find parent and count siblings
      const findParentAndSiblings = (items: InstrumentLevel[]): { parent?: InstrumentLevel, siblings: number } => {
        for (const item of items) {
          if (item.id === parentId) {
            return { parent: item, siblings: item.children.length };
          }
          const result = findParentAndSiblings(item.children);
          if (result.parent) return result;
        }
        return { siblings: 0 };
      };

      const { parent, siblings } = findParentAndSiblings(instrumentStructure);
      if (parent) {
        parentCode = parent.code;
        siblingIndex = siblings;
      }
    }

    const code = generateCode(level, parentCode, siblingIndex);
    const newItem: InstrumentLevel = {
      id: Date.now().toString() + Math.random(),
      code,
      name: '',
      level,
      parentId,
      children: []
    };

    if (level === 1) {
      setInstrumentStructure([...instrumentStructure, newItem]);
    } else {
      // Add as child to parent
              const updateStructure = (items: InstrumentLevel[]): InstrumentLevel[] => {
          return items.map(item => {
            if (item.id === parentId) {
              return {
                ...item,
                children: [...item.children, newItem]
              };
            }
            return {
              ...item,
              children: updateStructure(item.children)
            };
          });
        };
      setInstrumentStructure(updateStructure(instrumentStructure));
    }
  };

  const removeInstrumentLevel = (id: string) => {
    const removeFromStructure = (items: InstrumentLevel[]): InstrumentLevel[] => {
      return items.filter(item => item.id !== id).map(item => ({
        ...item,
        children: removeFromStructure(item.children)
      }));
    };
    setInstrumentStructure(removeFromStructure(instrumentStructure));
    
    // Remove from collapsed items if exists
    const newCollapsed = new Set(collapsedItems);
    newCollapsed.delete(id);
    setCollapsedItems(newCollapsed);
  };

  const updateInstrumentLevel = (id: string, field: 'name', value: string) => {
    const updateStructure = (items: InstrumentLevel[]): InstrumentLevel[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return {
          ...item,
          children: updateStructure(item.children)
        };
      });
    };
    setInstrumentStructure(updateStructure(instrumentStructure));
  };

  const toggleCollapse = (id: string) => {
    const newCollapsed = new Set(collapsedItems);
    if (newCollapsed.has(id)) {
      newCollapsed.delete(id);
    } else {
      newCollapsed.add(id);
    }
    setCollapsedItems(newCollapsed);
  };

  const renderInstrumentLevel = (item: InstrumentLevel, depth: number = 0) => {
    const isCollapsed = collapsedItems.has(item.id);
    const hasChildren = item.children.length > 0;
    const canAddChild = item.level < 3;
    
    const levelColors = {
      1: 'border-l-blue-500 bg-blue-50',
      2: 'border-l-green-500 bg-green-50', 
      3: 'border-l-purple-500 bg-purple-50'
    };

    const levelTextColors = {
      1: 'text-blue-700',
      2: 'text-green-700',
      3: 'text-purple-700'
    };

    return (
      <div key={item.id} className={`${depth > 0 ? 'ml-8' : ''} mb-3`}>
        <div className={`border-l-4 ${levelColors[item.level]} rounded-lg p-4 shadow-sm`}>
          <div className="flex items-center space-x-3">
            {hasChildren && (
              <button
                onClick={() => toggleCollapse(item.id)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {isCollapsed ? (
                  <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                )}
              </button>
            )}
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded ${levelTextColors[item.level]} bg-white border`}>
                Level {item.level}
              </span>
              <span className="text-sm font-mono text-gray-600">#{item.code}</span>
              <span className="text-sm font-semibold text-gray-700">{item.code}</span>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Instrument title"
                value={item.name}
                onChange={(e) => updateInstrumentLevel(item.id, 'name', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-1">
              {canAddChild && (
                <button
                  type="button"
                  onClick={() => addInstrumentLevel((item.level + 1) as 2 | 3, item.id)}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                  title="Add Sub-Instrument"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeInstrumentLevel(item.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                title="Remove Instrument"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        {hasChildren && !isCollapsed && (
          <div className="mt-3">
            {item.children.map(child => renderInstrumentLevel(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Survey</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Survey Title and Description - Two Column Layout */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Survey Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <div className="mt-1 text-xs text-white bg-gray-800 px-2 py-1 rounded">
                  {errors.description}
                </div>
              )}
            </div>
          </div>

          {/* Survey Structure */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Survey Structure (Instruments)</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Organize your survey into hierarchical sections and sub-sections with unique codes
                </p>
              </div>
              <button
                type="button"
                onClick={() => addInstrumentLevel(1)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Instrument</span>
              </button>
            </div>
            
            <div className="space-y-3 min-h-[200px]">
              {instrumentStructure.map(item => renderInstrumentLevel(item))}
              {instrumentStructure.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <p className="text-gray-500">
                    No instruments added yet. Click &quot;Add Instrument&quot; to get started.
                  </p>
                </div>
              )}
            </div>

            {/* Level Explanations */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium text-blue-800">Level 1:</span>
                  <span className="text-blue-700"> Main sections (Code: L1001, L1002, etc.)</span>
                </p>
                <p>
                  <span className="font-medium text-blue-800">Level 2:</span>
                  <span className="text-blue-700"> Sub-sections (Code: L1001.201, L1001.202, etc.)</span>
                </p>
                <p>
                  <span className="font-medium text-blue-800">Level 3:</span>
                  <span className="text-blue-700"> Detailed groupings (Code: L1001.201.301, etc.)</span>
                </p>
                <p className="pt-2 border-t border-blue-200">
                  <span className="font-medium text-blue-800">Note:</span>
                  <span className="text-blue-700"> Codes are automatically generated and help organize your survey structure</span>
                </p>
              </div>
            </div>
          </div>

          {/* Active Checkbox */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Active (available to the public)
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 