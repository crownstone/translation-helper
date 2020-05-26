import React, {Component} from "react";
import {LANGUAGE_MANAGER} from "./Translation";
import {TranslationFile} from "./TranslationFile";


export class TranslationList extends Component<any, any> {

  getList() {
    let fileArray = LANGUAGE_MANAGER.getFileArray();
    let data = [];
    fileArray.forEach((file) => {
      data.push(<TranslationFile key={file} file={file} />);
    });
    return data;
  }


  render() {
    return (
      <div>{this.getList()}</div>
    )
  }
}