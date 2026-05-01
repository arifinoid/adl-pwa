import createClient from "openapi-fetch";
import type { paths } from "./types";

const client = createClient<paths>({
  baseUrl: "http://localhost:8000",
});

// Middleware for adding Auth token
client.use({
  async onRequest({ request }) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
});

export default client;
