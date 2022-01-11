//HTML Widget Version 3.00
//https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget
module.exports = async function htmlWidget(input, debug){  
//https://github.com/henryluki/html-parser
//Minified using https://www.toptal.com/developers/javascript-minifier/
const STARTTAG_REX=/^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,ENDTAG_REX=/^<\/([-A-Za-z0-9_]+)[^>]*>/,ATTR_REX=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;function makeMap(t){return t.split(",").reduce((t,e)=>(t[e]=!0,t),{})}const EMPTY_MAKER=makeMap("symbol,img,spacer,hr"),FILLATTRS_MAKER=makeMap("bottom-align-content,center-align-content,top-align-content,layout-vertically,layout-horizontally,container-relative-shape,resizable,apply-filling-content-mode,apply-fitting-content-mode,center-align-image,left-align-image,right-align-image,center-align-text,left-align-text,right-align-text,apply-date-style,apply-offset-style,apply-relative-style,apply-timer-style,apply-time-style");function isEmptyMaker(t){return!!EMPTY_MAKER[t]}function isFillattrsMaker(t){return!!FILLATTRS_MAKER[t]}class TagStart{constructor(t,e){this.name=t,this.attributes=this.getAttributes(e)}getAttributes(t){let e={};return t.replace(ATTR_REX,function(t,n){const a=Array.prototype.slice.call(arguments),r=a[2]?a[2]:a[3]?a[3]:a[4]?a[4]:isFillattrsMaker(n)?n:"";e[n]=r.replace(/(^|[^\\])"/g,'$1\\"')}),e}}class TagEmpty extends TagStart{constructor(t,e){super(t,e)}}class TagEnd{constructor(t){this.name=t}}class Text{constructor(t){this.text=t}}const ElEMENT_TYPE="Element",TEXT_TYPE="Text";function createElement(t){const e=t.name,n=t.attributes;return t instanceof TagEmpty?{type:ElEMENT_TYPE,tagName:e,attributes:n}:{type:ElEMENT_TYPE,tagName:e,attributes:n,children:[]}}function createText(t){const e=t.text;return{type:TEXT_TYPE,content:e}}function createNodeFactory(t,e){switch(t){case ElEMENT_TYPE:return createElement(e);case TEXT_TYPE:return createText(e)}}function parse(t){let e={tag:"root",children:[]},n=[e];n.last=(()=>n[n.length-1]);for(let e=0;e<t.length;e++){const a=t[e];if(a instanceof TagStart){const t=createNodeFactory(ElEMENT_TYPE,a);t.children?n.push(t):n.last().children.push(t)}else if(a instanceof TagEnd){let t=n[n.length-2],e=n.pop();t.children.push(e)}else a instanceof Text&&n.last().children.push(createNodeFactory(TEXT_TYPE,a))}return e}function tokenize(t){let e=t,n=[];const a=Date.now()+1e3;for(;e;){if(0===e.indexOf("\x3c!--")){const t=e.indexOf("--\x3e")+3;e=e.substring(t);continue}if(0===e.indexOf("</")){const t=e.match(ENDTAG_REX);if(!t)continue;e=e.substring(t[0].length);const a=t[1];if(isEmptyMaker(a))continue;n.push(new TagEnd(a));continue}if(0===e.indexOf("<")){const t=e.match(STARTTAG_REX);if(!t)continue;e=e.substring(t[0].length);const a=t[1],r=t[2],s=isEmptyMaker(a)?new TagEmpty(a,r):new TagStart(a,r);n.push(s);continue}const t=e.indexOf("<"),r=t<0?e:e.substring(0,t);if(e=t<0?"":e.substring(t),n.push(new Text(r)),Date.now()>=a)break}return n}function htmlParser(t){return parse(tokenize(t))}
//Set base variables
  let currentStack, stackNumber=-1, imageNumber=-1, textNumber=-1,gradientNumber=-1,dateNumber=-1,hrNumber = -1,symbolNumber = -1,code;
const validAttributes = {
  "widget":["background-color","background-gradient","background-image","refresh-after-date","spacing","url","padding","class"],
  "stack":["background-color","background-gradient","background-image","spacing","url","padding","class","border-color","border-width","corner-radius","size","bottom-align-content","center-align-content","top-align-content","layout-horizontally","layout-vertically"],
  "hr":["background-color","background-gradient","corner-radius","class","url","layout-horizontally","layout-vertically","width"],
  "img":["border-color","border-width","container-relative-shape","corner-radius","image-opacity","image-size","resizable","tint-color","url","apply-filling-content-mode","apply-fitting-content-mode","center-align-image","left-align-image","right-align-image","src","class"],
  "symbol":["border-color","border-width","container-relative-shape","corner-radius","image-opacity","image-size","resizable","tint-color","url","apply-filling-content-mode","apply-fitting-content-mode","center-align-image","left-align-image","right-align-image","named","class"],
  "text":["font","line-limit","minimum-scale-factor","shadow-color","shadow-offset","shadow-radius","text-color","text-opacity","url","center-align-text","left-align-text","right-align-text","class"],
  "date":["font","line-limit","minimum-scale-factor","shadow-color","shadow-offset","shadow-radius","text-color","text-opacity","url","center-align-text","left-align-text","right-align-text","class","apply-date-style","apply-offset-style","apply-relative-style","apply-timer-style","apply-time-style"]
}
//Get only the first widget tag
  let widgetBody = htmlParser(input)["children"].filter(element => {
    if(element.tagName == "widget"){return element}
  })[0]
//If there were no widget tags raise error
  if(!widgetBody){
    throw new Error("widget Tag Must Be The Parent Tag")
}
//Get all direct style tags
  let styleTags = widgetBody["children"].filter(e=> e.tagName == "style")
  let cssTexts = ""
  for (let styleTag of styleTags) {
//Get all text children
      for(let item of styleTag["children"]) {
        if(item.type == "Text") {
          cssTexts += "\n" + item["content"].trim()
      }}
  }
  let mainCss = []
  let rules = cssTexts.match(/[\s\S]+?{[\s\S]*?}/g)||[]
//Repeat with each css rule
  for(let i=0;i<rules.length;i++) {
    let rule = rules[i]
    if(!/^\s*(\.?[\w\-]+?|\*)\s*\{(\s*[\w\-]+\s*:\s*[^\n]+?\s*;)*?\s*([\w\-]+\s*:\s*[^\n]+\s*;?)?\s*\}/.test(rule)){
      throw new Error(`Invalid CSS Rule\n${rule.trim()}`)
      break
    }
//Set rules into the mainCss JSON
    let selector = rule.match(/\.?[\w\-]+|\*/)[0]
    mainCss[i]={"selector":selector,css:{}}
    rule.match(/\{([\s\S]*)\}/)[1].split(";").map(e=>e.trim()).filter(e=>e).forEach(e=> {
    mainCss[i]["css"][e.split(/:/)[0].trim()] = e.substring(e.indexOf(':')+1).trim()
})}
//Compile widget
  await compile(widgetBody)
//Run code and set output of function
  if(debug == true){console.log(code)}
  let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
  let runCode = new AsyncFunction(code + "\nreturn widget")
  return await runCode()
  
  //Compile function
  async function compile(tag) {
//Do nothing when compile normal text or css
    if(tag.type == "Text" || tag.tagName == "style"){return}
//Start to compile
    if(tag["tagName"] == "widget" && !code) {
      code = "let widget = new ListWidget()"
//Repeat and set each attribute
      let availableCss = ["*","widget"]
      let attributeCss = {}
      for(let key of Object.keys(tag["attributes"])){
        let value = tag["attributes"][key].trim()
        if(!validAttributes["widget"].includes(key)) {
          throw new Error(`Unknown Attribute ${key} On ${tag["tagName"]} Element`)
        }
        if(key == "class"){
          value = value.trim().split(" ")
          for(let item of value) {
            availableCss.push("."+item)
          }
        }else{
          attributeCss[key] = value
        }
      }
        await applyCss("widget","widget",availableCss,attributeCss)
//Compile all children
      for(let item of tag["children"]) {
        currentStack = "widget"
        await compile(item)
      }
      return
    }
//Compile for stack
    if(tag["tagName"] == "stack") {
      stackNumber++
      code += `\nlet stack${stackNumber} = ${currentStack}.addStack()`
      let availableCss = ["*","stack"]
      let attributeCss = {}
      for(let key of Object.keys(tag["attributes"])){
        let value = tag["attributes"][key].trim()
        if(!validAttributes["stack"].includes(key)) {
          throw new Error(`Unknown Attribute ${key} On ${tag["tagName"]} Element`)
        }
        if(key == "class"){
          value = value.trim().split(" ")
          for(let item of value) {
            availableCss.push("."+item)
          }
        }else{
          attributeCss[key] = value
        }
      }
        await applyCss("stack","stack"+stackNumber,availableCss,attributeCss)
//Compile stack children
      let temp =  "stack" + stackNumber
      for(let item of tag["children"]) {
        currentStack = temp
        compile(item)
      }
      return
    }
//Compile for symbol
    if(tag["tagName"] == "symbol") {
      symbolNumber ++
      code += `\nlet symbol${symbolNumber} = ${currentStack}.addImage(SFSymbol.named("${tag["attributes"]["named"]?tag["attributes"]["named"]:"questionmark.circle"}").image)`
      let availableCss = ["*","symbol"]
      let attributeCss = {}
      for(let key of Object.keys(tag["attributes"])){
        let value = tag["attributes"][key].trim()
        if(!validAttributes["symbol"].includes(key)) {
          throw new Error(`Unknown Attribute ${key} On ${tag["tagName"]} Element`)
        }
        if(key == "class"){
          value = value.trim().split(" ")
          for(let item of value) {
            availableCss.push("."+item)
          }
        } else if(key != "named"){
          attributeCss[key] = value
        }
      }
      await applyCss("symbol","symbol"+symbolNumber,availableCss,attributeCss)
      return
    }
//Compile for symbol and img because they have the same attributes
    if(tag["tagName"] == "img") {
      imageNumber++
      if(!tag["attributes"]["src"]){throw new Error("img Element Must Have A src Attribute")}
        if(tag["attributes"]["src"].trim().startsWith("data:image/")) {
          let base = tag["attributes"]["src"].trim()
          base = base.replace("data:image/png;base64,","").replace("data:image/jpeg;base64,","")
          code += `\nlet image${imageNumber} = ${currentStack}.addImage(Image.fromData(Data.fromBase64String("${base.replace(/"/g,"")}")))`
        } else {
          code += `\nlet image${imageNumber} = ${currentStack}.addImage(await new Request("${tag["attributes"]["src"].replace(/"/g,"")}").loadImage())`
        }
      let availableCss = ["*","img"]
      let attributeCss = {}
      for(let key of Object.keys(tag["attributes"])){
        let value = tag["attributes"][key].trim()
        if(!validAttributes["img"].includes(key)) {
          throw new Error(`Unknown Attribute ${key} On ${tag["tagName"]} Element`)
        }
        if(key == "class"){
          value = value.trim().split(" ")
          for(let item of value) {
            availableCss.push("."+item)
          }
        } else if(key != "src"){
          attributeCss[key] = value
        }
      }
      await applyCss("img","image"+imageNumber,availableCss,attributeCss)
      return
    }
//Compile for text
    if(tag["tagName"] == "text") {
      textNumber++
      let textArray = []
//Get all text children
      for(let item of tag["children"]) {
        if(item.type == "Text") {
          textArray.push(item["content"].trim())
      }}
      code += `\nlet text${textNumber} = ${currentStack}.addText("${textArray.join(" ").replace(/"/g,"").replace(/&lt;/g, "<").replace(/&gt/g, ">").replace(/&amp;/g, "&").replace(/\n\s+/g, "\\n")}")`
      let availableCss = ["*","text"]
      let attributeCss = {}
      for(let key of Object.keys(tag["attributes"])){
        let value = tag["attributes"][key].trim()
        if(!validAttributes["text"].includes(key)) {
          throw new Error(`Unknown Attribute ${key} On ${tag["tagName"]} Element`)
        }
        if(key == "class"){
          value = value.trim().split(" ")
          for(let item of value) {
            availableCss.push("."+item)
          }
        } else {
          attributeCss[key] = value
        }
      }
      await applyCss("text","text"+textNumber,availableCss,attributeCss)
      return
    }
//Compile for date
    if(tag["tagName"] == "date") {
      dateNumber++
      let dateArray = []
//Get all text children
      for(let item of tag["children"]) {
        if(item.type == "Text") {
          dateArray.push(item["content"].trim())
        }
      }
      code += `\nlet date${dateNumber} = ${currentStack}.addDate(new Date("${dateArray.join("").replace(/"/g,"").replace(/&lt;/g, "<").replace(/&gt/g, ">").replace(/&amp;/g, "&").replace(/\n\s+/g, "\\n").replace(/"/g,"")}"))`
      let availableCss = ["*","date"]
      let attributeCss = {}
      for(let key of Object.keys(tag["attributes"])){
        let value = tag["attributes"][key].trim()
        if(!validAttributes["date"].includes(key)) {
          throw new Error(`Unknown Attribute ${key} On ${tag["tagName"]} Element`)
        }
        if(key == "class"){
          value = value.trim().split(" ")
          for(let item of value) {
            availableCss.push("."+item)
          }
        } else {
          attributeCss[key] = value
        }
      }
      await applyCss("date","date"+dateNumber,availableCss,attributeCss)
      return
    }
//Compile for hr
if(tag["tagName"] == "hr") {
      hrNumber++
      code += `\nlet hr${hrNumber} = ${currentStack}.addStack()\nhr${hrNumber}.addSpacer()\nlet hrImage${hrNumber} = hr${hrNumber}.addImage(Image.fromData(Data.fromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=")))\nhrImage${hrNumber}.imageSize = new Size(1,1)\nhr${hrNumber}.addSpacer()\nhr${hrNumber}.backgroundColor = Color.dynamic(Color.black(), Color.white())`
      let availableCss = ["*","hr"]
      let attributeCss = {}
      for(let key of Object.keys(tag["attributes"])){
        let value = tag["attributes"][key].trim()
        if(!validAttributes["hr"].includes(key)) {
          throw new Error(`Unknown Attribute ${key} On ${tag["tagName"]} Element`)
        }
        if(key == "class"){
          value = value.trim().split(" ")
          for(let item of value) {
            availableCss.push("."+item)
          }
        } else {
          attributeCss[key] = value
        }
      }
      await applyCss("hr","hr"+hrNumber,availableCss,attributeCss)
      return
    }
//Compile for spacer
    if(tag["tagName"] == "spacer") {
    code += `\n${currentStack}.addSpacer(${/\d+/.exec(tag["attributes"]["space"])?/\d+/.exec(tag["attributes"]["space"]):""})`
    return
}
//Raise error if there is a nestled widget tag or unknown tag
    if(tag["tagName"] == "widget"){ 
      throw new Error("widget Element Must Not Be Nestled")
    } else {
      throw new Error("Invalid Tag Name:" + tag["tagName"]) 
    }
  }

async function applyCss(tag,on,availableCss,attributeCss) {
  let finalCss = {}
  for(let rule of mainCss) {
    if(availableCss.includes(rule["selector"])){
      for(let key of Object.keys(rule["css"])) {
        if(validAttributes[tag].includes(key)) {
          finalCss[key] = rule["css"][key]
        }
      }
    }
  }
  for (let key of Object.keys(attributeCss)){
    finalCss[key] = attributeCss[key]
  }
  for(let key of Object.keys(finalCss)) {
    let value = finalCss[key]
    switch(key) {
      case "background-color":
        await colour(tag, "background-color", value, on)
      break
      case "background-gradient":
        await gradient(tag, value, on)
      break
      case "background-image":
        bgImage(value, on)
      break
      case "refresh-after-date":
        posInt(tag, key, value, on)
      break
      case "spacing":
        posInt(tag, key, value, on)
      break
      case "url":
        code += `\n${on}.url = "${value.replace(/"/g,"")}"`
      break
      case "padding":
        padding(tag, value, on)
       break
      case "border-color":
        await colour(tag, key, value, on)
      break
      case "border-width":
        posInt(tag, key, value, on)
      break
      case "corner-radius":
        posInt(tag, key, value, on)
      break
      case "size":
        size(tag, key, value, on)
      break
      case "bottom-align-content":
        if(value == true) {
          code += `\n${on}.bottomAlignContent()`
        }
      break
      case "center-align-content":
        if(value == true) {
          code += `\n${on}.centerAlignContent()`
        }
      break
      case "top-align-content":
        if(value == true) {
          code += `\n${on}.topAlignContent()`
        }
      break
      case "layout-horizontally":
        if(value == true) {
          if(tag !== "hr") {
            code += `\n${on}.layoutHorizontally()`
          } else {
            code += `\nhr${on.exec(/\d+/)}.layoutHorizontally()\nhrImage${on.exec(/\d+/)}.imageSize = new Size(1,${finalCss[width]?finalCss[width]:1})`
          }
        }
      break
      case "layout-vertically":
        if(value == true) {
          if(tag !== "hr") {
            code += `\n${on}.layoutVertically()`
          } else {
            code += `\nhr${on.exec(/\d+/)}.layoutVertically()\nhrImage${on.exec(/\d+/)}.imageSize = new Size(${finalCss[width]?finalCss[width]:1},1)`
          }
        }
      break
      case "container-relative-shape":
        if(value == true) {
          code += `\n${on}.containerRelativeShape = true`
        }
      break
      case "corner-radius":
        posInt(tag, key, value, on)
      break
      case "image-opacity":
        decimal(tag, key, value, on)
      break
      case "image-size":
        size(tag, key, value, on)
      break
      case "resizable":
        if(value == true) {
          code += `\n${on}.resizable = false`
        }
      break
      case "tint-color":
        await colour(tag, key, value, on)
      break
      case "apply-filling-content-mode":
        if(value == true) {
          code += `\n${on}.applyFillingContentMode()`
        }
      break
      case "apply-fitting-content-mode":
        if(value == true) {
          code += `\n${on}.applyFittingContentMode()`
        }
      break
      case "center-align-image":
        if(value == true) {
          code += `\n${on}.centerAlignImage()`
        }
      break
      case "left-align-image":
        if(value == true) {
          code += `\n${on}.leftAlignImage()`
        }
      break
      case "right-align-image":
        if(value == true) {
          code += `\n${on}.rightAlignImage()`
        }
      break
      case "font":
        font(tag, value, on)
      break
      case "line-limit":
        posInt(tag, key, value, on)
      break
      case "minimum-scale-factor":
        decimal(tag, key, value, on)
      break
      case "shadow-color":
        await colour(tag, key, value, on)
      break
      case "shadow-offset":
        shadowOffset(tag, value, on)
      break
      case "shadow-radius":
        posInt(tag, key, value, on)
      break
      case "text-color":
        await colour(tag, key, value, on)
      break
      case "text-opacity":
        decimal(tag, key, value, on)
      break
      case "center-align-text":
        if(value == true) {
          code += `\n${on}.centerAlignText()`
        }
      break
      case "left-align-text":
        if(value == true) {
          code += `\n${on}.leftAlignText()`
        }
      break
      case "right-align-text":
        if(value == true) {
          code += `\n${on}.rightAlignText()`
        }
      break
      case "apply-date-style":
        if(value == true) {
          code += `\n${on}.applyDateStyle()`
        }
      break
      case "apply-offset-style":
        if(value == true) {
          code += `\n${on}.applyOffsetStyle()`
        }
      break
      case "apply-relative-style":
        if(value == true) {
          code += `\n${on}.applyRelativeStyle()`
        }
      break
      case "apply-timer-style":
        if(value == true) {
          code += `\n${on}.applyTimerStyle()`
        }
      break
      case "apply-time-style":
        if(value == true) {
          code += `\n${on}.applyTimeStyle()`
        }
      break
      case "width":
        code += `\nhrImage${on.exec(/\d+/)}.imageSize = new Size(${(finalCss["layout-vertically"]==true)?`1,${value}`:`${value},1`})`
      break
    }
  }
}
//Other functions

// Get any html supported color
async function colorFromValue(c){
  let w = new WebView()
  await w.loadHTML(`<div id="div"style="color:${c}"></div>`)
  let result = await w.evaluateJavaScript('window.getComputedStyle(document.getElementById("div")).color')
  return rgbaToScriptable(...result.match(/\d+(\.\d+)?/g).map(e=>Number(e)))
  function rgbaToScriptable(r,g,b,a){
    r=r.toString(16)
    g=g.toString(16)
    b=b.toString(16)
    if(r.length==1){r="0"+r}
    if(g.length==1){g="0"+g}
    if(b.length==1){b="0"+b}
    if(a){
      if(a.length==1){a=",0"+a}else{a=","+a}
    } else {
      a=""
    }
      return `new Color("${"#"+r+g+b}"${a})`
  }
}

//Adding a colour
async function colour(tag,attribute,value,on) {
  colours = value.split("-")
  code+= `\n${on}.${attribute.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())} = ${colours.length == 2 ? "Color.dynamic("+await colorFromValue(colours[0])+","+await colorFromValue(colours[1])+")":await colorFromValue(colours[0])}`
}

//Adding a positive integer
function posInt(tag,attribute,value,on) {
  if(!/^\s*\d+\s*$/.test(value)) {
    throw new Error(`${attribute} Attribute On ${tag} Element Must Be A Positive Integer`)
  }
  if(attribute == "refresh-after-date") {
    code += `\nlet date = new Date()\ndate.setMinutes(date.getMinutes() + ${/\d+/.exec(value)})\nwidget.refreshAfterDate = date`
  } else {
    code += `\n${on}.${attribute.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())} = ${/\d+/.exec(value)}`
  }
}

//Adding a decimal
function decimal(tag,attribute,value,on) {
  if(!/^\s*\d*(?:\.\d*)?%?\s*$/.test(value)&&/^\s*\d*(?:\.\d*)?%?\s*$/.exec(value)!== ".") {
    throw new Error(`${attribute} Attribute On ${tag} Element Must Be A Positive Integer Or Float With An Optional  "%" At The End`)
  }
  value = /\d*(?:\.\d*)?%?/.exec(value)[0]
  if(value.endsWith("%")){
     value = Number(value.replace("%",""))
     value /= 100
   }
   code += `\n${on}.${attribute.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())} = ${value}`
}
//Adding a gradient
async function gradient(tag,value,on) {
    value = value.split(/,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/).map(e=>e.trim())
    let regex = /^(to bottom left|to bottom right|to top left|to top right|to top|to bottom|to right|to left)/
    let direction = "to bottom"
    if(regex.test(value[0])) {
      direction = value.shift().match(regex)[1]
    }
    direction = {"to left":["new Point(1, 0)","new Point(0, 0)"],
"to right": ["new Point(0, 1)","new Point(1, 1)"],
"to top": ["new Point(1, 1)","new Point(1, 0)"],
"to bottom": ["new Point(0, 0)","new Point(0, 1)"],
"to top left": ["new Point(1, 1)","new Point(0, 0)"],
"to top right": ["new Point(0, 1)","new Point(1, 0)"],
"to bottom left": ["new Point(1, 0)","new Point(0, 1)"],
"to bottom right": ["new Point(0, 0)","new Point(1, 1)"],
}[direction]
    let colors = []
    for (let color of value) {
      color = color.split("-")
      colors.push(
        color.length == 2 ? "Color.dynamic("+await colorFromValue(color[0])+","+await colorFromValue(color[1])+")":await colorFromValue(color[0])
      )
    }
      let gradientLocations=[]
      for(let i = 0, l = colors.length; i < l; i++) {
        gradientLocations.push(i/(l-1))
       }
       gradientNumber++
       code+=`\nlet gradient${gradientNumber} = new LinearGradient()\ngradient${gradientNumber}.colors = [${colors}]\ngradient${gradientNumber}.locations= [${gradientLocations}]\ngradient${gradientNumber}.startPoint = ${direction[0]}\ngradient${gradientNumber}.endPoint = ${direction[1]}\n${on}.backgroundGradient = gradient${gradientNumber}`
}
//Adding padding
function padding(tag,value,on) {
  if(!/^\s*\d+((\s*,\s*\d+){3}|(\s*,\s*\d+))?\s*$/g.test(value)) {
    throw new Error(`padding Attribute On ${tag} Element Must Be 1, 2 Or 4 Positive Integers Separated By Commas`)
  }
    paddingArray = value.match(/\d+/g)
    if(paddingArray.length == 1) {
      paddingArray = [paddingArray[0], paddingArray[0], paddingArray[0], paddingArray[0]]
    } else if (paddingArray.length == 2) {
      paddingArray = [paddingArray[0], paddingArray[1], paddingArray[0], paddingArray[1]]
    }
       code += `\n${on}.setPadding(${paddingArray.join(",")})`
}
//Adding a background-image
function bgImage(value,on) {
  if(value.startsWith("data:image/")) {
     value = value.replace("data:image/png;base64,","").replace("data:image/jpeg;base64,","")
     code += `\n${on}.backgroundImage = Image.fromData(Data.fromBase64String("${value.replace(/"/g, "")}"))`
  } else {
    code += `\n${on}.backgroundImage = await new Request("${value.replace(/"/g, "")}").loadImage()`
  }
}
//Adding a size
function size(tag,attribute,value,on) {
  if(!/^\s*\d+\s*,\s*\d+\s*$/.test(value)) {
    throw new Error(`${attribute} Attribute On ${tag} Element Must Have 2 Positive Integers Separated By Commas`)
  }
  code += `\n${on}.${attribute.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())} = new Size(${value.match(/\d+/g)[0]},${value.match(/\d+/g)[1]})`
}
//Adding a font
function font(tag,value,on) {
  if(!/^\s*[^,]+,\s*\d+\s*$/.test(value)) {
    throw new Error(`font Attribute On ${tag} Element Must Have 1 font And 1 Positive Integer Separated By Commas`)
  }
  if(/^\s*(black|bold|medium|light|heavy|regular|semibold|thin|ultraLight)(MonospacedSystemFont|RoundedSystemFont|SystemFont)\s*,\s*\d+\s*$/.test(value)){
  code += `\n${on}.font = Font.${value.replace(/^\s*(black|bold|medium|light|heavy|regular|semibold|thin|ultraLight)(MonospacedSystemFont|RoundedSystemFont|SystemFont)\s*,\s*(\d+)\s*$/, "$1$2($3)")}`
} else {
          code += `\n${on}.font = new Font("${value.split(",")[0].replace(/"/g,"")}",${value.split(",")[1].match(/\d+/g)[0]})`
}}
//Adding a shadow offset
function shadowOffset(tag,value,on) {
  if(!/^\s*-?\d+\s*,\s*-?\d+\s*$/.test(value)){
            throw new Error(`shadow-offset Attribute On ${tag} Element Must Have 2 Integers Separated By Commas`)
          }
          code += `\n${on}.shadowOffset = new Point(${value.split(",")[0].match(/-?\d*/)[0]},${value.split(",")[1].match(/-?\d*/)[0]})`}
}
