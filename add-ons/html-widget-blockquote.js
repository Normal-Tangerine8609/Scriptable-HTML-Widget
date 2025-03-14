/*
HTML Widget blockquote 1.3
https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/add-ons/html-widget-blockquote.js

- Compatible with HTML Widget 6.20
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
    height: "posInt",
  },
  async render(template, styles, attrs, innerText) {
    let barWidth = Number(
      styles.barWidth && styles.barWidth !== "null" ? styles.barWidth : 5,
    );
    let height = Number(
      styles.height && styles.height !== "null" ? styles.height : 100,
    );
    let width = Number(
      styles.width && styles.width !== "null" ? styles.width : 100,
    );
    let space = Number(
      styles.space && styles.space !== "null" ? styles.space : 0,
    );
    let contentWidth = width - barWidth - space;

    await template(`
          <stack layout="horizontally" url="${styles.url}">
            <stack size="${barWidth + "," + height}" background="${
              styles.barBackground === "null"
                ? "black-white"
                : styles.barBackground
            }" cornerRadius="${styles.barCornerRadius}">
            </stack>
            <spacer space="${space}"/>
            <stack background="${
              styles.background === "null"
                ? "rgb(0,0,0,50%)-rgb(255,255,255,50%)"
                : styles.background
            }" cornerRadius="${styles.cornerRadius}" spacing="${
              styles.spacing
            }" padding="${styles.padding === "null" ? 3 : styles.padding}" layout="${
              styles.layout === "null" ? "vertically" : styles.layout
            }" size="${contentWidth + "," + height}" children="">
            </stack>
          </stack>
      `);
  },
};
