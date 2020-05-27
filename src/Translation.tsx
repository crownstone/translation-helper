import React, {Component} from "react";
import {LanguageManager} from "./data/LanguageManager";
import {TranslationList} from "./TranslationList";
import {TranslationStatistics} from "./TranslationStatistics";

import {eventBus} from "./util/EventBus";
import {FocusManager} from "./focusManager/FocusManager";


export const LANGUAGE_MANAGER = new LanguageManager();

export class Translation extends Component<any, any> {

  constructor(props) {
    super(props)

    this.state = {
      initialized: false
    }
  }

  componentDidMount() {
    FocusManager.init();
    LANGUAGE_MANAGER.init(this.props.token)
      .then(() => { this.setState({initialized: true}) })
  }

  componentWillUnmount(): void {
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
        <div tabIndex={0} style={{height:0, padding:0, margin:0}} onFocus={() => { console.log("RESET"); eventBus.emit("FOCUS_RESET")}}></div>
        {content}
        <div tabIndex={1e8} onFocus={() => { console.log("end"); eventBus.emit("FOCUS_END")}}></div>
      </div>
    )
  }

}
