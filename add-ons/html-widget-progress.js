/*
HTML Widget progress 1.0
https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/add-ons/html-widget-progress.js
*/

module.exports = {
  progress: {
    isSelfClosing: true,
    constructer: (
      incrementor,
      innerText,
      children,
      attrs,
      currentStack,
      finalCss
    ) => {
      let value = attrs["value"] || 0
      if (/^\s*\d*(?:\.\d*)?%?\s*$/.exec(value) !== ".") {
        ;`value Attribute Must Be A Positive Integer Or Float With An Optional "%" At The End: ${value}`
      }
      value = /\d*(?:\.\d*)?%?/.exec(value)[0]
      if (value.endsWith("%")) {
        value = Number(value.replace("%", ""))
        value /= 100
      }
      log(finalCss)
      let width = finalCss["width"] || 1
      let length = finalCss["length"] || 100
      return `\nlet progressContainer${incrementor} = ${currentStack}.addStack()\nprogressContainer${incrementor}.size = new Size(${length}, ${width})\nprogressContainer${incrementor}.backgroundColor = Color.dynamic(Color.black(), Color.white())\nlet progressBar${incrementor} = progressContainer${incrementor}.addStack()\nprogressBar${incrementor}.size = new Size(${length} * ${value}, ${width})\nprogressBar${incrementor}.backgroundColor = Color.gray()\nlet progressBarBalence${incrementor} = progressContainer${incrementor}.addStack()\nprogressBarBalence${incrementor}.size = new Size(${length} * (1-${value}), ${width})`
    },
    attr: {
      "value": {
        isBoolean: false,
        isOnlyAttr: true
      },
      "background-color": {
        isBoolean: false,
        isOnlyAttr: false,
        func: async (value, incrementor, finalCss, Base) =>
          await Base.colour(
            "background-color",
            value,
            "progressContainer" + incrementor
          )
      },
      "background-gradient": {
        isBoolean: false,
        isOnlyAttr: false,
        func: async (value, incrementor, finalCss, Base) =>
          await Base.gradient(
            "background-gradient",
            value,
            "progressContainer" + incrementor
          )
      },
      "progress-color": {
        isBoolean: false,
        isOnlyAttr: false,
        func: async (value, incrementor, finalCss, Base) =>
          `\nprogressBar${incrementor}.backgroundColor = ${await Base.colour(
            "progress-color",
            value,
            "progressBar" + incrementor,
            true
          )}`
      },
      "progress-gradient": {
        isBoolean: false,
        isOnlyAttr: false,
        func: async (value, incrementor, finalCss, Base) => {
          const data = await Base.gradient(
            "progress-gradient",
            value,
            "progressBar" + incrementor,
            true
          )
          return `\nlet progressGradient${incrementor} = new LinearGradient()\nprogressGradient${incrementor}.colors = [${
            data.colors
          }]\nprogressGradient${incrementor}.locations = [${
            data.locations
          }]\nprogressGradient${incrementor}.startPoint = ${`new Point(${
            1 -
            (0.5 + 0.5 * Math.cos((Math.PI * (data.direction + 90)) / 180.0))
          }, ${
            1 -
            (0.5 + 0.5 * Math.sin((Math.PI * (data.direction + 90)) / 180.0))
          })`}\nprogressGradient${incrementor}.endPoint = ${`new Point(${
            0.5 + 0.5 * Math.cos((Math.PI * (data.direction + 90)) / 180.0)
          }, ${
            0.5 + 0.5 * Math.sin((Math.PI * (data.direction + 90)) / 180.0)
          })`}\nprogressBar${incrementor}.backgroundGradient = progressGradient${incrementor}`
        }
      },
      "border-color": {
        isBoolean: false,
        isOnlyAttr: false,
        func: async (value, incrementor, finalCss, Base) =>
          await Base.colour(
            "border-color",
            value,
            "progressContainer" + incrementor
          )
      },
      "border-width": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          Base.posInt("border-Width", value, "progressContainer" + incrementor)
      },
      "url": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          `\nprogressContainer${incrementor}.url = "${value.replace(/"/g, "")}"`
      },
      "corner-radius": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          Base.posInt("corner-radius", value, "progressContainer" + incrementor)
      },
      "progress-corner-radius": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          Base.posInt("corner-radius", value, "progressBar" + incrementor)
      },
      "url": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          `\nprogressContainer${incrementor}.url = "${value.replace(/"/g, "")}"`
      },
      "width": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) => {
          Base.posInt("width", value, "null", true)
          return ""
        }
      },
      "length": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) => {
          Base.posInt("length", value, "null", true)
          return ""
        }
      }
    }
  }
}
