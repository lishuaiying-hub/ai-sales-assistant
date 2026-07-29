import React from 'react';
import { createContext } from "react";

// 用户信息接口
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  department: string;
}

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  user: null as User | null,
  setUser: (user: User | null) => {},
  logout: () => {},
});