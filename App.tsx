import React from "react";
import { AuthProvider } from "@context/Authcontext";
import { UserProvider } from "@context/UserContext";
import AppWithProfileProvider from "@routes/New";
const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <AppWithProfileProvider />
      </UserProvider>
    </AuthProvider>
  );
};

export default App;
