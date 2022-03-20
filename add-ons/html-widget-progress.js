/*
HTML Widget progress 1.1
https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/add-ons/html-widget-progress.js

- Compatible with HTML Widget 5.00
- length attribute changed to width
- width attribute changed to height
- Fixed some bugs when setting width or height to null
- Fixed a bug were a error was thrown when the size attribue on a stack this element makes has a decimal number
*/
module.exports = {
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
      throw new Error("progress Element Must Have A value Attribute")
    }
    if (value < 0) {
      throw new Error(`value Attribute Must Be Above 0: ${attrs.value}`)
    }
    if (value > 1) {
      throw new Error(`value Attribute Must Be Below 1: ${attrs.value}`)
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
