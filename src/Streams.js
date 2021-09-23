import React from "react";
import {ListGroup, Row, Col} from "react-bootstrap";
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
            availableVideos: [],
            imageHash: Date.now()
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
        this.hashInterval = setInterval(() => {
            this.setState({ imageHash: Date.now()});
        }, 10000);
    }

    componentWillUnmount() {
        this.socket.off('streams');
        clearInterval(this.hashInterval);
    }

    isAudio(stream) {
        return (stream.startsWith('radio') || stream === 'pbmtv/live_audio');
    }
    isVideo(stream) {
        return (stream.startsWith('artist') || stream.startsWith('pbmtv') || stream.startsWith('stream')) && stream !== 'pbmtv/live_audio';
    }

    listItems() {
        return this.state.availableVideos.sort(alphaSort).map((stream, i)  => (
              <ListGroup.Item action="true" onClick={() => this.playVideo(stream)} key={i}>
                  <span style={{width: "110px", display: "inline-block"}} >
                    { this.isVideo(stream) &&
                        <img src={`https://sm1.pbmtv.org/${stream}/thumbnail.jpg?${this.state.imageHash}`} width="100" />
                    }
                      { this.isAudio(stream)  &&
                      <i className="bi bi-music-note-beamed" style={{width: "100px"}} />
                      }
                  </span>
                  {stream}
              </ListGroup.Item>
            )
        );
    }

    playVideo(stream) {
        if (this.isVideo(stream) || stream === 'pbmtv/live_audio') {
            this.setState({selectedVideo: `https://sm1.pbmtv.org/${stream}/playlist.m3u8`});
        } else if (this.isAudio(stream) && stream !== 'pbmtv/live_audio') {
            this.setState({selectedVideo: `https://sm1.pbmtv.org/${stream}/icecast.audio`});
        }
    }

    render() {
        return (
            <div>
                <h1>Live Streams</h1>
                <Row>
                    <Col xs lg="4"><ListGroup>{this.listItems()}</ListGroup></Col>
                    <Col md="auto">
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
                    </Col>
                </Row>
            </div>
        )
    }
}

Streams.contextType = SocketContext;

export default Streams;
