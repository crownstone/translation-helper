import React, {Component} from "react";
import {LANGUAGE_MANAGER} from "./Translation";
import {TranslationFile} from "./TranslationFile";


export class TranslationList extends Component<any, any> {

  getList() {
    let fileArray = LANGUAGE_MANAGER.getFileArray();
    let data = [];
    for (let file of fileArray) {
      let translationsRequired = LANGUAGE_MANAGER.translationsRequired(file);
      if (!translationsRequired && this.props.hideCompleted === true) {
        continue;
      }

      data.push(<TranslationFile key={file} file={file} />);
    };
    return data;
  }


  render() {
    return (
      <div>{this.getList()}</div>
    )
  }
}