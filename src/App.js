import React, { useState, useEffect } from 'react';
import ApiForm from './components/ApiForm';
import ApiList from './components/ApiList';
import ApiDetails from './components/ApiDetails';
import apiService from './services/api';

function App() {
  const [apis, setApis] = useState([]);
  const [selectedApi, setSelectedApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Load APIs on component mount
  useEffect(() => {
    loadApis();
  }, []);

  const loadApis = async () => {
    setLoading(true);
    const result = await apiService.getApis();
    if (result.success) {
      setApis(result.data.apis);
    } else {
      showNotification('Failed to load APIs: ' + result.error, 'error');
    }
    setLoading(false);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleApiAdded = async (url) => {
    const result = await apiService.addApi(url);
    if (result.success) {
      showNotification('API added successfully!', 'success');
      await loadApis();
    } else {
      showNotification('Failed to add API: ' + result.error, 'error');
    }
  };

  const handleApiClick = async (api) => {
    setSelectedApi(api);
    // If the API hasn't been fetched yet, fetch it
    if (api.lastStatus === 'pending') {
      await handleRefresh(api._id);
    }
  };

  const handleRefresh = async (apiId) => {
    const result = await apiService.fetchApi(apiId);
    if (result.success) {
      showNotification('API refreshed successfully!', 'success');
      await loadApis();
      // Update selected API
      const updatedApi = await apiService.getApis();
      if (updatedApi.success) {
        const api = updatedApi.data.apis.find(a => a._id === apiId);
        if (api) {
          setSelectedApi(api);
        }
      }
    } else {
      showNotification('Failed to refresh API: ' + result.error, 'error');
    }
  };

  const handleDeleteApi = async (apiId) => {
    if (!window.confirm('Are you sure you want to delete this API?')) {
      return;
    }

    const result = await apiService.deleteApi(apiId);
    if (result.success) {
      showNotification('API deleted successfully!', 'success');
      if (selectedApi?._id === apiId) {
        setSelectedApi(null);
      }
      await loadApis();
    } else {
      showNotification('Failed to delete API: ' + result.error, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            API Visualizer Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and visualize your API endpoints
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ApiForm onApiAdded={handleApiAdded} />
            {loading ? (
              <div className="bg-white shadow-md rounded-lg p-6">
                <p className="text-center text-gray-500">Loading APIs...</p>
              </div>
            ) : (
              <ApiList
                apis={apis}
                onApiClick={handleApiClick}
                selectedApi={selectedApi}
                onDeleteApi={handleDeleteApi}
              />
            )}
          </div>

          {/* Right Column */}
          <div>
            <ApiDetails api={selectedApi} onRefresh={handleRefresh} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-12">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600">
          <p>API Visualizer Dashboard - Built with React, Express, and MongoDB</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
