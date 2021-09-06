
import './App.css'
import Home from './Home'
import JSON from './sample.json'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useEffect} from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    
    /**//**/
    <Router>
     <ScrollToTop />
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/json' component={JSON} />
    </Switch>
  </Router> 
  );
}
export default App;
