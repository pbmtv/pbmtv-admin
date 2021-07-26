import React from "react";
import {ListGroup} from "react-bootstrap";
import ReactPlayer from "react-player";

function alphaSort(a, b) {
    if (a.name.toUpperCase() < b.name.toUpperCase())
        return -1;
    return 1;
}
function activeSort(a, b) {
    if (a.active && !b.active)
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
        const currentUrl = window.location.protocol + '//' + window.location.hostname;
        console.log(currentUrl);
        const url = new URL(currentUrl + ':3030/wms/live_streams');
        fetch(url).then(response => response.json()).then((response) => {
            console.log(response);
            const streams = response.streams.map((stream) => {
                return {
                    id: stream.id,
                    name: `${stream.application}/${stream.stream}`,
                    url: `https://sm1.pbmtv.org/${stream.application}/${stream.stream}/playlist.m3u8`
                }
            })
            this.setState({ availableVideos: streams })
            this.getStates();
            this.interval = setInterval(() => this.getStates(), 15000);
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    listItems() {
        return this.state.availableVideos.sort(alphaSort).sort(activeSort).map((item)  => (
            <ListGroup.Item action="true" onClick={() => this.playVideo(item.url)} key={item.id}>
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

export default Streams;
