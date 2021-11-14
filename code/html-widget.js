//HTML Widget Version 1.11
//https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget
async function htmlWidget(input, debug){  
//https://github.com/henryluki/html-parser
//Minified using https://www.toptal.com/developers/javascript-minifier/
const STARTTAG_REX=/^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,ENDTAG_REX=/^<\/([-A-Za-z0-9_]+)[^>]*>/,ATTR_REX=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;function makeMap(t){return t.split(",").reduce((t,e)=>(t[e]=!0,t),{})}const EMPTY_MAKER=makeMap("symbol,img,spacer"),FILLATTRS_MAKER=makeMap("bottom-align-content,center-align-content,top-align-content,layout-vertically,layout-horizontally,container-relative-shape,resizable,apply-filling-content-mode,apply-fitting-content-mode,center-align-image,left-align-image,right-align-image,center-align-text,left-align-text,right-align-text");function isEmptyMaker(t){return!!EMPTY_MAKER[t]}function isFillattrsMaker(t){return!!FILLATTRS_MAKER[t]}class TagStart{constructor(t,e){this.name=t,this.attributes=this.getAttributes(e)}getAttributes(t){let e={};return t.replace(ATTR_REX,function(t,n){const a=Array.prototype.slice.call(arguments),r=a[2]?a[2]:a[3]?a[3]:a[4]?a[4]:isFillattrsMaker(n)?n:"";e[n]=r.replace(/(^|[^\\])"/g,'$1\\"')}),e}}class TagEmpty extends TagStart{constructor(t,e){super(t,e)}}class TagEnd{constructor(t){this.name=t}}class Text{constructor(t){this.text=t}}const ElEMENT_TYPE="Element",TEXT_TYPE="Text";function createElement(t){const e=t.name,n=t.attributes;return t instanceof TagEmpty?{type:ElEMENT_TYPE,tagName:e,attributes:n}:{type:ElEMENT_TYPE,tagName:e,attributes:n,children:[]}}function createText(t){const e=t.text;return{type:TEXT_TYPE,content:e}}function createNodeFactory(t,e){switch(t){case ElEMENT_TYPE:return createElement(e);case TEXT_TYPE:return createText(e)}}function parse(t){let e={tag:"root",children:[]},n=[e];n.last=(()=>n[n.length-1]);for(let e=0;e<t.length;e++){const a=t[e];if(a instanceof TagStart){const t=createNodeFactory(ElEMENT_TYPE,a);t.children?n.push(t):n.last().children.push(t)}else if(a instanceof TagEnd){let t=n[n.length-2],e=n.pop();t.children.push(e)}else a instanceof Text&&n.last().children.push(createNodeFactory(TEXT_TYPE,a))}return e}function tokenize(t){let e=t,n=[];const a=Date.now()+1e3;for(;e;){if(0===e.indexOf("\x3c!--")){const t=e.indexOf("--\x3e")+3;e=e.substring(t);continue}if(0===e.indexOf("</")){const t=e.match(ENDTAG_REX);if(!t)continue;e=e.substring(t[0].length);const a=t[1];if(isEmptyMaker(a))continue;n.push(new TagEnd(a));continue}if(0===e.indexOf("<")){const t=e.match(STARTTAG_REX);if(!t)continue;e=e.substring(t[0].length);const a=t[1],r=t[2],s=isEmptyMaker(a)?new TagEmpty(a,r):new TagStart(a,r);n.push(s);continue}const t=e.indexOf("<"),r=t<0?e:e.substring(0,t);if(e=t<0?"":e.substring(t),n.push(new Text(r)),Date.now()>=a)break}return n}function htmlParser(t){return parse(tokenize(t))}
//Set base variables
  let currentStack, stackNumber=-1, imageNumber=-1, textNumber=-1,gradientNumber=-1,code
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
          colour("widget", "background-color", value, "widget")
        break
        case "background-gradient":
          gradient("widget", value, "widget")
        break
        case "background-image":
          bgImage(value, "widget")
        break
        case "refresh-after-date":
          posInt("widget", key, value, "widget")
        break
        case "spacing":
          posInt("widget", key, value, "widget")
        break
        case "url":
          code += `\nwidget.url = "${value.replace(/"/g,"")}"`
        break
        case "padding":
          padding("widget", value, "widget")
        break
        default:
        throw new Error(`Unknown Attribute ${key} On ${tag["tagName"]} Element`)
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
          colour("stack", key, value, "stack" + stackNumber)
        break
        case "background-gradient":
          gradient("stack", value, "stack" + stackNumber)
        break
        case "background-image":
          bgImage(value, "widget")
        break
        case "border-color":
          colour("stack", key, value, "stack" + stackNumber)
        break
        case "border-width":
          posInt("stack", key, value, "stack" + stackNumber)
        break
        case "corner-radius":
          posInt("stack", key, value, "stack" + stackNumber)
        break
        case "size":
          size("stack", key, value, "stack" + stackNumber)
        break
        case "spacing":
          posInt("stack", key, value, "stack" + stackNumber)
        break
        case "url":
          code += `\nstack${stackNumber}.url = "${value.replace(/"/g,"")}"`
        break
        case "padding":
          padding("stack", value, "stack" + stackNumber)
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
        throw new Error(`Unknown Attribute ${key} On ${tag["tagName"]} Element`)
        break
        }}
      }
//Compile stack children
      let temp =  "stack" + stackNumber
      for(var item of tag["children"]) {
        currentStack = temp
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
      if(!tag["attributes"]["src"]){throw new Error("img Element Must Have A src Attribute")}
        if(tag["attributes"]["src"].trim().startsWith("data:image/")) {
          let base = tag["attributes"]["src"].trim()
          base = base.replace("data:image/png;base64,","").replace("data:image/jpeg;base64,","")
          code += `\nlet image${imageNumber} = ${currentStack}.addImage(Image.fromData(Data.fromBase64String("${base.replace(/"/g,"")}")))`
        } else {
          code += `\nlet image${imageNumber} = ${currentStack}.addImage(await new Request("${tag["attributes"]["src"].replace(/"/g,"")}").loadImage())`
        }
      }
      for(var key of Object.keys(tag["attributes"])){
        let value = tag["attributes"][key].trim()
        if(value){
        switch(key) {
        case "border-color":
          colour("img", key, value, "image" + imageNumber)
        break
        case "border-width":
          posInt("img", key, value, "image" + imageNumber)
        break
        case "container-relative-shape":
          code += `\nimage${imageNumber}.containerRelativeShape = true`
        break
        case "corner-radius":
          posInt("img", key, value, "image" + imageNumber)
        break
        case "image-opacity":
          decimal("text", key, value, "text" + textNumber)
        break
        case "image-size":
          size("img", key, value, "image" + imageNumber)
        break
        case "resizable":
          code += `\nimage${imageNumber}.resizable = false`
        break
        case "tint-color":
          colour("img", key, value, "image" + imageNumber)
        break
        case "url":
          code += `\nimage${imageNumber}.url = "${value.replace(/"/g,"")}"`
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
        throw new Error(`Unknown Attribute ${key} On ${tag["tagName"]} Element`)
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
      code += `\nlet text${textNumber} = ${currentStack}.addText("${textArray.join(" ").replace(/"/g,"").replace(/&lt;/g, "<").replace(/&gt/g, ">").replace(/&amp;/g, "&")}")`
for(var key of Object.keys(tag["attributes"])){
        let value = tag["attributes"][key].trim()
        if(value){
        switch(key) {
        case "font":
          if(!/^\s*[^,]+,\s*\d+\s*$/.test(value)) {
    throw new Error(`font Attribute On text Element Must Have 1 font And 1 Positive Integer Separated By Commas`)
  }
  if(/^\s*(black|bold|medium|light|heavy|regular|semibold|thin|ultraLight)(MonospacedSystemFont|RoundedSystemFont|SystemFont)\s*,\s*\d+\s*$/.test(value)){
  code += `\ntext${textNumber}.font = Font.${value.replace(/^\s*(black|bold|medium|light|heavy|regular|semibold|thin|ultraLight)(MonospacedSystemFont|RoundedSystemFont|SystemFont)\s*,\s*(\d+)\s*$/, "$1$2($3)")}`
} else {
          code += `\ntext${textNumber}.font = new Font("${value.split(",")[0].replace(/"/g,"")}",${value.split(",")[1].match(/\d+/g)[0]})`
}
        break
        case "line-limit":
          posInt("text", key, value, "text" + textNumber)
        break
        case "minimum-scale-factor":
          decimal("text", key, value, "text" + textNumber)
        break
        case "shadow-color":
          colour("text", key, value, "text" + textNumber)
        break
        case "shadow-offset":
          if(!/^\s*-?\d+\s*,\s*-?\d+\s*$/.test(value)){
            throw new Error(`shadow-offset Attribute On text Element Must Have 2 Integers Separated By Commas`)
          }
          code += `\ntext${textNumber}.shadowOffset = new Point(${value.split(",")[0].match(/-?\d*/)[0]},${value.split(",")[1].match(/-?\d*/)[0]})`
        break
        case "shadow-radius":
          posInt("text", key, value, "text" + textNumber)
        break
        case "text-color":
          colour("text", key, value, "text" + textNumber)
        break
        case "text-opacity":
          decimal("text", key, value, "text" + textNumber)
        break
        case "url":
          code += `\ntext${textNumber}.url = "${value.replace(/"/g,"")}"`
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
        throw new Error(`Unknown Attribute ${key} On ${tag["tagName"]} Element`)
        break
        }}
      }
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
//Finished compiling
//Run code and set output of function
  if(debug == true){console.log(code)}
  let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
  let runCode = new AsyncFunction(code + "\nreturn widget")
  return await runCode()

//Other functions

//Adding a colour
function colour(tag,attribute,value,on) {
  if(!/^\s*#([a-fA-F0-9]{3,4}){1,2}(\s*,\s*#([a-fA-F0-9]{34}){1,2})?\s*$/.test(value)) {
    throw new Error(`${attribute} Attribute On ${tag} Element Must Be 1 Or 2 Hexes Separated By Commas`)
  }
  let colours = value.match(/#([a-fA-F0-9]{3,4}){2}|#([a-fA-F0-9]{3,4}){1}/g).map( c => {
    let alpha
    if(c.length == 5) {
      alpha = parseInt(c[4]+c[4], 16)
      c = c.slice(0, -1)
    } else if(c.length == 9) {
      alpha = parseInt(c[5]+c[6], 16)
      c = c.slice(0, -2)
    } else {
      alpha = 255
    }
    return [c,alpha/255]
   })
  
  code+= `\n${on}.${attribute.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())} = ${colours.length == 2 ? `Color.dynamic(new Color("${colours[0][0]}",${colours[0][1]}),new Color("${colours[1][0]}",${colours[1][1]}))`:`new Color("${colours[0][0]}",${colours[0][1]})`}`
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
function gradient(tag,value,on) {
  if(!/(,|^)\s*\(\s*#([a-fA-F0-9]{3,4}){1,2}\s*,\s*#([a-fA-F0-9]{3,4}){1,2}\)|(,|^)\s*#([a-fA-F0-9]{3,4}){1,2}/g.test(value)) {
    throw new Error(`background-gradient Attribute On ${tag} Element Must Be 1 Or More Hexes Or Hexes Separated By Commas And In Brackets Separated By Commas`)
  }
    let colours = value.match(/(,|^)\s*\(\s*#([a-fA-F0-9]{3,4}){1,2}\s*,\s*#([a-fA-F0-9]{3,4}){1,2}\)|(,|^)\s*#([a-fA-F0-9]{3,4}){1,2}/g).map(e => 
{
    e = e.match(/#([a-fA-F0-9]{3,4}){1,2}/g).map(c => {
    let alpha
    if(c.length == 5) {
      alpha = parseInt(c[4]+c[4], 16)
      c = c.slice(0, -1)
    } else if(c.length == 9) {
      alpha = parseInt(c[5]+c[6], 16)
      c = c.slice(0, -2)
    } else {
      alpha = 255
    }
    return [c,alpha/255]
})
console.log(e)
    if(e.length == 2) {
      e = `Color.dynamic(new Color("${e[0][0]}",${e[0][1]}),new Color("${e[1][0]}",${e[1][1]}))`
     } else {
       e = `new Color("${e[0][0]}",${e[0][1]})`
     }
        return e
      })
      let gradientLocations=[]
      for(let i = 0, l = colours.length; i < l; i++) {
        gradientLocations.push(i/(l-1))
       }
       gradientNumber++
       code+=`\nlet gradient${gradientNumber} = new LinearGradient()\ngradient${gradientNumber}.colors = [${colours}]\ngradient${gradientNumber}.locations= [${gradientLocations}]\n${on}.backgroundGradient = gradient${gradientNumber}`
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
}
