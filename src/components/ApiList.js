import React from 'react';

const ApiList = ({ apis, onApiClick, selectedApi, onDeleteApi }) => {
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

  if (!apis || apis.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">API List</h2>
        <p className="text-gray-500 text-center py-8">No APIs added yet. Add your first API above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">API List ({apis.length})</h2>
      <div className="space-y-3">
        {apis.map((api) => (
          <div
            key={api._id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedApi?._id === api._id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1" onClick={() => onApiClick(api)}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getStatusIcon(api.lastStatus)}</span>
                  <span className="font-semibold text-gray-800">
                    {api.lastStatus.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 break-all mb-1">{api.url}</p>
                <p className="text-xs text-gray-500">
                  Last checked: {formatDate(api.lastChecked)}
                </p>
                {api.responseTime && (
                  <p className="text-xs text-gray-500">
                    Response time: {api.responseTime}ms
                  </p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteApi(api._id);
                }}
                className="ml-4 text-red-500 hover:text-red-700 font-bold"
                title="Delete API"
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

export default ApiList;
