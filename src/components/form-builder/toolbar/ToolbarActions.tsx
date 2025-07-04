'use client';

import React, { useState } from 'react';
import { FiSave, FiEye, FiDownload, FiSettings, FiPlay } from 'react-icons/fi';
import { FormSchema } from '../../../lib/types/form';

interface ToolbarActionsProps {
  onSave?: () => void;
  onPreview?: () => void;
  onExport?: () => void;
  formSchema: FormSchema;
  onUpdateForm: (updates: Partial<FormSchema>) => void;
}

export function ToolbarActions({ 
  onSave, 
  onPreview, 
  onExport, 
  formSchema, 
  onUpdateForm 
}: ToolbarActionsProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="bg-white border-b border-gray-100 px-3 py-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <h1 className="text-sm font-medium text-gray-800">
          {formSchema.title || 'Untitled Form'}
        </h1>
        <div className="h-4 border-r border-gray-200"></div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
          title="Form Settings"
        >
          <FiSettings className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onSave}
          className="inline-flex items-center px-2 py-1 border border-gray-200 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400"
          title="Save form"
        >
          <FiSave className="w-3 h-3 mr-1" />
          Save
        </button>
        
        <button
          onClick={onPreview}
          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
          title="Preview form"
        >
          <FiEye className="w-3 h-3 mr-1" />
          Preview
        </button>
        
        <button
          onClick={onExport}
          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
          title="Export as JSON"
        >
          <FiDownload className="w-3 h-3 mr-1" />
          Export
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-80 max-w-md mx-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-800">Form Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Form Title
                </label>
                <input
                  type="text"
                  value={formSchema.title || ''}
                  onChange={(e) => onUpdateForm({ title: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Enter form title"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formSchema.description || ''}
                  onChange={(e) => onUpdateForm({ description: e.target.value })}
                  rows={3}
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Enter form description"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowSettings(false)}
                className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-2.5 py-1 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
