import React, {Component} from "react";
import {postData} from "./util/FetchUtil";


export class TokenValidation extends Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      token:'',
      checkPassed: false,
      tokenFailed: false,
    }
  }

  componentDidMount() {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem('accessToken');
      if (token !== null) {
        this.setState({token: token}, () => {
          this._checkToken();
        })
      }
    }
  }

  _checkToken() {
    if (this.state.token.length >= 64) {
      postData("/api/validate",{token: this.state.token})
        .then((result) => {
          if (result.success === false) {
            this.setState({tokenFailed: true})
          }
          else {
            this.setState({tokenFailed: false, checkPassed: true});
            this.props.callback(this.state.token);
            localStorage.setItem('accessToken', this.state.token);
          }
        })
    }
  }

  render() {
    if (this.state.tokenFailed) {
      return (
        <div>
          <h2>Invalid token / No access</h2>
          <input type={"button"} value={"Retry"} onClick={() => {
            this.setState({token: null, tokenFailed: false})
          }} />
        </div>
      );
    }
    return (
      <div>
        <h2>Insert token</h2>
        <input
          style={{width:600, padding:10}}
          value={this.state.token}
          onChange={(e) => {
            this.setState({token: e.target.value}, () => {
              this._checkToken();
            })
          }}
        />
        <h3>We'll store the token in a cookie! Delicious!</h3>
      </div>
    )
  }
}
