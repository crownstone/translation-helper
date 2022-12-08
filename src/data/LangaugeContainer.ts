import {postDataText} from "../util/FetchUtil";
import {SHOULD_BE_THE_SAME} from "./LanguageManager";
import {eventBus} from "../util/EventBus";
import {Util} from "../util/Util";

export const VARS = ["|VAR_1|","|VAR_2|","|VAR_3|","|VAR_4|","|VAR_5|","|VAR_6|","|VAR_7|","|VAR_8|","|VAR_9|","|VAR_10|","|VAR_11|","|VAR_12|"]

export class LanguageContainer {

  language = null;
  data     = {};

  constructor(language, data) {
    this.language = language;
    this.data = data;
  }

  getElement(file, key) {
    let shouldBeSame = this.data[file][SHOULD_BE_THE_SAME];
    if (shouldBeSame !== undefined) {
      shouldBeSame = this.data[file][SHOULD_BE_THE_SAME][key];
    }
    return new LanguageElement(this.data[file][key], shouldBeSame,
      (value, shouldBeTheSame) => {
      if (this.data[file] && this.data[file][key] !== undefined) {
        this.data[file][key] = value;
        this.data[file][SHOULD_BE_THE_SAME][key] = shouldBeTheSame;
        this.persist();
      }
    })
  }

  persist() {
    return postDataText('/api/snapshot', {data: this.data, language: this.language})
      .then(() => {
        eventBus.emit("DATA_UPDATED");
      })
  }

  toFileFormat() {
    let translationData = this.data;
    let resultString = 'export default {\n';
    let indent = "  "
    let keys = Object.keys(translationData);
    keys.sort();

    let keySizeMax = 0;
    keys.forEach((key) => {
      let source = translationData[key]
      let subKeys = Object.keys(source);
      subKeys.forEach((subKey) => {
        keySizeMax = Math.max(keySizeMax, subKey.length)
      })
    })

    keys.forEach((key) => {
      resultString += indent + key + ":{\n"
      let source = translationData[key]
      let subKeys = Object.keys(source);
      subKeys.forEach((subKey) => {
        if (subKey === "__filename") {
          resultString += indent + indent + Util.padd(subKey + ":", keySizeMax + 1) + " \"" + String(source[subKey]) + "\",\n"
        }
        else if (subKey === "__stringSameAsBaseLanguage") {
          resultString += indent + indent + subKey + ": {\n"
          Object.keys(source[subKey]).forEach((sameCheck) => {
            resultString += indent + indent + indent + Util.padd(sameCheck + ":", keySizeMax ) + source[subKey][sameCheck] +",\n"
          });
          resultString += indent + indent + "},\n"
        }
        else {

          let str = JSON.stringify(source[subKey])
          // console.log( String(source[subKey]),  )
          str = str.replace(/(\n)/g, "\\n")
          for (let i = 0; i < VARS.length; i++) {
            str = str.replace(VARS[i],"\" + arguments[" + i + "] + \"");
          }

          resultString += indent + indent + Util.padd(subKey + ":", keySizeMax + 1) + "function() { return "+ str + "; },\n"
        }
      })
      resultString += indent + "},\n"
    })

    resultString += "}";
    return resultString;
  }
}

class LanguageElement {

  shouldBeTheSame;
  storageCallback;
  value;
  constructor(value, shouldBeTheSame, storageCallback) {
    this.value = value;
    this.shouldBeTheSame = shouldBeTheSame;
    this.storageCallback = storageCallback;
  }

  save(value) {
    if (this.value !== value) {
      this.storageCallback(value, this.shouldBeTheSame);
      this.value = value;
    }
  }

  saveSimilar(shouldBeTheSame) {
    if (this.shouldBeTheSame !== shouldBeTheSame) {
      this.storageCallback(this.value, shouldBeTheSame);
      this.shouldBeTheSame = shouldBeTheSame;
    }
  }
}
