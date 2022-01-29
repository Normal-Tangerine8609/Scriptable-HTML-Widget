module.exports = {
  symbol: {
    isSelfClosing: false,
    constructer: (incrementor, innerText, children, attrs, currentStack) =>
      `\nlet symbol${incrementor} = ${currentStack}.addImage(SFSymbol.named("${
        innerText || "questionmark.circle"
      }").image)`,
    attr: {
      "border-color": {
        isBoolean: false,
        isOnlyAttr: false,
        func: async (value, incrementor, finalCss, Base) =>
          await Base.colour("border-color", value, "symbol" + incrementor),
      },
      "border-width": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          Base.posInt("border-width", value, "symbol" + incrementor),
      },
      "corner-radius": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          Base.posInt("corner-radius", value, "symbol" + incrementor),
      },
      "image-opacity": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          Base.decimal("image-opacity", value, "symbol" + incrementor),
      },
      "image-size": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          Base.size("image-size", value, "symbol" + incrementor),
      },
      "tint-color": {
        isBoolean: false,
        isOnlyAttr: false,
        func: async (value, incrementor, finalCss, Base) =>
          await Base.colour("tint-color", value, "symbol" + incrementor),
      },
      "url": {
        isBoolean: false,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          `\nsymbol${incrementor}.url = "${value.replace(/"/g, "")}"`,
      },
      "src": {
        isBoolean: false,
        isOnlyAttr: true,
      },
      "container-relative-shape": {
        isBoolean: true,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          Base.bool("container-relative-shape", value, "symbol" + incrementor),
      },
      "resizable": {
        isBoolean: true,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          Base.bool("resizable", value, "symbol" + incrementor),
      },
      "apply-filling-content-mode": {
        isBoolean: true,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          Base.bool(
            "apply-filling-content-mode",
            value,
            "symbol" + incrementor
          ),
      },
      "apply-fitting-content-mode": {
        isBoolean: true,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          Base.bool(
            "apply-fitting-content-mode",
            value,
            "symbol" + incrementor
          ),
      },
      "center-align-image": {
        isBoolean: true,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          Base.bool("center-align-image", value, "symbol" + incrementor),
      },
      "left-align-image": {
        isBoolean: true,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          Base.bool("left-align-image", value, "symbol" + incrementor),
      },
      "right-align-image": {
        isBoolean: true,
        isOnlyAttr: false,
        func: (value, incrementor, finalCss, Base) =>
          Base.bool("right-align-image", value, "symbol" + incrementor),
      },
    },
  },
}
