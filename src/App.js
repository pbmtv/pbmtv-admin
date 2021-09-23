import './App.css';
import React from "react";
import {Navbar, Nav} from "react-bootstrap";
import './Streams';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Streams from "./Streams";
import Links from "./LInks";
import {SocketContext, socket} from './context/socket';

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
              <SocketContext.Provider value={socket}>
                  <Navbar bg="light">
                    <Navbar.Brand>PBMTV Admin</Navbar.Brand>
                      <Nav className="mr-auto">
                          <Nav.Link as={Link} to="/streams">Streams</Nav.Link>
                          <Nav.Link as={Link} to="/links">Links</Nav.Link>
                      </Nav>
                      <i className="bi bi-person"/> {this.state.viewers}
                  </Navbar>

                  <Switch>
                      <Route path="/streams">
                          <Streams />
                      </Route>
                      <Route path="/links">
                          <Links />
                      </Route>
                  </Switch>
              </SocketContext.Provider>
      </Router>
    )
    }
}

export default App;
