import React from 'react';
import {ListGroup} from "react-bootstrap";

class Links extends React.Component {
    render() {
        return (
            <div>
                <h1>Links</h1>
                <ListGroup>
                    <ListGroup.Item action href="clocks.html">OBS World Clocks</ListGroup.Item>
                    <ListGroup.Item action href="scrollers/scroller.html">OBS Text Scroller</ListGroup.Item>
                    <ListGroup.Item action href="counter.html">Live Counter</ListGroup.Item>
                </ListGroup>
            </div>
        )
    }
}

export default Links
