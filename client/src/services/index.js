import api from './api.js';

export const testAPI = async () => {
  try {
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    console.error('Erro ao chamar API:', error);
    throw error;
  }
};

// Adicione mais funções de API aqui
