/*
HTML Widget progress 1.0
https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/add-ons/html-widget-progress.js

- Compatible with HTML Widget 5.00
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
      "length": "posInt",
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

    await template(`
    <stack url="${styles.url || "null"}" 
      background="${styles.background || "black-white"}" 
      border-color="${styles["border-color"] || "null"}" 
      border-width="${styles["border-width"] || "null"}" 
      corner-radius="${styles["corner-radius"] || "null"}" 
      size="${attrs.length || 100}, ${attrs.width || 1}"
    >
      <stack background="${styles["progress-background"] || "gray"}" 
        corner-radius="${styles["progress-corner-radius"] || "null"}" 
        size="${attrs.width || 1}" size="${
      Number(attrs.length || 100) * Number(value)
    }, ${attrs.width || 1}">
      </stack>
      <stack size="${Number(attrs.length || 100) * (1 - Number(value))}, ${
      attrs.width || 1
    }"></stack>
    </stack>
  `)
  }
}
