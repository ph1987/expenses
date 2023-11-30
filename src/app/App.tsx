import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Expenses } from "./Expenses";
import { getToday } from "../utils/dateFunctions";
import { useEffect, useState } from "react";
import { IUser, getUserEndpoint } from "../service/expenses";
import { LoginScreen } from "./LoginScreen";
import { authContext } from "./authContext";

/*
function App() {
  const period = getToday().substring(0, 7);
  return (
    <Router>
      <Switch>
        <Route path="/expenses/:period">
          <Expenses />
        </Route>
        <Redirect to={{ pathname: "/expenses/" + period }} />
      </Switch>
    </Router>
  );
}

export default App;
*/

function App() {
  const period = getToday().substring(0, 7);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUserEndpoint().then(setUser, onSignOut);
  }, []);

  function onSignOut() {
    setUser(null);
  }

  if (user) {
    return (
      <authContext.Provider value={{ user, onSignOut }}>
        <Router>
          <Switch>
            <Route path="/expenses/:period">
              <Expenses />
            </Route>
            <Redirect to={{ pathname: "/expenses/" + period }} />
          </Switch>
        </Router>
      </authContext.Provider>
    );
  } else {
    return <LoginScreen onSignIn={setUser} />;
  }
}

export default App;
