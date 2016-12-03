import React from 'react'
import ReactDom from 'react-dom'

class SplashView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      randomImages: [
      "/images/hakan.jpg",
      "/images/gandalf.jpg",
      "/images/sanni.jpg",
      "/images/stina.jpg",
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
    let index = Math.round(Math.random()*this.state.randomImages.length);
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

  render() {
    if(!this.props.visible) {
      return (<div></div>)
    }
    let box = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      height: window.innerHeight - 10 + 'px',
    }
    let items = {
      textAlign: 'center',
      width: '100%',
      color: '#212121',
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
          <div style={{width: 'auto'}}>
            <div style={items}><h1>Have a good afterwork</h1></div>
            <div style={items}><h1>{this.props.dataHandler.userInfo.userName}</h1></div>
          </div>
        </div>
      )
    }

    let input = {
      padding:'0.6em 0.1em 0.1em 0.1em',
      border: '0px 0px 0px 0px',
      borderWidth: '0px 0px 2px 0px',
      boxShadow: 'none',
      fontSize: '1.2em',
      fontFamily: '"Roboto", sans-serif',
      textAlign: 'center',
      width:'40%',
      outline: 'none',
    }

    let button = {
      marginTop: '1em',
      padding: '0.5em 1.2em 0.5em 1.2em',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1em',
      fontFamily: '"Roboto", sans-serif',
      backgroundColor: '#FB8C00',
      color: 'white',
    }
    return (
      <div style={box} id="splash">
        <div style={{width: 'auto'}}>
          <div><img src="/images/logo_minified.png" style={{width: '100%'}}/></div>
          <div style={items}><h1>Who are you?</h1></div>
          <div style={items}><input type="text" style={input} ref="nameInput" placeholder="Name" autoFocus onKeyDown={this.submit}/></div>
          <div style={items}><button style={button} onClick={this.registerUser}>Begin</button></div>
        </div>
      </div>
    )
  }
}

export default SplashView
