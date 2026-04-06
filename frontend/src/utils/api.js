import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('travel_sparsh_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('travel_sparsh_token');
      localStorage.removeItem('travel_sparsh_user');
      if (!window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register') &&
          !window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
  logout:   ()     => api.post('/auth/logout'),
};

// Contact / Enquiries
export const contactAPI = {
  submitContact: (data)    => api.post('/contact', data),
  getMyEnquiries:(params)  => api.get('/contact/my', { params }),

  // Admin
  getAll:        (params)  => api.get('/contact/admin/all', { params }),
  updateStatus:  (id, status) => api.patch(`/contact/admin/${id}/status`, { status }),
  delete:        (id)      => api.delete(`/contact/admin/${id}`),
};

// Airports
export const airportsAPI = {
  getAll:    ()     => api.get('/airports'),
  search:    (q)    => api.get('/airports/search', { params: { q } }),
  // Admin
  adminAll:  ()     => api.get('/airports/admin/all'),
  create:    (data) => api.post('/airports', data),
  update:    (id, data) => api.put(`/airports/${id}`, data),
  remove:    (id)   => api.delete(`/airports/${id}`),
};

// Airlines
export const airlinesAPI = {
  getAll:    ()     => api.get('/airlines'),
  // Admin
  adminAll:  ()     => api.get('/airlines/admin/all'),
  create:    (data) => api.post('/airlines', data),
  update:    (id, data) => api.put(`/airlines/${id}`, data),
  remove:    (id)   => api.delete(`/airlines/${id}`),
};

// Packages
export const packagesAPI = {
  getAll:    ()     => api.get('/packages'),
  getOne:    (id)   => api.get(`/packages/${id}`),
  // Admin
  adminAll:  ()     => api.get('/packages/admin/all'),
  create:    (data) => api.post('/packages', data),
  update:    (id, data) => api.put(`/packages/${id}`, data),
  remove:    (id)   => api.delete(`/packages/${id}`),
};

// Testimonials
export const testimonialsAPI = {
  getAll:     ()     => api.get('/testimonials'),
  // Admin
  adminAll:   ()     => api.get('/testimonials/admin/all'),
  create:     (data) => api.post('/testimonials', data),
  update:     (id, data) => api.put(`/testimonials/${id}`, data),
  remove:     (id)   => api.delete(`/testimonials/${id}`),
};

// Newsletter
export const newsletterAPI = {
  subscribe:    (email)      => api.post('/newsletter/subscribe', { email }),
  getAll:       (params)     => api.get('/newsletter', { params }),
  updateStatus: (id, status) => api.patch(`/newsletter/${id}`, { status }),
  delete:       (id)         => api.delete(`/newsletter/${id}`),
};



// Admin
export const adminAPI = {
  getStats:    ()            => api.get('/admin/stats'),
  getUsers:    (params)      => api.get('/admin/users', { params }),
  updateUser:  (id, data)    => api.patch(`/admin/users/${id}`, data),
  deleteUser:  (id)          => api.delete(`/admin/users/${id}`),
  // Admin Users
  getAdmins:   ()            => api.get('/admin/admins'),
  createAdmin: (data)        => api.post('/admin/admins', data),
  deleteAdmin: (id)          => api.delete(`/admin/admins/${id}`),
};


export default api;
