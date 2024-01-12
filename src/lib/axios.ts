import axios from "axios";
import MockAdapter from "axios-mock-adapter";

export const client = axios.create({
  baseURL: "http://localhost:5173/",
});

export const mock = new MockAdapter(client, {
  delayResponse: 350,
});
