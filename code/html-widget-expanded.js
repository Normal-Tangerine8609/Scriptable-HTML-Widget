//HTML Widget Version 5.03
//https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget

async function htmlWidget(input, debug, addons) {
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
  let space = Number(styles.space && styles.space !== "null" ? styles.space : 0)
  let contentWidth = width - barWidth - space

  await template(`
      <stack layout="horizontally" url="${styles.url || null}">
        <stack size="${barWidth + "," + height}" background="${
    styles["bar-background"] || "black-white"
  }" corner-radius="${styles["bar-corner-radius"] || null}">
        </stack>
        <spacer space="${space}">
        <stack background="${
          styles.background || "rgb(0,0,0,50%)-rgb(255,255,255,50%)"
        }" corner-radius="${styles["corner-radius"] || null}" spacing="${
    styles.spacing || null
  }" padding="${styles.padding || 3}" layout="${
    styles.layout || "vertically"
  }" size="${contentWidth + "," + height}" children>
        </stack>
      </stack>
  `)
}

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
  
  let symbol = SFSymbol.named(innerText || "questionmark.circle")
  let symbolSize = 100
  if(styles["image-size"]) {
    let [width,height] = styles["image-size"].match(/\d+/g)
    symbolSize = (width > height) ? height : width
  }
  symbol.applyFont(Font.systemFont(parseInt(symbolSize)))
  await template(`
<img 
  src="data:image/png;base64,${Data.fromPNG(
    symbol.image
  ).toBase64String()}" 
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
>
  `)
}

  const hr = {
  isSelfClosing: true,
  func: async (validate, template, update, styles, attrs, innerText) => {
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
      ${styles.width ? "" : "<spacer>"}
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" image-size="${
        styles.width || 100
      },${styles.height || 1}">
      ${styles.width ? "" : "<spacer>"}
    </stack>
  `)
  }
}

  const progress = {
  isSelfClosing: true,
  func: async (validate, template, update, styles, attrs, innerText) => {
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
        size="${
      Math.round(width * Number(value))
    }, ${height}">
      </stack>
      <stack size="${Math.round(width * (1 - Number(value)))}, ${height}"></stack>
    </stack>
  `)
  }
}
Object.assign(addons, progress, hr, symbol,blockquote)

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

  // Format addons to only the functions and find if they are self closing
  let selfClosers = ["img", "spacer"]
  if (addons) {
    for (let addon of Object.keys(addons)) {
      if (typeof addons[addon] == "object") {
        if (addons[addon].isSelfClosing) {
          selfClosers.push(addon)
        }
        addons[addon] = addons[addon].func
      }
    }
  }
  // https://github.com/henryluki/html-parser
  // Added comment support
  const STARTTAG_REX=/^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,ENDTAG_REX=/^<\/([-A-Za-z0-9_]+)[^>]*>/,ATTR_REX=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;function makeMap(t){return t.split(",").reduce((t,e)=>(t[e]=!0,t),{})}const EMPTY_MAKER=makeMap(selfClosers.join(",")),FILLATTRS_MAKER=makeMap("no-css,children");function isEmptyMaker(t){return!!EMPTY_MAKER[t]}function isFillattrsMaker(t){return!!FILLATTRS_MAKER[t]}class TagStart{constructor(t,e){this.name=t,this.attributes=this.getAttributes(e)}getAttributes(t){let e={};return t.replace(ATTR_REX,function(t,n){const s=Array.prototype.slice.call(arguments),r=s[2]?s[2]:s[3]?s[3]:s[4]?s[4]:isFillattrsMaker(n)?n:"";e[n]=r.replace(/(^|[^\\])"/g,'$1\\"')}),e}}class TagEmpty extends TagStart{constructor(t,e){super(t,e)}}class TagEnd{constructor(t){this.name=t}}class Text{constructor(t){this.text=t}}const ElEMENT_TYPE="Element",TEXT_TYPE="Text";function createElement(t){const e=t.name,n=t.attributes;return t instanceof TagEmpty?{type:ElEMENT_TYPE,tagName:e,attributes:n}:{type:ElEMENT_TYPE,tagName:e,attributes:n,children:[]}}function createText(t){const e=t.text;return{type:TEXT_TYPE,content:e}}function createNodeFactory(t,e){switch(t){case ElEMENT_TYPE:return createElement(e);case TEXT_TYPE:return createText(e)}}function parse(t){let e={tag:"root",children:[]},n=[e];n.last=(()=>n[n.length-1]);for(let e=0;e<t.length;e++){const s=t[e];if(s instanceof TagStart){const t=createNodeFactory(ElEMENT_TYPE,s);t.children?n.push(t):n.last().children.push(t)}else if(s instanceof TagEnd){let t=n[n.length-2],e=n.pop();t.children.push(e)}else s instanceof Text?n.last().children.push(createNodeFactory(TEXT_TYPE,s)):"Comment"!=s.type||n.last().children.push(s)}return e}function tokenize(t){let e=t,n=[];const s=Date.now()+1e3;for(;e;){if(0===e.indexOf("\x3c!--")){const t=e.indexOf("--\x3e")+3;n.push({type:"Comment",text:e.substring(4,t-3)}),e=e.substring(t);continue}if(0===e.indexOf("</")){const t=e.match(ENDTAG_REX);if(!t)continue;e=e.substring(t[0].length);const s=t[1];if(isEmptyMaker(s))continue;n.push(new TagEnd(s));continue}if(0===e.indexOf("<")){const t=e.match(STARTTAG_REX);if(!t)continue;e=e.substring(t[0].length);const s=t[1],r=t[2],a=isEmptyMaker(s)?new TagEmpty(s,r):new TagStart(s,r);n.push(a);continue}const t=e.indexOf("<"),r=t<0?e:e.substring(0,t);if(e=t<0?"":e.substring(t),n.push(new Text(r)),Date.now()>=s)break}return n}function htmlParser(t){return parse(tokenize(t))}

  // Set base variables
  let currentStack,
    code = "",
    incrementors = {},
    gradientNumber = -1

  // Get only the first widget tag
  let widgetBody = htmlParser(input).children.filter((element) => {
    if (element.tagName == "widget") {
      return element
    }
  })[0]
  // If there were no widget tags raise error
  if (!widgetBody) {
    error(17)
  }
  // Get all direct style tags
  let styleTags = widgetBody.children.filter((e) => e.tagName == "style")
  let cssTexts = ""
  for (let styleTag of styleTags) {
    // Get all text children
    for (let item of styleTag.children) {
      if (item.type == "Text") {
        cssTexts += "\n" + item.content.trim()
      }
    }
  }
  let mainCss = []
  let rules = cssTexts.match(/[\s\S]+?{[\s\S]*?}/g) || []
  // Repeat with each css rule
  for (let i = 0; i < rules.length; i++) {
    let rule = rules[i]
    if (
      !/^\s*(\.?[\w\-]+|\*)(\s*,\s*(\.?[\w\-]+|\*))*\s*\{(\s*[\w\-]+\s*:\s*[^\n]+?\s*;)*?\s*([\w\-]+\s*:\s*[^\n]+\s*;?)?\s*\}/.test(
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
      .match(/(\.?[\w\-]+|\*)(\s*,\s*(\.?[\w\-]+|\*))*/)[0]
      .split(",")
    for (let selector of selectors) {
      mainCss.push({selector: selector.trim(), css: declarations})
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
    if (tag.type == "Text" || tag.tagName == "style") {
      return
    }
    // Throw an error if there is a nestled widget tag
    if (tag.tagName == "widget" && code) {
      error(19)
    }
    // Increment incrementor
    if (incrementors[tag.tagName] || incrementors[tag.tagName] == 0) {
      incrementors[tag.tagName]++
    } else {
      incrementors[tag.tagName] = 0
    }
    let incrementor = incrementors[tag.tagName]
    // Get innerText
    let textArray = []
    tag.children = tag.children || []
    for (let item of tag.children) {
      if (item.type == "Text") {
        textArray.push(item.content.trim())
      }
    }
    let innerText = textArray
      .join(" ")
      .replace(/&lt;/g, "<")
      .replace(/&gt/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/\n\s+/g, "\\n")

    let availableCss = ["*", tag["tagName"]]
    let attributeCss = {}

    // Add attributes to css or compile for class
    for (let key of Object.keys(tag.attributes)) {
      let value = tag.attributes[key].trim()
      if (key == "class") {
        value = value.trim().split(" ")
        for (let item of value) {
          availableCss.push("." + item)
        }
      } else {
        attributeCss[key] = value
      }
    }
    // Add or reset all selected css values if the tag does not have the no-css attribute
    let finalCss = {}
    for (let rule of mainCss) {
      if (
        availableCss.includes(rule.selector) &&
        !Object.keys(tag.attributes).includes("no-css")
      ) {
        for (let key of Object.keys(rule.css)) {
          delete finalCss[key]
          finalCss[key] = rule.css[key]
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
    switch (tag.tagName) {
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
        if (!Object.keys(addons).includes(tag["tagName"])) {
          error(21, tag["tagName"])
        }
        code += `\n// <${tag.tagName}>`
        // Run the addon
        await addons[tag["tagName"]](
          validate,
          template,
          update,
          finalCss,
          attributeCss,
          innerText
        )
        code += `\n// </${tag.tagName}>`
        return
        // Function to add the raw html of the addon to the widget
        async function template(input) {
          // Parse the template
          let parsedInput = htmlParser(input)
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
            if (
              tag.attributes &&
              Object.keys(tag.attributes).includes("children")
            ) {
              for (let item of children) {
                tag.children.push(item)
              }
            }
            if (tag.children) {
              tag.children.map((e) => {
                putChildren(e, children)
              })
            }
            if (tag.attributes) {
              tag.attributes["no-css"] = ""
            }
            return tag
          }
        }
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
      26: "`{}` {} must be a valid url or base encoded data link: `{}`"
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
