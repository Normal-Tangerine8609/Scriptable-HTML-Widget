/*
HTML Widget hr 1.1
https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/add-ons/html-widget-hr.js

- Added length attribute
- Simplified output css
*/
module.exports = {
  hr: {
    isSelfClosing: true,
    constructer: (incrementor, innerText, children, attrs, currentStack, finalCss) => {
      let isHorizontal = true
      for(let item of Object.keys(finalCss)) {
        if(item == "layout-vertically"){
          isHorizontal = false
        } else if (item == "layout-horizontally") {
          isHorizontal = true
        }
      }
      let auto = (!finalCss["length"] && finalCss["length"]!= 0)?`\nhr${incrementor}.addSpacer()`:""
      let width = finalCss["width"] || 1
      let length = finalCss["length"] || 1
      return `\nlet hr${incrementor} = ${currentStack}.addStack()${isHorizontal?"":`\nhr${incrementor}.layoutVertically()`}${auto}\nlet hrImage${incrementor} = hr${incrementor}.addImage(Image.fromData(Data.fromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=")))\nhrImage${incrementor}.imageSize = new Size(${isHorizontal?`${length},${width}`:`${width},${length}`})${auto}\nhr${incrementor}.backgroundColor = Color.dynamic(Color.black(), Color.white())`},
    attr: {
      "background-color": {
        isBoolean: false,
        isOnlyAttr: false,
        func: async (value, incrementor, finalCss, Base) =>
          await Base.colour("background-color", value, "hr" + incrementor),
      },
      "background-gradient": {
        isBoolean: false,
        isOnlyAttr: false,
        func: async (value, incrementor, finalCss, Base) =>
          await Base.gradient("background-gradient", value, "hr" + incrementor),
      },
      "url": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          `\nhr${incrementor}.url = "${value.replace(/"/g, "")}"`,
      },
      "corner-radius": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          Base.posInt("corner-radius", value, "hr" + incrementor),
      },
      "layout-horizontally": {
        isBoolean: true,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) => "",
      },
      "layout-vertically": {
        isBoolean: true,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) => "",
      },
      "width": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) => {Base.posInt("width", value, "null", true); return ""},
      },
      "length": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) => {Base.posInt("length", value, "null", true); return ""},
      },
    },
  },
}
