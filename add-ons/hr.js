module.exports = {
  hr: {
    isSelfClosing: true,
    constructer: (incrementor, innerText, children, attrs, currentStack) =>
      `\nlet hr${incrementor} = ${currentStack}.addStack()\nhr${incrementor}.addSpacer()\nlet hrImage${incrementor} = hr${incrementor}.addImage(Image.fromData(Data.fromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=")))\nhrImage${incrementor}.imageSize = new Size(1,1)\nhr${incrementor}.addSpacer()\nhr${incrementor}.backgroundColor = Color.dynamic(Color.black(), Color.white())`,
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
          await Base.gradient(value, "hr" + incrementor),
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
        func: (value, incrementor, finalCss, Base) =>
          value == true
            ? `\nhr${incrementor}.layoutHorizontally()\nhrImage${incrementor}.imageSize = new Size(1,${
                finalCss["width"] ? finalCss["width"] : 1
              })`
            : "",
      },
      "layout-vertically": {
        isBoolean: true,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          value == true
            ? `\nhr${incrementor}.layoutVertically()\nhrImage${incrementor}.imageSize = new Size(${
                finalCss["width"] ? finalCss["width"] : 1
              },1)`
            : "",
      },
      "width": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          `\nhrImage${incrementor}.imageSize = new Size(${
            finalCss["layout-vertically"] == true ? `1,${value}` : `${value},1`
          })`,
      },
    },
  },
}
