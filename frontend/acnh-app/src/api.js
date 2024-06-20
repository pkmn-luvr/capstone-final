import axios from 'axios';

// Set the base URL for the backend server from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Error handling function
const handleError = (error) => {
  console.error('API call error:', error);
  if (error.response) {
    return error.response.data;
  }
  return { error: 'An error occurred. Please try again later.' };
};

class ACNHAPI {
  static api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  static token;

  static setAuthToken(token) {
    if (token) {
      this.token = token;
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      this.token = null;
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  static async request(endpoint, data = {}, method = 'get') {
    const url = `${API_BASE_URL}/${endpoint}`;
    console.log(`Request URL: ${url}`);
    const config = {
      method,
      url,
      headers: this.api.defaults.headers,
      ...(method === 'get' ? { params: data } : { data }),
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (err) {
      console.error('API Error:', err.response || err);
      const message = err.response ? err.response.data.error.message : err.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Auth API calls
  static async login(username, password) {
    try {
      const response = await this.api.post('/auth/token', { username, password });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  static async register(userData) {
    try {
      const response = await this.api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  // Items API calls
  static async getAllItems() {
    return this.request('items');
  }

  static async getItemsByAvailability(month, hemisphere) {
    return this.request('items/availability', { month, hemisphere });
  }

  static async getItemsByType(itemtype) {
    return this.request(`items/type/${itemtype}`);
  }

  static async searchItems(name, type) {
    return this.request('items/search', { name, type });
  }

  // Users API calls
  static async getUser(username) {
    return this.request(`users/${username}`);
  }

  static async getUserCollections(username) {
    return this.request(`users/${username}/collections`);
  }

  static async updateUser(username, userData) {
    try {
      const response = await this.api.patch(`/users/${username}`, userData);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  static async addItemToCollection(username, itemname, itemtype) {
    try {
      const response = await this.api.post(`users/${username}/collections/add`, { itemname, itemtype });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  static async removeItemFromCollection(username, itemname, itemtype) {
    try {
      const response = await this.api.post(`users/${username}/collections/remove`, { itemname, itemtype });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  static async toggleDonationStatus(username, itemname, itemtype) {
    return this.request(`users/${username}/collections/donate`, { itemname, itemtype }, 'patch');
}

}

export default ACNHAPI;
