import {eventBus} from "../util/EventBus";
import {LANGUAGE_MANAGER} from "../Translation";


class FocusManagerClass {

  currentFocusFile = null;
  cleanup = [];

  init() {
    this.cleanup.push(eventBus.on("FOCUS",       (data) => { this.handleFocus(data) }));
    this.cleanup.push(eventBus.on("FOCUS_END",   (data) => { this.focusNext() }));
    this.cleanup.push(eventBus.on("FOCUS_RESET", (data) => { this.focusNext() }));
  }

  clean() {
    this.cleanup.forEach(((clean) => { clean(); }))
  }

  handleFocus(data) {
    this.currentFocusFile = data.file;
  }


  focusNext() {
    let files = LANGUAGE_MANAGER.getFileArray()
    let startIndex = 0
    if (this.currentFocusFile !== null) {
      startIndex = files.indexOf(this.currentFocusFile) + 1;
      eventBus.emit("CloseFocus"+this.currentFocusFile);
    }

    for (let i = startIndex; i < files.length; i++) {
      let file = files[i];
      if (LANGUAGE_MANAGER.statistics.files[file].keysToTranslate !== 0) {
        eventBus.emit("SetFocus"+file);
        break;
      }
    }
  }
}

export const FocusManager = new FocusManagerClass()