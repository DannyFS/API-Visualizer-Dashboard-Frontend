import React, { useState, useEffect } from 'react';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import ApiVisualization from './components/ApiVisualization';
import MongoManager from './components/MongoManager';
import apiService from './services/api';

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [backendConnected, setBackendConnected] = useState(true);
  const [activeTab, setActiveTab] = useState('api'); // 'api' or 'mongo'

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const result = await apiService.getProjects();
    if (result.success && result.data && result.data.projects) {
      setProjects(result.data.projects);
      setBackendConnected(true);
    } else {
      setProjects([]);
      setBackendConnected(false);
      showNotification('Failed to load projects: ' + (result.error || 'Cannot connect to backend'), 'error');
    }
    setLoading(false);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  const handleProjectAdded = async (name, apiUrl, mongoDbUrl) => {
    const result = await apiService.addProject(name, apiUrl, mongoDbUrl);
    if (result.success) {
      showNotification('Project added successfully!', 'success');
      await loadProjects();
    } else {
      showNotification('Failed to add project: ' + result.error, 'error');
    }
  };

  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    // Refresh project data
    const result = await apiService.getProject(project._id);
    if (result.success) {
      setSelectedProject(result.data.project);
    }
  };

  const handleRefreshProject = async () => {
    if (!selectedProject) return;
    const result = await apiService.getProject(selectedProject._id);
    if (result.success) {
      setSelectedProject(result.data.project);
      await loadProjects();
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    const result = await apiService.deleteProject(projectId);
    if (result.success) {
      showNotification('Project deleted successfully!', 'success');
      if (selectedProject?._id === projectId) {
        setSelectedProject(null);
      }
      await loadProjects();
    } else {
      showNotification('Failed to delete project: ' + result.error, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white max-w-md`}>
          {notification.message}
        </div>
      )}

      {/* Backend Connection Warning */}
      {!backendConnected && !loading && (
        <div className="bg-red-600 text-white px-4 py-3 text-center">
          <p className="font-semibold">Cannot connect to backend server</p>
          <p className="text-sm mt-1">Make sure the backend is running at {process.env.REACT_APP_API_URL || 'http://localhost:5000'}</p>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            API & Database Manager
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your API projects, visualize routes, and control MongoDB databases
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Projects */}
          <div className="space-y-6">
            <ProjectForm onProjectAdded={handleProjectAdded} />
            {loading ? (
              <div className="bg-white shadow-md rounded-lg p-6">
                <p className="text-center text-gray-500">Loading projects...</p>
              </div>
            ) : (
              <ProjectList
                projects={projects}
                onProjectClick={handleProjectClick}
                selectedProject={selectedProject}
                onDeleteProject={handleDeleteProject}
              />
            )}
          </div>

          {/* Right Column - Visualization & Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            {selectedProject && (
              <div className="bg-white shadow-md rounded-lg p-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('api')}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                      activeTab === 'api'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    API Visualization
                  </button>
                  <button
                    onClick={() => setActiveTab('mongo')}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                      activeTab === 'mongo'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    MongoDB Manager
                  </button>
                </div>
              </div>
            )}

            {/* Content based on active tab */}
            {activeTab === 'api' ? (
              <ApiVisualization
                project={selectedProject}
                onRefresh={handleRefreshProject}
              />
            ) : (
              <MongoManager project={selectedProject} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-12">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600">
          <p>API & Database Manager - Built with React, Express, and MongoDB</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
