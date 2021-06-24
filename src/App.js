import './App.css';
import React from "react";
import {Navbar, Nav} from "react-bootstrap";
import './Streams';
import io from "socket.io-client";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Streams from "./Streams";

const socket = io("https://sm1.pbmtv.org:3000");

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {viewers: 0};
    }
    componentDidMount() {
        socket.on('live count', (data) => {
            this.setState({ viewers: data});
        });
    }

  render() {
      return (
          <Router>
          <Navbar bg="light">
            <Navbar.Brand>PBMTV Admin</Navbar.Brand>
              <Nav className="mr-auto">
                  <Nav.Link as={Link} to="/streams">Streams</Nav.Link>
              </Nav>
              <i className="bi bi-person"/> {this.state.viewers}
          </Navbar>

              <Switch>
                  <Route path="/streams">
                      <Streams />
                  </Route>
              </Switch>
      </Router>
    )
    }
}

export default App;
