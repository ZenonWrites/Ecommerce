

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Helper function to handle responses
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || JSON.stringify(errorData);
    } catch (e) {
      errorMessage = `HTTP error! status: ${response.status}`;
    }
    console.error('API Error:', errorMessage);
    throw new Error(errorMessage);
  }
  
  try {
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (e) {
    console.error('Error parsing JSON response:', e);
    throw new Error('Invalid response from server');
  }
};

// Products API
export const productApi = {
  getAll: () => fetch(`${API_BASE_URL}/products/`).then(handleResponse),
  getById: (id) => fetch(`${API_BASE_URL}/products/${id}/`).then(handleResponse),
};

// Categories API
export const categoryApi = {
  getAll: () => fetch(`${API_BASE_URL}/categories/`).then(handleResponse),
};

// Orders API
export const orderApi = {
  getAll: () => fetch(`${API_BASE_URL}/orders/`).then(handleResponse),
  create: (orderData) =>
    fetch(`${API_BASE_URL}/orders/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    }).then(handleResponse),
};

// WhatsApp API
export const whatsappApi = {
  getNumber: () => fetch(`${API_BASE_URL}/whatsapp/`).then(handleResponse),
};
