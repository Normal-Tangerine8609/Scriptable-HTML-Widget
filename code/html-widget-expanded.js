//HTML Widget Version 6.02
//https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget

module.exports = async function htmlWidget(input, debug, addons) {
  //////////
  // Addons
  //////////

  const symbol = async (
    validate,
    template,
    update,
    styles,
    attrs,
    innerText
  ) => {
    const mapping = {
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

    validate(attrs, styles, mapping)
    update(styles, mapping)

    let symbol = SFSymbol.named(innerText)
    if (!symbol) {
      symbol = SFSymbol.named("questionmark.circle")
    }
    let symbolSize = 100
    if (styles["image-size"] !== "null") {
      let [width, height] = styles["image-size"].match(/\d+/g)
      symbolSize = parseInt(width > height ? height : width)
    }
    symbol.applyFont(Font.systemFont(symbolSize))
    await template(`
<img 
  src="data:image/png;base64,${Data.fromPNG(symbol.image).toBase64String()}" 
  url="${styles.url}" 
  border-color="${styles["border-color"]}"
  border-width="${styles["border-width"]}" 
  corner-radius="${styles["corner-radius"]}" 
  image-size="${styles["image-size"]}" 
  image-opacity="${styles["image-opacity"]}" 
  tint-color="${styles["tint-color"]}" 
  content-mode="${styles["content-mode"]}" 
  align-image="${styles["align-image"]}" 
  container-relative-shape="${styles["container-relative-shape"]}" 
  resizable="${styles["resizable"]}"
/>
  `)
  }

  const blockquote = async (
    validate,
    template,
    update,
    styles,
    attrs,
    innerText
  ) => {
    const mapping = {
      "url": "url",
      "background": ["colour", "gradient"],
      "corner-radius": "posInt",
      "bar-width": "posInt",
      "bar-background": ["colour", "gradient"],
      "bar-corner-radius": "posInt",
      "space": "posInt",
      "spacing": "posInt",
      "padding": "padding",
      "layout": "layout",
      "width": "posInt",
      "height": "posInt"
    }

    validate(attrs, styles, mapping)

    let barWidth = Number(
      styles["bar-width"] && styles["bar-width"] !== "null"
        ? styles["bar-width"]
        : 5
    )
    let height = Number(
      styles.height && styles.height !== "null" ? styles.height : 100
    )
    let width = Number(
      styles.width && styles.width !== "null" ? styles.width : 100
    )
    let space = Number(
      styles.space && styles.space !== "null" ? styles.space : 0
    )
    let contentWidth = width - barWidth - space

    await template(`
      <stack layout="horizontally" url="${styles.url || null}">
        <stack size="${barWidth + "," + height}" background="${
      styles["bar-background"] || "black-white"
    }" corner-radius="${styles["bar-corner-radius"] || null}">
        </stack>
        <spacer space="${space}"/>
        <stack background="${
          styles.background || "rgb(0,0,0,50%)-rgb(255,255,255,50%)"
        }" corner-radius="${styles["corner-radius"] || null}" spacing="${
      styles.spacing || null
    }" padding="${styles.padding || 3}" layout="${
      styles.layout || "vertically"
    }" size="${contentWidth + "," + height}" children="">
        </stack>
      </stack>
  `)
  }

  const hr = async (validate, template, update, styles, attrs, innerText) => {
    const mapping = {
      "background": ["colour", "gradient", "image"],
      "url": "url",
      "corner-radius": "posInt",
      "width": "posInt",
      "height": "posInt"
    }

    validate(attrs, styles, mapping)

    await template(`
    <stack background="${styles.background || "black-white"}" url="${
      styles.url || "null"
    }" corner-radius="${styles["corner-radius"] || "null"}">
      ${styles.width ? "" : "<spacer/>"}
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" image-size="${
        styles.width || 100
      },${styles.height || 1}"/>
      ${styles.width ? "" : "<spacer/>"}
    </stack>
  `)
  }

  const progress = async (
    validate,
    template,
    update,
    styles,
    attrs,
    innerText
  ) => {
    const mapping = {
      "url": "url",
      "background": ["colour", "gradient"],
      "progress-background": ["colour", "gradient"],
      "border-color": "colour",
      "border-width": "posInt",
      "corner-radius": "posInt",
      "progress-corner-radius": "posInt",
      "width": "posInt",
      "height": "posInt",
      "value": "decimal"
    }
    validate(attrs, styles, mapping)
    let value = /\d*(?:\.\d*)?%?/.exec(attrs.value)[0]
    if (value.endsWith("%")) {
      value = Number(value.replace("%", ""))
      value /= 100
    }
    if (!attrs.value) {
      throw new Error("`progress` tag must have a `value` attribute")
    }
    if (value < 0) {
      throw new Error(`\`value\` attribute must be above \`0\`: ${attrs.value}`)
    }
    if (value > 1) {
      throw new Error(`\`value\` attribute must be below \`1\`: ${attrs.value}`)
    }

    let width = Number(
      styles.width && styles.width !== "null" ? styles.width : 100
    )
    let height = Number(
      styles.height && styles.height !== "null" ? styles.height : 1
    )
    await template(`
    <stack url="${styles.url || "null"}" 
      background="${styles.background || "black-white"}" 
      border-color="${styles["border-color"] || "null"}" 
      border-width="${styles["border-width"] || "null"}" 
      corner-radius="${styles["corner-radius"] || "null"}" 
      size="${width}, ${height}"
    >
      <stack background="${styles["progress-background"] || "gray"}" 
        corner-radius="${styles["progress-corner-radius"] || "null"}" 
        size="${Math.round(width * Number(value))}, ${height}">
      </stack>
      <stack size="${Math.round(
        width * (1 - Number(value))
      )}, ${height}"></stack>
    </stack>
  `)
  }

  if (addons) {
    Object.assign(addons, progress, hr, symbol, blockquote)
  } else {
    addons = {progress, hr, symbol, blockquote}
  }
  
  ///////////////////
  // PRIMATIVE TYPES
  ///////////////////
  const types = {
    colour: {
      add: async (attribute, value, on) => {
        const colours = value.split("-")
        const colour =
          colours.length == 2
            ? `Color.dynamic(${await colorFromValue(
                colours[0]
              )}, ${await colorFromValue(colours[1])})`
            : await colorFromValue(colours[0])
        code += `\n${on}.${toCamelCase(attribute)} = ${colour}`
      },
      validate: () => {}
    },
    posInt: {
      add: (attribute, value, on) => {
        if (attribute == "refresh-after-date") {
          code += `\nlet date = new Date()\ndate.setMinutes(date.getMinutes() + ${value})\nwidget.refreshAfterDate = date`
        } else {
          code += `\n${on}.${toCamelCase(attribute)} = ${value}`
        }
      },
      validate: (attribute, type, value) => {
        if (!/^\d+$/.test(value)) {
          error(1, attribute, type, value)
        }
      }
    },
    decimal: {
      add: (attribute, value, on) => {
        if (value.endsWith("%")) {
          value = Number(value.replace("%", ""))
          value /= 100
        }
        code += `\n${on}.${toCamelCase(attribute)} = ${value}`
      },
      validate: (attribute, type, value) => {
        if (!/^\d*((\.\d+)|\d\.?)%?$/.test(value)) {
          error(2, attribute, type, value)
        }
      }
    },
    gradient: {
      add: async (attribute, value, on) => {
        gradientNumber++

        // split into parts
        let gradient = value
          .split(/,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/)
          .map((e) => e.trim())

        // get the direction from the first item of gradient
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
        // check if it is a word direction, degrees direction or none are provided
        if (gradient[0] in wordDirections) {
          gradientDirection = wordDirections[gradient.shift()]
        } else if (/\d+\s*deg/.test(gradient[0])) {
          gradientDirection = Number(gradient.shift().match(/(\d+)\s*deg/)[1])
        } else {
          gradientDirection = 0
        }

        // Get colours
        let colours = []
        for (let colour of gradient) {
          colour = colour.replace(/\s+\d*((\.\d+)|\d\.?)%?$/, "")
          colour = colour.split("-")
          if (colour.length == 2) {
            colours.push(
              `Color.dynamic(${await colorFromValue(
                colour[0]
              )},${await colorFromValue(colour[1])})`
            )
          } else {
            colours.push(await colorFromValue(colour[0]))
          }
        }

        // Get locations
        let locations = gradient.map((e) => {
          // get all provided locations
          let matched = e.match(/\s+\d*((\.\d+)|\d\.?)%?$/)
          // get the matched result or null
          let result = matched && matched[0]
          // divide a percentage
          if (result && result.endsWith("%")) {
            result = Number(result.replace("%", "")) / 100
          }
          return result === null ? null : Number(result)
        })

        // Set defult first and last locations
        if (locations[0] === null) {
          locations[0] = 0
        }
        if (locations[locations.length - 1] === null) {
          locations[locations.length - 1] = 1
        }

        // Set not specified locations
        for (let i = 0; i < locations.length; i++) {
          let currentLocation = locations[i]
          // get next non-null location index
          let index = i + 1
          while (index < locations.length && locations[index] === null) {
            index++
          }
          // calculate the difference between each null location for a linear trasition
          let difference = (locations[index] - locations[i]) / (index - i)

          // set each between null location
          for (let plusIndex = 1; plusIndex < index - i; plusIndex++) {
            locations[i + plusIndex] = difference * plusIndex + currentLocation
          }
        }

        // calculate gradient points based on the direction
        const x1 =
          1 - (0.5 + 0.5 * Math.cos((Math.PI * (gradientDirection + 90)) / 180))
        const y1 =
          1 - (0.5 + 0.5 * Math.sin((Math.PI * (gradientDirection + 90)) / 180))
        const x2 =
          0.5 + 0.5 * Math.cos((Math.PI * (gradientDirection + 90)) / 180)
        const y2 =
          0.5 + 0.5 * Math.sin((Math.PI * (gradientDirection + 90)) / 180)
        code += `\nlet gradient${gradientNumber} = new LinearGradient()\ngradient${gradientNumber}.colors = [${colours}]\ngradient${gradientNumber}.locations = [${locations}]\ngradient${gradientNumber}.startPoint = ${`new Point(${x1}, ${y1})`}\ngradient${gradientNumber}.endPoint = ${`new Point(${x2}, ${y2})`}\n${on}.backgroundGradient = gradient${gradientNumber}`
      },
      validate: (attribute, type, value) => {
        let gradient = value
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
        let locations = gradient.map((e) => {
          // get all provided locations
          let matched = e.match(/\s+\d*((\.\d+)|\d\.?)%?$/)
          // get the matched result or null
          let result = matched && matched[0]
          // divide a percentage
          if (result && result.endsWith("%")) {
            result = Number(result.replace("%", "")) / 100
          }
          return result === null ? null : Number(result)
        })

        let minLocation = 0
        for (let i = 0; i < locations.length; i++) {
          let currentLocation = locations[i]
          if (currentLocation) {
            if (minLocation > currentLocation) {
              error(3, attribute, type, value)
            }
            if (currentLocation < 0) {
              error(4, attribute, type, value)
            }
            if (currentLocation > 1) {
              error(5, attribute, type, value)
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
          let paddingArray = value.match(/\d+/g)
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
          code += `\n${on}.setPadding(${paddingArray.join(", ")})`
        }
      },
      validate: (attribute, type, value) => {
        if (!/^(\d+((\s*,\s*\d+){3}|(\s*,\s*\d+))?|default)$/g.test(value)) {
          error(6, attribute, type, value)
        }
      }
    },
    size: {
      add: (attribute, value, on) => {
        let size = value.match(/\d+/g)
        code += `\n${on}.${toCamelCase(attribute)} = new Size(${size[0]}, ${
          size[1]
        })`
      },
      validate: (attribute, type, value) => {
        if (!/^\d+\s*,\s*\d+$/.test(value)) {
          error(7, attribute, type, value)
        }
      }
    },
    font: {
      add: (attribute, value, on) => {
        let regex =
          /^(((black|bold|medium|light|heavy|regular|semibold|thin|ultraLight)(MonospacedSystemFont|RoundedSystemFont|SystemFont)\s*,\s*(\d+))|(body|callout|caption1|caption2|footnote|subheadline|headline|largeTitle|title1|title2|title3)|((italicSystemFont)\s*,\s*(\d+)))$/
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
      validate: (attribute, type, value) => {
        if (
          !/^[^,]+,\s*\d+$/.test(value) &&
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
          error(8, attribute, type, value)
        }
      }
    },
    point: {
      add: (attribute, value, on) => {
        const point = value.split(",")
        code += `\n${on}.shadowOffset = new Point(${point[0]},${point[1]})`
      },
      validate: (attribute, type, value) => {
        if (!/^-?\d+\s*,\s*-?\d+$/.test(value)) {
          error(9, attribute, type, value)
        }
      }
    },
    bool: {
      add: (attribute, value, on) => {
        if (attribute == "resizable" && value !== "false") {
          code += `\n${on}.resizable = false`
        } else if (
          attribute == "container-relative-shape" &&
          value !== "false"
        ) {
          code += `\n${on}.containerRelativeShape = true`
        }
      },
      validate: () => {}
    },
    url: {
      add: (attribute, value, on) => {
        code += `\n${on}.url = "${value.replace(/"/g, "")}"`
      },
      validate: (attribute, type, value) => {
        if (
          !/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
            value
          )
        ) {
          error(10, attribute, type, value)
        }
      }
    },
    image: {
      add: (attribute, value, on) => {
        if (value.startsWith("data:image/")) {
          code += `\n${on}.backgroundImage = Image.fromData(Data.fromBase64String("${value
            .replace(/data:image\/\w+;base64,/, "")
            .replace(/"/g, "")}"))`
        } else {
          code += `\n${on}.backgroundImage = await new Request("${value.replace(
            /"/g,
            ""
          )}").loadImage()`
        }
      },
      validate: (attribute, type, value) => {
        if (
          !/^(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))|(data:image\/\w+?;base64,[a-zA-Z0-9+/]+={0,2})$/.test(
            value
          )
        ) {
          error(26, attribute, type, value)
        }
      }
    },
    layout: {
      add: (attribute, value, on) => {
        code += `\n${on}.layout${value[0].toUpperCase() + value.slice(1)}()`
      },
      validate: (attribute, type, value) => {
        if (value != "vertically" && value != "horizontally") {
          error(11, attribute, type, value)
        }
      }
    },
    alignText: {
      add: (attribute, value, on) => {
        code += `\n${on}.${value}AlignText()`
      },
      validate: (attribute, type, value) => {
        if (!["center", "left", "right"].includes(value)) {
          error(12, attribute, type, value)
        }
      }
    },
    alignImage: {
      add: (attribute, value, on) => {
        code += `\n${on}.${value}AlignImage()`
      },
      validate: (attribute, type, value) => {
        if (!["center", "left", "right"].includes(value)) {
          error(12, attribute, type, value)
        }
      }
    },
    alignContent: {
      add: (attribute, value, on) => {
        code += `\n${on}.${value}AlignContent()`
      },
      validate: (attribute, type, value) => {
        if (!["center", "top", "bottom"].includes(value)) {
          error(13, attribute, type, value)
        }
      }
    },
    applyStyle: {
      add: (attribute, value, on) => {
        code += `\n${on}.apply${value[0].toUpperCase() + value.slice(1)}Style()`
      },
      validate: (attribute, type, value) => {
        if (!["date", "timer", "offset", "relative", "time"].includes(value)) {
          error(14, attribute, type, value)
        }
      }
    },
    contentMode: {
      add: (attribute, value, on) => {
        code += `\n${on}.apply${
          value[0].toUpperCase() + value.slice(1)
        }ContentMode()`
      },
      validate: (attribute, type, value) => {
        if (!["filling", "fitting"].includes(value)) {
          error(15, attribute, type, value)
        }
      }
    }
  }

  ///////////////////
  // PARSE HTML + STYLES
  ///////////////////

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
      let sym = target.end
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

  // Get only the first widget tag
  let widgetBody = parseHTML(input).children.find((e) => {
    if (e.name == "widget") {
      return e
    }
  })

  // If there were no widget tags raise error
  if (!widgetBody) {
    error(17)
  }

  // Get all direct style tags
  const styleTags = widgetBody.children.filter((e) => e.name == "style")

  // combine the css text
  let cssTexts = ""
  for (let styleTag of styleTags) {
    cssTexts += "\n" + styleTag.innerText
  }

  // store css
  let mainCss = []

  // get all css rules
  const rules = cssTexts.match(/[\s\S]+?{[\s\S]*?}/g) || []

  // Repeat with each css rule
  for (let rule of rules) {
    // Test rule
    if (
      !/^\s*(\.?[\w\-]+|\*)(\s*[,>]\s*(\.?[\w\-]+|\*))*\s*\{(\s*[\w\-]+\s*:\s*[^\n]+?\s*;)*?\s*([\w\-]+\s*:\s*[^\n]+\s*;?)?\s*\}/.test(
        rule
      )
    ) {
      error(18, rule.trim())
    }
    // Store the declarations for the rule
    let declarations = {}

    // format declarations into the declarations JSON
    const rawDeclorations = rule.match(/\{([\s\S]*)\}/)[1].split(";")
    for (let decloration of rawDeclorations) {
      decloration = decloration.trim()
      if (!decloration) {
        continue
      }
      const property = decloration.split(/:/)[0].trim()
      const value = decloration.split(/:/).splice(1).join(":").trim()
      declarations[property] = value
    }

    // get the selector for the rule
    const selectors = rule
      .match(/(\.?[\w\-]+|\*)(\s*[>,]\s*(\.?[\w\-]+|\*))*/)[0]
      .split(",")
    // add the css rule to the main css with all selectors
    for (let selector of selectors) {
      mainCss.push({selector: parseSeletor(selector), css: declarations})
    }
  }

  // function to parse the selectors
  function parseSeletor(input) {
    input = input.trim()
    // store parser character location
    let current = 0
    // store the full css selector
    let root = []
    // store the current css selector position
    let currentSelector = root.push({
      classes: []
    })

    // repeat while the parser has characters left to go through
    while (current < input.length) {
      // store the current character
      let char = input[current]

      // if the char is a `.` then get all following valid characters and add a class to the selector
      if (char === ".") {
        char = input[++current]
        let VALIDCHARS = /[-a-zA-Z_0-9]/
        if (!VALIDCHARS.test(char)) {
          error(27, input)
        }
        let value = ""
        while (char && VALIDCHARS.test(char)) {
          value += char
          char = input[++current]
        }
        root[currentSelector - 1].classes.push(value)
      }

      // If it matches a direct child then create a new currentSelector position for the next part of the selector
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

      // if it matches a tag then get the tag name and add it to the selector
      let TAG = /[a-z]/i
      if (TAG.test(char)) {
        let value = ""
        while (char && TAG.test(char)) {
          value += char
          char = input[++current]
        }
        root[currentSelector - 1].tag = value
      }

      // if it matches a star then set the tag to be a `*`
      let STAR = /\*/
      if (STAR.test(char)) {
        char = input[++current]
        root[currentSelector - 1].tag = "*"
      }
      if (SPACE.test(char)) {
        char = input[++current]
      }
    }

    // return the root of the selector
    return root
  }

  // each element and attempt to add styles
  applyCss(widgetBody)
  function applyCss(tag) {
    if (tag.name == "style") {
      return
    }
    for (let rule of mainCss) {
      addCss(tag, rule, 0)
    }
    if (tag.children) {
      for (let child of tag.children) {
        applyCss(child)
      }
    }
  }

  // function to check if a selector matches an element and add the css to it
  function addCss(tag, rule, index) {
    if (tag.name === "style") {
      return
    }

    // ensure matching classes
    for (let cssClass of rule.selector[index].classes) {
      if (!tag.attrs.class) {
        return
      }
      if (!tag.attrs.class.split(" ").includes(cssClass)) {
        return
      }
    }

    // enaure proper tag name
    if (
      rule.selector[index].tag &&
      rule.selector[index].tag !== "*" &&
      rule.selector[index].tag !== tag.name
    ) {
      return
    }

    // if at the end of the css (no `>` following) add the css to the tag's css'
    // else check for matching the next level of the css with children tag (selector following `>`)
    if (rule.selector.length - 1 === index) {
      if (!tag.css) {
        tag.css = []
      }
      tag.css.push(rule)
    } else if (tag.children) {
      for (let child of tag.children) {
        addCss(child, rule, index + 1)
      }
    }
  }

  ///////////////////
  // COMPILE WIDGET
  ///////////////////

  // Set base variables
  let currentStack,
    code = "",
    incrementors = {},
    gradientNumber = -1

  // compile the widget
  await compile(widgetBody)

  // Run code and set output of function
  if (debug == true) {
    console.log(code)
  }
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
  const runCode = new AsyncFunction(code + "\nreturn widget")
  return await runCode()

  // function to compile the widget
  async function compile(tag) {
    // Do nothing when compile normal text or css
    if (tag.type == "Text" || tag.name == "style") {
      return
    }
    // Throw an error if there is a nestled widget tag
    if (tag.name == "widget" && code) {
      error(19)
    }

    // Add a new line spacing before tags
    if (code) {
      code += "\n"
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

    // store attributes that translate to css
    let attributeCss = {}

    // Add attributes to css
    for (let key in tag.attrs) {
      let value = tag.attrs[key].trim()
      if (!["class", "no-css", "children"].includes(key)) {
        attributeCss[key] = value
      }
    }

    // Add or reset all selected css values if the tag does not have the no-css attribute
    let finalCss = {}
    if (tag.css) {
      for (let rule of tag.css) {
        if (!("no-css" in tag.attrs)) {
          for (let key in rule.css) {
            delete finalCss[key]
            finalCss[key] = rule.css[key]
          }
        }
      }
    }

    // Add attribute values to the css
    for (let key in attributeCss) {
      delete finalCss[key]
      finalCss[key] = attributeCss[key]
    }

    // Switch for each tag name
    let mapping, linesBefore

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
        for (let key in finalCss) {
          const value = finalCss[key]
          const on = "widget"
          if (key == "background" && value !== "null") {
            // Background must be completed differently because it can have 3 different types
            try {
              // try for image
              types.url.validate("background", true, value)
              types.image.add(key, value, on)
            } catch (e) {
              // split for gradient and if the length is 1 set as a background colour else as a grafient
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
          } else if (value !== "null") {
            // Add the style to the tag
            const addFunc = types[mapping[key]].add
            if (isAsync(addFunc)) {
              await addFunc(key, value, on)
            } else {
              addFunc(key, value, on)
            }
          }
        }
        // Compile children with space indents
        linesBefore = code.split("\n").length
        for (let child of tag.children) {
          currentStack = "widget"
          await compile(child)
        }

        // add indents to the code before the widget tag
        indent(linesBefore)
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
        for (let key in finalCss) {
          const value = finalCss[key]
          const on = "stack" + incrementor
          if (key == "background" && value !== "null") {
            // Background must be completed differently because it can have 3 different types
            try {
              // try for background image
              types.image.validate("background", true, value)
              types.image.add(key, value, on)
            } catch (e) {
              // split for gradient and if the length is 1 set as a background colour else as a grafient
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
          } else if (value !== "null") {
            // Add style to stack
            const addFunc = types[mapping[key]].add
            if (isAsync(addFunc)) {
              await addFunc(key, value, on)
            } else {
              addFunc(key, value, on)
            }
          }
        }

        // Compile children with space indents
        linesBefore = code.split("\n").length
        let stack = "stack" + incrementor
        for (let child of tag["children"]) {
          currentStack = stack
          await compile(child)
        }

        // add indents to the code before the stack tag
        indent(linesBefore)
        return
        break
      case "img":
        let image
        // Throw an error if there is no src attribute
        if (!attributeCss["src"] || attributeCss["src"] === "null") {
          error(20)
        }
        // Determine if the image is a URL or base encoding
        if (attributeCss["src"].startsWith("data:image/")) {
          image = `Image.fromData(Data.fromBase64String("${attributeCss["src"]
            .replace(/data:image\/.*?;base64,/, "")
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
        for (let key in finalCss) {
          if (key == "src") {
            continue
          }
          const value = finalCss[key]
          const on = "img" + incrementor
          if (value !== "null") {
            const addFunc = types[mapping[key]].add
            if (isAsync(addFunc)) {
              await addFunc(key, value, on)
            } else {
              addFunc(key, value, on)
            }
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
        for (let key in finalCss) {
          const value = finalCss[key]
          const on = "text" + incrementor
          if (value !== "null") {
            const addFunc = types[mapping[key]].add
            if (isAsync(addFunc)) {
              await addFunc(key, value, on)
            } else {
              addFunc(key, value, on)
            }
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
        for (let key in finalCss) {
          const value = finalCss[key]
          const on = "date" + incrementor
          if (value != "null") {
            const addFunc = types[mapping[key]].add
            if (isAsync(addFunc)) {
              await addFunc(key, value, on)
            } else {
              addFunc(key, value, on)
            }
          }
        }
        return
        break
      default:
        // Throw an error if it is not a valid addon
        if (!(tag.name in addons)) {
          error(21, tag.name)
        }
        code += `\n// <${tag.name}>`
        // Run the addon
        const addonParams = [
          validate,
          template,
          update,
          finalCss,
          attributeCss,
          innerText
        ]
        if (isAsync(addons[tag.name])) {
          await addons[tag.name](...addonParams)
        } else {
          addons[tag.name](...addonParams)
        }
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
          const codeLines = code.split("\n")

          indent(linesBefore)

          // Function to add the no-css attribute to all children and put the tag children into the template
          function putChildren(tag, children) {
            if (tag.children) {
              tag.children.map((e) => {
                putChildren(e, children)
              })
            }
            if ("children" in tag.attrs) {
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
    for (let attr in attributeCss) {
      // Do nothing if the attributes is null
      if (attributeCss[attr] === "null") {
        continue
      }
      // Throw an error if the attribute is not in the mapping
      if (!mapping[attr]) {
        error(22, attr)
      }
      // Validate the attribute as a string or array of posibilities
      if (typeof mapping[attr] === "string") {
        types[mapping[attr]].validate(attr, "attribute", attributeCss[attr])
      } else {
        let isValid = false
        for (let posibility of mapping[attr]) {
          try {
            types[posibility].validate(attr, "attribute", attributeCss[attr])
            isValid = true
          } catch (e) {}
        }
        if (!isValid) {
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
    for (let css in finalCss) {
      // Do nothing if the css is children or no-css or the value is null
      if (finalCss[css] === "null") {
        continue
      }
      // Ignore css properties that are not in the mapping
      if (!mapping[css]) {
        delete finalCss[css]
        continue
      }
      // Validate the css as a string or array of posibilities
      if (typeof mapping[css] === "string") {
        types[mapping[css]].validate(css, "property", finalCss[css])
      } else {
        let isValid = false
        for (let posibility of mapping[css]) {
          try {
            types[posibility].validate(css, "property", finalCss[css])
            isValid = true
          } catch (e) {}
        }
        if (!isValid) {
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
    for (let key in mapping) {
      if (!(key in input)) {
        input[key] = "null"
      }
    }
    return input
  }

  ///////////////////
  // HELPER FUNCTIONS
  ///////////////////

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

  function toCamelCase(text) {
    return text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
  }

  function indent(startLine) {
    const codeLines = code.split("\n")
    for (let i = codeLines.length - 1; i >= startLine; i--) {
      codeLines[i] = "  " + codeLines[i]
    }
    code = codeLines.join("\n")
  }

  // if the provided function is a async function
  function isAsync(func) {
    return func.constructor.name === "AsyncFunction"
  }

  // error function
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
      25: "A parse error occurred, ensure all self closing tages are closed: <{}>",
      27: "A css parse error occurred: `{}`"
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
