import React from 'react';
import ListView from './ListView.jsx'
import SplashView from './SplashView.jsx';

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            splashViewVisible: true,
            listViewVisible: false,
        }

        this.backToInitialState = this.backToInitialState.bind(this);
    };

    backToInitialState(e) {
        this.setState({
            splashViewVisible: false,
            listViewVisible: true,
        });
    }

    render() {

        window.dataHandler.start(this);

        var appStyle = {
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            margin: 'auto',
            display: 'inline-block'
        }
        //Has the user logged in?
        if(window.dataHandler.userInfo.userName == "") {
          return (
              <div style={appStyle}>
                  <SplashView visible={this.state.splashViewVisible} dataHandler={window.dataHandler} onRegister={this.backToInitialState}/>
                  <ListView visible={this.state.listViewVisible} dataHandler={window.dataHandler} />
              </div>
          );
        }else{
          return (
              <div style={appStyle}>
                  <ListView visible={true} dataHandler={window.dataHandler} />
              </div>
          );
        }
    }
}

export default Home;
