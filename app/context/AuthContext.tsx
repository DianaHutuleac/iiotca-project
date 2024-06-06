import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface AuthContextProps {
  authState: { token: string | null; authenticated: boolean | null, user: any | null };
  onRegister: (email: string, password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt';
export const API_URL = 'http://localhost:3000';
const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<{ token: string | null; authenticated: boolean | null; user: any | null }>({
    token: null,
    authenticated: null,
    user: null
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Fetch user data or set initial user data here if needed
        setAuthState({ token, authenticated: true, user: { name: 'John Doe' } });
      }
    };
    loadToken();
  }, []);

  const register = async (email: string, password: string) => {
    try {
      return await axios.post(`${API_URL}/register`, { email, password });
    } catch (e) {
      console.error("Register error:", e);
      if (e.response) {
        return { error: true, msg: e.response.data.msg };
      }
      return { error: true, msg: e.message };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/login`, { email, password });
      setAuthState({ token: result.data.token, authenticated: true, user: result.data.user });
      axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
      return result;
    } catch (e) {
      console.error("Login error:", e);
      if (e.response) {
        return { error: true, msg: e.response.data.msg };
      }
      return { error: true, msg: e.message };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    axios.defaults.headers.common['Authorization'] = '';
    setAuthState({ token: null, authenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ authState, onRegister: register, onLogin: login, onLogout: logout }}>
      {children}
    </AuthContext.Provider>
  );
};


/*import React, { createContext, useContext, useState, useEffect, ReactNode, Children } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface AuthContextProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt';
export const API_URL = 'https://api.developbetterapps.com';
const AuthContext = createContext<AuthContextProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}: any) => {

    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log("stored: ", token)

            if(token){
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setAuthState({
                    token: token,
                    authenticated: true
                });
            }
        };
        loadToken();
    }, []);

    const register = async(email: string, password: string) => {
        try{
            return await axios.post(`${API_URL}/register`, {email, password});
        } catch (e){
            return {error: true, msg: (e as any).response.data.msg};
        }
    };

    const login = async(email: string, password: string) => {
        try{
            const result = await axios.post(`${API_URL}/login`, {email, password});

            console.log(" ~ file: AuthContext.tsx:41 ~ login ~ result:", result)

            setAuthState({
                token: result.data.token,
                authenticated: true
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

            return result;

        } catch (e){
            return {error: true, msg: (e as any).response.data.msg};
        }
    };

    const logout = async() => {
        // delete token from storage
        await SecureStore.deleteItemAsync(TOKEN_KEY);

        // update http headers
        axios.defaults.headers.common['Authorization'] = '';

        // reset auth state
        setAuthState({
            token: null,
            authenticated: false
        });

    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };
    return <AuthContext.Provider value={value}>children</AuthContext.Provider>;
}*/

/*const AuthContext = createContext<AuthContextProps>({
  authState: { token: null, authenticated: false },
  onRegister: async () => {},
  onLogin: async () => {},
  onLogout: async () => {},
});*/

/*interface AuthProviderProps {
  children: ReactNode;
}*/

/*export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<{ token: string | null; authenticated: boolean }>({
    token: null,
    authenticated: false,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      setAuthState({ token, authenticated: !!token });
    };

    loadToken();
  }, []);

  const onRegister = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://your-backend-url/register', { email, password });
      const { token } = response.data;
      await SecureStore.setItemAsync('token', token);
      setAuthState({ token, authenticated: true });
    } catch (error) {
      console.error('Registration Error', error);
    }
  };

  const onLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://your-backend-url/login', { email, password });
      const { token } = response.data;
      await SecureStore.setItemAsync('token', token);
      setAuthState({ token, authenticated: true });
    } catch (error) {
      console.error('Login Error', error);
    }
  };

  const onLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    setAuthState({ token: null, authenticated: false });
  };

  return (
    <AuthContext.Provider value={{ authState, onRegister, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};*/

//export const useAuth = () => useContext(AuthContext);
