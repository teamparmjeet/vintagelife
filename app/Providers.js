"use client";

import { SessionProvider} from "next-auth/react";

const SessionWatcher = ({ children }) => {



  return <>{children}</>;
};

export const AuthProvider = ({ children }) => {
  return (
    <SessionProvider>
      <SessionWatcher>{children}</SessionWatcher>
    </SessionProvider>
  );
};
