import React, { useState } from 'react';
import apiService from '../services/api';

const ApiVisualization = ({ project, onRefresh }) => {
  const [monitoring, setMonitoring] = useState(false);
  const [discovering, setDiscovering] = useState(false);

  if (!project) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">API Visualization</h2>
        <p className="text-gray-500 text-center py-8">
          Select a project to view API routes and metrics
        </p>
      </div>
    );
  }

  const handleDiscoverRoutes = async () => {
    setDiscovering(true);
    await apiService.discoverRoutes(project._id);
    await onRefresh();
    setDiscovering(false);
  };

  const handleMonitor = async () => {
    setMonitoring(true);
    await apiService.monitorProject(project._id);
    await onRefresh();
    setMonitoring(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-500';
      case 'POST':
        return 'bg-green-500';
      case 'PUT':
        return 'bg-yellow-500';
      case 'DELETE':
        return 'bg-red-500';
      case 'PATCH':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">API Visualization</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDiscoverRoutes}
            disabled={discovering}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 text-sm"
          >
            {discovering ? 'Discovering...' : 'Discover Routes'}
          </button>
          <button
            onClick={handleMonitor}
            disabled={monitoring || !project.routes || project.routes.length === 0}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 text-sm"
          >
            {monitoring ? 'Monitoring...' : 'Monitor All'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Project: {project.name}</h3>
        <p className="text-sm text-gray-600 break-all">{project.apiUrl}</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {project.apiMetrics?.totalRequests || 0}
          </div>
          <div className="text-sm text-gray-600">Total Requests</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {project.apiMetrics?.successfulRequests || 0}
          </div>
          <div className="text-sm text-gray-600">Successful</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {project.apiMetrics?.failedRequests || 0}
          </div>
          <div className="text-sm text-gray-600">Failed</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {project.apiMetrics?.averageResponseTime
              ? `${Math.round(project.apiMetrics.averageResponseTime)}ms`
              : 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Avg Response</div>
        </div>
      </div>

      {/* Routes */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Discovered Routes ({project.routes?.length || 0})
        </h3>
        {!project.routes || project.routes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No routes discovered yet. Click "Discover Routes" to scan the API.
          </p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(
              project.routes.reduce((groups, route) => {
                // Group routes by path prefix
                const pathParts = route.path.split('/').filter(Boolean);
                const groupName = pathParts.length > 0 ? `/${pathParts[0]}` : '/';

                if (!groups[groupName]) {
                  groups[groupName] = [];
                }
                groups[groupName].push(route);
                return groups;
              }, {})
            ).map(([groupName, routes]) => (
              <div key={groupName} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                <h4 className="font-bold text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <span className="bg-gray-700 text-white px-2 py-0.5 rounded text-xs">
                    {groupName}
                  </span>
                  <span className="text-gray-500 font-normal">
                    ({routes.length} {routes.length === 1 ? 'route' : 'routes'})
                  </span>
                </h4>
                <div className="space-y-2">
                  {routes.map((route, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-2 bg-white hover:border-blue-400 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`${getMethodColor(route.method)} text-white px-2 py-1 rounded text-xs font-bold`}
                          >
                            {route.method}
                          </span>
                          <span className="font-mono text-xs">{route.path}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {route.responseTime && (
                            <span className="text-xs text-gray-500">
                              {route.responseTime}ms
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(route.status)}`}>
                            {route.status || 'pending'}
                          </span>
                        </div>
                      </div>
                      {route.lastChecked && (
                        <div className="text-xs text-gray-500 mt-1">
                          Last checked: {new Date(route.lastChecked).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiVisualization;
