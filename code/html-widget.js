//HTML Widget Version 4.0
//https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget
async function htmlWidget(input, debug, addons) {
  let tagInfo = {
    spacer: {
      isSelfClosing: true,
      constructer: (incrementor, innerText, children, attrs, currentStack) =>
        `\n${currentStack}.addSpacer(${/\d+/.exec(attrs["space"] || "")})`,
      attr: {
        space: {
          isBoolean: false,
          isOnlyAttr: true,
        },
      },
    },
    widget: {
      isSelfClosing: false,
      constructer: (incrementor, innerText, children, attrs, currentStack) =>
        "let widget = new ListWidget()",
      attr: {
        "background-color": {
          isBoolean: false,
          isOnlyAttr: false,
          func: async (value, incrementor, finalCss) =>
            await Base.colour("background-color", value, "widget"),
        },
        "background-gradient": {
          isBoolean: false,
          isOnlyAttr: false,
          func: async (value, incrementor, finalCss, Base) =>
            await Base.gradient(value, "widget"),
        },
        "background-image": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bgImage(value, "widget"),
        },
        "refresh-after-date": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.posInt("refresh-after-date", value, "widget"),
        },
        "spacing": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.posInt("spacing", value, "widget"),
        },
        "url": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            `\nwidget.url = "${value.replace(/"/g, "")}"`,
        },
        "padding": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.padding(value, "widget"),
        },
        "use-default-padding": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("use-default-padding", value, "widget"),
        },
      },
      compile: (incrementor) => "widget",
    },
    stack: {
      isSelfClosing: false,
      constructer: (incrementor, innerText, children, attrs, currentStack) =>
        `\nlet stack${incrementor} = ${currentStack}.addStack()`,
      attr: {
        "background-color": {
          isBoolean: false,
          isOnlyAttr: false,
          func: async (value, incrementor, finalCss, Base) =>
            await Base.colour("background-color", value, "stack" + incrementor),
        },
        "background-gradient": {
          isBoolean: false,
          isOnlyAttr: false,
          func: async (value, incrementor, finalCss, Base) =>
            await Base.gradient(value, "stack" + incrementor),
        },
        "background-image": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bgImage(value, "stack" + incrementor),
        },
        "spacing": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.posInt("spacing", value, "stack" + incrementor),
        },
        "url": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            `\nstack${incrementor}.url = "${value.replace(/"/g, "")}"`,
        },
        "padding": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.padding(value, "stack" + incrementor),
        },
        "border-color": {
          isBoolean: false,
          isOnlyAttr: false,
          func: async (value, incrementor, finalCss, Base) =>
            await Base.colour("border-color", value, "stack" + incrementor),
        },
        "border-width": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.posInt("border-Width", value, "stack" + incrementor),
        },
        "corner-radius": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.posInt("corner-radius", value, "stack" + incrementor),
        },
        "size": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.size("size", value, "stack" + incrementor),
        },
        "bottom-align-content": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("bottom-align-content", value, "stack" + incrementor),
        },
        "center-align-content": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("center-align-content", value, "stack" + incrementor),
        },
        "top-align-content": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("top-align-content", value, "stack" + incrementor),
        },
        "layout-horizontally": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("layout-horizontally", value, "stack" + incrementor),
        },
        "layout-vertically": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("layout-vertically", value, "stack" + incrementor),
        },
        "use-default-padding": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("use-default-padding", value, "stack" + incrementor),
        },
      },
      compile: (incrementor) => "stack" + incrementor,
    },
    img: {
      isSelfClosing: true,
      constructer: (incrementor, innerText, children, attrs, currentStack) => {
        if (!attrs["src"]) {
          throw new Error("img Element Must Have A src Attribute")
        }
        if (attrs["src"].trim().startsWith("data:image/")) {
          return `\nlet img${incrementor} = ${currentStack}.addImage(Image.fromData(Data.fromBase64String("${attrs[
            "src"
          ]
            .trim()
            .replace("data:image/png;base64,", "")
            .replace("data:image/jpeg;base64,", "")
            .replace(/"/g, "")}")))`
        } else {
          return `\nlet img${incrementor} = ${currentStack}.addImage(await new Request("${attrs[
            "src"
          ].replace(/"/g, "")}").loadImage())`
        }
      },
      attr: {
        "border-color": {
          isBoolean: false,
          isOnlyAttr: false,
          func: async (value, incrementor, finalCss, Base) =>
            await Base.colour("border-color", value, "img" + incrementor),
        },
        "border-width": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.posInt("border-width", value, "img" + incrementor),
        },
        "corner-radius": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.posInt("corner-radius", value, "img" + incrementor),
        },
        "image-opacity": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.decimal("image-opacity", value, "img" + incrementor),
        },
        "image-size": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.size("image-size", value, "img" + incrementor),
        },
        "tint-color": {
          isBoolean: false,
          isOnlyAttr: false,
          func: async (value, incrementor, finalCss, Base) =>
            await Base.colour("tint-color", value, "img" + incrementor),
        },
        "url": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            `\nimg${incrementor}.url = "${value.replace(/"/g, "")}"`,
        },
        "src": {
          isBoolean: false,
          isOnlyAttr: true,
        },
        "container-relative-shape": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("container-relative-shape", value, "img" + incrementor),
        },
        "resizable": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("resizable", value, "img" + incrementor),
        },
        "apply-filling-content-mode": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("apply-filling-content-mode", value, "img" + incrementor),
        },
        "apply-fitting-content-mode": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("apply-fitting-content-mode", value, "img" + incrementor),
        },
        "center-align-image": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("center-align-image", value, "img" + incrementor),
        },
        "left-align-image": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("left-align-image", value, "img" + incrementor),
        },
        "right-align-image": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("right-align-image", value, "img" + incrementor),
        },
      },
    },
    text: {
      isSelfClosing: false,
      constructer: (incrementor, innerText, children, attrs, currentStack) =>
        `\nlet text${incrementor} = ${currentStack}.addText("${innerText.replace(
          /"/g,
          '"'
        )}")`,
      attr: {
        "font": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.font(value, "text" + incrementor),
        },
        "line-limit": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.posInt("line-limit", value, "text" + incrementor),
        },
        "minimum-scale-factor": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.decimal("minnimim-scale-factor", value, "text" + incrementor),
        },
        "shadow-color": {
          isBoolean: false,
          isOnlyAttr: false,
          func: async (value, incrementor, finalCss, Base) =>
            await Base.colour("shadow-color", value, "text" + incrementor),
        },
        "shadow-offset": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.shadowOffset(value, "text" + incrementor),
        },
        "shadow-radius": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.posInt("shadow-radius", value, "text" + incrementor),
        },
        "text-color": {
          isBoolean: false,
          isOnlyAttr: false,
          func: async (value, incrementor, finalCss, Base) =>
            await Base.colour("text-color", value, "text" + incrementor),
        },
        "text-opacity": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.decimal("text-opacity", value, "text" + incrementor),
        },
        "url": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            `\ntext${incrementor}.url = "${value.replace(/"/g, "")}"`,
        },
        "center-align-text": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("center-align-text", value, "text" + incrementor),
        },
        "left-align-text": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("left-align-text", value, "text" + incrementor),
        },
        "right-align-text": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("right-align-text", value, "text" + incrementor),
        },
      },
    },
    date: {
      isSelfClosing: false,
      constructer: (incrementor, innerText, children, attrs, currentStack) =>
        `\nlet date${incrementor} = ${currentStack}.addDate(new Date("${innerText.replace(
          /"/g,
          '"'
        )}"))`,
      attr: {
        "font": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.font(value, "date" + incrementor),
        },
        "line-limit": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.posInt("line-limit", value, "date" + incrementor),
        },
        "minimum-scale-factor": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.decimal("minnimim-scale-factor", value, "date" + incrementor),
        },
        "shadow-color": {
          isBoolean: false,
          isOnlyAttr: false,
          func: async (value, incrementor, finalCss, Base) =>
            await Base.colour("shadow-color", value, "date" + incrementor),
        },
        "shadow-offset": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.shadowOffset(value, "date" + incrementor),
        },
        "shadow-radius": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.posInt("shadow-radius", value, "date" + incrementor),
        },
        "text-color": {
          isBoolean: false,
          isOnlyAttr: false,
          func: async (value, incrementor, finalCss, Base) =>
            await Base.colour("text-color", value, "date" + incrementor),
        },
        "text-opacity": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.decimal("text-opacity", value, "date" + incrementor),
        },
        "url": {
          isBoolean: false,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            `\ndate${incrementor}.url = "${value.replace(/"/g, "")}"`,
        },
        "center-align-text": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("center-align-text", value, "date" + incrementor),
        },
        "left-align-text": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("left-align-text", value, "date" + incrementor),
        },
        "right-align-text": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("right-align-text", value, "date" + incrementor),
        },
        "apply-time-style": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("apply-time-style", value, "date" + incrementor),
        },
        "apply-date-style": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("apply-date-style", value, "date" + incrementor),
        },
        "apply-offset-style": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("apply-offset-style", value, "date" + incrementor),
        },
        "apply-relative-style": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) => {
            if (value == true) {
              return `\ndate${incrementor}.applyRelativeStyle()`
            } else {
              return ""
            }
          },
        },
        "apply-timer-style": {
          isBoolean: true,
          isOnlyAttr: false,
          func: (value, incrementor, finalCss, Base) =>
            Base.bool("apply-timer-style", value, "date" + incrementor),
        },
      },
    },
  }

  // Primitive types
  const Base = {
    colour: async (attribute, value, on) => {
      colours = value.split("-")
      return `\n${on}.${attribute
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())} = ${
        colours.length == 2
          ? "Color.dynamic(" +
            (await colorFromValue(colours[0])) +
            "," +
            (await colorFromValue(colours[1])) +
            ")"
          : await colorFromValue(colours[0])
      }`
    },
    posInt: (attribute, value, on) => {
      if (!/^\s*\d+\s*$/.test(value)) {
        throw new Error(
          `${attribute} Propery Or Attribute Must Be A Positive Integer: ${value}`
        )
      }
      if (attribute == "refresh-after-date") {
        return `\nlet date = new Date()\ndate.setMinutes(date.getMinutes() + ${/\d+/.exec(
          value
        )})\nwidget.refreshAfterDate = date`
      } else {
        return `\n${on}.${attribute
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) =>
            chr.toUpperCase()
          )} = ${/\d+/.exec(value)}`
      }
    },
    decimal: (attribute, value, on) => {
      if (
        !/^\s*\d*(?:\.\d*)?%?\s*$/.test(value) &&
        /^\s*\d*(?:\.\d*)?%?\s*$/.exec(value) !== "."
      ) {
        throw new Error(
          `${attribute} Propery Or Attribute Must Be A Positive Integer Or Float With An Optional  "%" At The End: ${value}`
        )
      }
      value = /\d*(?:\.\d*)?%?/.exec(value)[0]
      if (value.endsWith("%")) {
        value = Number(value.replace("%", ""))
        value /= 100
      }
      return `\n${on}.${attribute
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) =>
          chr.toUpperCase()
        )} = ${value}`
    },
    gradient: async (value, on) => {
      gradientNumber++
      let gradient = value
      // Split gradient in parts
      gradient = gradient
        .split(/,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/)
        .map((e) => e.trim())
      let gradientDirection
      const wordDirections = {
        "to left": 90,
        "to right": 270,
        "to top": 180,
        "to bottom": 0,
        "to top left": 135,
        "to top right": 225,
        "to bottom left": 45,
        "to bottom right": 315,
        "to left top": 135,
        "to right top": 225,
        "to left bottom": 45,
        "to right bottom": 315,
      }
      // Set gradient direction
      if (Object.keys(wordDirections).includes(gradient[0])) {
        gradientDirection = wordDirections[gradient.shift()]
      } else if (/\d+\s*deg/.test(gradient[0])) {
        gradientDirection = Number(gradient.shift().match(/(\d+)\s*deg/)[1])
      } else {
        gradientDirection = 0
      }
      // Get colours
      let colours = []
      for (let colour of gradient) {
        colour = colour.replace(/\d*(\.\d+)?%?$/, "")
        colour = colour.split("-")
        if (colour.length == 2) {
          colours.push(
            Color.dynamic(
              await colorFromValue(colour[0]),
              await colorFromValue(colour[1])
            )
          )
        } else {
          colours.push(await colorFromValue(colour[0]))
        }
      }
      // Get locations
      let locations = gradient
        .map((e) =>
          /\d*(\.\d+)?%?$/.test(e) ? e.match(/\d*(\.\d+)?%?$/)[0] : null
        )
        .map((e) => {
          if (e) {
            if (e.endsWith("%")) {
              e = Number(e.replace("%", "")) / 100
            }
          }
          return (!isNaN(e) && !isNaN(parseFloat(e))) || typeof e == "number"
            ? Number(e)
            : null
        })
      if (!locations[0]) {
        locations[0] = 0
      }
      if (!locations[locations.length - 1]) {
        locations[locations.length - 1] = 1
      }
      let minLocation = 0
      // Set not specified locations
      for (let i = 0; i < locations.length; i++) {
        let currentLocation = locations[i]
        if (currentLocation) {
          if (minLocation > currentLocation) {
            throw new Error(
              `background-gradient Propery Or Attribute Locations Must Be In Ascending Order: ${value}`
            )
          }
          if (currentLocation < 0) {
            throw new Error(
              `background-gradient Propery Or Attribute Locations Must Be Equal Or Greater Than 0: ${value}`
            )
          }
          if (currentLocation > 1) {
            throw new Error(
              `background-gradient Propery Or Attribute Locations Must Be Equal Or Less Than 1: ${value}`
            )
          }
          minLocation = currentLocation
        } else {
          let counter = 0
          let index = i
          while (locations[index] === null) {
            counter++
            index++
          }
          let difference = (locations[index] - locations[i - 1]) / (counter + 1)
          for (let count = 0; count < counter; count++) {
            locations[count + i] = difference * (count + 1) + locations[i - 1]
          }
        }
      }
      return `\nlet gradient${gradientNumber} = new LinearGradient()\ngradient${gradientNumber}.colors = [${colours}]\ngradient${gradientNumber}.locations = [${locations}]\ngradient${gradientNumber}.startPoint = ${`new Point(${
        1 - (0.5 + 0.5 * Math.cos((Math.PI * (gradientDirection + 90)) / 180.0))
      }, ${
        1 - (0.5 + 0.5 * Math.sin((Math.PI * (gradientDirection + 90)) / 180.0))
      })`}\ngradient${gradientNumber}.endPoint = ${`new Point(${
        0.5 + 0.5 * Math.cos((Math.PI * (gradientDirection + 90)) / 180.0)
      }, ${
        0.5 + 0.5 * Math.sin((Math.PI * (gradientDirection + 90)) / 180.0)
      })`}\n${on}.backgroundGradient = gradient${gradientNumber}`
    },
    padding: (value, on) => {
      if (!/^\s*\d+((\s*,\s*\d+){3}|(\s*,\s*\d+))?\s*$/g.test(value)) {
        throw new Error(
          `padding Propery Or Attribute Must Be 1, 2 Or 4 Positive Integers Separated By Commas: ${value}`
        )
      }
      paddingArray = value.match(/\d+/g)
      if (paddingArray.length == 1) {
        paddingArray = [
          paddingArray[0],
          paddingArray[0],
          paddingArray[0],
          paddingArray[0],
        ]
      } else if (paddingArray.length == 2) {
        paddingArray = [
          paddingArray[0],
          paddingArray[1],
          paddingArray[0],
          paddingArray[1],
        ]
      }
      return `\n${on}.setPadding(${paddingArray.join(",")})`
    },
    bgImage: (value, on) => {
      if (value.startsWith("data:image/")) {
        value = value
          .replace("data:image/png;base64,", "")
          .replace("data:image/jpeg;base64,", "")
        return `\n${on}.backgroundImage = Image.fromData(Data.fromBase64String("${value.replace(
          /"/g,
          ""
        )}"))`
      } else {
        return `\n${on}.backgroundImage = await new Request("${value.replace(
          /"/g,
          ""
        )}").loadImage()`
      }
    },
    size: (attribute, value, on) => {
      if (!/^\s*\d+\s*,\s*\d+\s*$/.test(value)) {
        throw new Error(
          `${attribute} Propery Or Attribute Must Have 2 Positive Integers Separated By Commas: ${value}`
        )
      }
      return `\n${on}.${attribute
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) =>
          chr.toUpperCase()
        )} = new Size(${value.match(/\d+/g)[0]},${value.match(/\d+/g)[1]})`
    },
    font: (value, on) => {
      if (
        !/^\s*[^,]+,\s*\d+\s*$/.test(value) &&
        ![
          "body",
          "callout",
          "caption1",
          "caption2",
          "footnote",
          "subheadline",
          "headline",
          "italicSystemFont",
          "largeTitle",
          "title1",
          "title2",
          "title3",
        ].includes(value)
      ) {
        throw new Error(
          `font Propery Or Attribute Must Be 1 font And 1 Positive Integer Separated By Commas Or A Content-Based Font: ${value}`
        )
      }
      let regex =
        /^\s*(((black|bold|medium|light|heavy|regular|semibold|thin|ultraLight)(MonospacedSystemFont|RoundedSystemFont|SystemFont)\s*,\s*(\d+))|(body|callout|caption1|caption2|footnote|subheadline|headline|largeTitle|title1|title2|title3)|((italicSystemFont)\s*,\s*(\d+)))\s*$/
      if (regex.test(value)) {
        return `\n${on}.font = Font.${value.replace(regex, "$3$4$6$8($5$9)")}`
      } else {
        return `\n${on}.font = new Font("${value
          .split(",")[0]
          .replace(/"/g, "")}",${value.split(",")[1].match(/\d+/g)[0]})`
      }
    },
    shadowOffset: (value, on) => {
      if (!/^\s*-?\d+\s*,\s*-?\d+\s*$/.test(value)) {
        throw new Error(
          `shadow-offset Propery Or Attribute Element Must Have 2 Integers Separated By Commas: ${value}`
        )
      }
      return `\n${on}.shadowOffset = new Point(${
        value.split(",")[0].match(/-?\d*/)[0]
      },${value.split(",")[1].match(/-?\d*/)[0]})`
    },
    bool: (attribute, value, on) => {
      if (value == true) {
        if (attribute == "resizable") {
          return `\n${on}.resizable = false`
        }
        if (attribute == "apply-filling-content-mode") {
          return `\n${on}.applyFillingContentMode = true`
        }
        if (attribute == "apply-fitting-content-mode") {
          return `\n${on}.applyFittingContentMode = true`
        }
        if (attribute == "container-relative-shape") {
          return `\n${on}.containerRelativeShape = true`
        }
        return `\n${on}.${attribute
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())}()`
      } else {
        return ""
      }
    },
  }

  // Combine default components with addons
  if (addons) {
    Object.assign(tagInfo, addons)
  }
  // Figure out self closing tags and boolean attributes for parsing
  let selfClosers = []
  let booleanAttr = []
  for (let component of Object.keys(tagInfo)) {
    if (tagInfo[component]["isSelfClosing"]) {
      selfClosers.push(component)
    }
    for (let attr of Object.keys(tagInfo[component]["attr"])) {
      if (tagInfo[component]["attr"][attr]["isBoolean"]) {
        booleanAttr.push(tagInfo[component]["attr"][attr]["name"])
      }
    }
  }
  // https://github.com/henryluki/html-parser
  // Added comment support
  const STARTTAG_REX=/^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,ENDTAG_REX=/^<\/([-A-Za-z0-9_]+)[^>]*>/,ATTR_REX=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;function makeMap(t){return t.split(",").reduce((t,e)=>(t[e]=!0,t),{})}const EMPTY_MAKER=makeMap(selfClosers.join(",")),FILLATTRS_MAKER=makeMap(booleanAttr.join(","));function isEmptyMaker(t){return!!EMPTY_MAKER[t]}function isFillattrsMaker(t){return!!FILLATTRS_MAKER[t]}class TagStart{constructor(t,e){this.name=t,this.attributes=this.getAttributes(e)}getAttributes(t){let e={};return t.replace(ATTR_REX,function(t,n){const s=Array.prototype.slice.call(arguments),r=s[2]?s[2]:s[3]?s[3]:s[4]?s[4]:isFillattrsMaker(n)?n:"";e[n]=r.replace(/(^|[^\\])"/g,'$1\\"')}),e}}class TagEmpty extends TagStart{constructor(t,e){super(t,e)}}class TagEnd{constructor(t){this.name=t}}class Text{constructor(t){this.text=t}}const ElEMENT_TYPE="Element",TEXT_TYPE="Text";function createElement(t){const e=t.name,n=t.attributes;return t instanceof TagEmpty?{type:ElEMENT_TYPE,tagName:e,attributes:n}:{type:ElEMENT_TYPE,tagName:e,attributes:n,children:[]}}function createText(t){const e=t.text;return{type:TEXT_TYPE,content:e}}function createNodeFactory(t,e){switch(t){case ElEMENT_TYPE:return createElement(e);case TEXT_TYPE:return createText(e)}}function parse(t){let e={tag:"root",children:[]},n=[e];n.last=(()=>n[n.length-1]);for(let e=0;e<t.length;e++){const s=t[e];if(s instanceof TagStart){const t=createNodeFactory(ElEMENT_TYPE,s);t.children?n.push(t):n.last().children.push(t)}else if(s instanceof TagEnd){let t=n[n.length-2],e=n.pop();t.children.push(e)}else s instanceof Text?n.last().children.push(createNodeFactory(TEXT_TYPE,s)):"Comment"!=s.type||n.last().children.push(s)}return e}function tokenize(t){let e=t,n=[];const s=Date.now()+1e3;for(;e;){if(0===e.indexOf("\x3c!--")){const t=e.indexOf("--\x3e")+3;n.push({type:"Comment",text:e.substring(4,t-3)}),e=e.substring(t);continue}if(0===e.indexOf("</")){const t=e.match(ENDTAG_REX);if(!t)continue;e=e.substring(t[0].length);const s=t[1];if(isEmptyMaker(s))continue;n.push(new TagEnd(s));continue}if(0===e.indexOf("<")){const t=e.match(STARTTAG_REX);if(!t)continue;e=e.substring(t[0].length);const s=t[1],r=t[2],a=isEmptyMaker(s)?new TagEmpty(s,r):new TagStart(s,r);n.push(a);continue}const t=e.indexOf("<"),r=t<0?e:e.substring(0,t);if(e=t<0?"":e.substring(t),n.push(new Text(r)),Date.now()>=s)break}return n}function htmlParser(t){return parse(tokenize(t))}
  // Set base variables
  let currentStack,
    code = "",
    incrementors = {},
    gradientNumber = -1

  // Get only the first widget tag
  let widgetBody = htmlParser(input)["children"].filter((element) => {
    if (element.tagName == "widget") {
      return element
    }
  })[0]
  // If there were no widget tags raise error
  if (!widgetBody) {
    throw new Error("widget Tag Must Be The Parent Tag")
  }
  // Get all direct style tags
  let styleTags = widgetBody["children"].filter((e) => e.tagName == "style")
  let cssTexts = ""
  for (let styleTag of styleTags) {
    // Get all text children
    for (let item of styleTag["children"]) {
      if (item.type == "Text") {
        cssTexts += "\n" + item["content"].trim()
      }
    }
  }
  let mainCss = []
  let rules = cssTexts.match(/[\s\S]+?{[\s\S]*?}/g) || []
  // Repeat with each css rule
  for (let i = 0; i < rules.length; i++) {
    let rule = rules[i]
    if (
      !/^\s*(\.?[\w\-]+?|\*)\s*\{(\s*[\w\-]+\s*:\s*[^\n]+?\s*;)*?\s*([\w\-]+\s*:\s*[^\n]+\s*;?)?\s*\}/.test(
        rule
      )
    ) {
      throw new Error(`Invalid CSS Rule\n${rule.trim()}`)
    }
    // Set rules into the mainCss JSON
    let selector = rule.match(/\.?[\w\-]+|\*/)[0]
    mainCss[i] = {selector: selector, css: {}}
    rule
      .match(/\{([\s\S]*)\}/)[1]
      .split(";")
      .map((e) => e.trim())
      .filter((e) => e)
      .forEach((e) => {
        mainCss[i]["css"][e.split(/:/)[0].trim()] = e
          .substring(e.indexOf(":") + 1)
          .trim()
      })
  }
  // Compile widget
  await compile(widgetBody)
  // Run code and set output of function
  if (debug == true) {
    console.log(code)
  }
  let AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
  let runCode = new AsyncFunction(code + "\nreturn widget")
  return await runCode()

  // Compile function
  async function compile(tag) {
    // Do nothing when compile normal text or css
    if (tag.type == "Text" || tag.tagName == "style") {
      return
    }
    // Throw an error if there is a nestled widget tag
    if (tag["tagName"] == "widget" && code) {
      throw new Error("widget Tag Must Not Be Nestled")
    }
    if (Object.keys(tagInfo).includes(tag["tagName"])) {
      // Increment incrementor
      if (incrementors[tag["tagName"]] || incrementors[tag["tagName"]] == 0) {
        incrementors[tag["tagName"]]++
      } else {
        incrementors[tag["tagName"]] = 0
      }
      let incrementor = incrementors[tag["tagName"]]
      // Get innerText
      let textArray = []
      tag["children"] = tag["children"] || []
      for (let item of tag["children"]) {
        if (item.type == "Text") {
          textArray.push(item["content"].trim())
        }
      }
      let innerText = textArray
        .join(" ")
        .replace(/&lt;/g, "<")
        .replace(/&gt/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/\n\s+/g, "\\n")

      // Construct component
      code += await tagInfo[tag["tagName"]]["constructer"](
        incrementor,
        innerText,
        tag["children"],
        tag["attributes"],
        currentStack
      )

      // Get valid attributes
      let cssAttr = []
      let plainAttr = []
      for (let attr of Object.keys(tagInfo[tag["tagName"]]["attr"])) {
        if (tagInfo[tag["tagName"]]["attr"][attr]["isOnlyAttr"]) {
          plainAttr.push(attr)
        } else {
          cssAttr.push(attr)
        }
      }
      plainAttr.push("class")
      let availableCss = ["*", tag["tagName"]]
      let attributeCss = {}

      // Add attributes to css or compile for class
      for (let key of Object.keys(tag["attributes"])) {
        let value = tag["attributes"][key].trim()
        if (!plainAttr.includes(key) && !cssAttr.includes(key)) {
          throw new Error(
            `Unknown Attribute ${key} On ${tag["tagName"]} Element`
          )
        }
        if (key == "class") {
          value = value.trim().split(" ")
          for (let item of value) {
            availableCss.push("." + item)
          }
        } else {
          if (!plainAttr.includes(key)) {
            attributeCss[key] = value || true
          }
        }
      }
      // Add or reset all selected css values
      let customeCss = tagInfo[tag["tagName"]]["customeAttr"]
      let customInfo = tagInfo[tag["tagName"]]["attr"]
      let finalCss = {}
      for (let rule of mainCss) {
        if (availableCss.includes(rule["selector"])) {
          for (let key of Object.keys(rule["css"])) {
            if (cssAttr.includes(key)) {
              finalCss[key] = rule["css"][key]
            }
          }
        }
      }
      for (let key of Object.keys(attributeCss)) {
        finalCss[key] = attributeCss[key]
      }

      // Add the css
      for (let key of Object.keys(finalCss)) {
        let value = finalCss[key] == "true" ? true : finalCss[key]
        code += await customInfo[key]["func"](
          value,
          incrementor,
          finalCss,
          Base
        )
      }

      // Compile children of component if specified
      if (tagInfo[tag["tagName"]]["compile"]) {
        for (let child of tag["children"]) {
          currentStack = tagInfo[tag["tagName"]]["compile"](incrementor)
          await compile(child)
        }
      }
      return
    }
    // Compile for comment
    if (tag["type"] == "Comment") {
      if (!tag["text"].match(/\n/g)) {
        code += `\n// ${tag["text"]}`
      } else {
        code += `\n/*\n${tag["text"]}\n*/`
      }
      return
    }
    // Raise error if there is a nestled widget tag or unknown tag
    throw new Error("Invalid Tag Name:" + tag["tagName"])
  }

  // Get any html supported color
  async function colorFromValue(c) {
    let w = new WebView()
    await w.loadHTML(`<div id="div"style="color:${c}"></div>`)
    let result = await w.evaluateJavaScript(
      'window.getComputedStyle(document.getElementById("div")).color'
    )
    return rgbaToScriptable(
      ...result.match(/\d+(\.\d+)?/g).map((e) => Number(e))
    )
    function rgbaToScriptable(r, g, b, a) {
      r = r.toString(16)
      g = g.toString(16)
      b = b.toString(16)
      if (r.length == 1) {
        r = "0" + r
      }
      if (g.length == 1) {
        g = "0" + g
      }
      if (b.length == 1) {
        b = "0" + b
      }
      if (a) {
        if (a.length == 1) {
          a = ",0" + a
        } else {
          a = "," + a
        }
      } else {
        a = ""
      }
      return `new Color("${"#" + r + g + b}"${a})`
    }
  }
}
