// src/features/api/baseApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL || "https://api.internetbachelor.com",
    // baseUrl: "http://164.92.85.75:5040",
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies?.get("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "RowMaterials",
    "Products",
    "customer",
    "assest",
    "reportAnalysis",
  ],
});

// Export hooks for usage in functional components
export default baseApi;
