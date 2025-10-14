import React, { useState } from 'react';

const ProjectForm = ({ onProjectAdded }) => {
  const [name, setName] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [mongoDbUrl, setMongoDbUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !apiUrl.trim() || !mongoDbUrl.trim()) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    await onProjectAdded(name, apiUrl, mongoDbUrl);
    setName('');
    setApiUrl('');
    setMongoDbUrl('');
    setLoading(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Project</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My API Project"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API URL
          </label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://api.example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            MongoDB URL
          </label>
          <input
            type="text"
            value={mongoDbUrl}
            onChange={(e) => setMongoDbUrl(e.target.value)}
            placeholder="mongodb://localhost:27017/mydb or mongodb+srv://..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Adding...' : 'Add Project'}
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;
