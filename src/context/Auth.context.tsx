import { useReducer, createContext, useContext } from "react";
import jwtDecode, { JwtPayload } from "jwt-decode";
const ACCESS_TOKEN = "access-token";

interface AuthorizationState {
  user: JwtPayload | null;
  login: (userData: { token: string }) => void;
  logout: () => void;
  loading?: boolean;
}

const initialState: AuthorizationState = { 
  user: null,
  login: (userData: any) => {},
  logout: () => {},
  loading: false,
};

const token = localStorage.getItem(ACCESS_TOKEN);
if (token) {
  const decodedToken = jwtDecode<JwtPayload>(token);

  if (decodedToken.exp!! * 1000 < Date.now()) {
    localStorage.removeItem(ACCESS_TOKEN);
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext(initialState);

function authReducer(
  state: any,
  action: any
) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        loading: action.payload.loading
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        loading: action.payload.loading
      };
    case "LOADING":
    return {
      ...state,
      loading: action.payload.loading,
    };
    default:
      return state;
  }
}

function AuthProvider(props: any) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loading = () => {
    dispatch({ type: "LOADING", payload: { loading: true } });
  };

  const login = (userData: any) => {
    loading();
    const token = userData[ACCESS_TOKEN];
    localStorage.setItem(ACCESS_TOKEN, token);
    dispatch({
      type: "LOGIN",
      payload: { user: jwtDecode(token), loading: false },
    });
  };

  const logout = () => {
    loading();
    localStorage.removeItem(ACCESS_TOKEN);
    dispatch({
      type: "LOGOUT",
      payload: { loading: false }
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }} {...props} />
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export { AuthContext, AuthProvider, useAuth, ACCESS_TOKEN };
