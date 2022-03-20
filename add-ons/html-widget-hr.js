/*
HTML Widget hr 2.1
https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/add-ons/html-widget-hr.js

- Compatible with HTML Widget 5.00
- Fixed a bug with setting height
*/
module.exports = {
  isSelfClosing: true,
  func: async (validate, template, update, styles, attrs, innerText) => {
    const mapping = {
      "background": ["colour", "gradient", "image"],
      "url": "url",
      "corner-radius": "posInt",
      "width": "posInt",
      "hight": "posInt"
    }

    validate(attrs, styles, mapping)

    await template(`
    <stack background="${styles.background || "black-white"}" url="${
      styles.url || "null"
    }" corner-radius="${styles["corner-radius"] || "null"}">
      ${styles.width ? "" : "<spacer>"}
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" image-size="${
        styles.width || 100
      },${styles.hight || 1}">
      ${styles.width ? "" : "<spacer>"}
    </stack>
  `)
  }
}
