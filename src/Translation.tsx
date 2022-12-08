import React, {Component} from "react";
import {LanguageManager, LANGUAGES} from "./data/LanguageManager";
import {TranslationList} from "./TranslationList";
import {TranslationStatistics} from "./TranslationStatistics";

import {eventBus} from "./util/EventBus";
import {FocusManager} from "./focusManager/FocusManager";
import {TranslationTools} from "./TranslationTools";
import {TranslationWords} from "./TranslationWords";


export const LANGUAGE_MANAGER = new LanguageManager();

export class Translation extends Component<any, any> {

  eventCleanUp = null;
  searchInput = null;

  constructor(props) {
    super(props)

    this.state = {
      initialized: false,
      hideCompleted: false,
      results: []
    }
  }

  componentDidMount() {
    window.onresize = () => { this.forceUpdate(); };

    FocusManager.init();
    this.eventCleanUp = eventBus.on("RELOADING", () => { this.setState({initialized: false}, () => {
      this.initLanguages();
    })});
    LANGUAGE_MANAGER.init()
      .then(() => { this.setState({initialized: true}); })
  }

  initLanguages() {
    LANGUAGE_MANAGER.init()
      .then(() => { this.setState({initialized: true}); })
  }

  componentWillUnmount(): void {
    this.eventCleanUp();
    FocusManager.clean();
  }

  _handleSearch(e, dataset, itemIndex = 0) {
    let matches = LANGUAGE_MANAGER.find(dataset, e);
    let result = [];
    for (let m of matches) {
      result.push(<div key={m.file+m.item} style={{width: 700, padding:5, height:30, backgroundColor: itemIndex % 2 === 0 ? "#fff" : '#ddd', cursor: 'pointer', overflow:'hidden'}} onClick={() => {
        eventBus.emit("SetFocus"+m.file);
        setTimeout(() => {console.log('emit', "SetFocus"+LANGUAGES.nl_nl + m.file + m.item); eventBus.emit("SetFocus"+LANGUAGES.nl_nl + m.file + m.item) }, 50);
        this.setState({results: []});
      }}><b>{m.file}</b>: {m.content}</div>)
      itemIndex++

      if (itemIndex > 8) {
        break;
      }
    }
    return result;
  }

  handleSearch(e) {
    if (e.length > 2) {
      let result = this._handleSearch(e, LANGUAGES.nl_nl);
      if (result.length < 2) {
        let otherResults = this._handleSearch(e, LANGUAGES.en_us, result.length);
        result = result.concat(otherResults);
      }
      this.setState({results: result})
    }
    else {
      this.setState({results:[]})
    }
  }

  render() {
    let content;
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
          <div style={{overflow:'auto', height: window.innerHeight - 240, padding: 5}}>
            <TranslationList hideCompleted={this.state.hideCompleted}/>
          </div>
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
        <div style={{height: 240, width: '100vw'}}>
          <div style={{height: 160, width: '100vw', paddingLeft: 10, paddingTop:10, lineHeight: '25px'}}>
            <p>
              - If a translation is the same between english and dutch, use the checkbox “is the same”. <br/>
              - Try to roughly match the number of letters used in the english text. The UI is built to facilitate the size of the text.<br/>
              - Press <b>“Tab”</b> to quickly go to the next line that needs to be translated.<br/>
              - Sometimes, the item <b>|VAR_1|</b> is in the text. This is an external variable that will be inserted at that location. You must not remove it, but you can move it around.<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Example: “Hello |VAR_1|” will become “Hello Alex” in the app.<br/>
              - A Crownstone communicates to the user from the I-point of view. “I will dim to 50%”. We try to have the communication casual, upbeat and friendly.<br/>
            </p>
          </div>
          <div tabIndex={0} style={{height:0, padding:0, margin:0}} onFocus={() => {eventBus.emit("FOCUS_RESET")}}></div>
          <div style={{padding:10, position:'relative'}}>
            <b>Search:</b> <input
            ref={(input) => { this.searchInput = input; }}
            style={{width:500, height:30}}
            onChange={(e) => { this.handleSearch(e.target.value) }}
            onClick={(e) => { if (this.state.results.length === 0) { this.searchInput.value = ''}}}
          />
            &nbsp;
            <input type={"button"} value={"Expand all"}   onClick={() => { eventBus.emit("EXPAND_ALL") }} />&nbsp;
            <input type={"button"} value={"Collapse all"} onClick={() => { eventBus.emit("COLLAPSE_ALL") }} />&nbsp;
            <input type={"button"} value={this.state.hideCompleted === false ? 'Hide finished' : 'Show all'} onClick={() => { this.setState({ hideCompleted: !this.state.hideCompleted }); }} />&nbsp;
            <input type={"button"} value={'Log out'} onClick={() => { this.props.clearToken(); }} />&nbsp;
            <div style={{
              zIndex: 1e9,
              position:"absolute", top: 50, left:90, width: 700,
              height: this.state.results.length * 40 + 30,
              padding:10,
              backgroundColor: "#eee",
              borderRadius: 5,
              boxShadow: "2px 2px 10px rgba(0,0,0,0.5)",
              display: this.state.results.length > 0 ? 'block' : 'none'
            }}>{this.state.results}</div>
          </div>
        </div>
        {content}
        <div tabIndex={1e8} onFocus={() => { console.log("end"); eventBus.emit("FOCUS_END")}}></div>
        <a id="downloadAnchorElem" style={{display:"none"}}></a>
      </div>
    )
  }
}
