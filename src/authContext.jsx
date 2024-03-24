/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useEffect } from "react";
import axios, { localApi } from "./api/axios";
import { links, urls } from "./constants/links";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const tokensLocalStorage = JSON.parse(localStorage.getItem("tokens"));
  const onLoadTokens = tokensLocalStorage ? tokensLocalStorage : null;
  const decodedToken = tokensLocalStorage
    ? jwtDecode(tokensLocalStorage.access)
    : null;
  const [user, setUser] = useState(() => decodedToken);
  const [tokens, setTokens] = useState(() => onLoadTokens);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const loginUser = async (inputs) => {
    const response = await localApi.post(urls.LOGIN, inputs);
    setTokens(response.data);
    const userID = jwtDecode(response.data.access);
    setUser(userID);
    setIsSignedIn(true);
    localStorage.setItem("tokens", JSON.stringify(response.data));
  };

  const logout = () => {
    localStorage.removeItem("tokens");
    setTokens(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loginUser, tokens, logout, isSignedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};
