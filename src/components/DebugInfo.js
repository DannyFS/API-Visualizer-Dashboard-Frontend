import React from 'react';

const DebugInfo = () => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
      <p className="font-bold">Debug Info:</p>
      <p className="text-sm">Backend URL: <code className="bg-yellow-200 px-2 py-1 rounded">{apiUrl}</code></p>
      <p className="text-xs mt-1">If this shows localhost but you want Railway, restart your React app!</p>
    </div>
  );
};

export default DebugInfo;
