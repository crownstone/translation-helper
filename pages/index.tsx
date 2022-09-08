import React, {Component} from 'react'
import {TokenValidation} from "../src/TokenValidation";
import {Translation} from "../src/Translation";

export default class Home extends Component<any,any> {

  constructor(props) {
    super(props)

    this.state = {
      token: null
    }
  }

  render() {
    if (this.state.token === null) {
      return <TokenValidation callback={(token) => { this.setState({token: token}); console.log("SET") }} />;
    }
    else {
      return <Translation token={this.state.token} clearToken={() => {
        localStorage.removeItem('accessToken');
        this.setState({token: null});
      }} />;
    }
  }
}
