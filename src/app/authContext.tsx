import React, { useContext } from "react";
import { IUser } from "../service/expenses";

export interface IAuthContext {
  user: IUser;
  onSignOut: () => void;
}

export const authContext = React.createContext<IAuthContext>({
  user: {
    email: "usuario@email.com",
    senha: "1234",
  },
  onSignOut: () => {},
});

export function useAuthContext() {
  return useContext(authContext);
}
