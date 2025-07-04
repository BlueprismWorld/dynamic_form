'use client';

import { FormBuilder } from '../../components/form-builder/FormBuilder';
import { FormSchema } from '../../lib/types/form';
import { useState } from 'react';

export default function FormBuilderPage() {
  const [savedSchema, setSavedSchema] = useState<FormSchema | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = (schema: FormSchema) => {
    setSavedSchema(schema);
    alert('Form saved successfully!');
  };

  const handlePreview = (schema: FormSchema) => {
    setSavedSchema(schema);
    setShowPreview(true);
  };

  return (
    <div className="h-screen overflow-hidden">
      <FormBuilder
        onSave={handleSave}
        onPreview={handlePreview}
      />
      
      {/* Preview Modal */}
      {showPreview && savedSchema && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Form Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Generated JSON Schema:</h3>
                <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                  {JSON.stringify(savedSchema, null, 2)}
                </pre>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4">Form Preview:</h3>
                {/* Note: You would use FormRenderer here once it's imported */}
                <div className="text-center py-8 text-gray-500">
                  <p>Form preview would be rendered here using the FormRenderer component</p>
                  <p className="text-sm mt-2">Import FormRenderer to see the live preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
