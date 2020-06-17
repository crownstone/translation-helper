import React, {Component} from "react";
import {LanguageManager} from "./data/LanguageManager";
import {TranslationList} from "./TranslationList";
import {TranslationStatistics} from "./TranslationStatistics";

import {eventBus} from "./util/EventBus";
import {FocusManager} from "./focusManager/FocusManager";
import {TranslationTools} from "./TranslationTools";
import {TranslationWords} from "./TranslationWords";


export const LANGUAGE_MANAGER = new LanguageManager();

export class Translation extends Component<any, any> {

  eventCleanUp = null;

  constructor(props) {
    super(props)

    this.state = {
      initialized: false
    }
  }

  componentDidMount() {
    FocusManager.init();
    this.eventCleanUp = eventBus.on("RELOADING", () => { this.setState({initialized: false}, () => {
      this.initLanguages();
    })});
    LANGUAGE_MANAGER.init(this.props.token)
      .then(() => { this.setState({initialized: true}) })
  }

  initLanguages() {
    LANGUAGE_MANAGER.init(this.props.token)
      .then(() => { this.setState({initialized: true}) })
  }

  componentWillUnmount(): void {
    this.eventCleanUp();
    FocusManager.clean();
  }

  render() {
    let content = null;
    if (this.state.initialized === false) {
      content = (
        <div>
          <h2>preparing to translate it</h2>
        </div>
      )
    }
    else {
      content = (
        <div>
          <TranslationStatistics />
          <TranslationTools />
          <TranslationWords />
          <div style={{overflow:'auto', height: '99VH', padding: 5}}><TranslationList /></div>
          <style jsx global>{`
        body {
          padding:0px; margin:0px; overflow: hidden;
        }
      `}</style>
        </div>
      );
    }

    return (
      <div style={{height: '100vh', margin:0, padding:0}}>
        <div style={{height: 160, width: '100vw', paddingLeft: 10, paddingTop:10, lineHeight: '25px'}}>
          <p>
            - If a translation is the same between english and dutch, use the checkbox “is the same”. <br/>
            - Try to roughly match the number of letters used in the english text. The UI is built to facilitate the size of the text.<br/>
            - Press “Tab” to quickly go to the next line that needs to be translated.<br/>
            - Sometimes, the item |VAR_1| is in the text. This is an external variable that will be inserted at that location. You must not remove it, but you can move it around.<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Example: “Hello |VAR_1|” will become “Hello Alex” in the app.<br/>
            - A Crownstone communicates to the user from the I-point of view. “I will dim to 50%”. We try to have the communication casual, upbeat and friendly.<br/>
          </p>
        </div>
        <div tabIndex={0} style={{height:0, padding:0, margin:0}} onFocus={() => { console.log("RESET"); eventBus.emit("FOCUS_RESET")}}></div>
        {content}
        <div tabIndex={1e8} onFocus={() => { console.log("end"); eventBus.emit("FOCUS_END")}}></div>
        <a id="downloadAnchorElem" style={{display:"none"}}></a>
      </div>
    )
  }

}
