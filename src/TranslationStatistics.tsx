import React, {Component} from "react";
import {colors} from "./styles";
import {LANGUAGE_MANAGER} from "./Translation";
import {LANGUAGES} from "./data/LanguageManager";
import {eventBus} from "./util/EventBus";

export class TranslationStatistics extends Component<any, any> {

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
    let statistics = LANGUAGE_MANAGER.getStatistics();
    return (
      <div style={{position:'absolute', top:10, right:30, width:500, height: 50, borderRadius:10, backgroundColor: colors.green.hex, padding:20}}>
        <table>
          <tbody>
            <tr>
              <th style={{textAlign:'left',width:80}}>Language:</th>
              <th style={{textAlign:'right',width:70}}>Done:</th>
              <th style={{textAlign:'right',width:150}}>Words remaining:</th>
              <th style={{textAlign:'right',width:100}}>Words %:</th>
              <th style={{textAlign:'right',width:100}}>Items %:</th>
            </tr>
            <tr>
              <td>NL_NL</td>
              <td style={{textAlign:'right'}}>{statistics[LANGUAGES.nl_nl].wordsTranslated}</td>
              <td style={{textAlign:'right'}}>{statistics[LANGUAGES.nl_nl].wordsToTranslate}</td>
              <td style={{textAlign:'right'}}>{statistics[LANGUAGES.nl_nl].wordsPercentage} %</td>
              <td style={{textAlign:'right'}}>{statistics[LANGUAGES.nl_nl].keysPercentage} %</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

}
