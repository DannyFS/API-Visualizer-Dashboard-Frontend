import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const MongoManager = ({ project }) => {
  const [databases, setDatabases] = useState([]);
  const [selectedDb, setSelectedDb] = useState('');
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalDocs, setTotalDocs] = useState(0);
  const [page, setPage] = useState(0);
  const [limit] = useState(20);
  const [editingDoc, setEditingDoc] = useState(null);
  const [newDoc, setNewDoc] = useState('');
  const [showAddDoc, setShowAddDoc] = useState(false);

  useEffect(() => {
    if (project) {
      loadDatabases();
    }
  }, [project]);

  useEffect(() => {
    if (selectedDb) {
      loadCollections();
    }
  }, [selectedDb]);

  useEffect(() => {
    if (selectedCollection) {
      loadDocuments();
    }
  }, [selectedCollection, page]);

  const loadDatabases = async () => {
    setLoading(true);
    const result = await apiService.getDatabases(project._id);
    if (result.success) {
      setDatabases(result.data.databases || []);
    }
    setLoading(false);
  };

  const loadCollections = async () => {
    setLoading(true);
    const result = await apiService.getCollections(project._id, selectedDb);
    if (result.success) {
      setCollections(result.data.collections || []);
    }
    setLoading(false);
  };

  const loadDocuments = async () => {
    setLoading(true);
    const result = await apiService.getDocuments(
      project._id,
      selectedDb,
      selectedCollection,
      limit,
      page * limit
    );
    if (result.success) {
      setDocuments(result.data.documents || []);
      setTotalDocs(result.data.total || 0);
    }
    setLoading(false);
  };

  const handleAddDocument = async () => {
    try {
      const doc = JSON.parse(newDoc);
      const result = await apiService.insertDocument(
        project._id,
        selectedDb,
        selectedCollection,
        doc
      );
      if (result.success) {
        alert('Document added successfully!');
        setNewDoc('');
        setShowAddDoc(false);
        loadDocuments();
      } else {
        alert('Failed to add document: ' + result.error);
      }
    } catch (error) {
      alert('Invalid JSON: ' + error.message);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    const result = await apiService.deleteDocument(
      project._id,
      selectedDb,
      selectedCollection,
      { _id: { $oid: docId } }
    );

    if (result.success) {
      alert('Document deleted successfully!');
      loadDocuments();
    } else {
      alert('Failed to delete document: ' + result.error);
    }
  };

  if (!project) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">MongoDB Manager</h2>
        <p className="text-gray-500 text-center py-8">
          Select a project to manage MongoDB data
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalDocs / limit);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">MongoDB Manager</h2>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Project: {project.name}</h3>
      </div>

      {/* Database Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Database
        </label>
        <select
          value={selectedDb}
          onChange={(e) => {
            setSelectedDb(e.target.value);
            setSelectedCollection('');
            setDocuments([]);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select Database --</option>
          {databases.map((db) => (
            <option key={db.name} value={db.name}>
              {db.name} ({(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)
            </option>
          ))}
        </select>
      </div>

      {/* Collection Selection */}
      {selectedDb && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Collection
          </label>
          <select
            value={selectedCollection}
            onChange={(e) => {
              setSelectedCollection(e.target.value);
              setPage(0);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Collection --</option>
            {collections.map((col) => (
              <option key={col.name} value={col.name}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Documents */}
      {selectedCollection && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">
              Documents ({totalDocs})
            </h3>
            <button
              onClick={() => setShowAddDoc(!showAddDoc)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
            >
              {showAddDoc ? 'Cancel' : 'Add Document'}
            </button>
          </div>

          {/* Add Document Form */}
          {showAddDoc && (
            <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Document (JSON)
              </label>
              <textarea
                value={newDoc}
                onChange={(e) => setNewDoc(e.target.value)}
                placeholder='{"name": "John", "age": 30}'
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                rows="6"
              />
              <button
                onClick={handleAddDocument}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
              >
                Insert Document
              </button>
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-500 py-4">Loading...</p>
          ) : documents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No documents found</p>
          ) : (
            <>
              <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                {documents.map((doc, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <pre className="text-xs bg-gray-50 p-2 rounded flex-1 overflow-x-auto">
                        {JSON.stringify(doc, null, 2)}
                      </pre>
                      <button
                        onClick={() => handleDeleteDocument(doc._id)}
                        className="ml-2 text-red-500 hover:text-red-700 font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="px-3 py-1 bg-gray-200 rounded disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MongoManager;
