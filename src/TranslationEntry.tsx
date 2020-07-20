import React, {Component} from "react";
import {LANGUAGE_MANAGER} from "./Translation";
import {colors} from "./styles";
import {eventBus} from "./util/EventBus";
import {VARS} from "./data/LangaugeContainer";
import {LANGUAGES} from "./data/LanguageManager";



export class TranslationEntry extends Component<any, any> {

  element = null;
  initialValue = null;
  nameInput = null;
  hasVars = {}
  originalLength = 0;
  breaklines = 0;

  constructor(props) {
    super(props);

    let originalLanguageElement = LANGUAGE_MANAGER.getElement(LANGUAGES.en_us, this.props.file, this.props.entryKey).value;
    this.breaklines = originalLanguageElement.split("\n").length - 1;
    this.originalLength = originalLanguageElement.length - 50*this.breaklines;


    this.element      = LANGUAGE_MANAGER.getElement(this.props.language, this.props.file, this.props.entryKey);
    this.initialValue = this.element.value;
    VARS.forEach((VAR) => { this.hasVars[VAR] = this.initialValue.indexOf(VAR) !== -1; });
    this.state        = { value: this.initialValue, shouldBeTheSame: this.element.shouldBeTheSame, backgroundColor: null };
  }

  componentDidMount(): void {
    if (this.props.initialFocus) {
      this.nameInput.focus();
      this.nameInput.select()
    }
  }

  render() {
    let color = this.props.translationRequired ? colors.orange.hex : colors.green.hex;
    if (this.props.language == LANGUAGE_MANAGER.baseLanguage) {
      color = "#fff"
    }
    if (this.state.backgroundColor) {
      color = this.state.backgroundColor;
    }

    let textAreaHeight = Math.max(20, Math.ceil(this.originalLength/85)*20 + 20*this.breaklines);

    return (
      <div style={{paddingLeft: 10, verticalAlign:'middle', height:textAreaHeight + 6}}>
        <div style={{width:40, height:textAreaHeight, float:'left', fontSize:12, verticalAlign:"middle", lineHeight:textAreaHeight+"px"}}>{this.props.language}</div>
        <div style={{width:1000, display: 'inline-block'}}>
          <textarea
            ref={(input) => { this.nameInput = input; }}
            style={{width:800, height:textAreaHeight, backgroundColor: color, display: "inline-block",}}
            value={this.state.value}
            onChange={(e) => { this.setState({value: e.target.value}) }}
            disabled={this.props.locked}
            onFocus={() => {
              this.nameInput.select()
              this.setState({backgroundColor: colors.lightBlue.hex})
              eventBus.emit("FOCUS", {file: this.props.file, language: this.props.langauge, key: this.props.entryKey, type:"input"})
            }}
            onBlur={() => {
              for (let i = 0; i < VARS.length; i++) {
                let VAR = VARS[i];
                if (this.hasVars[VAR]) {
                  if (this.state.value.indexOf(VAR) === -1) {
                    alert("You cannot remove " + VAR + " from the translation. Reverting...")
                    this.setState({value: this.initialValue, backgroundColor:null});
                    return;
                  }
                }
              }
              this.setState({backgroundColor:null});

              this.element.save(this.state.value);
              this.props.refresh()
            }}
          />
          {this.state.shouldBeTheSame !== undefined &&
            <div style={{display: 'inline-block'}}>
              <input
                style={{display: "inline-block"}}
                type={"checkbox"}
                checked={this.state.shouldBeTheSame}
                onFocus={() => {
                  eventBus.emit("FOCUS", {file: this.props.file, language: this.props.langauge, key: this.props.entryKey, type:"checkbox"})
                }}
                onChange={(e) => {
                  this.setState({shouldBeTheSame: e.target.checked}, () => {
                    this.element.saveSimilar(this.state.shouldBeTheSame);
                    this.props.refresh()
                  });
                }}
              />
              <span style={{}}>is the same</span>
            </div>
          }
        </div>
      </div>
    )
  }
}