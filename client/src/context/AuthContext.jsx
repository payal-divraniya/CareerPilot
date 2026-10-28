
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("careerpilot_user")
      );
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() =>
    localStorage.getItem("careerpilot_token")
  );

  const loading = false;

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem("careerpilot_user");
      localStorage.removeItem("careerpilot_token");
      setUser(null);
      setToken(null);
    };
    window.addEventListener("careerpilot:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("careerpilot:unauthorized", handleUnauthorized);
  }, []);

  const login = (userData, authToken) => {
    // Also support passing the complete login response.
    if (userData?.user && userData?.token) {
      authToken = userData.token;
      userData = userData.user;
    }

    if (!userData || !authToken) {
      throw new Error("User information or login token is missing.");
    }

    localStorage.setItem(
      "careerpilot_user",
      JSON.stringify(userData)
    );

    localStorage.setItem("careerpilot_token", authToken);

    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem("careerpilot_user");
    localStorage.removeItem("careerpilot_token");

    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: Boolean(user && token),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// The context hook intentionally lives beside its provider.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
};
