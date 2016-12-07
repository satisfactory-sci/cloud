import React from 'react';

class App extends React.Component {

    constructor(props) {
        super(props);
        window.scrollTo(0,0);
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
