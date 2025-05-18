//HTML Widget Version 6.3.0
//https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget

async function htmlWidget(input, debug = false, addons = {}) {
  /*****************
   * MAIN PROGRAM
   *****************/
  let currentStack = "widget"
  let code = ""
  let incrementors = {}
  let gradientNumber = -1
  let indentLevel = 0
  const colorCache = new Map()
  const cascadingProperties = [
    "font",
    "lineLimit",
    "minimumScaleFactor",
    "shadowColor",
    "shadowOffset",
    "shadowRadius",
    "textColor",
    "textOpacity",
    "alignText"
  ]

  // Parse and locate the widget
  const {root, styleTags} = parseHTML(input)
  const widgetBody = root.children.find((e) => e.name == "widget")
  if (!widgetBody) {
    error("`widget` tag must be the root tag.")
  }

  // Combine style text and apply css to the widget
  const mainCss = createCss(styleTags.map((e) => e.innerText).join("\n"))
  applyCss(widgetBody, mainCss)

  // Generate types then compile the widget
  const types = getTypes()
  await compile(widgetBody)
  appendCodeLine("// Widget Complete")

  // Debug and create the widget
  if (debug) {
    console.log(code)
  }
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
  const runCode = new AsyncFunction(code + "\nreturn widget")
  return await runCode()

  /*********************
   * PARSE HTML + STYLES
   *********************/

  // Function to parse a HTML
  function parseHTML(string) {
    const styleTags = []
    const parser = new XMLParser(string)

    // Root of html
    const root = {
      name: "root",
      children: []
    }
    const stack = [root]

    // Store the new node and add it to the stack
    parser.didStartElement = (name, attrs) => {
      const node = {
        name,
        attrs,
        innerText: "",
        children: [],
        classList: [],
        noCss: false,
        putChildren: false
      }

      // Style tags are not part of the output tree
      if (name === "style") {
        styleTags.push(node)
      } else {
        stack.at(-1).children.push(node)
      }
      // Still need to add style tags to the stack
      stack.push(node)
    }

    // Add the inner text to the node
    parser.foundCharacters = (text) => {
      stack.at(-1).innerText += text
    }

    // Remove element from the stack and normalize its attributes
    parser.didEndElement = () => {
      const removed = stack.pop()

      const normalizedAttrs = {}
      for (const [attr, value] of Object.entries(removed.attrs)) {
        const normalizedAttrName = toCamelCase(attr)
        if (normalizedAttrName === "class") {
          removed.classList = removed.attrs.class.trim().split(/\s+/)
        } else if (normalizedAttrName === "noCss") {
          removed.noCss = true
        } else if (normalizedAttrName === "children") {
          removed.putChildren = true
        } else {
          const normalizedValue = value.trim()
          normalizedAttrs[normalizedAttrName] =
            normalizedValue === "null" ? null : normalizedValue
        }
      }
      removed.attrs = normalizedAttrs

      if (stack.length === 0) {
        error("Unexpected closing tag: <{}/>", removed.name)
      }
    }

    // Throw error on invalid input
    parser.parseErrorOccurred = (message) => {
      error("A parse error occurred: {}", message)
    }

    parser.parse()
    if (stack.length !== 1) {
      error(
        "A parse error occurred, ensure all tags are closed and attributes are properly formatted: <{}>",
        stack.at(-1).name
      )
    }

    return {root, styleTags}
  }

  // function to parse the selectors
  function parseSelector(input) {
    // ignore whitespace, split on '>', and filter out empties
    const segments = input
      .replace(/\s/g, "")
      .split(">")
      .filter((segment) => segment.length)

    return segments.map((segment) => {
      let tag
      let rest = segment
      if (!segment.startsWith(".")) {
        // There is a tag name
        const match = segment.match(/^([a-zA-Z][\w-]*|\*)/)
        if (match) {
          tag = match[1]
          rest = segment.slice(tag.length)
        } else {
          error("A css parse error occurred, invalid tag name: {}.", segment)
        }
      }
      // There can be multiple class names
      const classes = []
      let classMatch
      const CLASS_RE = /\.([-_a-zA-Z0-9]+)/g
      while ((classMatch = CLASS_RE.exec(rest))) {
        classes.push(classMatch[1])
      }

      return {tag, classes}
    })
  }

  // function to convert the css text into a object
  function createCss(cssText) {
    const css = []
    const RULE_RE = /([^{]+)\{([^}]+)\}/g
    let match

    // loop through each css rule
    while ((match = RULE_RE.exec(cssText))) {
      const selectorPart = match[1].trim()
      const declarationPart = match[2].trim()

      // parse declarations into { textColor: "red", font:  "system-ui, 11"} form
      const declarations = declarationPart
        .split(";")
        .map((declaration) => declaration.trim())
        .filter((declaration) => declaration.length)
        .reduce((out, declaration) => {
          const [prop, ...rest] = declaration.split(":")
          const key = toCamelCase(prop.trim())
          const value = rest.join(":").trim()
          out[key] = value === "null" ? null : value
          return out
        }, {})

      // for each comma-separated selector, add it to the css
      selectorPart
        .split(",")
        .map((selector) => selector.trim())
        .forEach((rawSelector) => {
          css.push({
            selector: parseSelector(rawSelector),
            css: declarations
          })
        })
    }

    return css
  }

  // function to add the css to each element and children elements
  function applyCss(root, css) {
    traverse(root, css, {})

    // css is the full parsed css, the inheritedRules are css rules that have been partially matched by the parent
    function traverse(node, css, cascadingCss) {
      const cascadingPropertiesObject = {...cascadingCss}
      // cascading properties always matches, but has the lowest priority
      const matchingRules = [{selector: "*", css: cascadingPropertiesObject}]
      const nextRules = []

      // get the matching rules, and the rules for the children nodes
      for (const rule of css) {
        // rules that have been partially matched do not extend to children nodes
        if (!rule.partial) {
          nextRules.push(rule)
        }
        const [segment, ...rest] = rule.selector
        if (matchesSegment(node, segment)) {
          if (rest.length) {
            nextRules.push({selector: rest, css: rule.css, partial: true})
          } else {
            for (const property in rule.css) {
              if (cascadingProperties.includes(property)) {
                cascadingPropertiesObject[property] = rule.css[property]
              }
            }
            matchingRules.push(rule)
          }
        }
      }

      // apply the matching css
      node.css = matchingRules

      // recurse with the children nodes
      for (const child of node.children || []) {
        traverse(child, nextRules, cascadingPropertiesObject)
      }
    }
  }

  // Checks if a node matches a segment
  function matchesSegment(node, {tag, classes}) {
    return (
      (!tag || tag === "*" || node.name === tag) &&
      classes.every((c) => node.classList.includes(c))
    )
  }
  /*********************
   * COMPILE THE WIDGET
   ********************/

  async function compile(tag) {
    // Throw an error if there is a nestled widget tag
    if (tag.name == "widget" && code) {
      error("`widget` tag must not be nestled.")
    }

    // Add a new line spacing before tags
    if (code) {
      appendCodeLine("")
    }

    // Increment incrementor
    if (tag.name in incrementors) {
      incrementors[tag.name] += 1
    } else {
      incrementors[tag.name] = 0
    }
    const incrementor = incrementors[tag.name]

    // Get innerText
    const innerText = tag.innerText
      .replace(/&lt;/g, "<")
      .replace(/&gt/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/\n\s+/g, "\\n")

    // get the css
    const finalCss = mergeCssRules(tag.css, tag.attrs, tag.noCss)

    // object for data pertaining to each widget element
    const handlers = {
      widget: {
        mapping: {
          background: ["gradient", "image", "colour"],
          refreshAfterDate: "posInt",
          spacing: "posInt",
          url: "url",
          padding: "padding",
          addAccessoryWidgetBackground: "bool"
        },
        hasChildren: true,
        instantiate() {
          appendCodeLine(`let widget = new ListWidget()`)
          return "widget"
        },
        async applyStyles(onVar) {
          const {background, ...rest} = finalCss
          const kind = background in tag.attrs ? "attribute" : "property"
          await applyBackground("widget", kind, background)
          await applyStandardStyles(onVar, rest, this.mapping)
        }
      },

      stack: {
        mapping: {
          background: ["gradient", "image", "colour"],
          spacing: "posInt",
          url: "url",
          padding: "padding",
          borderColor: "colour",
          borderWidth: "posInt",
          size: "size",
          cornerRadius: "posInt",
          alignContent: "alignContent",
          layout: "layout"
        },
        hasChildren: true,
        instantiate() {
          appendCodeLine(`let stack${incrementor} = ${currentStack}.addStack()`)
          return `stack${incrementor}`
        },
        async applyStyles(onVar) {
          const {background, ...rest} = finalCss
          const kind = background in tag.attrs ? "attribute" : "property"
          await applyBackground(onVar, kind, background)
          await applyStandardStyles(onVar, rest, this.mapping)
        }
      },

      spacer: {
        mapping: {space: "posInt"},
        hasChildren: false,
        instantiate() {
          const space = tag.attrs.space ?? ""
          appendCodeLine(
            `let spacer${incrementor} = ${currentStack}.addSpacer(${space})`
          )
          return null
        }
        // No styles to apply
      },

      text: {
        mapping: {
          url: "url",
          font: "font",
          lineLimit: "posInt",
          minimumScaleFactor: "decimal",
          shadowColor: "colour",
          shadowOffset: "point",
          shadowRadius: "posInt",
          textColor: "colour",
          textOpacity: "decimal",
          alignText: "alignText"
        },
        hasChildren: false,
        instantiate() {
          appendCodeLine(
            `let text${incrementor} = ${currentStack}.addText("${innerText.replace(
              /"/g,
              ""
            )}")`
          )
          return `text${incrementor}`
        },
        async applyStyles(onVar) {
          await applyStandardStyles(onVar, finalCss, this.mapping)
        }
      },

      date: {
        mapping: {
          url: "url",
          font: "font",
          lineLimit: "posInt",
          minimumScaleFactor: "decimal",
          shadowColor: "colour",
          shadowOffset: "point",
          shadowRadius: "posInt",
          textColor: "colour",
          textOpacity: "decimal",
          alignText: "alignText",
          applyStyle: "applyStyle"
        },
        hasChildren: false,
        instantiate() {
          appendCodeLine(
            `let date${incrementor} = ${currentStack}.addDate(new Date("${innerText.replace(
              /"/g,
              ""
            )}"))`
          )
          return `date${incrementor}`
        },
        async applyStyles(onVar) {
          await applyStandardStyles(onVar, finalCss, this.mapping)
        }
      },

      img: {
        mapping: {
          src: "image",
          url: "url",
          borderColor: "colour",
          borderWidth: "posInt",
          cornerRadius: "posInt",
          imageSize: "size",
          imageOpacity: "decimal",
          tintColor: "colour",
          resizable: "bool",
          containerRelativeShape: "bool",
          contentMode: "contentMode",
          alignImage: "alignImage"
        },
        hasChildren: false,
        instantiate() {
          let image

          // Throw an error if there is no src attribute
          if (!tag.attrs.src) {
            error("`img` tag must have a `src` attribute.")
          }

          // Determine if the image is a URL or base encoding
          if (tag.attrs.src.startsWith("data:image/")) {
            image = `Image.fromData(Data.fromBase64String("${tag.attrs.src
              .replace(/data:image\/.*?;base64,/, "")
              .replace(/"/g, "")}"))`
          } else {
            image = `await new Request("${tag.attrs.src.replace(
              /"/g,
              ""
            )}").loadImage()`
          }

          appendCodeLine(
            `let img${incrementor} = ${currentStack}.addImage(${image})`
          )
          return `img${incrementor}`
        },
        async applyStyles(onVar) {
          const {src, ...rest} = finalCss
          await applyStandardStyles(onVar, rest, this.mapping)
        }
      }
    }

    // get the element we are dealing with
    const handler = handlers[tag.name]

    // compile the addon
    if (!handler) {
      // throw an error if it is not a valid addon
      if (!(tag.name in addons)) {
        error("Invalid tag name: `{}`.", tag.name)
      }

      appendCodeLine(`// <${tag.name}>`)

      // grab the addon
      const addon = addons[tag.name]
      const mapping = addon.mapping || {}

      // set up the css
      validateAll(tag.attrs, finalCss, mapping)
      for (let key in mapping) {
        if (!(key in finalCss)) {
          finalCss[key] = null
        }
        if (!(key in tag.attrs)) {
          tag.attrs[key] = null
        }
      }

      // render the addon
      const template = (input) => renderTemplate(input, tag.children)
      await addon.render(template, finalCss, tag.attrs, innerText)
      appendCodeLine(`// </${tag.name}>`)
      return
    }

    // instantiate element and validate styles and attributes
    const onVar = handler.instantiate()
    validateAll(tag.attrs, finalCss, handler.mapping)

    // apply styles, if there are any
    await handler.applyStyles?.(onVar)

    // compile children with indention
    if (handler.hasChildren) {
      indentLevel++
      const prevStack = currentStack
      currentStack = onVar

      for (const child of tag.children) {
        await compile(child)
      }

      indentLevel--
      currentStack = prevStack
    }
  }

  // create the final css, merging the matching css rules and attribute css
  function mergeCssRules(rules = [], attributeCss, noCss) {
    if (noCss) return {...attributeCss}
    const fromRules = {}
    for (const {css} of rules) {
      Object.assign(fromRules, css)
    }
    return {...fromRules, ...attributeCss}
  }

  // apply styles on a widget element
  async function applyStandardStyles(onVar, finalCss, mapping) {
    for (const [key, value] of Object.entries(finalCss)) {
      if (value === null) continue
      const typeKey = mapping[key]
      await types[typeKey].add(key, value, onVar)
    }
  }

  // special function for background, since it can be an image, colour, or gradient
  async function applyBackground(onVar, kind, value) {
    if (!value) return
    try {
      types.url.validate("background", "attribute", value)
      types.image.add("background", value, onVar)
    } catch {
      // gradient vs solid color
      if (
        value.split(
          /,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/
        ).length === 1
      ) {
        await types.colour.add("backgroundColor", value, onVar)
      } else {
        // Need to revalidate because the validation is always true when validating for the array of types since background passes the colour type
        types.gradient.validate("backgroundGradient", kind, value)
        await types.gradient.add("backgroundGradient", value, onVar)
      }
    }
  }

  // Function to add the no-css property to all children and put the tag children into the template
  function mergeChildren(templateNode, children) {
    templateNode.noCss = true
    for (let child of templateNode.children || []) {
      mergeChildren(child, children)
    }
    if (templateNode.putChildren) {
      templateNode.children.push(...children)
    }
  }

  // Function to add the raw html of the addon to the widget
  async function renderTemplate(input, children) {
    // parse the template and ignore style tags
    let {root} = parseHTML(input)

    // run through all children to determine where to put the tag children and add the no-css property
    root.children.forEach((node) => mergeChildren(node, children))

    // compile the template
    indentLevel++
    const prevStack = currentStack

    for (let child of root.children) {
      currentStack = prevStack
      await compile(child)
    }

    indentLevel--
  }

  function validateAll(attributeCss, finalCss, mapping) {
    validate(attributeCss, mapping, "attribute")
    validate(finalCss, mapping, "property")
  }

  // Function that validates css
  function validate(entries, mapping, kind) {
    for (const [key, value] of Object.entries(entries)) {
      // get the expected type of the property or attribute
      const expected = mapping[key]
      if (!expected) {
        if (kind === "property") {
          delete entries[key]
          continue
        }
        // we only error on invalid attributes because of the "*" or other similar selectors
        error("Unknown attribute: `{}`.", key)
      }

      // skip null placeholders
      if (value === null) continue

      // validate one type
      if (!Array.isArray(expected)) {
        types[expected].validate(key, kind, value)
        continue
      }

      // validate over an array of types
      const passed = expected.some((typeName) => {
        try {
          types[typeName].validate(key, kind, value)
          return true
        } catch {
          return false
        }
      })

      if (!passed) {
        const list = expected.join(", ").replace(/,([^,]+)$/, " or$1")
        error("`{}` {} must be {} type: `{}`", key, kind, list, value)
      }
    }
  }

  /******************
   * HELPER FUNCTIONS
   ******************/

  function appendCodeLine(line) {
    const prefix = "  ".repeat(indentLevel)
    code += `\n${prefix + line}`
  }

  function upperCaseFirstChar(value) {
    return value[0].toUpperCase() + value.slice(1)
  }

  // Function to get any html supported color, colours are memorized to speed up reusing same colours
  async function colorFromValue(c) {
    if (colorCache.has(c)) return colorCache.get(c)

    // Hex colours are supported by scriptable
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(c)) {
      return `new Color("${c}")`
    }

    let w = new WebView()
    await w.loadHTML(`<div id="div"style="color:${c}"></div>`)
    let result = await w.evaluateJavaScript(
      'window.getComputedStyle(document.getElementById("div")).color'
    )

    const rgba = result.match(/\d+(\.\d+)?/g).map(Number)
    const scriptable = rgbaToScriptable(...rgba)
    colorCache.set(c, scriptable)

    return scriptable

    function rgbaToScriptable(r, g, b, a = 1) {
      const hex = (n) => n.toString(16).padStart(2, "0")
      const alpha = a === 1 ? "" : `,${a}`
      return `new Color("#${hex(r)}${hex(g)}${hex(b)}"${alpha})`
    }
  }

  function toCamelCase(text) {
    return text.replace(/-(.)/g, (_, chr) => chr.toUpperCase())
  }

  // error function
  function error(message, ...params) {
    for (let param of params) {
      message = message.replace("{}", param)
    }
    throw new Error(
      `HTML Widget Error\n--------<Code>--------\n${code}\n--------</Code>--------\n${message}`
    )
  }

  /******************
   * PRIMITIVE TYPES
   ******************/
  function getTypes() {
    return {
      colour: {
        async add(attribute, value, on) {
          const [first, second] = value.split("-").map((c) => c.trim())
          let colour
          // colour can be in light-dark format
          if (second != null) {
            const [scriptableFirst, scriptableSecond] = await Promise.all([
              colorFromValue(first),
              colorFromValue(second)
            ])
            colour = `Color.dynamic(${scriptableFirst}, ${scriptableSecond})`
          } else {
            colour = await colorFromValue(first)
          }
          appendCodeLine(`${on}.${attribute} = ${colour}`)
        },
        validate() {}
      },
      posInt: {
        add(attribute, value, on) {
          if (attribute === "refreshAfterDate") {
            appendCodeLine(
              `${on}.refreshAfterDate = new Date(Date.now() + ${value} * 60000)`
            )
          } else {
            appendCodeLine(`${on}.${attribute} = ${value}`)
          }
        },
        validate(attribute, kind, value) {
          if (!/^\d+$/.test(value)) {
            error(
              "`{}` {} must be a positive integer: `{}`.",
              attribute,
              kind,
              value
            )
          }
        }
      },
      decimal: {
        add(attribute, value, on) {
          let number = parseFloat(value.replace("%", ""))
          if (value.endsWith("%")) {
            number = number / 100
          }
          appendCodeLine(`${on}.${attribute} = ${number}`)
        },
        validate(attribute, kind, value) {
          const isPercent = value.endsWith("%")
          const raw = isPercent ? value.slice(0, -1) : value
          const number = parseFloat(raw)

          // reject if parsing failed, or is negative
          if (!Number.isFinite(number) || number < 0) {
            error(
              "`{}` {} must be a positive integer or float with an optional `%` at the end: `{}`.",
              attribute,
              kind,
              value
            )
          }
        }
      },
      gradient: {
        async add(_, value, on) {
          gradientNumber++

          // split into parts by commas not in quotes or brackets
          let splitGradient = value
            .split(/,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/)
            .map((e) => e.trim())

          // get the direction from the first item of gradient
          let gradientDirection
          const wordDirections = {
            "to top": 0,
            "to top right": 45,
            "to right": 90,
            "to bottom right": 135,
            "to bottom": 180,
            "to bottom left": 225,
            "to left": 270,
            "to top left": 315
          }
          // check if it is a word direction, degrees direction or none are provided
          const first = splitGradient[0].toLowerCase()
          if (first in wordDirections) {
            splitGradient.shift()
            gradientDirection = wordDirections[first]
          } else if (/\d+\s*deg/.test(first)) {
            splitGradient.shift()
            gradientDirection = Number(first.match(/(\d+)\s*deg/)[1])
          } else {
            gradientDirection = 0
          }

          // Get colours and locations
          const colours = []
          const locations = []
          for (const part of splitGradient) {
            // Get the location
            const locationMatch = part.match(/\s+(\d+(?:\.\d+)?%?)$/)
            let location = null
            let colorPart = part

            if (locationMatch) {
              const rawLocation = locationMatch[1]

              // Locations ending in % are percentages
              if (rawLocation.endsWith("%")) {
                location = Number(rawLocation.slice(0, -1)) / 100
              } else {
                location = Number(rawLocation)
              }

              colorPart = part.slice(0, locationMatch.index).trim()
            }
            locations.push(location)

            // Get the colour of the part
            let color
            const [first, second] = colorPart.split("-")
            if (second != null) {
              const [scriptableFirst, scriptableSecond] = await Promise.all([
                colorFromValue(first),
                colorFromValue(second)
              ])
              color = `Color.dynamic(${scriptableFirst}, ${scriptableSecond})`
            } else {
              color = await colorFromValue(first)
            }
            colours.push(color)
          }

          // Set default first and last locations
          if (locations[0] === null) {
            locations[0] = 0
          }
          if (locations.at(-1) === null) {
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
            // calculate the difference between each null location for a linear transition
            let difference = (locations[index] - locations[i]) / (index - i)

            // set each between null location
            for (let plusIndex = 1; plusIndex < index - i; plusIndex++) {
              locations[i + plusIndex] =
                difference * plusIndex + currentLocation
            }
          }

          // calculate gradient points based on the direction
          const rad = (Math.PI * (gradientDirection - 90)) / 180
          const cos = Math.cos(rad)
          const sin = Math.sin(rad)
          const t = 0.5 / Math.max(Math.abs(cos), Math.abs(sin))
          const x1 = 0.5 - t * cos
          const y1 = 0.5 - t * sin
          const x2 = 0.5 + t * cos
          const y2 = 0.5 + t * sin

          appendCodeLine(`let gradient${gradientNumber} = new LinearGradient()`)
          appendCodeLine(`gradient${gradientNumber}.colors = [${colours}]`)
          appendCodeLine(`gradient${gradientNumber}.locations = [${locations}]`)
          appendCodeLine(
            `gradient${gradientNumber}.startPoint = ${`new Point(${x1}, ${y1})`}`
          )
          appendCodeLine(
            `gradient${gradientNumber}.endPoint = ${`new Point(${x2}, ${y2})`}`
          )
          appendCodeLine(`${on}.backgroundGradient = gradient${gradientNumber}`)
        },

        validate(attribute, kind, value) {
          // split into parts by commas not in quotes or brackets
          let splitGradient = value
            .split(/,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/)
            .map((e) => e.trim())

          // remove the gradient direction
          const wordDirections = [
            "to top",
            "to top right",
            "to right",
            "to bottom right",
            "to bottom",
            "to bottom left",
            "to left",
            "to top left"
          ]
          if (
            wordDirections.includes(splitGradient[0].toLowerCase()) ||
            /\d+\s*deg/.test(splitGradient[0])
          ) {
            splitGradient.shift()
          }
          if (splitGradient.length < 2) {
            error(
              "`{}` {} must have at least two color stops after the direction: `{}`.",
              attribute,
              kind,
              value
            )
          }

          // validate locations
          let greatest = -Infinity
          for (const part of splitGradient) {
            // Get the location
            const locationMatch = part.match(/\s+(\d+(?:\.\d+)?%?)$/)
            if (locationMatch) {
              const rawLocation = locationMatch[1]
              // Locations ending in % are percentages
              const location = rawLocation.endsWith("%")
                ? Number(rawLocation.slice(0, -1)) / 100
                : Number(rawLocation)
              if (!Number.isFinite(location)) {
                error(
                  "`{}` {} has invalid position: `{}` in `{}`.",
                  attribute,
                  kind,
                  rawLocation,
                  value
                )
              }
              if (location < 0 || location > 1) {
                error(
                  "`{}` {} position must be between `0` and `1`: `{}`.",
                  attribute,
                  kind,
                  rawLocation
                )
              }
              if (location < greatest) {
                error(
                  "`{}` {} color-stop positions must be in ascending order: `{}`.",
                  attribute,
                  kind,
                  value
                )
              }
              greatest = location
            }
          }
        }
      },
      padding: {
        add(_, value, on) {
          if (value === "default") {
            appendCodeLine(`${on}.useDefaultPadding()`)
            return
          }
          const numbers = value.split(",").map((s) => parseInt(s.trim(), 10))

          // CSS shorthand rules: [top, right?, bottom?, left?]
          let [t, r, b, l] = numbers
          if (numbers.length === 1) [t, r, b, l] = [t, t, t, t]
          else if (numbers.length === 2) [t, r, b, l] = [t, r, t, r]
          else if (numbers.length === 3) [t, r, b, l] = [t, r, b, r]

          appendCodeLine(`${on}.setPadding(${t}, ${r}, ${b}, ${l})`)
        },
        validate(attribute, kind, value) {
          if (value === "default") return

          const parts = value.split(",").map((s) => s.trim())
          if (parts.length < 1 || parts.length > 4) {
            error(
              "`{}` {} must have 1-4 comma-separated positive integers or be `default`: `{}`.",
              attribute,
              kind,
              value
            )
          }

          for (let part of parts) {
            if (!/^\d+$/.test(part)) {
              error(
                "`{}` {} must be non-negative integers: `{}` contains `{}`.",
                attribute,
                kind,
                value,
                part
              )
            }
          }
        }
      },
      size: {
        add(attribute, value, on) {
          let [width, height] = value.split(",")
          appendCodeLine(`${on}.${attribute} = new Size(${width}, ${height})`)
        },
        validate(attribute, kind, value) {
          if (!/^\d+\s*,\s*\d+$/.test(value)) {
            error(
              "`{}` {} must be 2 positive integers separated by commas: `{}`.",
              attribute,
              kind,
              value
            )
          }
        }
      },
      font: {
        add(_, value, on) {
          let fontRegex =
            /^(((black|bold|medium|light|heavy|regular|semibold|thin|ultraLight)(MonospacedSystemFont|RoundedSystemFont|SystemFont)\s*,\s*(\d+))|(body|callout|caption1|caption2|footnote|subheadline|headline|largeTitle|title1|title2|title3)|((italicSystemFont)\s*,\s*(\d+)))$/
          if (fontRegex.test(value)) {
            appendCodeLine(
              `${on}.font = Font.${value.replace(fontRegex, "$3$4$6$8($5$9)")}`
            )
          } else {
            const [name, size] = value.split(",")
            appendCodeLine(
              `${on}.font = new Font("${name.replace(/"/g, "")}",${
                size.match(/\d+/g)[0]
              })`
            )
          }
        },
        validate(attribute, kind, value) {
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
            error(
              "`{}` {} must be 1 font name and 1 positive integer separated by commas or be a content-based font: `{}`.",
              attribute,
              kind,
              value
            )
          }
        }
      },
      point: {
        add(_, value, on) {
          const [x, y] = value.split(",")
          appendCodeLine(`${on}.shadowOffset = new Point(${x},${y})`)
        },
        validate(attribute, kind, value) {
          if (!/^-?\d+\s*,\s*-?\d+$/.test(value)) {
            error(
              "`{}` {} must be 2 integers separated by commas: `{}`.",
              attribute,
              kind,
              value
            )
          }
        }
      },
      bool: {
        add(attribute, value, on) {
          if (value === "false") {
            return
          }
          if (attribute === "resizable") {
            appendCodeLine(`${on}.resizable = false`)
          } else {
            appendCodeLine(`${on}.${attribute} = true`)
          }
        },
        validate() {}
      },
      url: {
        add: (_, value, on) => {
          appendCodeLine(`${on}.url = "${value.replace(/"/g, "")}"`)
        },
        validate(attribute, kind, value) {
          if (!/^\w+:\/\/\S+$/.test(value)) {
            error("`{}` {} must be a valid URL: `{}.`", attribute, kind, value)
          }
        }
      },
      image: {
        add(_, value, on) {
          if (value.startsWith("data:image/")) {
            const base64 = value.split(",", 2)[1].replace(/"/g, "")
            appendCodeLine(
              `${on}.backgroundImage = Image.fromData(Data.fromBase64String("${base64}"))`
            )
          } else {
            appendCodeLine(
              `${on}.backgroundImage = await new Request("${value.replace(
                /"/g,
                ""
              )}").loadImage()`
            )
          }
        },
        validate(attribute, kind, value) {
          if (
            !/^(https?:\/\/\S+|data:image\/\w+?;base64,[a-zA-Z0-9+/]+=*)$/.test(
              value
            )
          ) {
            error(
              "`{}` {} must be a valid url or base encoded data link: `{}`.",
              attribute,
              kind,
              value
            )
          }
        }
      },
      layout: {
        add(_, value, on) {
          appendCodeLine(`${on}.layout${upperCaseFirstChar(value)}()`)
        },
        validate(attribute, kind, value) {
          if (value !== "vertically" && value !== "horizontally") {
            error(
              "`{}` {} must be `vertically` or `horizontally`: `{}`.",
              attribute,
              kind,
              value
            )
          }
        }
      },
      alignText: {
        add(_, value, on) {
          appendCodeLine(`${on}.${value}AlignText()`)
        },
        validate(attribute, kind, value) {
          if (!["center", "left", "right"].includes(value)) {
            error(
              "`{}` {} must be `left`, `right` or `center`: `{}.`",
              attribute,
              kind,
              value
            )
          }
        }
      },
      alignImage: {
        add(_, value, on) {
          appendCodeLine(`${on}.${value}AlignImage()`)
        },
        validate(attribute, kind, value) {
          if (!["center", "left", "right"].includes(value)) {
            error(
              "`{}` {} must be `left`, `right` or `center`: `{}`.",
              attribute,
              kind,
              value
            )
          }
        }
      },
      alignContent: {
        add(_, value, on) {
          appendCodeLine(`${on}.${value}AlignContent()`)
        },
        validate(attribute, kind, value) {
          if (!["center", "top", "bottom"].includes(value)) {
            error(
              "`{}` {} must be `top`, `bottom` or `center`: `{}`.",
              attribute,
              kind,
              value
            )
          }
        }
      },
      applyStyle: {
        add(_, value, on) {
          appendCodeLine(`${on}.apply${upperCaseFirstChar(value)}Style()`)
        },
        validate(attribute, kind, value) {
          if (
            !["date", "timer", "offset", "relative", "time"].includes(value)
          ) {
            error(
              "`{}` {} must be `date`, `timer` , `relative`, `time`, or `offset`: `{}`.",
              attribute,
              kind,
              value
            )
          }
        }
      },
      contentMode: {
        add(_, value, on) {
          appendCodeLine(`${on}.apply${upperCaseFirstChar(value)}ContentMode()`)
        },
        validate(attribute, kind, value) {
          if (!["filling", "fitting"].includes(value)) {
            error(
              "`{}` {} must be `filling` or `fitting`: `{}`.",
              attribute,
              kind,
              value
            )
          }
        }
      }
    }
  }
}

module.exports = htmlWidget
