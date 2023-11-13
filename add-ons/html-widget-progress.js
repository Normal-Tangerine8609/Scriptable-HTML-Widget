/*
HTML Widget progress 1.4
https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/add-ons/html-widget-progress.js

- Compatible with HTML Widget 6.10

*/
module.exports = async (
  validate,
  template,
  update,
  styles,
  attrs,
  innerText
) => {
  const mapping = {
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
      borderColor="${styles.borderColor || "null"}" 
      borderWidth="${styles.borderWidth || "null"}" 
      cornerRadius="${styles.cornerRadius || "null"}" 
      size="${width}, ${height}"
    >
      <stack background="${styles.progressBackground || "gray"}" 
        cornerRadius="${styles.progressCornerRadius || "null"}" 
        size="${Math.round(width * Number(value))}, ${height}">
      </stack>
      <stack size="${Math.round(
    width * (1 - Number(value))
  )}, ${height}"></stack>
    </stack>
  `)
}
