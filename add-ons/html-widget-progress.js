/*
HTML Widget progress 1.5
https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/add-ons/html-widget-progress.js

- Compatible with HTML Widget 6.3.0

*/
module.exports = {
  mapping: {
    url: "url",
    background: ["colour", "gradient"],
    progressBackground: ["colour", "gradient"],
    borderColor: "colour",
    borderWidth: "posInt",
    cornerRadius: "posInt",
    progressCornerRadius: "posInt",
    width: "posInt",
    height: "posInt",
    value: "decimal"
  },
  async render(template, styles, attrs, innerText) {
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

    let width = Number(styles.width ?? 100)
    let height = Number(styles.height ?? 1)
    await template(`
    <stack url="${styles.url}" 
      background="${styles.background ?? "#000-#fff"}" 
      borderColor="${styles.borderColor}" 
      borderWidth="${styles.borderWidth}" 
      cornerRadius="${styles.cornerRadius}" 
      size="${width}, ${height}"
    >
      <stack background="${styles.progressBackground ?? "#808080"}" 
        cornerRadius="${styles.progressCornerRadius}" 
        size="${Math.round(width * Number(value))}, ${height}">
      </stack>
      <stack size="${Math.round(
        width * (1 - Number(value))
      )}, ${height}"></stack>
    </stack>
  `)
  }
}
