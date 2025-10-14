import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiService = {
  // Add a new project
  addProject: async (name, apiUrl, mongoDbUrl) => {
    try {
      const response = await axios.post(`${API_URL}/api/projects/add`, {
        name,
        apiUrl,
        mongoDbUrl
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Get all projects
  getProjects: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/projects/list`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Get a specific project
  getProject: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/projects/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Discover routes for a project
  discoverRoutes: async (id) => {
    try {
      const response = await axios.post(`${API_URL}/api/projects/${id}/discover-routes`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Monitor project API routes
  monitorProject: async (id) => {
    try {
      const response = await axios.post(`${API_URL}/api/projects/${id}/monitor`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Delete a project
  deleteProject: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/projects/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // MongoDB operations
  getDatabases: async (projectId) => {
    try {
      const response = await axios.get(`${API_URL}/api/projects/${projectId}/mongo/databases`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  getCollections: async (projectId, dbName) => {
    try {
      const response = await axios.get(`${API_URL}/api/projects/${projectId}/mongo/${dbName}/collections`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  getDocuments: async (projectId, dbName, collectionName, limit = 100, skip = 0) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/projects/${projectId}/mongo/${dbName}/${collectionName}/documents`,
        { params: { limit, skip } }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  insertDocument: async (projectId, dbName, collectionName, document) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/projects/${projectId}/mongo/${dbName}/${collectionName}/documents`,
        document
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  updateDocument: async (projectId, dbName, collectionName, filter, update) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/projects/${projectId}/mongo/${dbName}/${collectionName}/documents`,
        { filter, update }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  deleteDocument: async (projectId, dbName, collectionName, filter) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/projects/${projectId}/mongo/${dbName}/${collectionName}/documents`,
        { data: { filter } }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }
};

export default apiService;
