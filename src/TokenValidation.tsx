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

  render() {
    return (
      <div>
        <h2>Insert token</h2>
        <input
          style={{width:300}}
          value={this.state.token}
          onChange={(e) => {
            this.setState({token: e.target.value}, () => {
              if (this.state.token.length >= 64) {
                postData("/api/validate",{token: this.state.token})
                  .then((result) => {
                    if (result.success === false) {
                      this.setState({tokenFailed: true})
                    }
                    else {
                      this.setState({tokenFailed: false, checkPassed: true});
                      this.props.callback(this.state.token);
                    }
                  })
              }
            })
          }}
        />
        { this.state.tokenFailed && <p>Invalid token</p>}
      </div>
    )
  }
}