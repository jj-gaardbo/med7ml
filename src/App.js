import React from 'react';
import SketchWrapper from "./SketchWrapper";

require('./main.css');
class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            generation: 1,
            mating_pool_size: 0,
            max_fitness: 0,
            population_count: 0
        };

        this.handle_info = this.handle_info.bind(this)
    }

    handle_info(info){
        this.setState({generation:info[0], mating_pool_size:info[2], max_fitness:info[1], population_count:info[3]});
    }

    render() {
        return(
            <div className="App">
                <SketchWrapper info={this.handle_info} />
                <div className="info">
                    <p>Generation: {this.state.generation}</p>
                    <p>Population Size: {this.state.population_count}</p>
                    <p>Mating Pool Size: {this.state.mating_pool_size}</p>
                    <p>Max Fitness: {this.state.max_fitness}</p>
                </div>
            </div>
        )
    }
}
export default App;
