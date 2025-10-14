import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiService = {
  // Add a new API
  addApi: async (url) => {
    try {
      const response = await axios.post(`${API_URL}/api/add`, { url });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Get all APIs
  getApis: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/list`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Fetch data from a specific API
  fetchApi: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/fetch/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Delete an API
  deleteApi: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/delete/${id}`);
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
