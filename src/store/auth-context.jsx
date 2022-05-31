import React, { createContext, useState, useEffect, useCallback } from "react";
// timer to logout the user
let logoutTimer;
// initial state for cotext
const initState = {
  isLoggedIn: false,
  token: "",
  logIn: (token) => {},
  logOut: () => {},
};
// function that caclulate remaining time
const calculateRemainingTime = (exTime) => {
  const currentTime = new Date().getTime();
  const expireTime = new Date(exTime).getTime();
  return expireTime - currentTime;
};
// get remaining time and token id
const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("Token");
  const storedExpirationDate = localStorage.getItem("expirationTime");
  const remainingTime = calculateRemainingTime(storedExpirationDate);
  if (remainingTime <= 3600) {
    localStorage.removeItem("Token");
    localStorage.removeItem("expirationTime");
    return null;
  }
  return { token: storedToken, duration: remainingTime };
};
// create context
const AuthContext = createContext(initState);
// provide the context
export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();

  let initialToken;

  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);

  const isLoggedIn = !!token;

  const loginHandler = (token, expirationTime) => {
    localStorage.setItem("Token", token);
    localStorage.setItem("expirationTime", expirationTime);
    setToken(token);
    const remainingTime = calculateRemainingTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  const logoutHandler = useCallback(() => {
    setToken(null);
    console.log("running");
    localStorage.removeItem("Token");
    localStorage.removeItem("expirationTime");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData]);

  const contextValue = {
    isLoggedIn,
    token,
    logIn: loginHandler,
    logOut: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
