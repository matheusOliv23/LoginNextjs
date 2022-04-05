import { setDefaultResultOrder } from "dns/promises";
import Router from "next/router";
import { setCookie } from "nookies";
import { createContext, ReactNode, useState } from "react";
import { api } from "../src/services/api";

interface SignInCredentials {
  email: string;
  password: string;
}

interface User {
  email: string;
}

interface AuthContextdata {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User | undefined;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextdata);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      const { token, refreshToken } = response.data;

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      setUser({ email });

      Router.push("/perfil");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
