const API_BASE = 'https://starsrkhim.hosfer.com/api';

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export const api = {
  // Foydalanuvchi ma'lumotlari
  getUser: (initData) => apiRequest('/user', {
    method: 'POST',
    body: JSON.stringify({ initData }),
  }),

  // Balans
  getBalance: (initData) => apiRequest('/balance', {
    method: 'POST',
    body: JSON.stringify({ initData }),
  }),

  // Buyurtmalar
  getOrders: (initData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify({ initData }),
  }),

  // Narxlar
  getStarsPrices: () => apiRequest('/prices/stars'),
  getPremiumPrices: () => apiRequest('/prices/premium'),
  getCountries: () => apiRequest('/numbers/countries'),
};
