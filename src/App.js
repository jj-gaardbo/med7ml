import React from 'react';
import SketchWrapper from "./SketchWrapper";
import API from "./API";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            play_along: true,
            number_of_birds: 0,
            ready: false
        };

        this.handle_play_along = this.handle_play_along.bind(this);
        this.handle_number_of_birds = this.handle_number_of_birds.bind(this);
    }

    handle_number_of_birds(number_of_birds){
        this.setState({number_of_birds: number_of_birds,ready:true});
    }

    componentDidMount() {
        API.get_number_of_birds(this.handle_number_of_birds);
    }

    handle_play_along() {
        this.setState({play_along: !this.state.play_along});
    }

    render() {
        return(
            <div className="App">
                {!this.state.ready ? (
                    <p>Loading...</p>
                ) : (
                    <SketchWrapper play_along={this.state.play_along} number_of_birds={this.state.number_of_birds}></SketchWrapper>
                )}
            </div>
        )
    }
}

export default App;
