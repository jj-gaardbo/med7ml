import React from 'react';
import SketchWrapper from "./SketchWrapper";
import {get_alive_count} from "./constants";

require('./main.css');
class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            generation: 1,
            mating_pool_size: 0,
            max_fitness: 0,
            population_count: 0,
            alive_count: 0,
            avg_score:0
        };

        this.handle_alive_count = this.handle_alive_count.bind(this)
        this.handle_info = this.handle_info.bind(this)
    }

    handle_alive_count(count){
        this.setState({alive_count:count});
    }

    handle_info(info){
        if(info){
            this.setState({
                generation:info[0],
                population_count:info[1],
                max_fitness:info[2],
                mating_pool_size:info[3],
                avg_score:info[4],
                });
        }
    }

    render() {
        return(
            <div className="App">
                <SketchWrapper count={this.handle_alive_count} info={this.handle_info} />
                <div className="info">
                    <p>Generation: {this.state.generation}</p>
                    <p>Population Size: {this.state.population_count}</p>
                    <p>Mating Pool Size: {this.state.mating_pool_size}</p>
                    <p>Max Fitness: {this.state.max_fitness}</p>
                    <p>Alive Count: {this.state.alive_count}</p>
                    <p>Avg score: {this.state.avg_score}</p>
                </div>
            </div>
        )
    }
}
export default App;
