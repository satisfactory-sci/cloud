import React from 'react';
import ListView from'./ListView.jsx';
import DetailsView from'./DetailsView.jsx';
import AddView from'./AddView.jsx';
import SplashView from './SplashView.jsx';
import HomeView from './HomeView.jsx';

class App extends React.Component {

    constructor(props) {
        super(props);
    };

    render() {

        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export default App;
