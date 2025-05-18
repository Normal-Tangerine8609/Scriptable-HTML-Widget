/*
HTML Widget blockquote 1.4
https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/add-ons/html-widget-blockquote.js

- Compatible with HTML Widget 6.3.0
*/
module.exports = {
  mapping: {
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
  },
  async render(template, styles, attrs, innerText) {
    let barWidth = Number(styles.barWidth ?? 5)
    let height = Number(styles.height ?? 100)
    let width = Number(styles.width ?? 100)
    let space = Number(styles.space ?? 0)
    let contentWidth = width - barWidth - space

    await template(`
          <stack layout="horizontally" url="${styles.url}">
            <stack size="${barWidth + "," + height}" background="${
      styles.barBackground ?? "#000-#fff"
    }" cornerRadius="${styles.barCornerRadius}">
            </stack>
            <spacer space="${space}"/>
            <stack background="${
              styles.background ?? "#00000080-#ffffff80"
            }" cornerRadius="${styles.cornerRadius}" spacing="${
      styles.spacing
    }" padding="${styles.padding ?? 3}" layout="${
      styles.layout ?? "vertically"
    }" size="${contentWidth + "," + height}" children="">
            </stack>
          </stack>
      `)
  }
}
