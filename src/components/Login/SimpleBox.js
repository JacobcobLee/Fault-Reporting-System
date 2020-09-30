import React, { Component } from 'react';
import logo from "assets/img/bch_logo.png";
// import bgImage from "assets/img/bg2.png";


const divStyle = {
  width: '100%',
  height: '100vh',
  // backgroundImage: `url(${bgImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat', 
};


export default class SimpleBox extends Component {
  render() {
    const { title, body, footer } = this.props;
    return (
      <div style={divStyle}>
      <div className="container center">
        <div className="d-flex justify-content-center align-self-center" style={{marginTop:200}}>
          <div className="card col-sm-8">
            <div className="card-block">           
              <br></br>
              <div className="card-title text-center">  
              <img src={logo} width="220px" height="80px" alt=" "/> 
              <br></br>
              <br></br>
                {title}
              </div>
              <div className="card-body">
                {body}
              </div>
              {footer && <div className="card-footer">
                {footer}
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}
