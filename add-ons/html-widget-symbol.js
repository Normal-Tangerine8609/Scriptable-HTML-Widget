/*
HTML Widget symbol 2.3
https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/add-ons/html-widget-symbol.js

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
    borderColor: "colour",
    borderWidth: "posInt",
    cornerRadius: "posInt",
    imageSize: "size",
    imageOpacity: "decimal",
    tintColor: "colour",
    resizable: "bool",
    containerRelativeShape: "bool",
    contentMode: "contentMode",
    alignImage: "alignImage"
  }

  validate(attrs, styles, mapping)
  update(styles, mapping)

  let symbol = SFSymbol.named(innerText)
  if (!symbol) {
    symbol = SFSymbol.named("questionmark.circle")
  }

  let symbolSize = 100
  if (styles.imageSize !== "null") {
    let [width, height] = styles.imageSize.match(/\d+/g)
    symbolSize = parseInt((width > height) ? height : width)
  }
  symbol.applyFont(Font.systemFont(symbolSize))
  await template(`
<img 
  src="data:image/png;base64,${Data.fromPNG(
    symbol.image
  ).toBase64String()}" 
  url="${styles.url}" 
  borderColor="${styles.borderColor}"
  borderWidth="${styles.borderWidth}" 
  cornerRadius="${styles.cornerRadius}" 
  imageSize="${styles.imageSize}" 
  imageOpacity="${styles.imageOpacity}" 
  tintColor="${styles.tintColor}" 
  contentMode="${styles.contentMode}" 
  alignImage="${styles.alignImage}" 
  containerRelativeShape="${styles.containerRelativeShape}" 
  resizable="${styles.resizable}"
/>
  `)
}
