import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/api";


export const registerUser = (data) => axios.post(`${API_URL}/users/register`, data);
export const loginUser = (data) => axios.post(`${API_URL}/users/login`, data);


export const fetchProperties = (filters) => axios.get(`${API_URL}/properties`, { params: filters });
export const addProperty = (data, token) =>
  axios.post(`${API_URL}/properties`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    
    },
  });

export const deleteProperty = (propertyId, token) =>
  axios.delete(`${API_URL}/properties/${propertyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });


export const fetchChats = (token) =>
  axios.get(`${API_URL}/chats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createChat = (ownerId, token) =>
  axios.post(
    `${API_URL}/chats`,
    { ownerId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );


export const fetchMessages = (chatId, token) =>
  axios.get(`${API_URL}/messages/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const sendMessage = (chatId, message, token) =>
  axios.post(
    `${API_URL}/messages`,
    { chatId, message },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

