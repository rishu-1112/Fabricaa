import { apiUrl } from "./api";
import axios from "axios";

const API_URL = apiUrl("/fabrics");

export const getAllFabrics = async (signal) => {
  const res = await axios.get(API_URL, { signal });
  return res.data;
};
