import React, { Suspense } from "react";

// ** Router Import
import Router from "./router/Router";
import LanguageContext from "./LanguageContext";
import i18n from 'i18next';
import themeConfig from "@configs/themeConfig";
// import { LogoProvider } from './contexts/LogoContext';  // Import the LogoProvider

const App = () => {
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  // localStorage.setItem(
  //   'token',
  //   JSON.stringify({logo: themeConfig.layout.logo}),
  
  //   );

  return (
    <LanguageContext.Provider value={changeLanguage}>
      {/* <LogoProvider>  */}
         <Suspense fallback={null}>
      <Router />
    </Suspense>  
    {/* </LogoProvider> */}
 
  </LanguageContext.Provider>);
};

export default App;
