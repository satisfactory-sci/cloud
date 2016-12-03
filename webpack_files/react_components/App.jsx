import React from 'react';
import ListView from'./ListView.jsx';
import DetailsView from'./DetailsView.jsx';
import AddView from'./AddView.jsx';
import SplashView from './SplashView.jsx';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            splashViewVisible: true,
            listViewVisible: false,
            addViewVisible: false,
            detailsViewVisible: false,
            chosenEvent: {}
        }

        this.onChooseEvent = this.onChooseEvent.bind(this);
        this.onClickAddButton = this.onClickAddButton.bind(this);
        this.backToInitialState = this.backToInitialState.bind(this);
    };

    backToInitialState(e) {
        this.setState({
            splashViewVisible: false,
            listViewVisible: true,
            addViewVisible: false,
            detailsViewVisible: false,
            chosenEvent: {}
        });
    }

    onChooseEvent(eventData) {
        this.setState({
            splashViewVisible: false,
            listViewVisible: false,
            addViewVisible: false,
            detailsViewVisible: true,
            chosenEvent: eventData
        });
    }

    onClickAddButton(e) {
        this.setState({
            splashViewVisible: false,
            listViewVisible: false,
            addViewVisible: true,
            detailsViewVisible: false,
            chosenEvent: {}
        });
    }

    render() {

        this.props.dataHandler.start(this);

        var appStyle = {
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            margin: 'auto',
            display: 'inline-block'
        }
        return (
            <div style={appStyle}>
                <SplashView visible={this.state.splashViewVisible} dataHandler={this.props.dataHandler} onRegister={this.backToInitialState}/>
                <ListView visible={this.state.listViewVisible} dataHandler={this.props.dataHandler} onChooseEvent={this.onChooseEvent} onClickAddButton={this.onClickAddButton}/>
                <DetailsView visible={this.state.detailsViewVisible} dataHandler={this.props.dataHandler} onCancelClicked={this.backToInitialState} data={this.state.chosenEvent}/>
                <AddView visible={this.state.addViewVisible} dataHandler={this.props.dataHandler} onCancelClicked={this.backToInitialState} />
            </div>
        );
    }
}

export default App;
