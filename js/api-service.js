// Configuration de base pour l'API
const API_URL = 'http://localhost:5000/api';

/**
 * Service d'API pour gérer les appels vers le backend
 */
class ApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  /**
   * Configure les headers pour les requêtes API
   * @returns {Object} Headers HTTP
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Met à jour le token d'authentification
   * @param {string} token - Token JWT
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  /**
   * Supprime le token d'authentification
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  /**
   * Effectue une requête GET
   * @param {string} endpoint - Endpoint API
   * @returns {Promise} Réponse de l'API
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la requête');
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur GET ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Effectue une requête POST
   * @param {string} endpoint - Endpoint API
   * @param {Object} data - Données à envoyer
   * @returns {Promise} Réponse de l'API
   */
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la requête');
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur POST ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Effectue une requête PUT
   * @param {string} endpoint - Endpoint API
   * @param {Object} data - Données à envoyer
   * @returns {Promise} Réponse de l'API
   */
  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la requête');
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur PUT ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Effectue une requête DELETE
   * @param {string} endpoint - Endpoint API
   * @returns {Promise} Réponse de l'API
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la requête');
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur DELETE ${endpoint}:`, error);
      throw error;
    }
  }
}

// Services spécifiques pour chaque entité
const AuthService = {
  async login(email, password) {
    const api = new ApiService();
    const response = await api.post('auth/login', { email, password });
    if (response.token) {
      api.setToken(response.token);
    }
    return response;
  },

  async getCurrentUser() {
    const api = new ApiService();
    return api.get('auth/me');
  },

  async logout() {
    const api = new ApiService();
    api.clearToken();
    return { success: true };
  }
};

const ProductService = {
  async getAllProducts() {
    const api = new ApiService();
    return api.get('products');
  },

  async getProduct(id) {
    const api = new ApiService();
    return api.get(`products/${id}`);
  },

  async createProduct(productData) {
    const api = new ApiService();
    return api.post('products', productData);
  },

  async updateProduct(id, productData) {
    const api = new ApiService();
    return api.put(`products/${id}`, productData);
  },

  async deleteProduct(id) {
    const api = new ApiService();
    return api.delete(`products/${id}`);
  }
};

const OrderService = {
  async createOrder(orderData) {
    const api = new ApiService();
    return api.post('orders', orderData);
  },

  async getAllOrders() {
    const api = new ApiService();
    return api.get('orders');
  },

  async getOrder(id) {
    const api = new ApiService();
    return api.get(`orders/${id}`);
  },

  async updateOrderStatus(id, status) {
    const api = new ApiService();
    return api.put(`orders/${id}/status`, { status });
  },

  async deleteOrder(id) {
    const api = new ApiService();
    return api.delete(`orders/${id}`);
  }
};

const CustomerService = {
  async getAllCustomers() {
    const api = new ApiService();
    return api.get('customers');
  },

  async getCustomer(id) {
    const api = new ApiService();
    return api.get(`customers/${id}`);
  },

  async updateCustomer(id, customerData) {
    const api = new ApiService();
    return api.put(`customers/${id}`, customerData);
  },

  async deleteCustomer(id) {
    const api = new ApiService();
    return api.delete(`customers/${id}`);
  }
};

const MessageService = {
  async createMessage(messageData) {
    const api = new ApiService();
    return api.post('messages', messageData);
  },

  async getAllMessages() {
    const api = new ApiService();
    return api.get('messages');
  },

  async getMessage(id) {
    const api = new ApiService();
    return api.get(`messages/${id}`);
  },

  async updateMessageStatus(id, status) {
    const api = new ApiService();
    return api.put(`messages/${id}/status`, { status });
  },

  async deleteMessage(id) {
    const api = new ApiService();
    return api.delete(`messages/${id}`);
  }
};

const DashboardService = {
  async getStats() {
    const api = new ApiService();
    return api.get('dashboard/stats');
  },

  async getActivityLogs() {
    const api = new ApiService();
    return api.get('dashboard/activity');
  }
};

// Export all services
window.ApiService = ApiService;
window.AuthService = AuthService;
window.ProductService = ProductService;
window.OrderService = OrderService;
window.CustomerService = CustomerService;
window.MessageService = MessageService;
window.DashboardService = DashboardService;
