import {downloadContent, getData, postDataText} from "../util/FetchUtil";
import {LanguageContainer} from "./LangaugeContainer";
import {Util} from "../util/Util";
import {match} from "assert";


export const LANGUAGES = {
  en_us: "en_us",
  nl_nl: "nl_nl",
}

export const SHOULD_BE_THE_SAME = "__stringSameAsBaseLanguage";

export class LanguageManager {

  containers = {};
  baseLanguage = LANGUAGES.en_us;

  statistics = { files: {} };

  async init() {
    let nl_nl = {};
    let en_us = {};

    try {
      let en_us = await this.download(LANGUAGES.en_us);
      let nlFromDatabase = await this.getFromDatabase(LANGUAGES.nl_nl);
      if (!nlFromDatabase) {
        nl_nl = await this.download(LANGUAGES.nl_nl);
      }
      else {
        nl_nl = nlFromDatabase;
      }
      this.containers[LANGUAGES.en_us] = new LanguageContainer(LANGUAGES.en_us, en_us);
      this.containers[LANGUAGES.nl_nl] = new LanguageContainer(LANGUAGES.nl_nl, nl_nl);
    }
    catch {
      alert("Not authorized")
      this.containers[LANGUAGES.en_us] = new LanguageContainer(LANGUAGES.en_us, en_us);
      this.containers[LANGUAGES.nl_nl] = new LanguageContainer(LANGUAGES.nl_nl, nl_nl);
    }
  }


  async download(language) {
    if (language === LANGUAGES.en_us) {
      return await this._downloadFileFromGit('https://raw.githubusercontent.com/crownstone/crownstone-app/master/app/ts/languages/en/us/en_us.ts')
    }
    else if (language === LANGUAGES.nl_nl) {
      return await this._downloadFileFromGit('https://raw.githubusercontent.com/crownstone/crownstone-app/master/app/ts/languages/nl/nl/nl_nl.ts')
    }
  }


  async _downloadFileFromGit(url) {
    let data = await downloadContent( url );
    let resultData = {};

    // parse data
    let content = data.replace("export default ", 'content = ');
    eval(content);

    // extract data
    let files = Object.keys(content);
    files.forEach((file) => {
      resultData[file] = {};
      if (content[file]["__stringSameAsBaseLanguage"]) {
        resultData[file] = {__stringSameAsBaseLanguage: content[file]["__stringSameAsBaseLanguage"]};
      }

      Object.keys(content[file]).forEach((key) => {
        if (typeof content[file][key] === "function") {
          resultData[file][key] = content[file][key]("|VAR_1|","|VAR_2|","|VAR_3|","|VAR_4|","|VAR_5|","|VAR_6|","|VAR_7|","|VAR_8|","|VAR_9|","|VAR_10|","|VAR_11|","|VAR_12|")
        }
      })

    })

    return resultData;
  }

  downloadLanguageFile(language: string) {
    let string = this.containers[language].toFileFormat();
    Util.download(string, language + ".ts")
  }

  async getFromDatabase(language) {
    if (language === LANGUAGES.nl_nl) {
      let data = await getData("/api/snapshot", {language: LANGUAGES.nl_nl});
      data = JSON.parse(data);
      if (data.length == 0) {
        return null;
      }
      // @ts-ignore
      return data[0].data;
    }
  }

  find(language, string) {
    let result = [];

    if (this.containers[language] === undefined) {
      return result
    }

    let matchCount = 0;
    let data = this.containers[language].data
    let fileArray = this.getFileArray(language);
    for (let i = 0; i < fileArray.length; i++) {
      let file = fileArray[i];
      let itemArray = this.getKeyArray(file, language);
      for (let j = 0; j < itemArray.length; j++) {
        let item = itemArray[j];
        let content = data[file][item];
        if (typeof content === "string") {
          if (content.indexOf(string) !== -1) {
            result.push({file, item, content});
            matchCount++;
            if (matchCount > 10) {
              break;
            }
          }
        }
      }
    }

    return result;
  }


  getFileArray(language = this.baseLanguage) {
    return Object.keys(this.containers[language].data);
  }

  getKeyArray(file, language = this.baseLanguage) {
    return Object.keys(this.containers[language].data[file]);
  }

  getLanguages() {
    let languages = [this.baseLanguage];
    Object.keys(this.containers).forEach((lang) => {
      if (lang != this.baseLanguage) {
        languages.push(lang);
      }
    })
    return languages;
  }

  itemTranslationRequired(file, key, language) {
    if (language === this.baseLanguage) { return false; }
    let base = this.containers[this.baseLanguage].data[file][key];
    if (this.containers[language].data[file] === undefined) { return false }

    let otherLanguage = this.containers[language].data[file][key];

    if (base === otherLanguage) {
      return !this.containers[language].data[file][SHOULD_BE_THE_SAME][key];
    }
    else {
      return false;
    }
  }

  translationsRequired(file) {
    let required  = false;
    let languages = Object.keys(this.containers);
    let keyArray  = this.getKeyArray(file);
    for (let i = 0; i < languages.length; i++) {
      if (languages[i] !== this.baseLanguage) {
        for (let j = 0; j < keyArray.length; j++) {
          required = this.itemTranslationRequired(file, keyArray[j], languages[i]);
          if (required) { break; }
        }
        if (required) { break; }
      }
    }
    return required;
  }

  getElement(language, file, key) {
    return this.containers[language].getElement(file, key);
  }

  getStatistics() {
    this.statistics = { files: {} };
    Object.keys(this.containers).forEach((lang) => {
      if (lang !== this.baseLanguage) {
        let keysTranslated  = 0;
        let keysToTranslate = 0;
        this.statistics[lang] = {
          wordsTranslated: 0,
          wordsToTranslate: 0,
          percentage: 0,
        };
        let files = this.getFileArray();
        files.forEach((file) => {
          this.statistics.files[file] = { keysTranslated: 0, keysToTranslate: 0, keyCount: 0 };

          let keyArray = this.getKeyArray(file);
          keyArray.forEach((key) => {
            let lines = this.containers[this.baseLanguage].data[file][key].split("\n");
            let count = 0;
            lines.forEach((line) => {
              let words = line.split(" ");
              count += words.length;
            });
            if (this.itemTranslationRequired(file, key, lang)) {
              this.statistics.files[file].keysToTranslate += 1;
              this.statistics.files[file].keyCount += 1;
              this.statistics[lang].wordsToTranslate += count;
              keysToTranslate += 1;
            }
            else {
              this.statistics.files[file].keysTranslated += 1;
              this.statistics.files[file].keyCount += 1;
              this.statistics[lang].wordsTranslated += count;
              keysTranslated += 1;
            }
          })
        })
        let keysPercentage = keysToTranslate / (keysToTranslate+keysTranslated);
        keysPercentage = 100*keysPercentage;
        let wordsPercentage = this.statistics[lang].wordsTranslated / (this.statistics[lang].wordsTranslated+this.statistics[lang].wordsToTranslate);
        wordsPercentage = 100*wordsPercentage;
        this.statistics[lang].wordsPercentage = wordsPercentage.toFixed(2);
        this.statistics[lang].keysPercentage  = keysPercentage.toFixed(2);
      }
    });

    return this.statistics;
  }



}
