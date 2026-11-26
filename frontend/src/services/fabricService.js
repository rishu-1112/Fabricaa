import { apiUrl } from "./api";
import axios from "axios";

const API_URL = apiUrl("/fabrics");

export const getAllFabrics = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};
