'use client';

import { FormRenderer } from '../components/core/FormRenderer';
import { CompleteShowcaseSchema } from '../examples/json-loader';


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          🚀 Dynamic Form Renderer
        </h1>
        
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-4">
            A comprehensive showcase of all available components loaded from JSON configuration
          </p>
          <div className="flex justify-center space-x-4 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              17 Components
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              JSON Configured
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              TypeScript
            </span>
          </div>
          <div className="flex justify-center space-x-4">
            <a
              href="/builder"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              🛠️ Open Form Builder
            </a>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              🔄 Reload Showcase
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📋 Complete Component Showcase</h2>
            <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Loaded from JSON
            </span>
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">
              📁 <strong>Source:</strong> <code className="bg-gray-100 px-2 py-1 rounded">src/examples/complete-showcase.json</code>
            </p>
            <p className="text-sm text-gray-600">
              This entire form is generated from a JSON configuration file, demonstrating the power of schema-driven UI generation.
            </p>
          </div>
          <FormRenderer 
            schema={CompleteShowcaseSchema}
            className="space-y-6"
          />
        </div>


      </div>
    </div>
  );
}
