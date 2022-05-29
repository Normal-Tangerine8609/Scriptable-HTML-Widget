//HTML Widget Version 6.00
//https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget

module.exports = async function htmlWidget(input, debug, addons) {
  
  // Primitive types for adding and validating
  const types = {
    colour: {
      add: async (attribute, value, on) => {
        const colours = value.split("-")
        const colour =
          colours.length == 2
            ? "Color.dynamic(" +
              (await colorFromValue(colours[0])) +
              "," +
              (await colorFromValue(colours[1])) +
              ")"
            : await colorFromValue(colours[0])
        code += `\n${on}.${attribute
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) =>
            chr.toUpperCase()
          )} = ${colour}`
      },
      validate: () => {}
    },
    posInt: {
      add: (attribute, value, on) => {
        if (attribute == "refresh-after-date") {
          code += `\nlet date = new Date()\ndate.setMinutes(date.getMinutes() + ${/\d+/.exec(
            value
          )})\nwidget.refreshAfterDate = date`
        } else {
          code += `\n${on}.${attribute
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) =>
              chr.toUpperCase()
            )} = ${/\d+/.exec(value)}`
        }
      },
      validate: (attribute, isAttribute, value) => {
        if (!/^\s*\d+\s*$/.test(value)) {
          error(1, attribute, isAttribute ? "attribute" : "property", value)
        }
      }
    },
    decimal: {
      add: (attribute, value, on) => {
        value = /\d*(?:\.\d*)?%?/.exec(value)[0]
        if (value.endsWith("%")) {
          value = Number(value.replace("%", ""))
          value /= 100
        }
        code += `\n${on}.${attribute
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) =>
            chr.toUpperCase()
          )} = ${value}`
      },
      validate: (attribute, isAttribute, value) => {
        let regex = /^\s*(\d*(?:\.\d*)?)%?\s*$/
        if (
          !value.match(regex) ||
          (value.match(regex) && ["", "."].includes(value.match(regex)[1]))
        ) {
          error(2, attribute, isAttribute ? "attribute" : "property", value)
        }
      }
    },
    gradient: {
      add: async (attribute, value, on) => {
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
          "to right bottom": 315
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
            let counter = 0
            let index = i
            while (locations[index] === null) {
              counter++
              index++
            }
            let difference =
              (locations[index] - locations[i - 1]) / (counter + 1)
            for (let count = 0; count < counter; count++) {
              locations[count + i] = difference * (count + 1) + locations[i - 1]
            }
          }
        }
        code += `\nlet gradient${gradientNumber} = new LinearGradient()\ngradient${gradientNumber}.colors = [${colours}]\ngradient${gradientNumber}.locations = [${locations}]\ngradient${gradientNumber}.startPoint = ${`new Point(${
          1 -
          (0.5 + 0.5 * Math.cos((Math.PI * (gradientDirection + 90)) / 180.0))
        }, ${
          1 -
          (0.5 + 0.5 * Math.sin((Math.PI * (gradientDirection + 90)) / 180.0))
        })`}\ngradient${gradientNumber}.endPoint = ${`new Point(${
          0.5 + 0.5 * Math.cos((Math.PI * (gradientDirection + 90)) / 180.0)
        }, ${
          0.5 + 0.5 * Math.sin((Math.PI * (gradientDirection + 90)) / 180.0)
        })`}\n${on}.backgroundGradient = gradient${gradientNumber}`
      },
      validate: (attribute, isAttribute, value) => {
        let gradient = value
        // Split gradient in parts
        gradient = gradient
          .split(/,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/)
          .map((e) => e.trim())
        const wordDirections = [
          "to left",
          "to right",
          "to top",
          "to bottom",
          "to top left",
          "to top right",
          "to bottom left",
          "to bottom right",
          "to left top",
          "to right top",
          "to left bottom",
          "to right bottom"
        ]
        if (wordDirections.includes(gradient[0])) {
          gradient.shift()
        } else if (/\d+\s*deg/.test(gradient[0])) {
          gradient.shift()
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
        for (let i = 0; i < locations.length; i++) {
          let currentLocation = locations[i]
          if (currentLocation) {
            if (minLocation > currentLocation) {
              error(3, attribute, isAttribute ? "attribute" : "property", value)
            }
            if (currentLocation < 0) {
              error(4, attribute, isAttribute ? "attribute" : "property", value)
            }
            if (currentLocation > 1) {
              error(5, attribute, isAttribute ? "attribute" : "property", value)
            }
            minLocation = currentLocation
          }
        }
      }
    },
    padding: {
      add: (attribute, value, on) => {
        if (value == "default") {
          code += `\n${on}.useDefaultPadding()`
        } else {
          paddingArray = value.match(/\d+/g)
          if (paddingArray.length == 1) {
            paddingArray = [
              paddingArray[0],
              paddingArray[0],
              paddingArray[0],
              paddingArray[0]
            ]
          } else if (paddingArray.length == 2) {
            paddingArray = [
              paddingArray[0],
              paddingArray[1],
              paddingArray[0],
              paddingArray[1]
            ]
          }
          code += `\n${on}.setPadding(${paddingArray.join(",")})`
        }
      },
      validate: (attribute, isAttribute, value) => {
        if (
          !/^\s*\d+((\s*,\s*\d+){3}|(\s*,\s*\d+))?\s*$|^default$/g.test(value)
        ) {
          error(6, attribute, isAttribute ? "attribute" : "property", value)
        }
      }
    },
    size: {
      add: (attribute, value, on) => {
        code += `\n${on}.${attribute
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) =>
            chr.toUpperCase()
          )} = new Size(${value.match(/\d+/g)[0]},${value.match(/\d+/g)[1]})`
      },
      validate: (attribute, isAttribute, value) => {
        if (!/^\s*\d+\s*,\s*\d+\s*$/.test(value)) {
          error(7, attribute, isAttribute ? "attribute" : "property", value)
        }
      }
    },
    font: {
      add: (attribute, value, on) => {
        let regex =
          /^\s*(((black|bold|medium|light|heavy|regular|semibold|thin|ultraLight)(MonospacedSystemFont|RoundedSystemFont|SystemFont)\s*,\s*(\d+))|(body|callout|caption1|caption2|footnote|subheadline|headline|largeTitle|title1|title2|title3)|((italicSystemFont)\s*,\s*(\d+)))\s*$/
        if (regex.test(value)) {
          code += `\n${on}.font = Font.${value.replace(
            regex,
            "$3$4$6$8($5$9)"
          )}`
        } else {
          code += `\n${on}.font = new Font("${value
            .split(",")[0]
            .replace(/"/g, "")}",${value.split(",")[1].match(/\d+/g)[0]})`
        }
      },
      validate: (attribute, isAttribute, value) => {
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
            "title3"
          ].includes(value)
        ) {
          error(8, attribute, isAttribute ? "attribute" : "property", value)
        }
      }
    },
    point: {
      add: (attribute, value, on) => {
        code += `\n${on}.shadowOffset = new Point(${
          value.split(",")[0].match(/-?\d+/)[0]
        },${value.split(",")[1].match(/-?\d+/)[0]})`
      },
      validate: (attribute, isAttribute, value) => {
        if (!/^\s*-?\d+\s*,\s*-?\d+\s*$/.test(value)) {
          error(9, attribute, isAttribute ? "attribute" : "property", value)
        }
      }
    },
    bool: {
      add: (attribute, value, on) => {
        if (attribute == "resizable" && value !== "false") {
          code += `\n${on}.resizable = false`
        }
        if (attribute == "container-relative-shape" && value !== "false") {
          code += `\n${on}.containerRelativeShape = true`
        }
      },
      validate: () => {}
    },
    url: {
      add: (attribute, value, on) => {
        code += `\n${on}.url = "${value.replace(/"/g, "")}"`
      },
      validate: (attribute, isAttribute, value) => {
        if (
          !/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
            value
          )
        ) {
          error(10, attribute, isAttribute ? "attribute" : "property", value)
        }
      }
    },
    image: {
      add: (attribute, value, on) => {
        if (value.startsWith("data:image/")) {
          code += `\n${on}.backgroundImage = Image.fromData(Data.fromBase64String("${value
            .replace(/data:image\/\w+?;base64,/, "")
            .replace(/"/g, "")}"))`
        } else {
          code += `\n${on}.backgroundImage = await new Request("${value.replace(
            /"/g,
            ""
          )}").loadImage()`
        }
      },
      validate: (attribute, isAttribute, value) => {
        if (
          !/^(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))|(data:image\/\w+?;base64,[a-zA-Z0-9+/]+={0,2})$/.test(
            value
          )
        ) {
          error(26, attribute, isAttribute ? "attribute" : "property", value)
        }
      }
    },
    layout: {
      add: (attribute, value, on) => {
        code += `\n${on}.layout${
          value == "vertically" ? "Vertically" : "Horizontally"
        }()`
      },
      validate: (attribute, isAttribute, value) => {
        if (value != "vertically" && value != "horizontally") {
          error(11, attribute, isAttribute ? "attribute" : "property", value)
        }
      }
    },
    alignText: {
      add: (attribute, value, on) => {
        code += `\n${on}.${value}AlignText()`
      },
      validate: (attribute, isAttribute, value) => {
        if (!["center", "left", "right"].includes(value)) {
          error(12, attribute, isAttribute ? "attribute" : "property", value)
        }
      }
    },
    alignImage: {
      add: (attribute, value, on) => {
        code += `\n${on}.${value}AlignImage()`
      },
      validate: (attribute, isAttribute, value) => {
        if (!["center", "left", "right"].includes(value)) {
          error(12, attribute, isAttribute ? "attribute" : "property", value)
        }
      }
    },
    alignContent: {
      add: (attribute, value, on) => {
        code += `\n${on}.${value}AlignContent()`
      },
      validate: (attribute, isAttribute, value) => {
        if (!["center", "top", "bottom"].includes(value)) {
          error(13, attribute, isAttribute ? "attribute" : "property", value)
        }
      }
    },
    applyStyle: {
      add: (attribute, value, on) => {
        code += `\n${on}.apply${value[0].toUpperCase() + value.slice(1)}Style()`
      },
      validate: (attribute, isAttribute, value) => {
        if (!["date", "timer", "offset", "relative", "time"].includes(value)) {
          error(14, attribute, isAttribute ? "attribute" : "property", value)
        }
      }
    },
    contentMode: {
      add: (attribute, value, on) => {
        code += `\n${on}.apply${
          value[0].toUpperCase() + value.slice(1)
        }ContentMode()`
      },
      validate: (attribute, isAttribute, value) => {
        if (!["filling", "fitting"].includes(value)) {
          error(15, attribute, isAttribute ? "attribute" : "property", value)
        }
      }
    }
  }
  
  // Function to parse a HTML
  function parseHTML(string) {
    // Declare the parser
    let parser = new XMLParser(string)

    // Root of html
    let main = {
      isRoot: true,
      name: "root",
      children: []
    }

    // Node to add onto
    let target = main

    // Store symbols to go back to parent nodes
    let goBack = {}

    // Store the new node and switch targets
    parser.didStartElement = (name, attrs) => {
      let backTo = Symbol("unique")
      goBack[backTo] = target
      let newTarget = {
        name,
        attrs,
        innerText: "",
        children: [],
        end: backTo
      }
      target.children.push(newTarget)
      target = newTarget
    }

    // Add the inner text to the node
    parser.foundCharacters = (text) => {
      target.innerText += target.innerText === "" ? text : " " + text
    }

    // Go back to the parent node
    parser.didEndElement = (name) => {
      sym = target.end
      delete target.end
      target = goBack[sym]
    }

    // Throw error on invalid input
    parser.parseErrorOccurred = () => {
      error(14)
    }
    if (!main.isRoot) {
      error(25, main.name)
    }

    // Parse and return the root
    parser.parse()
    return main
  }

  // Set base variables
  let currentStack,
    code = "",
    incrementors = {},
    gradientNumber = -1

  // Get only the first widget tag
  let widgetBody = parseHTML(input).children.filter((element) => {
    if (element.name == "widget") {
      return element
    }
  })[0]
  // If there were no widget tags raise error
  if (!widgetBody) {
    error(17)
  }
  // Get all direct style tags
  let styleTags = widgetBody.children.filter((e) => e.name == "style")
  let cssTexts = ""
  for (let styleTag of styleTags) {
    cssTexts += "\n" + styleTag.innerText
  }
  let mainCss = []
  let rules = cssTexts.match(/[\s\S]+?{[\s\S]*?}/g) || []
  // Repeat with each css rule
  for (let i = 0; i < rules.length; i++) {
    let rule = rules[i]
    if (
      !/^\s*(\.?[\w\-]+|\*)(\s*[,>]\s*(\.?[\w\-]+|\*))*\s*\{(\s*[\w\-]+\s*:\s*[^\n]+?\s*;)*?\s*([\w\-]+\s*:\s*[^\n]+\s*;?)?\s*\}/.test(
        rule
      )
    ) {
      error(18, rule.trim())
    }
    // Set rules into the mainCss JSON
    let declarations = {}
    rule
      .match(/\{([\s\S]*)\}/)[1]
      .split(";")
      .map((e) => e.trim())
      .filter((e) => e)
      .forEach((e) => {
        declarations[e.split(/:/)[0].trim()] = e
          .substring(e.indexOf(":") + 1)
          .trim()
      })
    let selectors = rule
      .match(/(\.?[\w\-]+|\*)(\s*[>,]\s*(\.?[\w\-]+|\*))*/)[0]
      .split(",")
    for (let selector of selectors) {
      mainCss.push({selector: parseSeletor(selector.trim()), css: declarations})
    }
  }
  function parseSeletor(input) {
    input = input.trim()
    let current = 0
    let root = []
    let currentSelector = root.push({
      classes: []
    })
    while (current < input.length) {
      let char = input[current]

      if (char === ".") {
        char = input[++current]
        let VALIDCHARS = /[-a-zA-Z_0-9]/
        if (!VALIDCHARS.test(char)) {
          throw new Error("A css parse error: `" + input + "`")
        }
        let value = ""
        while (char && VALIDCHARS.test(char)) {
          value += char
          char = input[++current]
        }
        root[currentSelector - 1].classes.push(value)
      }
      let SPACE = / /
      let DIRECTCHILD = />/
      if (DIRECTCHILD.test(char)) {
        char = input[++current]
        while (char && SPACE.test(char)) {
          char = input[++current]
        }
        currentSelector = root.push({
          classes: []
        })
      }
      let TAG = /[a-z]/i
      if (TAG.test(char)) {
        let value = ""
        while (char && TAG.test(char)) {
          value += char
          char = input[++current]
        }
        root[currentSelector - 1].tag = value
      }
      let STAR = /\*/
      if (STAR.test(char)) {
        char = input[++current]
        root[currentSelector - 1].tag = "*"
      }
      if (SPACE.test(char)) {
        char = input[++current]
      }
    }
    return root
  }

  // repeat with all rules on all tags and see if they fit the criteria
  for (let rule of mainCss) {
    applyCss(widgetBody, rule)
  }
  function applyCss(tag, rule) {
    if (tag.name == "style") {
      return
    }
    addCss(tag, rule, 0)
    if (tag.children) {
      for (let child of tag.children) {
        applyCss(child, rule)
      }
    }
  }
  function addCss(tag, rule, index) {
    if (tag.name == "style") {
      return
    }
    for (let cssClass of rule.selector[index].classes) {
      if (!tag.attrs.class) {
        return
      }
      if (!tag.attrs.class.split(" ").includes(cssClass)) {
        return
      }
    }
    if (
      rule.selector[index].tag &&
      rule.selector[index].tag !== "*" &&
      rule.selector[index].tag !== tag.name
    ) {
      return
    }
    if (rule.selector.length - 1 === index) {
      if (!tag.css) {
        tag.css = []
      }
      tag.css.push(rule)
    } else {
      if (tag.children) {
        for (let child of tag.children) {
          addCss(child, rule, index + 1)
        }
      }
    }
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
    if (tag.type == "Text" || tag.name == "style") {
      return
    }
    // Throw an error if there is a nestled widget tag
    if (tag.name == "widget" && code) {
      error(19)
    }
    // Increment incrementor
    if (incrementors[tag.name] || incrementors[tag.name] == 0) {
      incrementors[tag.name]++
    } else {
      incrementors[tag.name] = 0
    }
    let incrementor = incrementors[tag.name]
    // Get innerText
    let innerText = tag.innerText
      .replace(/&lt;/g, "<")
      .replace(/&gt/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/\n\s+/g, "\\n")
    let attributeCss = {}

    // Add attributes to css
    for (let key of Object.keys(tag.attrs)) {
      let value = tag.attrs[key].trim()
      if (key !== "class") {
        attributeCss[key] = value
      }
    }
    // Add or reset all selected css values if the tag does not have the no-css attribute
    let finalCss = {}
    if (tag.css) {
      for (let rule of tag.css) {
        if (!Object.keys(tag.attrs).includes("no-css")) {
          for (let key of Object.keys(rule.css)) {
            delete finalCss[key]
            finalCss[key] = rule.css[key]
          }
        }
      }
    }
    // Add attribute values to the css
    for (let key of Object.keys(attributeCss)) {
      delete finalCss[key]
      finalCss[key] = attributeCss[key]
    }

    // Switch for each tag name
    let mapping, linesBefore, codeLines
    switch (tag.name) {
      case "spacer":
        // Add the spacer to the code and validate for the space attribute
        code += `\nlet spacer${incrementor} = ${currentStack}.addSpacer(${
          attributeCss.space && attributeCss.space !== "null"
            ? attributeCss.space
            : ""
        })`
        mapping = {space: "posInt"}
        validate(attributeCss, finalCss, mapping)
        return
        break
      case "widget":
        // Add the widget to the code and validate the attributes and css
        code += `let widget = new ListWidget()`
        mapping = {
          "background": ["gradient", "image", "colour"],
          "refresh-after-date": "posInt",
          "spacing": "posInt",
          "url": "url",
          "padding": "padding"
        }
        validate(attributeCss, finalCss, mapping)
        // Repeat with each css value
        for (let key of Object.keys(finalCss)) {
          let value = finalCss[key]
          let on = "widget"
          if (
            key == "background" &&
            value !== "null" &&
            key != "no-css" &&
            key != "children"
          ) {
            // Background must be completed differently because it can have 3 different types
            try {
              types.url.validate("background", true, value)
              types.image.add(key, value, on)
            } catch (e) {
              if (
                value.split(
                  /,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/
                ).length === 1
              ) {
                await types.colour.add("background-color", value, on)
              } else {
                await types.gradient.add("background-gradient", value, on)
              }
            }
          } else if (value != "null" && key != "children" && key != "no-css") {
            // Add the style to the tag
            await types[mapping[key]].add(key, value, on)
          }
        }
        // Compile children with space indents
        linesBefore = code.split("\n").length
        for (let child of tag["children"]) {
          currentStack = "widget"
          await compile(child)
        }

        codeLines = code.split("\n")

        for (let i = codeLines.length - 1; i >= 0; i--) {
          if (i == linesBefore - 1) {
            break
          }
          codeLines[i] = "  " + codeLines[i]
        }
        code = codeLines.join("\n")
        return
        break
      case "stack":
        // Add the stack to the code and validate the attributes and css
        code += `\nlet stack${incrementor} = ${currentStack}.addStack()`
        mapping = {
          "background": ["gradient", "image", "colour"],
          "spacing": "posInt",
          "url": "url",
          "padding": "padding",
          "border-color": "colour",
          "border-width": "posInt",
          "size": "size",
          "corner-radius": "posInt",
          "align-content": "alignContent",
          "layout": "layout"
        }
        validate(attributeCss, finalCss, mapping)
        // Repeat with each css value
        for (let key of Object.keys(finalCss)) {
          let value = finalCss[key]
          let on = "stack" + incrementor
          if (
            key == "background" &&
            value !== "null" &&
            key != "children" &&
            key != "no-css"
          ) {
            // Background must be completed differently because it can have 3 different types
            try {
              types.image.validate("background", true, value)
              types.image.add(key, value, on)
            } catch (e) {
              if (
                value.split(
                  /,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/
                ).length === 1
              ) {
                await types.colour.add("background-color", value, on)
              } else {
                await types.gradient.add("background-gradient", value, on)
              }
            }
          } else if (value != "null" && key != "children" && key != "no-css") {
            // Add style to stack
            await types[mapping[key]].add(key, value, on)
          }
        }
        // Compile children with space indents
        linesBefore = code.split("\n").length
        let stack = "stack" + incrementor
        for (let child of tag["children"]) {
          currentStack = stack
          await compile(child)
        }

        codeLines = code.split("\n")

        for (let i = codeLines.length - 1; i >= 0; i--) {
          if (i == linesBefore - 1) {
            break
          }
          codeLines[i] = "  " + codeLines[i]
        }
        code = codeLines.join("\n")
        return
        break
      case "img":
        let image
        // Throw an error if there is no src attribute
        if (!attributeCss["src"] || attributeCss["src"] == "null") {
          error(20)
        }
        // Determine if the image is a URL or base encoding
        if (attributeCss["src"].startsWith("data:image/")) {
          image = `Image.fromData(Data.fromBase64String("${attributeCss["src"]
            .replace("data:image/png;base64,", "")
            .replace("data:image/jpeg;base64,", "")
            .replace(/"/g, "")}"))`
        } else {
          image = `await new Request("${attributeCss["src"].replace(
            /"/g,
            ""
          )}").loadImage()`
        }
        // Add the image to the code and validate attributes and css
        code += `\nlet img${incrementor} = ${currentStack}.addImage(${image})`
        mapping = {
          "src": "image",
          "url": "url",
          "border-color": "colour",
          "border-width": "posInt",
          "corner-radius": "posInt",
          "image-size": "size",
          "image-opacity": "decimal",
          "tint-color": "colour",
          "resizable": "bool",
          "container-relative-shape": "bool",
          "content-mode": "contentMode",
          "align-image": "alignImage"
        }
        validate(attributeCss, finalCss, mapping)
        // Add css styles to the image
        for (let key of Object.keys(finalCss)) {
          if (key == "src") {
            continue
          }
          let value = finalCss[key]
          let on = "img" + incrementor
          if (value != "null" && key != "children" && key != "no-css") {
            await types[mapping[key]].add(key, value, on)
          }
        }
        return
        break
      case "text":
        // Add text to the widget and validate attributes and css
        code += `\nlet text${incrementor} = ${currentStack}.addText("${innerText.replace(
          /"/g,
          ""
        )}")`
        mapping = {
          "url": "url",
          "font": "font",
          "line-limit": "posInt",
          "minimum-scale-factor": "decimal",
          "shadow-color": "colour",
          "shadow-offset": "point",
          "shadow-radius": "posInt",
          "text-color": "colour",
          "text-opacity": "decimal",
          "align-text": "alignText"
        }
        validate(attributeCss, finalCss, mapping)
        // Add styles to the text
        for (let key of Object.keys(finalCss)) {
          let value = finalCss[key]
          let on = "text" + incrementor
          if (value != "null" && key != "children" && key != "no-css") {
            await types[mapping[key]].add(key, value, on)
          }
        }
        return
        break
      case "date":
        // Add the date element to the widget and validate for the attributes and css
        code += `\nlet date${incrementor} = ${currentStack}.addDate(new Date("${innerText.replace(
          /"/g,
          ""
        )}"))`
        mapping = {
          "url": "url",
          "font": "font",
          "line-limit": "posInt",
          "minimum-scale-factor": "decimal",
          "shadow-color": "colour",
          "shadow-offset": "point",
          "shadow-radius": "posInt",
          "text-color": "colour",
          "text-opacity": "decimal",
          "align-text": "alignText",
          "apply-style": "applyStyle"
        }
        validate(attributeCss, finalCss, mapping)
        // Add styles to the date
        for (let key of Object.keys(finalCss)) {
          let value = finalCss[key]
          let on = "date" + incrementor
          if (value != "null" && key != "children" && key != "no-css") {
            await types[mapping[key]].add(key, value, on)
          }
        }
        return
        break
      default:
        // Throw an error if it is not a valid addon
        if (!Object.keys(addons).includes(tag.name)) {
          error(21, tag["name"])
        }
        code += `\n// <${tag.name}>`
        // Run the addon
        await addons[tag.name](
          validate,
          template,
          update,
          finalCss,
          attributeCss,
          innerText
        )
        code += `\n// </${tag.name}>`
        return
        // Function to add the raw html of the addon to the widget
        async function template(input) {
          // Parse the template
          let parsedInput = parseHTML(input)
          // Run through all children to determine where to put the tag children and add the no-css attribute
          parsedInput.children = parsedInput.children.map((e) =>
            putChildren(e, tag.children)
          )
          // Compile template
          let stack = currentStack
          linesBefore = code.split("\n").length

          for (let child of parsedInput.children) {
            let currentStack = stack
            await compile(child)
          }
          codeLines = code.split("\n")

          for (let i = codeLines.length - 1; i >= 0; i--) {
            if (i == linesBefore - 1) {
              break
            }
            codeLines[i] = "  " + codeLines[i]
          }
          code = codeLines.join("\n")
          // Function to add the no-css attribute to all children and put the tag children into the template
          function putChildren(tag, children) {
            if (tag.children) {
              tag.children.map((e) => {
                putChildren(e, children)
              })
            }
            if (Object.keys(tag.attrs).includes("children")) {
              for (let item of children) {
                tag.children.push(item)
              }
            }
            tag.attrs["no-css"] = ""
            return tag
          }
        }
    }
  }
  // Function that validated all attributes and css
  function validate(attributeCss, finalCss, mapping) {
    // Repeat with all the attributes
    for (let attr of Object.keys(attributeCss)) {
      // Do nothing if the attributes is children or no-css or the value is null
      if (
        attributeCss[attr] == "null" ||
        attr == "children" ||
        attr == "no-css"
      ) {
        continue
      }
      // Throw an error if the attribute is not in the mapping
      if (!mapping[attr]) {
        error(22, attr)
      }
      // Validate the attribute as a string or array of posibilities
      if (typeof mapping[attr] == "string") {
        types[mapping[attr]].validate(attr, true, attributeCss[attr])
      } else {
        let isValid = false
        for (let posibility of mapping[attr]) {
          try {
            types[posibility].validate(attr, true, attributeCss[attr])
            isValid = true
          } catch (e) {}
        }
        if (isValid === false) {
          error(
            23,
            attr,
            mapping[attr].join(", ").replace(/,([^,]*?)$/, " or$1"),
            attributeCss[attr]
          )
        }
      }
    }
    // Repeat with all the css
    for (let css of Object.keys(finalCss)) {
      // Do nothing if the css is children or no-css or the value is null
      if (finalCss[css] == "null" || css == "children" || css == "no-css") {
        continue
      }
      // Ignore css properties that are not in the mapping
      if (!mapping[css]) {
        delete finalCss[css]
        continue
      }
      // Validate the css as a string or array of posibilities
      if (typeof mapping[css] == "string") {
        types[mapping[css]].validate(css, false, finalCss[css])
      } else {
        let isValid = false
        for (let posibility of mapping[css]) {
          try {
            types[posibility].validate(css, false, finalCss[css])
            isValid = true
          } catch (e) {}
        }
        if (isValid === false) {
          error(
            24,
            attr,
            mapping[css].join(", ").replace(/,([^,]*?)$/, " or$1"),
            finalCss[css]
          )
        }
      }
    }
  }
  // Function to fill all not entered keys from the mapping with null
  function update(input, mapping) {
    for (let key of Object.keys(mapping)) {
      if (!Object.keys(input).includes(key)) {
        input[key] = "null"
      }
    }
    return input
  }

  // Function to get any html supported color
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
  function error(number) {
    const errors = {
      1: "`{}` {} must be a positive integer: `{}`",
      2: "`{}` {} must be a positive integer or float with an optional `%` at the end: `{}`",
      3: "`{}` {} locations must be in ascending order: `{}`",
      4: "`{}` {} locations must be equal or greater than `0`: `{}`",
      5: "`{}` {} locations must be equal or less than `1`: `{}`",
      6: "`{}` {} must be 1, 2 or 4 positive integers separated by commas or be `default`: `{}`",
      7: "`{}` {} must be 2 positive integers separated by commas: `{}`",
      8: "`{}` {} must be 1 font name and 1 positive integer separated by commas or be a content-based font: `{}`",
      9: "`{}` {} must be 2 integers separated by commas: `{}`",
      10: "`{}` {} must be a valid URL: `{}`",
      11: "`{}` {} must be `vertically` or `horizontally`: `{}`",
      12: "`{}` {} must be `left`, `right` or `center`: `{}`",
      13: "`{}` {} must be `top`, `bottom` or `center`: `{}`",
      15: "`{}` {} must be `date`, `timer` , `relative`, `time`, or `offset`: `{}`",
      16: "`{}` {} must be `filling` or `fitting`: `{}`",
      17: "`widget` tag must be the root tag",
      18: "Invalid CSS rule: `{}`",
      19: "`widget` tag must not be nestled",
      20: "`img` tag must have a `src` attribute",
      21: "Invalid tag name: `{}`",
      22: "Unknown attribute: `{}`",
      23: "`{}` attribute must be a {} type: `{}`",
      24: "`{}` property must be a {} type: `{}`",
      26: "`{}` {} must be a valid url or base encoded data link: `{}`",
      14: "A parse error occurred, ensure your widget is formatted properly.",
      25: "A parse error occurred, ensure all self closing tages are closed: <{}>"
    }
    let error = errors[number]
    let params = [...arguments]
    params.splice(0, 1)
    for (let param of params) {
      error = error.replace("{}", param)
    }
    throw new Error(error)
  }
}
