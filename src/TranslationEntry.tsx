import React, {Component} from "react";
import {LANGUAGE_MANAGER} from "./Translation";
import {colors} from "./styles";
import {eventBus} from "./util/EventBus";


export class TranslationEntry extends Component<any, any> {

  element = null;
  initialValue = null;
  nameInput = null;

  constructor(props) {
    super(props);

    this.element      = LANGUAGE_MANAGER.getElement(this.props.language, this.props.file, this.props.entryKey);
    this.initialValue = this.element.value;
    this.state        = { value: this.initialValue, shouldBeTheSame: this.element.shouldBeTheSame };
  }

  componentDidMount(): void {
    console.log("initialFocus", this.props.language, this.props.initialFocus, this.props.translationRequired, this.props.entryKey)
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
    return (
      <div style={{paddingLeft: 10}}>
        <p style={{width:40, display: 'inline-block', margin:0, fontSize:12, }}>{this.props.language}</p>
        <div style={{width:1000, display: 'inline-block'}}>
          <textarea
            ref={(input) => { this.nameInput = input; }}
            style={{width:800, height:25, backgroundColor: color, display: "inline-block",}}
            value={this.state.value}
            onChange={(e) => { this.setState({value: e.target.value}) }}
            disabled={this.props.locked}
            onFocus={() => {
              eventBus.emit("FOCUS", {file: this.props.file, language: this.props.langauge, key: this.props.entryKey, type:"input"})
            }}
            onBlur={() => {
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