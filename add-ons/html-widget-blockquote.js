/*
HTML Widget blockquote 1.0
https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/add-ons/html-widget-blockquote.js

- Compatible with HTML Widget 5.00
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
    "hight": "posInt"
  }

  validate(attrs, styles, mapping)

  let barWidth = Number(
    styles["bar-width"] && styles["bar-width"] !== "null"
      ? styles["bar-width"]
      : 5
  )
  let height = Number(
    styles.hight && styles.hight !== "null" ? styles.hight : 100
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
