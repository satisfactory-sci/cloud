import React from 'react'
import ReactDom from 'react-dom'

class SplashView extends React.Component {

  constructor(props) {
    super(props);

    this.removeOutline = this.removeOutline.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  componentDidMount() {
    let splash = document.getElementById('splash');
    let opacity = 0;
    splash.style.opacity = 0;
    let id = setInterval(() => {
      if(opacity > 1){
        clearInterval(id);
      }else{
        opacity += 0.01;
        splash.style.opacity = opacity;
      }
    }, 5);
  }

  removeOutline(e) {
    let input = ReactDom.findDOMNode(this.refs.nameInput);
    input.style.outline = 'none';
  }

  registerUser(e) {
    let input = ReactDom.findDOMNode(this.refs.nameInput);
    this.props.dataHandler.userInfo.userName = input.value;
    this.props.onRegister();
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
      height: window.innerHeight + 'px',
    }
    let items = {
      textAlign: 'center',
      width: '100%',
      color: '#212121',
    }

    let input = {
      padding:'0.6em 0.1em 0.1em 0.1em',
      border: '0px 0px 0px 0px',
      borderWidth: '0px 0px 2px 0px',
      boxShadow: 'none',
      fontSize: '1.2em',
      fontFamily: '"Roboto", sans-serif',
      textAlign: 'center',
      width:'40%'
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
          <div style={items}><input type="text" style={input} ref="nameInput" onClick={this.removeOutline}/></div>
          <div style={items}><button style={button} onClick={this.registerUser}>Begin</button></div>
        </div>
      </div>
    )
  }
}

export default SplashView
