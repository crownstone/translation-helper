import React, {Component, CSSProperties} from "react";
import {colors} from "./styles";
import {LANGUAGE_MANAGER} from "./Translation";
import {LANGUAGES} from "./data/LanguageManager";
import {clickStyle} from "./TranslationFile";
import {postData} from "./util/FetchUtil";
import {eventBus} from "./util/EventBus";

// @ts-ignore
let buttonStyle : CSSProperties = {...clickStyle, display:"inline-block", padding:15, borderRadius:10, color: colors.white.hex, fontSize:20, fontWeight:'bold'}

export class TranslationTools extends Component<any, any> {

  constructor(props) {
    super(props)

    this.state = { showCode: false, value: "INSERT PERMISSION CODE", success: null };
  }

  getButton() {
    if (this.state.showCode === false) {
      return (
        <div style={{...buttonStyle, backgroundColor: colors.red.hex, float: "right"}}
          onClick={() => {
               if (confirm("DANGER: all undownloaded data will be lost! Are you sure?")) {
                 this.setState({showCode: true});
               }
             }}>Pull from Git</div>
      )
    }
    else {
      return (
        <div style={{...buttonStyle, backgroundColor: colors.menuTextSelected.hex, float: "right"}}
             onClick={() => { this.setState({showCode: false, value: "INSERT PERMISSION CODE" }); }}>Cancel</div>
      )
    }
  }

  render() {
    let height = 50;
    if (this.state.showCode){
      height = 100;
    }
    return (
      <div style={{position:'absolute', top:110, right:30, width:300, height: height, borderRadius:10, backgroundColor: colors.green.hex, padding:20}}>
        <div style={{...buttonStyle, backgroundColor: colors.blue.hex, float:"left"}} onClick={() => {
          LANGUAGE_MANAGER.downloadLanguageFile(LANGUAGES.nl_nl)
        }}>Download</div>
        { this.getButton() }
        { this.state.showCode &&
          <input
            onFocus={() => { this.setState({value:'', success:null})}}
            style={{width:270, height:30, margin:10, backgroundColor: this.state.success === false && colors.csOrange.hex}}
            maxLength={28}
            disabled={this.state.disabled}
            onChange={(e) => {
              this.setState({value: e.target.value, success: null}, () => {
                if (this.state.value.length == 28) {
                  postData('/api/clear', {token: LANGUAGE_MANAGER.token, key: this.state.value, language: LANGUAGES.nl_nl}, '', true)
                    .then((result) => {
                      if (result.status !== 204) {
                        this.setState({success: false, value:"INCORRECT", disabled:true});
                      }
                      else {
                        this.setState({success: true, value:"SUCCESS", disabled:true});
                        eventBus.emit("RELOADING");
                        setTimeout(() => { this.setState({showCode: false })}, 2000);
                      }
                      setTimeout(() => { this.setState({disabled:false, value:"INSERT PERMISSION CODE", success:null})}, 2000)
                    })
                }
              });
            }}
            value={this.state.value} />
        }

      </div>
    );
  }

}
