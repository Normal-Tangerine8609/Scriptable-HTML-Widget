/*
HTML Widget blockquote 1.2
https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/add-ons/html-widget-blockquote.js

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
    cornerRadius: "posInt",
    barWidth: "posInt",
    barBackground: ["colour", "gradient"],
    barCornerRadius: "posInt",
    space: "posInt",
    spacing: "posInt",
    padding: "padding",
    layout: "layout",
    width: "posInt",
    height: "posInt"
  }

  validate(attrs, styles, mapping)

  let barWidth = Number(
    styles.barWidth && styles.barWidth !== "null"
      ? styles.barWidth
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
        <stack size="${barWidth + "," + height}" background="${styles.barBackground || "black-white"
    }" cornerRadius="${styles.barCornerRadius || null}">
        </stack>
        <spacer space="${space}"/>
        <stack background="${styles.background || "rgb(0,0,0,50%)-rgb(255,255,255,50%)"
    }" cornerRadius="${styles.cornerRadius || null}" spacing="${styles.spacing || null
    }" padding="${styles.padding || 3}" layout="${styles.layout || "vertically"
    }" size="${contentWidth + "," + height}" children="">
        </stack>
      </stack>
  `)
}
