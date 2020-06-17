import React, {Component} from "react";
import {colors} from "./styles";
import {LANGUAGE_MANAGER} from "./Translation";
import {LANGUAGES} from "./data/LanguageManager";
import {eventBus} from "./util/EventBus";

export class TranslationWords extends Component<any, any> {

  cleanupEvent = null;
  constructor(props) {
    super(props)

    this.state = { initialized: false };
  }

  componentDidMount(): void {
    this.cleanupEvent = eventBus.on("DATA_UPDATED", () => { this.forceUpdate() })
  }

  componentWillUnmount(): void {
    this.cleanupEvent();
  }

  render() {
    return (
      <div style={{position:'absolute', top:260, right:30, width:200, borderRadius:10, backgroundColor: colors.green.hex, padding:20}}>
        <table>
          <tbody>
          <tr>
            <th style={{textAlign:'left'}}>EN</th><th style={{textAlign:'left'}}>NL</th>
          </tr>
          <tr>
            <td>Sphere</td><td>Sfeer</td>
          </tr>
          <tr>
            <td>Crownstone</td><td>Crownstone</td>
          </tr>
          <tr>
            <td>Scene</td><td>Scene</td>
          </tr>
          <tr>
            <td>Behaviour</td><td>Behaviour</td>
          </tr>
          <tr>
            <td>Twilight</td><td>Twilight</td>
          </tr>
          <tr>
            <td>Presence</td><td>Aanwezigheid</td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }

}
