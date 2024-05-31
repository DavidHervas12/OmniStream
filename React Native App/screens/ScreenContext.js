import React, { createContext, useState, useEffect } from "react";

const ScreensContext = createContext();
import i18n from "i18n-js";
import { en, es } from "./localizations";

i18n.translations = {
  en,
  es,
};

export const ScreensProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    i18n.locale = language;
  }, [language]);

  return (
    <ScreensContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        language,
        setLanguage,
      }}
    >
      {children}
    </ScreensContext.Provider>
  );
};

export default ScreensContext;
