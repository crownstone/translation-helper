
import React, {Component, CSSProperties} from "react";
import {LANGUAGE_MANAGER} from "./Translation";
import {TranslationEntry} from "./TranslationEntry";
import {eventBus} from "./util/EventBus";

const keyItemStyle = {padding:5};
const subKeyStyle : CSSProperties = {margin:0, fontSize:15, fontWeight:'bold'};

export const clickStyle = {
  cursor:"pointer",
  userSelect: "none"
}

const sharedStyle : CSSProperties = {
  width: 500,
  height: 22,
  borderRadius: 5,
  textAlign:'left',
  fontWeight:'bold'
};
const openBackground : CSSProperties = {
  backgroundColor: 'rgba(87,114,157,0.11)',
  padding:10,
  borderRadius: 10
}
// @ts-ignore
const openStyle : CSSProperties = {
  ...clickStyle,
  ...sharedStyle,
  padding:5,
}
// @ts-ignore
const closedStyle : CSSProperties = {
  ...clickStyle,
  ...sharedStyle,
  padding:10,
  margin:10,
  backgroundColor: "#57729d",
  color: "#fff"
}
// @ts-ignore
const closedFinishedStyle : CSSProperties = {
  ...clickStyle,
  ...sharedStyle,
  padding:10,
  margin:10,
  backgroundColor: "rgba(87,114,157,0.54)",
  color: "#fff"
}


export class TranslationFile extends Component<any, any> {


  cleanup = [];
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      translationsRequired: LANGUAGE_MANAGER.translationsRequired(this.props.file)
    }
  }

  componentDidMount(): void {
    this.cleanup.push(eventBus.on("SetFocus" + this.props.file,   () => { this.setState({open:true});  }));
    this.cleanup.push(eventBus.on("CloseFocus" + this.props.file, () => { this.setState({open:false}); }));
  }

  componentWillUnmount(): void {
    this.cleanup.forEach((c) => { c(); })
  }

  _clickHandler = () => {
    this.setState({open: !this.state.open});
  }

  _refresh = () => {
    let translationsRequired = LANGUAGE_MANAGER.translationsRequired(this.props.file);
    if (translationsRequired !== this.state.translationsRequired) {
      this.setState({translationsRequired: translationsRequired});
    }
    else {
      this.forceUpdate()
    }
  }

  getEntries() {
    let entries   = [];
    let keys      = LANGUAGE_MANAGER.getKeyArray(this.props.file);
    let languages = LANGUAGE_MANAGER.getLanguages();
    let setInitialFocus = false;
    keys.forEach((key) => {
      let langItems = [];

      languages.forEach((lang, index) => {
        let translationRequired = LANGUAGE_MANAGER.itemTranslationRequired(this.props.file, key, lang);
        let focus = false;
        if (translationRequired && setInitialFocus === false) {
          focus = true;
          setInitialFocus = true;
        }
        langItems.push(
          <TranslationEntry
            key={this.props.file+key+lang}
            language={lang}
            file={this.props.file}
            entryKey={key}
            initialFocus={focus}
            locked={lang === LANGUAGE_MANAGER.baseLanguage}
            translationRequired={LANGUAGE_MANAGER.itemTranslationRequired(this.props.file, key, lang)}
            refresh={this._refresh}
          />);
      })
      entries.push(
        <div style={keyItemStyle} key={this.props.file+key}>
          <p style={subKeyStyle}>{key}</p>
          {langItems}
        </div>
      );
    })

    return entries;
  }

  render() {
    let divStyle = closedStyle;
    if (this.state.open) {
      divStyle = openStyle;
    }
    else if (this.state.translationRequired === false) {
      divStyle = closedFinishedStyle
    }

    return (
      <div style={this.state.open ? openBackground : {}}>
        <div onClick={this._clickHandler} style={divStyle}>
          <div style={{float:'left'}}>{this.props.file}</div>
          <div style={{float:'right'}}>{LANGUAGE_MANAGER.statistics.files[this.props.file].keysTranslated + "/" +LANGUAGE_MANAGER.statistics.files[this.props.file].keyCount }</div>
        </div>
        { this.state.open && <div style={{paddingLeft: 20}}>{this.getEntries()}</div> }
      </div>

    )
  }
}