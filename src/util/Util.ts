
interface utilType {
  getUUID: (() => string),
  padd: ((x: string, size: number) => string),
  download: ((data:string, filename:string) => void)
}

/**
 *  Collection of Util functions
 */
export const Util: utilType = {
  getUUID : () : string => {
    const S4 = function () {
      return Math.floor(Math.random() * 0x10000 /* 65536 */).toString(16);
    };

    return (
      S4() + S4() + '-' +
      S4() + '-' +
      S4() + '-' +
      S4() + '-' +
      S4() + S4() + S4()
    );
  },


  padd: function (x, size) {
    if (x === "__filename:") {
      return x;
    }
    while (x.length < size) {
      x += " ";
    }
    return x
  },

  download: function(data, fileName) {
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    let blob = new Blob([data], {type: "octet/stream"});
    let url = window.URL.createObjectURL(blob);
    // @ts-ignore
    dlAnchorElem.href = url;
    // @ts-ignore
    dlAnchorElem.download = fileName;
    dlAnchorElem.click();
    window.URL.revokeObjectURL(url);
  },


}
