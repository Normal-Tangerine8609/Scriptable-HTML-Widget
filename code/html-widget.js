//https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget
async function htmlWidget(input, logCode){  
//https://github.com/henryluki/html-parser
//Minified using https://www.toptal.com/developers/javascript-minifier/
const STARTTAG_REX=/^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,ENDTAG_REX=/^<\/([-A-Za-z0-9_]+)[^>]*>/,ATTR_REX=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;function makeMap(t){return t.split(",").reduce((t,e)=>(t[e]=!0,t),{})}const EMPTY_MAKER=makeMap("symbol,img"),FILLATTRS_MAKER=makeMap("bottom-align-content,center-align-content,top-align-content,layout-vertically,layout-horizontally,container-relative-shape,resizable,apply-filling-content-mode,apply-fitting-content-mode,center-align-image,left-align-image,right-align-image,center-align-text,left-align-text,right-align-text");function isEmptyMaker(t){return!!EMPTY_MAKER[t]}function isFillattrsMaker(t){return!!FILLATTRS_MAKER[t]}class TagStart{constructor(t,e){this.name=t,this.attributes=this.getAttributes(e)}getAttributes(t){let e={};return t.replace(ATTR_REX,function(t,n){const a=Array.prototype.slice.call(arguments),r=a[2]?a[2]:a[3]?a[3]:a[4]?a[4]:isFillattrsMaker(n)?n:"";e[n]=r.replace(/(^|[^\\])"/g,'$1\\"')}),e}}class TagEmpty extends TagStart{constructor(t,e){super(t,e)}}class TagEnd{constructor(t){this.name=t}}class Text{constructor(t){this.text=t}}const ElEMENT_TYPE="Element",TEXT_TYPE="Text";function createElement(t){const e=t.name,n=t.attributes;return t instanceof TagEmpty?{type:ElEMENT_TYPE,tagName:e,attributes:n}:{type:ElEMENT_TYPE,tagName:e,attributes:n,children:[]}}function createText(t){const e=t.text;return{type:TEXT_TYPE,content:e}}function createNodeFactory(t,e){switch(t){case ElEMENT_TYPE:return createElement(e);case TEXT_TYPE:return createText(e)}}function parse(t){let e={tag:"root",children:[]},n=[e];n.last=(()=>n[n.length-1]);for(let e=0;e<t.length;e++){const a=t[e];if(a instanceof TagStart){const t=createNodeFactory(ElEMENT_TYPE,a);t.children?n.push(t):n.last().children.push(t)}else if(a instanceof TagEnd){let t=n[n.length-2],e=n.pop();t.children.push(e)}else a instanceof Text&&n.last().children.push(createNodeFactory(TEXT_TYPE,a))}return e}function tokenize(t){let e=t,n=[];const a=Date.now()+1e3;for(;e;){if(0===e.indexOf("\x3c!--")){const t=e.indexOf("--\x3e")+3;e=e.substring(t);continue}if(0===e.indexOf("</")){const t=e.match(ENDTAG_REX);if(!t)continue;e=e.substring(t[0].length);const a=t[1];if(isEmptyMaker(a))continue;n.push(new TagEnd(a));continue}if(0===e.indexOf("<")){const t=e.match(STARTTAG_REX);if(!t)continue;e=e.substring(t[0].length);const a=t[1],r=t[2],s=isEmptyMaker(a)?new TagEmpty(a,r):new TagStart(a,r);n.push(s);continue}const t=e.indexOf("<"),r=t<0?e:e.substring(0,t);if(e=t<0?"":e.substring(t),n.push(new Text(r)),Date.now()>=a)break}return n}function htmlParser(t){return parse(tokenize(t))}
 
//Set up simple methods
String.prototype.replaceQuotes = function () {  
    return this.replace(/"/g, "")
	}
String.prototype.getNumber = function () {
    return this.match(/\d/g)?this.match(/\d/g).join(""):0
    }
//Set base variables
  let currentStack, stackNumber=-1, imageNumber=-1, textNumber=-1, code
//compile only the first widget tag
  compile(htmlParser(input)["children"].filter(element => {
    if(element.tagName == "widget"){return element}
  })[0])
  function compile(tag) {
    let image
//If there were no widget tags raise error
    if(!tag){throw new Error("widget Tag Must Be The Parent Tag")}
//Do nothing when compile normal text
    if(tag.type == "Text"){return}
//Start to compile
    if(tag["tagName"] == "widget" && !code) {
      code = "let widget = new ListWidget()"
//Repeat and set each attribute
      for(var key of Object.keys(tag["attributes"])){
        let value = tag["attributes"][key].trim()
        if(value){
        switch(key) {
        case "background-color":
          if(value.split(",").length != 1) {
             code+= `\nwidget.backgroundColor = Color.dynamic(new Color("${value.split(",")[0].trim().replaceQuotes()}"),new Color("${value.split(",")[1].trim().replaceQuotes()}"))`
          } else {
            code+= `\nwidget.backgroundColor = new Color("${value.replaceQuotes()}")`
          }
        break;
        case "background-image":
          if(value.startsWith("data:image/")) {
          value = value.replace("data:image/png;base64,","").replace("data:image/jpeg;base64,","")
          code += `\nwidget.backgroundImage = Image.fromData(Data.fromBase64String("${base.replaceQuotes()}"))`
        } else {
          code += `\nwidget.backgroundImage = await new Request("${value.replaceQuotes()}").loadImage()`
        }
        break
        case "refresh-after-date":
          code += `\nlet date = new Date()\ndate.setMinutes(date.getMinutes() + ${value.getNumber()})\nwidget.refreshAfterDate = date`
        break
        case "spacing":
          code += `\nwidget.spacing = ${value.getNumber()}`
        break
        case "url":
          code += `\nwidget.url = "${value.replaceQuotes()}"`
        break
        case "padding":
          let paddingArray = value.split(",").map(function (i){return i.trim().getNumber()})
           if(paddingArray.length == 1) {
              paddingArray = [paddingArray[0], paddingArray[0], paddingArray[0], paddingArray[0]]
           } else if (paddingArray.length == 2) {
             paddingArray = [paddingArray[0], paddingArray[1], paddingArray[0], paddingArray[1]]
           } else if (paddingArray.length != 4) {
throw new Error("padding Attribute On widget Must Have 1, 2 Or 4 Parameters")}
           code += `\nwidget.setPadding(${paddingArray.join(",")})`
        break
        default:
        throw new Error(`Unknown Attribute ${key} On Tag ${tag["tagName"]}`)
        break
        }}
      }
//Compile all children
      for(var item of tag["children"]) {
        currentStack = "widget"
        compile(item)
      }
      return
    }
//Compile for stack
    if(tag["tagName"] == "stack") {
      stackNumber++
      code += `\nlet stack${stackNumber} = ${currentStack}.addStack()`
      for(var key of Object.keys(tag["attributes"])){
        let value = tag["attributes"][key].trim()
        if(value){
        switch(key) {
        case "background-color":
          if(value.split(",").length != 1) {
             code+= `\nstack${stackNumber}.backgroundColor = Color.dynamic(new Color("${value.split(",")[0].trim().replaceQuotes()}"),new Color("${value.split(",")[1].trim().replaceQuotes()}"))`
          } else {
            code+= `\nstack${stackNumber}.backgroundColor = new Color("${value.replaceQuotes()}")`
          }
        break
        case "background-image":
          if(value.startsWith("data:image/")) {
          value = value.replace("data:image/png;base64,","").replace("data:image/jpeg;base64,","")
          code += `\nwidget.backgroundImage = Image.fromData(Data.fromBase64String("${base.replaceQuotes()}"))`
        } else {
          code += `\nwidget.backgroundImage = await new Request("${value.replaceQuotes()}").loadImage()`
        }
        break
        case "border-color":
          if(value.split(",").length != 1) {
             code+= `\nstack${stackNumber}.borderColor = Color.dynamic(new Color("${value.split(",")[0].trim().replaceQuotes()}"),new Color("${value.split(",")[1].trim().replaceQuotes()}"))`
          } else {
            code+= `\nstack${stackNumber}.borderColor = new Color("${value.replaceQuotes()}")`
          }
        break
        case "border-width":
          code += `\nstack${stackNumber}.borderWidth = ${value.getNumber()}`
        break
        case "corner-radius":
          code += `\nstack${stackNumber}.cornerRadius = ${value.getNumber()}`
        break
        case "size":
          if(value.split(",").length != 2){throw new Error("size Attribute On stack Tag Must Have 2 Parameters")}
          code += `\nstack${stackNumber}.size = new Size(${value.split(",")[0].getNumber()},${value.split(",")[1].getNumber()})`
        break
        case "spacing":
          code += `\nstack${stackNumber}.spacing = ${value.getNumber()}`
        break
        case "url":
          code += `\nstack${stackNumber}.url = "${value.replaceQuotes()}"`
        break
        case "padding":
          let paddingArray = value.split(",").map(function (i){return i.trim().getNumber()})
           if(paddingArray.length == 1) {
              paddingArray = [paddingArray[0], paddingArray[0], paddingArray[0], paddingArray[0]]
           } else if (paddingArray.length == 2) {
             paddingArray = [paddingArray[0], paddingArray[1], paddingArray[0], paddingArray[1]]
           } else if (paddingArray.length != 4) {
throw new Error("padding Attribute On stack Must Have 1, 2 Or 4 Parameters")}
           code += `\nwidget.setPadding(${paddingArray.join(",")})`
        break
        case "bottom-align-content":
          code += `\nstack${stackNumber}.bottomAlignContent()`
        break
        case "center-align-content":
          code += `\nstack${stackNumber}.centerAlignContent()`
        break
        case "top-align-content":
          code += `\nstack${stackNumber}.topAlignContent()`
        break
        case "layout-horizontally":
          code += `\nstack${stackNumber}.layoutHorizontally()`
        break
        case "layout-vertically":
          code += `\nstack${stackNumber}.layoutVertically()`
        break
        default:
        throw new Error(`Unknown Attribute ${key} On Tag ${tag["tagName"]}`)
        break
        }}
//Compile stack children
      }
      for(var item of tag["children"]) {
        currentStack = "stack" + stackNumber
        compile(item)
      }
      return
    }
//Compile for symbol
    if(tag["tagName"] == "symbol") {
      image = `SFSymbol.named("${tag["attributes"]["named"]?tag["attributes"]["named"]:"questionmark.circle"}").image`
    }
//Compile for symbol and img because they have the same attributes
    if(tag["tagName"] == "img" || tag["tagName"] == "symbol") {
      imageNumber++
      if(image) {
        code += `\nlet image${imageNumber} = ${currentStack}.addImage(${image})`
      }else {
      if(!tag["attributes"]["src"]){throw new Error("image Element Must Have A src Attribute")}
        if(tag["attributes"]["src"].trim().startsWith("data:image/")) {
          let base = tag["attributes"]["src"].trim()
          base = base.replace("data:image/png;base64,","").replace("data:image/jpeg;base64,","")
          code += `\nlet image${imageNumber} = ${currentStack}.addImage(Image.fromData(Data.fromBase64String("${base.replaceQuotes()}")))`
        } else {
          code += `\nlet image${imageNumber} = ${currentStack}.addImage(await new Request("${tag["attributes"]["src"].replaceQuotes()}").loadImage())`
        }
      }
      for(var key of Object.keys(tag["attributes"])){
        let value = tag["attributes"][key].trim()
        if(value){
        switch(key) {
        case "background-color":
          if(value.split(",").length != 1) {
             code+= `\nstack${stackNumber}.backgroundColor = Color.dynamic(new Color("${value.split(",")[0].trim().replaceQuotes()}"),new Color("${value.split(",")[1].trim().replaceQuotes()}"))`
          } else {
            code+= `\nstack${stackNumber}.backgroundColor = new Color("${value.replaceQuotes()}")`
          }
        break
        case "border-color":
          if(value.split(",").length != 1) {
             code+= `\nimage${imageNumber}.borderColor = Color.dynamic(new Color("${value.split(",")[0].trim().replaceQuotes()}"),new Color("${value.split(",")[1].trim().replaceQuotes()}"))`
          } else {
            code+= `\nimage${imageNumber}.borderColor = new Color("${value.replaceQuotes()}")`
          }
        break
        case "border-width":
          code += `\nimage${imageNumber}.borderWidth = ${value.getNumber()}`
        break
        case "container-relative-shape":
          code += `\nimage${imageNumber}.containerRelativeShape = true`
        break
        case "corner-radius":
          code += `\nimage${imageNumber}.cornerRadius = ${value.getNumber()}`
        break
        case "image-opacity":
          value = value.match(/\d*(?:\.\d*)?%?/)[0]
          if(value.endsWith("%")){
            value = Number(value.replace("%",""))
            value /= 100
          }
          code += `\nimage${imageNumber}.imageOpacity = ${value}`
        break
        case "image-size":
          if(value.split(",").length != 2){throw new Error("image-size Attribute On image Tag Must Have 2 Parameters")}
          code += `\nimage${imageNumber}.imageSize = new Size(${value.split(",")[0].getNumber()},${value.split(",")[1].getNumber()})`
        break
        case "resizable":
          code += `\nimage${imageNumber}.resizable = false`
        break
        case "tint-color":
          if(value.split(",").length != 1) {
             code+= `\nimage${imageNumber}.tintColor = Color.dynamic(new Color("${value.split(",")[0].trim().replaceQuotes()}"),new Color("${value.split(",")[1].trim().replaceQuotes()}"))`
          } else {
            code+= `\nimage${imageNumber}.tintColor = new Color("${value.replaceQuotes()}")`
          }
        break
        case "url":
          code += `\nimage${imageNumber}.url = "${value.replaceQuotes()}"`
        break
        case "apply-filling-content-mode":
          code += `\nimage${imageNumber}.applyFillingContentMode()`
        break
        case "apply-fitting-content-mode":
          code += `\nimage${imageNumber}.applyFittingContentMode()`
        break
        case "center-align-image":
          code += `\nimage${imageNumber}.centerAlignImage()`
        break
        case "left-align-image":
          code += `\nimage${imageNumber}.leftAlignImage()`
        break
        case "right-align-image":
          code += `\nimage${imageNumber}.rightAlignImage()`
        break
        case "named": break
        case "src": break
        default:
        throw new Error(`Unknown Attribute ${key} On Tag ${tag["tagName"]}`)
        break
        }}
      }
      return
    }
//Compile for text
    if(tag["tagName"] == "text") {
      textNumber++
      let textArray = []
//Get all text children
      for(var item of tag["children"]) {
        if(item.type == "Text") {
          if(/[^\s]/.test(item["content"]))
            textArray.push(item["content"])
        }
      }
      code += `\nlet text${textNumber} = ${currentStack}.addText("${textArray.join(" ").replaceQuotes().replace(/&lt;/g, "<").replace(/&gt/g, ">").replace(/&amp;/g, "&")}")`
for(var key of Object.keys(tag["attributes"])){
        let value = tag["attributes"][key].trim()
        if(value){
        switch(key) {
        case "font":
          if(value.split(",").length != 2){throw new Error("font Attribute On text Tag Must Have 2 Parameters")}
          code += `\ntext${textNumber}.font = new Font("${value.split(",")[0].trim().replaceQuotes()}",${value.split(",")[1].trim().getNumber()})`
        break
        case "line-limit":
          code += `\ntext${textNumber}.lineLimit = ${value.getNumber()}`
        break
        case "minimum-scale-factor":
          value = value.match(/\d*(?:\.\d*)?%?/)[0]
          if(value.endsWith("%")){
            value = Number(value.replace("%",""))
            value /= 100
          }
          code += `\ntext${textNumber}.minimumScaleFactor = ${value}`
        break
        case "shadow-color":
          if(value.split(",").length != 1) {
             code+= `\ntext${textNumber}.shadowColor = Color.dynamic(new Color("${value.split(",")[0].trim().replaceQuotes()}"),new Color("${value.split(",")[1].trim().replaceQuotes()}"))`
          } else {
            code+= `\ntext${textNumber}.shadowColor = new Color("${value.replaceQuotes()}")`
          }
        break
        case "shadow-offset":
          if(value.split(",").length != 2){throw new Error("shadow-offset Attribute On text Tag Must Have 2 Parameters")}
          code += `\ntext${textNumber}.shadowOffset = new Point(${value.split(",")[0].trim().match(/-?\d*/)[0]},${value.split(",")[1].trim().match(/-?\d*/)[0]})`
        break
        case "shadow-radius":
          code += `\ntext${textNumber}.shadowRadius = ${value.getNumber()}`
        break
        case "text-color":
          if(value.split(",").length != 1) {
             code+= `\ntext${textNumber}.textColor = Color.dynamic(new Color("${value.split(",")[0].trim().replaceQuotes()}"),new Color("${value.split(",")[1].trim().replaceQuotes()}"))`
          } else {
            code+= `\ntext${textNumber}.textColor = new Color("${value.replaceQuotes()}")`
          }
        break
        case "text-opacity":
          value = value.match(/\d*(?:\.\d*)?%?/)[0]
          if(value.endsWith("%")){
            value = Number(value.replace("%",""))
            value /= 100
          }
          code += `\ntext${textNumber}.textOpacity = ${value}`
        break
        case "url":
          code += `\ntext${textNumber}.url = ${value.replaceQuotes}`
        break
        case "center-align-text":
          code += `\ntext${textNumber}.centerAlignText()`
        break
        case "left-align-text":
          code += `\ntext${textNumber}.leftAlignText()`
        break
        case "right-align-text":
          code += `\ntext${textNumber}.rightAlignText()`
        break
        default:
        throw new Error(`Unknown Attribute ${key} On Tag ${tag["tagName"]}`)
        break
        }}
      }
      return
    }
//Compile for spacer
    if(tag["tagName"] == "spacer") {
      let spacerNumber = ""
//Get all numbers for children
      for(var item of tag["children"]) {
        if(item.type == "Text") {
          /\d{1,}/.exec(item["content"]).forEach(function(element){
            spacerNumber += element
          })
      }
    }
    code += `\n${currentStack}.addSpacer(${spacerNumber})`
    return
}
//Raise error if there is a nestled widget tag or unknown tag
    if(tag["tagName"] == "widget"){ 
      throw new Error("widget Tags Must Not Be Nestled")
    } else {
      throw new Error("Invalid Tag Name:" + tag["tagName"]) 
    }
  }
//Finished compiling
//Run code and set output of function
  if(logCode == true){console.log(code)}
  let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
  let runCode = new AsyncFunction(code + "\nreturn widget")
  return await runCode()
}
