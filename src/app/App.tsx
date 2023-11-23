import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Expenses } from "./Expenses";
import { getToday } from "../utils/dateFunctions";

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
