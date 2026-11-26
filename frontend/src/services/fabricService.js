import axios from "axios";

const API_URL = "http://localhost:5000/api/fabrics";

export const getAllFabrics = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addFabric = async (fabricData) => {
  const res = await axios.post(API_URL, fabricData);
  return res.data;
};
