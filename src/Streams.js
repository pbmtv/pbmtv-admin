import React from "react";
import {ListGroup} from "react-bootstrap";
import ReactPlayer from "react-player";
import {SocketContext} from "./context/socket";

function alphaSort(a, b) {
    if (a.toUpperCase() < b.toUpperCase())
        return -1;
    return 1;
}

class Streams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedVideo: "",
            availableVideos: []
        };
    }
    componentDidMount() {
        this.socket = this.context;
        this.socket.on('streams', (data) => {
            this.setState({ availableVideos: data});
        });
        this.socket.emit('get_streams', (data) => {
            this.setState({ availableVideos: data });
        })
    }

    componentWillUnmount() {
        this.socket.off('streams');
    }

    listItems() {
        return this.state.availableVideos.sort(alphaSort).map((item, i)  => (
            <ListGroup.Item action="true" onClick={() => this.playVideo(item)} key={i}>
                {item}
            </ListGroup.Item>
        ));
    }

    playVideo(stream) {
        this.setState({selectedVideo: `https://sm1.pbmtv.org/${stream}/playlist.m3u8`});
    }

    render() {
        return (
            <div>
                <h1>Available Streams</h1>
                <ReactPlayer playing
                             url={this.state.selectedVideo}
                             controls={true}
                             config={{
                                file: {
                                    hlsOptions: {
                                        lowLatencyMode: true
                                    }
                                }
                             }}/>
                <ListGroup>{this.listItems()}</ListGroup>
            </div>
        )
    }
}

Streams.contextType = SocketContext;

export default Streams;
