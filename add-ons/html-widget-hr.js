/*
HTML Widget hr 2.4
https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/add-ons/html-widget-hr.js

- Compatible with HTML Widget 6.20
- Fixed height spelling
*/
module.exports = {
  mapping: {
    background: ["colour", "gradient", "image"],
    url: "url",
    cornerRadius: "posInt",
    width: "posInt",
    height: "posInt",
  },
  async render(template, styles, attrs, innerText) {
    await template(`
    <stack 
      background="${styles.background === "null" ? "black-white" : styles.background}" 
      url="${styles.url}" 
      cornerRadius="${styles.cornerRadius}"
    >
      ${styles.width !== "null" ? "" : "<spacer/>"}
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" image-size="${
        styles.width === "null" ? 100 : styles.width
      },${styles.height === "null" ? 1 : styles.height}"/>
      ${styles.width !== "null" ? "" : "<spacer/>"}
    </stack>
  `);
  },
};
