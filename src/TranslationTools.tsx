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

    this.state = {disabled:false, value: "INSERT PERMISSION CODE", success: null };
  }

  getButton() {
    return (
      <div style={{...buttonStyle, backgroundColor: colors.red.hex, float: "right"}}
        onClick={() => {
             if (confirm("DANGER: all undownloaded data will be lost! Are you sure?")) {
               postData('/api/clear', {key: this.state.value, language: LANGUAGES.nl_nl}, '', true)
                 .then((result) => {
                   if (result.status !== 204) {
                     this.setState({success: false, value:"INCORRECT", disabled:true});
                   }
                   else {
                     this.setState({success: true, value:"SUCCESS", disabled:true});
                     eventBus.emit("RELOADING");
                   }
                   setTimeout(() => { this.setState({disabled:false, value:"INSERT PERMISSION CODE", success:null})}, 2000)
                 })
             }
           }}>Pull from Git</div>
    );
  }

  render() {
    let height = 50;
    return (
      <div style={{position:'absolute', top:110, right:30, width:300, height: height, borderRadius:10, backgroundColor: colors.green.hex, padding:20}}>
        <div style={{...buttonStyle, backgroundColor: colors.blue.hex, float:"left"}} onClick={() => {
          LANGUAGE_MANAGER.downloadLanguageFile(LANGUAGES.nl_nl)
        }}>Download</div>
        { this.getButton() }

      </div>
    );
  }

}
