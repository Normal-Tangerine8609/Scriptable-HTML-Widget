/*
HTML Widget hr 2.4
https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/add-ons/html-widget-hr.js

- Compatible with HTML Widget 6.10
- Fixed height spelling
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
    background: ["colour", "gradient", "image"],
    url: "url",
    cornerRadius: "posInt",
    width: "posInt",
    height: "posInt"
  }

  validate(attrs, styles, mapping)

  await template(`
    <stack background="${styles.background || "black-white"}" url="${styles.url || "null"
    }" cornerRadius="${styles.cornerRadius || "null"}">
      ${styles.width ? "" : "<spacer/>"}
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" image-size="${styles.width || 100
    },${styles.height || 1}"/>
      ${styles.width ? "" : "<spacer/>"}
    </stack>
  `)
}
