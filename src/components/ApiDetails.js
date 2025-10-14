import React, { useState } from 'react';

const ApiDetails = ({ api, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState(new Set());

  if (!api) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-500 text-center py-8">
          Select an API from the list to view details
        </p>
      </div>
    );
  }

  const handleRefresh = async () => {
    setLoading(true);
    await onRefresh(api._id);
    setLoading(false);
  };

  const toggleExpand = (key) => {
    const newExpanded = new Set(expandedKeys);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedKeys(newExpanded);
  };

  const renderValue = (value, key = '', depth = 0) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400">null</span>;
    }

    if (typeof value === 'boolean') {
      return <span className="text-purple-600">{value.toString()}</span>;
    }

    if (typeof value === 'number') {
      return <span className="text-blue-600">{value}</span>;
    }

    if (typeof value === 'string') {
      return <span className="text-green-600">"{value}"</span>;
    }

    if (Array.isArray(value)) {
      const isExpanded = expandedKeys.has(key);
      if (value.length === 0) {
        return <span className="text-gray-500">[]</span>;
      }

      return (
        <div>
          <button
            onClick={() => toggleExpand(key)}
            className="text-gray-600 hover:text-blue-500"
          >
            {isExpanded ? '▼' : '▶'} Array[{value.length}]
          </button>
          {isExpanded && (
            <div className="ml-4 border-l-2 border-gray-200 pl-2 mt-1">
              {value.map((item, index) => (
                <div key={`${key}-${index}`} className="my-1">
                  <span className="text-gray-500">[{index}]:</span>{' '}
                  {renderValue(item, `${key}-${index}`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === 'object') {
      const isExpanded = expandedKeys.has(key);
      const keys = Object.keys(value);
      if (keys.length === 0) {
        return <span className="text-gray-500">{'{}'}</span>;
      }

      return (
        <div>
          <button
            onClick={() => toggleExpand(key)}
            className="text-gray-600 hover:text-blue-500"
          >
            {isExpanded ? '▼' : '▶'} Object
          </button>
          {isExpanded && (
            <div className="ml-4 border-l-2 border-gray-200 pl-2 mt-1">
              {keys.map((objKey) => (
                <div key={`${key}-${objKey}`} className="my-1">
                  <span className="text-orange-600 font-semibold">{objKey}:</span>{' '}
                  {renderValue(value[objKey], `${key}-${objKey}`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <span>{String(value)}</span>;
  };

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

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">API Details</h2>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Status</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{getStatusIcon(api.lastStatus)}</span>
            <span className="text-xl font-bold">{api.lastStatus.toUpperCase()}</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">URL</h3>
          <p className="text-gray-600 break-all bg-gray-50 p-3 rounded">{api.url}</p>
        </div>

        {api.lastChecked && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Last Checked</h3>
            <p className="text-gray-600">{new Date(api.lastChecked).toLocaleString()}</p>
          </div>
        )}

        {api.responseTime && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Response Time</h3>
            <p className="text-gray-600">{api.responseTime}ms</p>
          </div>
        )}

        {api.errorMessage && (
          <div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error Message</h3>
            <p className="text-red-500 bg-red-50 p-3 rounded">{api.errorMessage}</p>
          </div>
        )}

        {api.lastResponse && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Response Data</h3>
            <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 font-mono text-sm">
              {renderValue(api.lastResponse, 'root')}
            </div>
          </div>
        )}

        {!api.lastResponse && api.lastStatus === 'pending' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Response Data</h3>
            <p className="text-gray-500 bg-gray-50 p-4 rounded">
              No data yet. Click "Refresh" to fetch data from this API.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiDetails;
