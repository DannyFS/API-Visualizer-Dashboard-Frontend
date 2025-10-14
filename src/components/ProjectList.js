import React from 'react';

const ProjectList = ({ projects, onProjectClick, selectedProject, onDeleteProject }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '❓';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Never checked';
    return new Date(date).toLocaleString();
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Projects</h2>
        <p className="text-gray-500 text-center py-8">No projects yet. Add your first project above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Projects ({projects.length})</h2>
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project._id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedProject?._id === project._id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1" onClick={() => onProjectClick(project)}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getStatusIcon(project.apiStatus)}</span>
                  <span className="font-bold text-lg text-gray-800">
                    {project.name}
                  </span>
                </div>
                <p className="text-sm text-gray-600 break-all mb-1">
                  <span className="font-semibold">API:</span> {project.apiUrl}
                </p>
                <div className="flex gap-4 text-xs text-gray-500 mt-2">
                  <span>Last checked: {formatDate(project.lastChecked)}</span>
                  {project.responseTime && (
                    <span>Response: {project.responseTime}ms</span>
                  )}
                </div>
                {project.routes && project.routes.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {project.routes.length} routes discovered
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProject(project._id);
                }}
                className="ml-4 text-red-500 hover:text-red-700 font-bold text-xl"
                title="Delete Project"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
