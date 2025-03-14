//HTML Widget Version 6.20
//https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget
async function htmlWidget(input, debug, addons) {
  /*****************
   * MAIN PROGRAM
   *****************/
  // Set base variables
  let currentStack;
  let code = "";
  let incrementors = {};
  let gradientNumber = -1;

  // Get "primitive" types (points, colours, positive integers...)
  const types = getTypes();

  // Get only the first widget tag
  const widgetBody = parseHTML(input).children.find((e) => e.name == "widget");

  // If there were no widget tags raise an error
  if (!widgetBody) {
    error("`widget` tag must be the root tag.");
  }

  // Get all direct style tags and combine the styles, and add the rules directly to the elements
  const styleTags = widgetBody.children.filter((e) => e.name == "style");
  const cssText = styleTags.map((e) => e.innerText).join("\n");
  const mainCss = createCss(cssText);
  applyCss(widgetBody, mainCss);

  // compile the widget
  await compile(widgetBody);
  appendCodeLine("// Widget Complete");

  // Run code and set output of function
  if (debug == true) {
    console.log(code);
  }
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const runCode = new AsyncFunction(code + "\nreturn widget");
  return await runCode();

  /*********************
   * PARSE HTML + STYLES
   *********************/

  // Function to parse a HTML
  function parseHTML(string) {
    const parser = new XMLParser(string);

    // Root of html
    const main = {
      isRoot: true,
      name: "root",
      children: [],
    };

    // Node to add onto
    let target = main;

    // Store symbols to go back to parent nodes
    const goBack = {};

    // Store the new node and switch targets
    parser.didStartElement = (name, attrs) => {
      const backTo = Symbol();
      goBack[backTo] = target;
      const newTarget = {
        name,
        attrs,
        innerText: "",
        children: [],
        end: backTo,
      };
      target.children.push(newTarget);
      target = newTarget;
    };

    // Add the inner text to the node
    parser.foundCharacters = (text) => {
      target.innerText += target.innerText === "" ? text : " " + text;
    };

    // Go back to the parent node
    parser.didEndElement = () => {
      const symbol = target.end;
      target = goBack[symbol];
    };

    // Throw error on invalid input
    parser.parseErrorOccurred = () => {
      error(
        "A parse error occurred, ensure your widget is formatted properly.",
      );
    };

    parser.parse();

    if (!main.isRoot) {
      error(
        "A parse error occurred, ensure all self closing tags are closed: <{}>.",
        main.name,
      );
    }

    if (!target.isRoot) {
      error(
        "A parse error occurred, ensure all self closing tags are closed: <{}/>.",
        target.name,
      );
    }

    return main;
  }

  // function to parse the selectors
  function parseSelector(input) {
    input = input.trim();
    // store parser character location
    let current = 0;
    // store the full css selector
    const selector = [];

    // add the first selector
    selector.push({
      classes: [],
    });

    // repeat while the parser has characters left to go through
    while (current < input.length) {
      // store the current character
      let char = input[current];

      // if the char is a `.` then get all following valid characters and add a class to the selector
      if (char === ".") {
        char = input[++current];
        const VALIDCHARS = /[-a-zA-Z_0-9]/;
        if (!VALIDCHARS.test(char)) {
          error(
            "A css parse error occurred, a class name must be provided: `{}`.",
            input,
          );
        }
        let value = "";
        while (char && VALIDCHARS.test(char)) {
          value += char;
          char = input[++current];
        }
        selector.at(-1).classes.push(value);
      }

      // If it matches a direct child then create a new css selector for the next part of the selector
      const SPACE = / /;
      const DIRECTCHILD = />/;
      if (DIRECTCHILD.test(char)) {
        char = input[++current];
        while (char && SPACE.test(char)) {
          char = input[++current];
        }
        selector.push({
          classes: [],
        });
      }

      // if it matches a tag then get the tag name and add it to the selector
      const TAG = /[a-z]/i;
      if (TAG.test(char)) {
        let value = "";
        while (char && TAG.test(char)) {
          value += char;
          char = input[++current];
        }
        selector.at(-1).tag = value;
      }

      // if it matches a star then set the tag to be a `*`
      let STAR = /\*/;
      if (STAR.test(char)) {
        char = input[++current];
        selector.at(-1).tag = "*";
      }
      if (SPACE.test(char)) {
        char = input[++current];
      }
    }

    // return the root of the selector
    return selector;
  }

  // function to convert the css text into a object
  function createCss(cssText) {
    // store css
    const css = [];

    // get all css rules
    const rules = cssText.match(/[\s\S]+?{[\s\S]*?}/g) || [];

    // Repeat with each css rule
    for (let rule of rules) {
      // Test rule
      if (
        !/^\s*(([a-zA-Z]*?)(\.?[\w\-]+)*[\w\-]|\*)(\s*[,>]\s*(([a-zA-Z]*?)(\.?[\w\-]+)*[\w\-]|\*))*\s*\{(\s*[\w\-]+\s*:\s*[^\n]+?\s*;)*?\s*([\w\-]+\s*:\s*[^\n]+\s*;?)?\s*\}/.test(
          rule,
        )
      ) {
        error("Invalid CSS rule: `{}`.", rule.trim());
      }

      // Store the declarations for the rule
      const declarations = {};

      // format declarations into the declarations JSON
      const rawDeclarations = rule.match(/\{([\s\S]*)\}/)[1].split(";");
      for (let declaration of rawDeclarations) {
        declaration = declaration.trim();
        if (!declaration) {
          continue;
        }
        const property = declaration.split(/:/)[0].trim();
        // need to only remove the first colon not others (for URLs)
        const value = declaration.split(/:/).splice(1).join(":").trim();
        declarations[toCamelCase(property)] = value;
      }

      // get the selector for the rule
      const selectors = rule.split("{")[0].split(",");
      // add the css rule to the main css with all selectors
      selectors.forEach((selector) =>
        css.push({ selector: parseSelector(selector), css: declarations }),
      );
    }
    return css;
  }

  // function to add the css to each element and children elements
  function applyCss(tag, css) {
    if (tag.name == "style") {
      return;
    }
    for (let rule of css) {
      addCssIfMatchesSelector(tag, rule, 0);
    }
    if (tag.children) {
      for (let child of tag.children) {
        applyCss(child, css);
      }
    }
  }

  // function to check if a selector matches an element and add the css to it
  function addCssIfMatchesSelector(tag, rule, index) {
    if (tag.name === "style") {
      return;
    }

    // ensure matching classes
    for (let cssClass of rule.selector[index].classes) {
      if (!tag.attrs.class) {
        return;
      }
      if (!tag.attrs.class.split(" ").includes(cssClass)) {
        return;
      }
    }

    // ensure proper tag name
    if (
      rule.selector[index].tag &&
      rule.selector[index].tag !== "*" &&
      rule.selector[index].tag !== tag.name
    ) {
      return;
    }

    // if at the end of the css (no `>` following) add the css to the tag's css
    // else check for matching the next level of the css with children tag (selector following `>`)
    if (rule.selector.length - 1 === index) {
      if (!tag.css) {
        tag.css = [];
      }
      tag.css.push(rule);
    } else if (tag.children) {
      for (let child of tag.children) {
        addCssIfMatchesSelector(child, rule, index + 1);
      }
    }
  }

  /*********************
   * COMPILE THE WIDGET
   ********************/

  async function compile(tag) {
    // Do nothing when compiling css
    if (tag.name == "style") {
      return;
    }

    // Throw an error if there is a nestled widget tag
    if (tag.name == "widget" && code) {
      error("`widget` tag must not be nestled.");
    }

    // Add a new line spacing before tags
    if (code) {
      appendCodeLine("");
    }

    // Increment incrementor
    if (tag.name in incrementors) {
      incrementors[tag.name] += 1;
    } else {
      incrementors[tag.name] = 0;
    }
    const incrementor = incrementors[tag.name];

    // Get innerText
    const innerText = tag.innerText
      .replace(/&lt;/g, "<")
      .replace(/&gt/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/\n\s+/g, "\\n");

    // store attributes that translate to css
    const attributeCss = {};

    // Add attributes to css
    Object.entries(tag.attrs).forEach(([key, value]) => {
      if (!["class", "no-css", "children"].includes(key)) {
        attributeCss[toCamelCase(key)] = value.trim();
      }
    });
    // Add or reset all selected css values if the tag does not have the no-css attribute
    let finalCss = {};
    if (tag.css && !("no-css" in tag.attrs)) {
      tag.css.forEach((rule) =>
        Object.entries(rule.css).forEach(
          ([property, value]) => (finalCss[property] = value),
        ),
      );
    }
    // Add attribute values to the css
    finalCss = { ...finalCss, ...attributeCss };

    // Do stuff based on the tag name
    if (tag.name === "spacer") {
      // Add the spacer to the code and validate for the space attribute
      appendCodeLine(
        `let spacer${incrementor} = ${currentStack}.addSpacer(${
          attributeCss.space && attributeCss.space !== "null"
            ? attributeCss.space
            : ""
        })`,
      );

      const mapping = { space: "posInt" };
      validate(attributeCss, finalCss, mapping);
    } else if (tag.name === "widget") {
      // Add the widget to the code and validate the attributes and css
      code += `let widget = new ListWidget()`;
      const mapping = {
        background: ["gradient", "image", "colour"],
        refreshAfterDate: "posInt",
        spacing: "posInt",
        url: "url",
        padding: "padding",
        addAccessoryWidgetBackground: "bool",
      };
      validate(attributeCss, finalCss, mapping);

      // Add the styles
      for (const [key, value] of Object.entries(finalCss)) {
        if (value === "null") {
          continue;
        }

        const on = "widget";
        if (key === "background") {
          // Background must be completed differently because it can have 3 different types
          try {
            // try for image
            types.url.validate("background", true, value);
            types.image.add(key, value, on);
          } catch (e) {
            // split for gradient and if the length is 1 set as a background colour else as a gradient
            if (
              value.split(
                /,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/,
              ).length === 1
            ) {
              await types.colour.add("backgroundColor", value, on);
            } else {
              await types.gradient.add("backgroundGradient", value, on);
            }
          }
        } else {
          // Add the style to the tag
          const addFunc = types[mapping[key]].add;
          await addFunc(key, value, on);
        }
      }

      // Compile children with space indents
      const linesBefore = code.split("\n").length;
      for (const child of tag.children) {
        currentStack = "widget";
        await compile(child);
      }

      // add indents to the code before the widget tag
      indent(linesBefore);
    } else if (tag.name === "stack") {
      // Add the stack to the code and validate the attributes and css
      appendCodeLine(`let stack${incrementor} = ${currentStack}.addStack()`);
      const mapping = {
        background: ["gradient", "image", "colour"],
        spacing: "posInt",
        url: "url",
        padding: "padding",
        borderColor: "colour",
        borderWidth: "posInt",
        size: "size",
        cornerRadius: "posInt",
        alignContent: "alignContent",
        layout: "layout",
      };
      validate(attributeCss, finalCss, mapping);

      // Repeat with each css value
      for (const [key, value] of Object.entries(finalCss)) {
        if (value === "null") {
          continue;
        }

        const on = "stack" + incrementor;
        if (key === "background") {
          // Background must be completed differently because it can have 3 different types
          try {
            // try for background image
            types.image.validate("background", true, value);
            types.image.add(key, value, on);
          } catch (e) {
            // split for gradient and if the length is 1 set as a background colour else as a gradient
            if (
              value.split(
                /,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/,
              ).length === 1
            ) {
              await types.colour.add("backgroundColor", value, on);
            } else {
              await types.gradient.add("backgroundGradient", value, on);
            }
          }
        } else {
          // Add style to stack
          const addFunc = types[mapping[key]].add;
          await addFunc(key, value, on);
        }
      }

      // Compile children with space indents
      const linesBefore = code.split("\n").length;
      const stack = "stack" + incrementor;
      for (let child of tag.children) {
        currentStack = stack;
        await compile(child);
      }

      // add indents to the code before the stack tag
      indent(linesBefore);
    } else if (tag.name === "img") {
      let image;
      // Throw an error if there is no src attribute
      if (!attributeCss.src || attributeCss.src === "null") {
        error("`img` tag must have a `src` attribute.");
      }
      // Determine if the image is a URL or base encoding
      if (attributeCss.src.startsWith("data:image/")) {
        image = `Image.fromData(Data.fromBase64String("${attributeCss.src
          .replace(/data:image\/.*?;base64,/, "")
          .replace(/"/g, "")}"))`;
      } else {
        image = `await new Request("${attributeCss.src.replace(
          /"/g,
          "",
        )}").loadImage()`;
      }
      // Add the image to the code and validate attributes and css
      appendCodeLine(
        `let img${incrementor} = ${currentStack}.addImage(${image})`,
      );

      const mapping = {
        src: "image",
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
        alignImage: "alignImage",
      };
      validate(attributeCss, finalCss, mapping);

      // Add css styles to the image
      for (const [key, value] of Object.entries(finalCss)) {
        if (value === "null" || key === "src") {
          continue;
        }
        const on = "img" + incrementor;
        const addFunc = types[mapping[key]].add;
        await addFunc(key, value, on);
      }
    } else if (tag.name === "text") {
      // Add text to the widget and validate attributes and css
      appendCodeLine(
        `let text${incrementor} = ${currentStack}.addText("${innerText.replace(
          /"/g,
          "",
        )}")`,
      );
      const mapping = {
        url: "url",
        font: "font",
        lineLimit: "posInt",
        minimumScaleFactor: "decimal",
        shadowColor: "colour",
        shadowOffset: "point",
        shadowRadius: "posInt",
        textColor: "colour",
        textOpacity: "decimal",
        alignText: "alignText",
      };
      validate(attributeCss, finalCss, mapping);

      // Add styles to the text
      for (const [key, value] of Object.entries(finalCss)) {
        if (value === "null") {
          continue;
        }

        const on = "text" + incrementor;
        const addFunc = types[mapping[key]].add;
        await addFunc(key, value, on);
      }
    } else if (tag.name === "date") {
      // Add the date element to the widget and validate for the attributes and css
      appendCodeLine(
        `let date${incrementor} = ${currentStack}.addDate(new Date("${innerText.replace(
          /"/g,
          "",
        )}"))`,
      );
      const mapping = {
        url: "url",
        font: "font",
        lineLimit: "posInt",
        minimumScaleFactor: "decimal",
        shadowColor: "colour",
        shadowOffset: "point",
        shadowRadius: "posInt",
        textColor: "colour",
        textOpacity: "decimal",
        alignText: "alignText",
        applyStyle: "applyStyle",
      };
      validate(attributeCss, finalCss, mapping);

      // Add styles to the date
      for (const [key, value] of Object.entries(finalCss)) {
        if (value === "null") {
          continue;
        }
        const on = "date" + incrementor;
        const addFunc = types[mapping[key]].add;
        await addFunc(key, value, on);
      }
    } else {
      // Throw an error if it is not a valid addon
      if (!(tag.name in addons)) {
        error("Invalid tag name: `{}`.", tag.name);
      }
      appendCodeLine(`// <${tag.name}>`);

      // Run the addon
      const addon = addons[tag.name];
      validate(attributeCss, finalCss, addon.mapping || {});
      for (let key in addon.mapping) {
        if (!(key in finalCss)) {
          finalCss[key] = "null";
        }
        if (!(key in attributeCss)) {
          attributeCss[key] = "null";
        }
      }
      await addon.render(template, finalCss, attributeCss, innerText);

      appendCodeLine(`// </${tag.name}>`);

      // Function to add the raw html of the addon to the widget
      async function template(input) {
        // Parse the template
        let parsedInput = parseHTML(input);
        // Run through all children to determine where to put the tag children and add the no-css attribute
        parsedInput.children = parsedInput.children.map((e) =>
          putChildren(e, tag.children),
        );

        // Compile template
        let stack = currentStack;
        const linesBefore = code.split("\n").length;

        for (let child of parsedInput.children) {
          currentStack = stack;
          await compile(child);
        }

        indent(linesBefore);

        // Function to add the no-css attribute to all children and put the tag children into the template
        function putChildren(tag, children) {
          if (tag.children) {
            tag.children.map((e) => {
              putChildren(e, children);
            });
          }
          if ("children" in tag.attrs) {
            for (let item of children) {
              tag.children.push(item);
            }
          }
          tag.attrs["no-css"] = "";
          return tag;
        }
      }
    }
  }

  // Function that validated all attributes and css
  function validate(attributeCss, finalCss, mapping) {
    // Repeat with all the attributes
    for (const attr in attributeCss) {
      // Do nothing if the attributes is null
      if (attributeCss[attr] === "null") {
        continue;
      }
      // Throw an error if the attribute is not in the mapping
      if (!mapping[attr]) {
        error("Unknown attribute: `{}`.", attr);
      }
      // Validate the attribute as a string or array of possibilities
      if (typeof mapping[attr] === "string") {
        types[mapping[attr]].validate(attr, "attribute", attributeCss[attr]);
      } else {
        let isValid = false;
        for (let possibility of mapping[attr]) {
          try {
            types[possibility].validate(attr, "attribute", attributeCss[attr]);
            isValid = true;
          } catch (e) {}
        }
        if (!isValid) {
          error(
            "`{}` attribute must be a {} type: `{}`",
            attr,
            mapping[attr].join(", ").replace(/,([^,]*?)$/, " or$1"),
            attributeCss[attr],
          );
        }
      }
    }

    // Repeat with all the css
    for (let css in finalCss) {
      // Do nothing if the css is children or no-css or the value is null
      if (finalCss[css] === "null") {
        continue;
      }
      // Ignore css properties that are not in the mapping
      if (!mapping[css]) {
        delete finalCss[css];
        continue;
      }
      // Validate the css as a string or array of possibilities
      if (typeof mapping[css] === "string") {
        types[mapping[css]].validate(css, "property", finalCss[css]);
      } else {
        let isValid = false;
        for (let possibility of mapping[css]) {
          try {
            types[possibility].validate(css, "property", finalCss[css]);
            isValid = true;
          } catch (e) {}
        }
        if (!isValid) {
          error(
            "`{}` property must be a {} type: `{}`.",
            attr,
            mapping[css].join(", ").replace(/,([^,]*?)$/, " or$1"),
            finalCss[css],
          );
        }
      }
    }
  }

  /******************
   * HELPER FUNCTIONS
   ******************/

  // Function to indent the code
  function indent(startLine) {
    const codeLines = code.split("\n");
    for (let i = codeLines.length - 1; i >= startLine; i--) {
      codeLines[i] = "  " + codeLines[i];
    }
    code = codeLines.join("\n");
  }

  function appendCodeLine(line) {
    code += `\n${line}`;
  }

  // Function to get any html supported color
  async function colorFromValue(c) {
    let w = new WebView();
    await w.loadHTML(`<div id="div"style="color:${c}"></div>`);
    let result = await w.evaluateJavaScript(
      'window.getComputedStyle(document.getElementById("div")).color',
    );
    return rgbaToScriptable(
      ...result.match(/\d+(\.\d+)?/g).map((e) => Number(e)),
    );
    function rgbaToScriptable(r, g, b, a) {
      r = r.toString(16);
      g = g.toString(16);
      b = b.toString(16);
      if (r.length == 1) {
        r = "0" + r;
      }
      if (g.length == 1) {
        g = "0" + g;
      }
      if (b.length == 1) {
        b = "0" + b;
      }
      if (a) {
        if (a.length == 1) {
          a = ",0" + a;
        } else {
          a = "," + a;
        }
      } else {
        a = "";
      }
      return `new Color("${"#" + r + g + b}"${a})`;
    }
  }

  function toCamelCase(text) {
    return text.replace(/-(.)/g, (m, chr) => chr.toUpperCase());
  }

  // error function
  function error(message, ...params) {
    for (let param of params) {
      message = message.replace("{}", param);
    }
    throw new Error(
      `HTML Widget Error\n--------<Code>--------\n${code}\n--------</Code>--------\n${message}`,
    );
  }

  /******************
   * PRIMITIVE TYPES
   ******************/
  function getTypes() {
    return {
      colour: {
        async add(attribute, value, on) {
          const colours = value.split("-");
          let colour;
          if (colours.length === 2) {
            const newColours = await Promise.allSettled([
              colorFromValue(colours[0]),
              colorFromValue(colours[1]),
            ]);
            colour = `Color.dynamic(${newColours[0].value}, ${newColours[1].value})`;
          } else {
            colour = await colorFromValue(colours[0]);
          }
          appendCodeLine(`${on}.${attribute} = ${colour}`);
        },
        validate() {},
      },
      posInt: {
        add(attribute, value, on) {
          if (attribute === "refreshAfterDate") {
            appendCodeLine(
              `let date = new Date()\ndate.setMinutes(date.getMinutes() + ${value})\nwidget.refreshAfterDate = date`,
            );
          } else {
            appendCodeLine(`${on}.${attribute} = ${value}`);
          }
        },
        validate(attribute, type, value) {
          if (!/^\d+$/.test(value)) {
            error(
              "`{}` {} must be a positive integer: `{}`.",
              attribute,
              type,
              value,
            );
          }
        },
      },
      decimal: {
        add(attribute, value, on) {
          if (value.endsWith("%")) {
            value = Number(value.replace("%", ""));
            value /= 100;
          }
          appendCodeLine(`${on}.${attribute} = ${value}`);
        },
        validate(attribute, type, value) {
          if (!/^\d*((\.\d+)|\d\.?)%?$/.test(value)) {
            error(
              "`{}` {} must be a positive integer or float with an optional `%` at the end: `{}`.",
              attribute,
              type,
              value,
            );
          }
        },
      },
      gradient: {
        async add(_, value, on) {
          gradientNumber++;

          // split into parts
          let gradient = value
            .split(/,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/)
            .map((e) => e.trim());

          // get the direction from the first item of gradient
          let gradientDirection;
          const wordDirections = {
            "to left": 90,
            "to right": 270,
            "to top": 180,
            "to bottom": 0,
            "to top left": 135,
            "to top right": 225,
            "to bottom left": 45,
            "to bottom right": 315,
            "to left top": 135,
            "to right top": 225,
            "to left bottom": 45,
            "to right bottom": 315,
          };
          // check if it is a word direction, degrees direction or none are provided
          if (gradient[0] in wordDirections) {
            gradientDirection = wordDirections[gradient.shift()];
          } else if (/\d+\s*deg/.test(gradient[0])) {
            gradientDirection = Number(
              gradient.shift().match(/(\d+)\s*deg/)[1],
            );
          } else {
            gradientDirection = 0;
          }

          // Get colours
          const gradColours = [];
          for (const colour of gradient) {
            const colourArr = colour
              .replace(/\s+\d*((\.\d+)|\d\.?)%?$/, "")
              .split("-");
            if (colourArr.length == 2) {
              const newColours = await Promise.allSettled([
                colorFromValue(colourArr[0]),
                colorFromValue(colourArr[1]),
              ]);
              gradColours.push(
                `Color.dynamic(${newColours[0].value}, ${newColours[1].value})`,
              );
            } else {
              gradColours.push(await colorFromValue(colourArr[0]));
            }
          }

          // Get locations
          let locations = gradient.map((e) => {
            // get all provided locations
            let matched = e.match(/\s+\d*((\.\d+)|\d\.?)%?$/);
            // get the matched result or null
            let result = matched && matched[0];
            // divide a percentage
            if (result && result.endsWith("%")) {
              result = Number(result.replace("%", "")) / 100;
            }
            return result === null ? null : Number(result);
          });

          // Set default first and last locations
          if (locations[0] === null) {
            locations[0] = 0;
          }
          if (locations[locations.length - 1] === null) {
            locations[locations.length - 1] = 1;
          }

          // Set not specified locations
          for (let i = 0; i < locations.length; i++) {
            let currentLocation = locations[i];
            // get next non-null location index
            let index = i + 1;
            while (index < locations.length && locations[index] === null) {
              index++;
            }
            // calculate the difference between each null location for a linear transition
            let difference = (locations[index] - locations[i]) / (index - i);

            // set each between null location
            for (let plusIndex = 1; plusIndex < index - i; plusIndex++) {
              locations[i + plusIndex] =
                difference * plusIndex + currentLocation;
            }
          }

          // calculate gradient points based on the direction
          const x1 =
            1 -
            (0.5 + 0.5 * Math.cos((Math.PI * (gradientDirection + 90)) / 180));
          const y1 =
            1 -
            (0.5 + 0.5 * Math.sin((Math.PI * (gradientDirection + 90)) / 180));
          const x2 =
            0.5 + 0.5 * Math.cos((Math.PI * (gradientDirection + 90)) / 180);
          const y2 =
            0.5 + 0.5 * Math.sin((Math.PI * (gradientDirection + 90)) / 180);
          appendCodeLine(
            `let gradient${gradientNumber} = new LinearGradient()\ngradient${gradientNumber}.colors = [${gradColours}]\ngradient${gradientNumber}.locations = [${locations}]\ngradient${gradientNumber}.startPoint = ${`new Point(${x1}, ${y1})`}\ngradient${gradientNumber}.endPoint = ${`new Point(${x2}, ${y2})`}\n${on}.backgroundGradient = gradient${gradientNumber}`,
          );
        },
        validate(attribute, type, value) {
          let gradient = value
            .split(/,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/)
            .map((e) => e.trim());
          const wordDirections = [
            "to left",
            "to right",
            "to top",
            "to bottom",
            "to top left",
            "to top right",
            "to bottom left",
            "to bottom right",
            "to left top",
            "to right top",
            "to left bottom",
            "to right bottom",
          ];
          if (wordDirections.includes(gradient[0])) {
            gradient.shift();
          } else if (/\d+\s*deg/.test(gradient[0])) {
            gradient.shift();
          }
          // Get locations
          let locations = gradient.map((e) => {
            // get all provided locations
            let matched = e.match(/\s+\d*((\.\d+)|\d\.?)%?$/);
            // get the matched result or null
            let result = matched && matched[0];
            // divide a percentage
            if (result && result.endsWith("%")) {
              result = Number(result.replace("%", "")) / 100;
            }
            return result === null ? null : Number(result);
          });

          let minLocation = 0;
          for (let i = 0; i < locations.length; i++) {
            let currentLocation = locations[i];
            if (currentLocation) {
              if (minLocation > currentLocation) {
                error(
                  "`{}` {} locations must be in ascending order: `{}`.",
                  attribute,
                  type,
                  value,
                );
              }
              if (currentLocation < 0) {
                error(
                  "`{}` {} locations must be equal or greater than `0`: `{}`.",
                  attribute,
                  type,
                  value,
                );
              }
              if (currentLocation > 1) {
                error(
                  "`{}` {} locations must be equal or less than `1`: `{}`.",
                  attribute,
                  type,
                  value,
                );
              }
              minLocation = currentLocation;
            }
          }
        },
      },
      padding: {
        add(_, value, on) {
          if (value === "default") {
            appendCodeLine(`${on}.useDefaultPadding()`);
          } else {
            let paddingArray = value.match(/\d+/g);
            if (paddingArray.length == 1) {
              paddingArray = [
                paddingArray[0],
                paddingArray[0],
                paddingArray[0],
                paddingArray[0],
              ];
            } else if (paddingArray.length == 2) {
              paddingArray = [
                paddingArray[0],
                paddingArray[1],
                paddingArray[0],
                paddingArray[1],
              ];
            }
            appendCodeLine(`${on}.setPadding(${paddingArray.join(", ")})`);
          }
        },
        validate(attribute, type, value) {
          if (!/^(\d+((\s*,\s*\d+){3}|(\s*,\s*\d+))?|default)$/g.test(value)) {
            error(
              "`{}` {} must be 1, 2 or 4 positive integers separated by commas or be `default`: `{}`.",
              attribute,
              type,
              value,
            );
          }
        },
      },
      size: {
        add(attribute, value, on) {
          let size = value.match(/\d+/g);
          appendCodeLine(
            `${on}.${attribute} = new Size(${size[0]}, ${size[1]})`,
          );
        },
        validate(attribute, type, value) {
          if (!/^\d+\s*,\s*\d+$/.test(value)) {
            error(
              "`{}` {} must be 2 positive integers separated by commas: `{}`.",
              attribute,
              type,
              value,
            );
          }
        },
      },
      font: {
        add(_, value, on) {
          let fontRegex =
            /^(((black|bold|medium|light|heavy|regular|semibold|thin|ultraLight)(MonospacedSystemFont|RoundedSystemFont|SystemFont)\s*,\s*(\d+))|(body|callout|caption1|caption2|footnote|subheadline|headline|largeTitle|title1|title2|title3)|((italicSystemFont)\s*,\s*(\d+)))$/;
          if (fontRegex.test(value)) {
            appendCodeLine(
              `${on}.font = Font.${value.replace(fontRegex, "$3$4$6$8($5$9)")}`,
            );
          } else {
            appendCodeLine(
              `${on}.font = new Font("${value
                .split(",")[0]
                .replace(/"/g, "")}",${value.split(",")[1].match(/\d+/g)[0]})`,
            );
          }
        },
        validate(attribute, type, value) {
          if (
            !/^[^,]+,\s*\d+$/.test(value) &&
            ![
              "body",
              "callout",
              "caption1",
              "caption2",
              "footnote",
              "subheadline",
              "headline",
              "italicSystemFont",
              "largeTitle",
              "title1",
              "title2",
              "title3",
            ].includes(value)
          ) {
            error(
              "`{}` {} must be 1 font name and 1 positive integer separated by commas or be a content-based font: `{}`.",
              attribute,
              type,
              value,
            );
          }
        },
      },
      point: {
        add(_, value, on) {
          const point = value.split(",");
          appendCodeLine(
            `${on}.shadowOffset = new Point(${point[0]},${point[1]})`,
          );
        },
        validate(attribute, type, value) {
          if (!/^-?\d+\s*,\s*-?\d+$/.test(value)) {
            error(
              "`{}` {} must be 2 integers separated by commas: `{}`.",
              attribute,
              type,
              value,
            );
          }
        },
      },
      bool: {
        add(attribute, value, on) {
          if (value === "false") {
            return;
          }
          if (attribute === "resizable") {
            appendCodeLine(`${on}.resizable = false`);
          } else {
            appendCodeLine(`${on}.${attribute} = true`);
          }
        },
        validate() {},
      },
      url: {
        add: (_, value, on) => {
          appendCodeLine(`${on}.url = "${value.replace(/"/g, "")}"`);
        },
        validate(attribute, type, value) {
          if (
            !/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
              value,
            )
          ) {
            error("`{}` {} must be a valid URL: `{}.`", attribute, type, value);
          }
        },
      },
      image: {
        add(_, value, on) {
          if (value.startsWith("data:image/")) {
            appendCodeLine(
              `${on}.backgroundImage = Image.fromData(Data.fromBase64String("${value
                .replace(/data:image\/\w+;base64,/, "")
                .replace(/"/g, "")}"))`,
            );
          } else {
            appendCodeLine(
              `${on}.backgroundImage = await new Request("${value.replace(
                /"/g,
                "",
              )}").loadImage()`,
            );
          }
        },
        validate(attribute, type, value) {
          if (
            !/^(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))|(data:image\/\w+?;base64,[a-zA-Z0-9+/]+={0,2})$/.test(
              value,
            )
          ) {
            error(
              "`{}` {} must be a valid url or base encoded data link: `{}`.",
              attribute,
              type,
              value,
            );
          }
        },
      },
      layout: {
        add(_, value, on) {
          appendCodeLine(
            `${on}.layout${value[0].toUpperCase() + value.slice(1)}()`,
          );
        },
        validate(attribute, type, value) {
          if (value !== "vertically" && value !== "horizontally") {
            error(
              "`{}` {} must be `vertically` or `horizontally`: `{}`.",
              attribute,
              type,
              value,
            );
          }
        },
      },
      alignText: {
        add(_, value, on) {
          appendCodeLine(`${on}.${value}AlignText()`);
        },
        validate(attribute, type, value) {
          if (!["center", "left", "right"].includes(value)) {
            error(
              "`{}` {} must be `left`, `right` or `center`: `{}.`",
              attribute,
              type,
              value,
            );
          }
        },
      },
      alignImage: {
        add(_, value, on) {
          appendCodeLine(`${on}.${value}AlignImage()`);
        },
        validate(attribute, type, value) {
          if (!["center", "left", "right"].includes(value)) {
            error(
              "`{}` {} must be `left`, `right` or `center`: `{}`.",
              attribute,
              type,
              value,
            );
          }
        },
      },
      alignContent: {
        add(_, value, on) {
          appendCodeLine(`${on}.${value}AlignContent()`);
        },
        validate(attribute, type, value) {
          if (!["center", "top", "bottom"].includes(value)) {
            error(
              "`{}` {} must be `top`, `bottom` or `center`: `{}`.",
              attribute,
              type,
              value,
            );
          }
        },
      },
      applyStyle: {
        add(_, value, on) {
          appendCodeLine(
            `${on}.apply${value[0].toUpperCase() + value.slice(1)}Style()`,
          );
        },
        validate(attribute, type, value) {
          if (
            !["date", "timer", "offset", "relative", "time"].includes(value)
          ) {
            error(
              "`{}` {} must be `date`, `timer` , `relative`, `time`, or `offset`: `{}`.",
              attribute,
              type,
              value,
            );
          }
        },
      },
      contentMode: {
        add(_, value, on) {
          appendCodeLine(
            `${on}.apply${value[0].toUpperCase() + value.slice(1)}ContentMode()`,
          );
        },
        validate(attribute, type, value) {
          if (!["filling", "fitting"].includes(value)) {
            error(
              "`{}` {} must be `filling` or `fitting`: `{}`.",
              attribute,
              type,
              value,
            );
          }
        },
      },
    };
  }
}

module.exports = htmlWidget;
