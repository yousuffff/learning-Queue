import { Client, Account } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);

export const registerUser = (email, password) => {
  return account.create("unique()", email, password);
};

export const loginUser = (email, password) => {
  return account.createEmailPasswordSession(email, password);
};

export const logoutUser = () => {
  return account.deleteSession("current");
};

export const getCurrentUser = () => {
  return account.get();
};
