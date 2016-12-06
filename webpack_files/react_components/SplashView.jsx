import React from 'react'
import ReactDom from 'react-dom'

require("../stylesheets/SplashView.scss");

class SplashView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      randomImages: [
      "/images/hakan.jpg",
      "/images/gandalf.jpg",
      "/images/sanni.jpg",
      "/images/stina.jpeg",
      "/images/teemuselanne.jpg",
      "/images/tuomo.png",
      "/images/max.png",
      "/images/obama.jpg",
      ],
      welcome: false
    };

    this.registerUser = this.registerUser.bind(this);
    this.submit = this.submit.bind(this);
  }

  //Helper function for fade in/out transitions
  fade(step, elem, origin, test, cb) {
    let opacity = origin;
    let id = setInterval(() => {
      if(test(opacity)){
        clearInterval(id);
        cb()
      }else{
        opacity += step;
        elem.style.opacity = opacity;
      }
    }, 5);
  }

  componentDidMount() {
    let splash = document.getElementById('splash');
    let opacity = 0;
    splash.style.opacity = 0;
    this.fade(0.01, splash, 0, (o) => {return o > 1} ,() => {});
  }

  //Function called after user has submitted his/her name
  registerUser(e) {
    let input = ReactDom.findDOMNode(this.refs.nameInput);
    if(input.value.length == 0) {
      return;
    }
    this.props.dataHandler.userInfo.userName = input.value;
    //Random image for user
    let index = Math.round(Math.random()*(this.state.randomImages.length - 1));
    this.props.dataHandler.userInfo.img = this.state.randomImages[index];
    //transition to welcome screen
    let splash = document.getElementById('splash');
    let opacity = 1;
    this.fade(-0.01, splash, 1, (o) => {return o <= 0}, () => {
      this.setState({
        welcome: true
      })
    })
  }

  submit(e) {
    if(e.keyCode == 13){
      this.registerUser();
    }
  }

  getPhrase() {
    const phrases = [
      "Enjoy your afterwork",
    ];
    //let i = Math.round(Math.random() * phrases.length);
    return phrases[0];
  }

  render() {
    if(!this.props.visible) {
      return (<div></div>)
    }
    let box = {
      height: window.innerHeight - 10 + 'px',
    }

    //Transition to ListView
    if(this.state.welcome) {
      let splash = document.getElementById('splash');
      function wait() {
        setTimeout(() => {
          this.fade(-0.01, splash, 1, (o) => {return o <= 0}, () => {
            this.props.onRegister();
          })
        }, 1000)
      }
      splash.style.opacity = 0;
      this.fade(0.01, splash, 0, (o) => {return o > 1}, wait.bind(this));
      return (
        <div style={box} id='splash'>
          <div className="splash-container">
            <div className="splash-item"><h2 id="splash-phrase">{this.getPhrase()}</h2></div>
            <div className="splash-item"><h2>{this.props.dataHandler.userInfo.userName}</h2></div>
          </div>
        </div>
      )
    }

    return (
      <div style={box} id="splash">
        <div className="splash-container">
          <div className="splash-item"><img src="/images/logo_minified.png" id="splash-logo"/></div>
          <div className="splash-item"><h2>Who are you?</h2></div>
          <div className="splash-item"><input type="text" id="splash-input" ref="nameInput" placeholder="Name" autoFocus onKeyDown={this.submit}/></div>
          <div className="splash-item"><button id="splash-button" onClick={this.registerUser}>Begin</button></div>
        </div>
      </div>
    )
  }
}

export default SplashView
