/*
HTML Widget symbol 2.0
https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/add-ons/html-widget-symbol.js

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

  await template(`
<img 
  src="data:image/png;base64,${Data.fromPNG(
    SFSymbol.named(innerText || "questionmark.circle").image
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
