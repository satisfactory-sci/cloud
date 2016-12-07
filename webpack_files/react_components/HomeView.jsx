import React from 'react';
import ListView from './ListView.jsx'
import SplashView from './SplashView.jsx';

require("../stylesheets/HomeView.scss");

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            splashViewVisible: true,
            listViewVisible: false,
            first: false,
        }
        this.backToInitialState = this.backToInitialState.bind(this);
    };

    backToInitialState(e) {
        this.setState({
            splashViewVisible: false,
            listViewVisible: true,
            first: true
        });
    }

    render() {

        window.dataHandler.start(this);
        //Has the user logged in?
        if(window.dataHandler.userInfo.userName == "") {
          return (
              <div id="app">
                  <SplashView visible={this.state.splashViewVisible} dataHandler={window.dataHandler} onRegister={this.backToInitialState}/>
              </div>
          );
        }else{
          return (
              <div id="app">
                  <ListView first={this.state.first} visible={true} dataHandler={window.dataHandler} />
              </div>
          );
        }
    }
}

export default Home;
