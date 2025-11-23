const API_BASE = 'https://dummyjson.com';

export const api = {
  login: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, expiresInMins: 60 }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  getProducts: async (skip: number, limit: number, search: string = '') => {
    const url = search
      ? `${API_BASE}/products/search?q=${search}&limit=${limit}&skip=${skip}`
      : `${API_BASE}/products?limit=${limit}&skip=${skip}`;
    const res = await fetch(url);
    return res.json();
  },

  updateUser: async (userId: number, data: any, token: string) => {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
