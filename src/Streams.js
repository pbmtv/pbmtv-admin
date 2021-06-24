import React from "react";
import {ListGroup} from "react-bootstrap";
import ReactPlayer from "react-player";

class Streams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedVideo: "",
            availableVideos: [
                {
                    name: "pbmtv",
                    url: "https://sm1.pbmtv.org/pbmtv/live/playlist.m3u8",
                    active: false
                },
                {
                    name: "pbmtv1",
                    url: "https://sm1.pbmtv.org/pbmtvincoming1/live/playlist.m3u8",
                    active: false
                },
                {
                    name: "pbmtv2",
                    url: "https://sm1.pbmtv.org/pbmtvincoming2/live/playlist.m3u8",
                    active: false
                },
                {
                    name: "pbmtv3",
                    url: "https://sm1.pbmtv.org/pbmtvincoming3/live/playlist.m3u8",
                    active: false
                }
            ]
        };

    }
    componentDidMount() {
        this.getStates();
        this.interval = setInterval(() => this.getStates(), 15000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    listItems() {
        return this.state.availableVideos.map((item)  => (
            <ListGroup.Item action="true" onClick={() => this.playVideo(item.url)} key={item.name}>
                <i className={ "bi bi-record-fill " + (item.active ? "text-success" : "text-danger")}/> {item.name}
            </ListGroup.Item>
        ));
    }

    getStates() {
        let availableVideos = [...this.state.availableVideos];
        availableVideos.forEach((video, i) => {
            fetch(video.url)
                .then((response) => response.text())
                .then((response) => {
                        video.active = !response.startsWith('<html>');
                        this.setState({ availableVideos: availableVideos});
                    },
                    () => video.active = false)
        });
    }

    playVideo(video) {
        this.setState({selectedVideo: video});
    }

    render() {
        return (
            <div>
                <h1>Available Streams</h1>
                <ReactPlayer playing
                             url={this.state.selectedVideo}
                             controls={true}/>
                <ListGroup>{this.listItems()}</ListGroup>
            </div>
        )
    }
}

export default Streams;
