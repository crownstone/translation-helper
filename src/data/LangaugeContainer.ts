import {postDataText} from "../util/FetchUtil";
import {SHOULD_BE_THE_SAME} from "./LanguageManager";
import {eventBus} from "../util/EventBus";


export class LanguageContainer {

  token    = null;
  language = null;
  data     = {};

  constructor(language, data, token) {
    this.language = language;
    this.data = data;
    this.token = token;
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
    return postDataText('/api/snapshot', {token: this.token, data: this.data, language: this.language})
      .then(() => {
        eventBus.emit("DATA_UPDATED");
      })
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