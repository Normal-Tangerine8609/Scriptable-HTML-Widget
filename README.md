# HTML Widget
![Logo](/images/logo.jpeg) 

HTML Widget allows you to create [Scriptable](https://scriptable.app/) widgets in HTML-like syntax. HTML Widget is easy to use and supports most widget features.

## The Function

```javascript
await htmlWidget(input: String, debug: Boolean): ListWidget
```

Provide the HTML string as the first parameter. The second parameter is optional and when `true` logs the compiled code.

```javascript
let widget = await htmlWidget(`
<widget>
  <text>Hello, World!</text>
</widget>
`)
widget.presentSmall()
```

## Getting Started

Visit one of the files from the [code](/code) folder. Copy the text and paste it into a new Scriptable script. You are ready to  create a widget.

## Example

![Small Reddit Widget](/images/RedditWidget.jpeg)

```javascript
let json = await new Request("https://www.reddit.com/r/Showerthoughts.json").loadJSON()
let post = json["data"]["children"][Math.floor((Math.random() * 10) + 2)]["data"]
let title = post["title"].replace(/</g,"&lt;").replace(/>/g,"&gt;")
let body = post["selftext"].replace(/</g,"&lt;").replace(/>/g,"&gt;")
let ups = post["ups"]
let awards = post["all_awardings"].length
let comments = post["num_comments"]
let url = post["url"]

let widget = await htmlWidget(`
<widget refresh-after-date="15" url="${url}">
  <style>
    symbol {
      image-size: 11,11;
    }
    .title {
      font: system-ui, 13;
      center-align-text: true;
    }
    .content {
      font: system-ui, 11;
      minimum-scale-factor: 0.3;
    }
  </style>
  <text class="title">Showerthoughts</text>
  <spacer space="5">
  <text class="content">${title}</text>
  <text class="content">${body}</text>
  <stack center-align-content>
    <symbol named="arrow.up.circle.fill">
    <spacer space="2">
    <text class="content">${ups}</text>
    <spacer>
    <symbol named="star.circle.fill">
    <spacer space="2">
    <text class="content">${awards}</text>
    <spacer>
    <symbol named="message.circle.fill">
    <spacer space="2">
    <text class="content">${comments}</text>
  </stack>
</widget>
`)
Script.setWidget(widget)
widget.presentSmall()
Script.complete()
```

## Documentation

* [<widget\>](#widget)
* [<stack\>](#stack)
* [<spacer\>](#spacer)
* [<img\>](#img)
* [<symbol\>](#symbol)
* [<text\>](#text)
* [<date\>](#date)
* [<hr\>](#hr)
*  [<style\>](#style)
* [Comment](#comment)
 
- - - -

### <widget\>

```html
<widget>
</widget>
```

All tags must be nestled in the `widget` element. There must be a parent `widget` element. The `widget` element defines the widget.

#### Attributes

**background-color**

Defines the background color. Value must be one or two HTML supported colours separated by hyphens. HTML supported colours include hsl, hsla, rgb, rgba, hex or css colour names like `red`. If there are two colours, the first is the light mode colour and the second is the dark mode colour.

**background-gradient**

Defines the background gradient. Value must be one or more HTML supported colour or group of light mode/dark mode colours separated by commas. Light mode/dark mode colour groups are created by splitting the light and dark colour by a hyphen with the light colour as the first colour. Example: `red, white-black, blue`. HTML supported colours include hsl, hsla, rgb, rgba, hex or css colour names like `red`. The value can also have an optional direction as the first parameter. The options are `to top`, `to bottom`, `to right`, `to left`, `to top right`, `to top`, `to top left`, `to bottom right` and `to bottom left`. Example: `to top left, #ff00ff, rgb(0,255,0)-rgb(255,0,255), hsl(180, 50%,70%)`. The default gradient direction is `to bottom`.

**background-image**

Defines the background image. Value must be a valid url leading to an image or a data url starting with `data:image/jpeg;base64,` or `data:image/png;base64,` and with the base encoded image following.

**padding**

Defines the widget padding. Value must be 1, 2 or 4 positive integers separated by commas. 1 integer sets all padding. 2 integers sets the top and bottom padding to the first integer and left and right padding to the second. 4 integers sets the top padding to the first integer, left padding to the second, bottom padding to the third and right padding to the fourth integer.

**refresh-after-date**

Defines the minimum refresh time for the widget in minutes.  Value must be a positive integer.

**spacing**

Defines the spacing between widget elements. Value must be a positive  integer.

**url**

Defines the widget url. Value must be a valid url.

**class**

Defines one or more classes of the tag. Value must be one or more word characters including hyphens separated by spaces.

- - - -

### <stack\>

```html
<widget>
  <stack>
  </stack>
</widget>
```

The `stack`  element defines a widget stack element.

#### Attributes

**background-color**

Defines the background color. Value must be one or two HTML supported colours separated by hyphens. HTML supported colours include hsl, hsla, rgb, rgba, hex or css colour names like `red`. If there are two colours, the first is the light mode colour and the second is the dark mode colour.

**background-gradient**

Defines the background gradient. Value must be one or more HTML supported colour or group of light mode/dark mode colours separated by commas. Light mode/dark mode colour groups are created by splitting the light and dark colour by a hyphen with the light colour as the first colour. Example: `red, white-black, blue`. HTML supported colours include hsl, hsla, rgb, rgba, hex or css colour names like `red`. The value can also have an optional direction as the first parameter. The options are `to top`, `to bottom`, `to right`, `to left`, `to top right`, `to top`, `to top left`, `to bottom right` and `to bottom left`. Example: `to top left, #ff00ff, rgb(0,255,0)-rgb(255,0,255), hsl(180, 50%,70%)`. The default gradient direction is `to bottom`.

**background-image**

Defines the background image. Value must be a valid url leading to an image or a data url starting with `data:image/jpeg;base64,` or `data:image/png;base64,` and with the base encoded image following.

**border-color**

Defines the border color. Value must be one or two HTML supported colours separated by hyphens. HTML supported colours include hsl, hsla, rgb, rgba, hex or css colour names like `red`. If there are two colours, the first is the light mode colour and the second is the dark mode colour.

**border-width**

Defines the border width.  Value must be a positive integer.

**corner-radius**

Defines the corner radius.  Value must be a positive integer.

**padding**

Defines the widget padding. Value must be 1, 2 or 4 positive integers separated by commas. 1 integer sets all padding. 2 integers sets the top and bottom padding to the first integer and left and right padding to the second. 4 integers sets the top padding to the first integer, left padding to the second, bottom padding to the third and right padding to the fourth integer.

**size**

Defines the size of the stack.  Value must be two positive integers separated by commas. The first integer is the width and the second is the height.

**spacing**

Defines the spacing between widget elements. Value must be a positive integer.

**url**

Defines the stack url. Value must be a valid url.

**bottom-align-content**

Boolean attribute bottom aligns content in stack.

**center-align-content**

Boolean attribute center aligns content in stack.

**top-align-content**

Boolean attribute top aligns content in stack.

**layout-horizontally**

Boolean attribute lays out the stack horizontally.

**layout-vertically**

Boolean attribute lays out the stack vertically.

**class**

Defines one or more classes of the tag. Value must be one or more word characters including hyphens separated by spaces.

- - - -

### <spacer\>

```html
<widget>
  <spacer space="5">
</widget>
```

The `spacer` element defines a widget spacer element.

#### Attributes

**space**

Defines the space of the spacer. Value must be a valid integer. If the value is empty or not provided, the space automatically sizes.


- - - -

### <img\>

```html
<widget>
  <img src="https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/images/logo.jpeg">
</widget>
```

The `img` element defines a widget image element.

#### Attributes

**src**

Defines the image. All `img` elements must have a `src` attribute. Value must be a valid url leading to an image or a data url starting with `data:image/jpeg;base64,` or `data:image/png;base64,` and with the base encoded image following.

**border-color**

Defines the border color. Value must be one or two HTML supported colours separated by hyphens. HTML supported colours include hsl, hsla, rgb, rgba, hex or css colour names like `red`. If there are two colours, the first is the light mode colour and the second is the dark mode colour.

**border-width**

Defines the border width.  Value must be a  positive integer.

**corner-radius**

Defines the corner radius.  Value must be a positive integer.

**image-opacity**

Defines the opacity of the image. Value must be a positive integer or float with an optional  `%` at the end.

**image-size**

Defines the size of the image.  Value must be two positive integers separated by commas. The first integer is the width and the second is the height.

**tint-color**

Defines the tint color. Value must be one or two HTML supported colours separated by hyphens. HTML supported colours include hsl, hsla, rgb, rgba, hex or css colour names like `red`. If there are two colours, the first is the light mode colour and the second is the dark mode colour.

**url**

Defines the image url. Value must be a valid url.

**apply-filling-content-mode**

Boolean attribute applies filling content mode to image.

**apply-fitting-content-mode**

Boolean attribute applies fitting content mode to image.

**center-align-image**

Boolean attribute center aligns image.

**container-relative-shape**

Boolean attribute shapes the image to the container’s relative shape.

**left-align-image**

Boolean attribute left aligns image.

**resizable**

Boolean attribute does not allow image to be resizable.

**right-align-image**

Boolean attribute right aligns image.

**class**

Defines one or more classes of the tag. Value must be one or more word characters including hyphens separated by spaces.

- - - -

### <symbol\>

```html
<widget>
  <symbol named="">
</widget>
```

The `symbol` element defines a SF symbol that becomes a widget image element.

#### Attributes

**named**

Defines the name of the SF symbol. All `symbol` elements must have a `named` attribute. Value  must be a valid SF symbol name.

**border-color**

Defines the border color. Value must be one or two HTML supported colours separated by hyphens. HTML supported colours include hsl, hsla, rgb, rgba, hex or css colour names like `red`. If there are two colours, the first is the light mode colour and the second is the dark mode colour.

**border-width**

Defines the border width.  Value must be a  positive integer.

**corner-radius**

Defines the corner radius.  Value must be a positive integer.

**image-opacity**

Defines the opacity of the image. Value must be a positive integer or float with an optional  `%` at the end.

**image-size**

Defines the size of the symbol.  Value must be two positive integers separated by commas. The first integer is the width and the second is the height.

**tint-color**

Defines the tint color. Value must be one or two HTML supported colours separated by hyphens. HTML supported colours include hsl, hsla, rgb, rgba, hex or css colour names like `red`. If there are two colours, the first is the light mode colour and the second is the dark mode colour.

**url**

Defines the symbol url. Value must be a valid url.

**apply-filling-content-mode**

Boolean attribute applies filling content mode to symbol.

**apply-fitting-content-mode**

Boolean attribute applies fitting content mode to symbol.

**center-align-image**

Boolean attribute center aligns symbol.

**container-relative-shape**

Boolean attribute shapes the symbol to the container’s relative shape.

**left-align-image**

Boolean attribute left aligns symbol.

**resizable**

Boolean attribute does not allow symbol to be resizable.

**right-align-image**

Boolean attribute right aligns symbol.

**class**

Defines one or more classes of the tag. Value must be one or more word characters including hyphens separated by spaces.

- - - -

### <text\>

```html
<widget>
  <text>Hello, world!</text>
</widget>
```

The `text` element defines a widget text element.

#### Inner Text 

The `text` element can have any character as the inner text excluding `<` and `>` and trimming white space. `<` must be converted to the `&lt;` entity.  `>` must be converted to the `&gt;` entity.  `&` can optionally be converted to the `&amp;` entity. 

#### Attributes

**font**

Defines the font family and size of the text. Value must be a valid font name and then a positive integer separated by commas. The font name can also be a pre-set font such as `boldSystemFont`, `lightMonospacedSystemFont` or `regularRoundedSystemFont` but not `italicSystemFont` or  a font based on its content like `largeTitle`.

**line-limit**

Defines the maximum line limit.  Value must be a positive integer.

**minimum-scale-factor**

Defines the minimum scale factor. Value must be a integer or float with an optional  `%` at the end.

**shadow-color**

Defines the shadow color. Value must be one or two HTML supported colours separated by hyphens. HTML supported colours include hsl, hsla, rgb, rgba, hex or css colour names like `red`. If there are two colours, the first is the light mode colour and the second is the dark mode colour.

**shadow-offset**

Defines the shadow offset. Value must be 2 integers separated by commas. The first integer is the x and the second is the y.

**shadow radius**

Defines the shadow radius. Value must be a positive integer.

**text-color**

Defines the text color. Value must be one or two HTML supported colours separated by hyphens. HTML supported colours include hsl, hsla, rgb, rgba, hex or css colour names like `red`. If there are two colours, the first is the light mode colour and the second is the dark mode colour.

**text-opacity**

Defines the opacity of the text. Value can be a integer or float with an optional  `%` at the end.

**url**

Defines the text url. Value must be a valid url.

**center-align-text**

Boolean attribute center aligns the text.

**left-align-text**

Boolean attribute left aligns the text.

**right-align-text**

Boolean attribute right aligns the text.

**class**

Defines one or more classes of the tag. Value must be one or more word characters including hyphens separated by spaces.

- - - -

### <date\>

```html
<widget>
  <date>Thu Dec 23 2021 17:54:40 GMT-0500 (EST)</date>
</widget>
```

The `date` element defines a widget date element.

#### Inner Text 

The `date` element can have any character as the inner text excluding `<` and `>` and trimming white space. `<` must be converted to the `&lt;` entity.  `>` must be converted to the `&gt;` entity.  `&` can optionally be converted to the `&amp;` entity. The inner text should be a date defined by the `Date()` object. The inner text is the date that will be displayed.

#### Attributes

**font**

Defines the font family and size of the text. Value must be a valid font name and then a positive integer separated by commas. The font name can also be a pre-set font such as `boldSystemFont`, `lightMonospacedSystemFont` or `regularRoundedSystemFont` but not `italicSystemFont` or  a font based on its content like `largeTitle`.

**line-limit**

Defines the maximum line limit.  Value must be a positive integer.

**minimum-scale-factor**

Defines the minimum scale factor. Value must be a integer or float with an optional  `%` at the end.

**shadow-color**

Defines the shadow color. Value must be one or two HTML supported colours separated by hyphens. HTML supported colours include hsl, hsla, rgb, rgba, hex or css colour names like `red`. If there are two colours, the first is the light mode colour and the second is the dark mode colour.

**shadow-offset**

Defines the shadow offset. Value must be 2 integers separated by commas. The first integer is the x and the second is the y.

**shadow radius**

Defines the shadow radius. Value must be a positive integer.

**text-color**

Defines the text color. Value must be one or two HTML supported colours separated by hyphens. HTML supported colours include hsl, hsla, rgb, rgba, hex or css colour names like `red`. If there are two colours, the first is the light mode colour and the second is the dark mode colour.

**text-opacity**

Defines the opacity of the text. Value can be a integer or float with an optional  `%` at the end.

**url**

Defines the text url. Value must be a valid url.

**center-align-text**

Boolean attribute center aligns the text.

**left-align-text**

Boolean attribute left aligns the text.

**right-align-text**

Boolean attribute right aligns the text.

**apply-date-style**

Boolean attribute applies date style to the date.

**apply-offset-style**

Boolean attribute applies offset style to the date.

**apply-relative-style**

Boolean attribute applies relative style to the date.

**apply-timer-style**

Boolean attribute applies timer style to the date.

**apply-time-style**

Boolean attribute applies time style to the date.

**class**

Defines one or more classes of the tag. Value must be one or more word characters including hyphens separated by spaces.

- - - -

### <hr\>

```html
<widget>
  <hr>
</widget>
```

The `hr`  element defines a horizontal rule that is mimicked using a widget stack.

#### Attributes

**background-color**

Defines the background color. Value must be one or two HTML supported colours separated by hyphens. HTML supported colours include hsl, hsla, rgb, rgba, hex or css colour names like `red`. If there are two colours, the first is the light mode colour and the second is the dark mode colour.

**background-gradient**

Defines the background gradient. Value must be one or more HTML supported colour or group of light mode/dark mode colours separated by commas. Light mode/dark mode colour groups are created by splitting the light and dark colour by a hyphen with the light colour as the first colour. Example: `red, white-black, blue`. HTML supported colours include hsl, hsla, rgb, rgba, hex or css colour names like `red`. The value can also have an optional direction as the first parameter. The options are `to top`, `to bottom`, `to right`, `to left`, `to top right`, `to top`, `to top left`, `to bottom right` and `to bottom left`. Example: `to top left, #ff00ff, rgb(0,255,0)-rgb(255,0,255), hsl(180, 50%,70%)`. The default gradient direction is `to bottom`.

**corner-radius**

Defines the corner radius.  Value must be a positive integer.

**url**

Defines the stack url. Value must be a valid url.

**width**

Defines the width.  Value must be a positive integer.

**layout-horizontally**

Boolean attribute lays out the hr horizontally.

**layout-vertically**

Boolean attribute lays out the hr vertically.

**class**

Defines one or more classes of the tag. Value must be one or more word characters including hyphens separated by spaces.

- - - -

### <style\>

```html
<widget>
  <style>
    text {
      text-color: red;
    }
  </style>
  <text>Hello, World!</text>
</widget>
```

The `style` element defines default styles for tags.

#### Inner Text 

The inner text in the `style` tag is a simple css syntax, but not exactly the same as css. Properties are not inherited through elements.

The css consists of rules with the selector followed by curly brackets.

```css
selector {
}
```

Within the curly brackets are declarations. Each declaration is made up with a property and value with a colon between, and a semicolon between each declaration. The final declaration has an optional semicolon at the end.

```css
selector {
  property: value;
  property: value;
}
```

The valid properties for declarations include all of the attributes for all tags excluding `class`, `src`, `spacer` and `named`. The value must be the valid value of the given attribute/property. The value cannot have line breaks (\n) within itself. The value for boolean attributes must be `true`.

```css
text {
  text-color: red;
  minimum-scale-factor: 50%;
  center-align-text: true;
}
```

The style tag only supports the simplest css selectors including `*`, tag selectors (`date`) and class selectors (`.title`). Class names must only contain word and hyphen characters. The styles are cascading, meaning that the colour for `text` elements will be green in the following example. 

```css
text {
  text-color: red;
}
* {
  text-color: green;
}
```

- - - -

### Comment

```html
<!-- This is a comment -->
```

Comments can be created the same way you create comments in HTML. Text in between `<!--` and `-->` become a comment. Comments are not valid within `style` tags.

## Bugs and Feedback 

If you find any bugs please message me. My preferred mode of communication is Reddit but fell free to poste the issues to this respiratory.
 
[u/Normal-Tangerine8609](https://www.reddit.com/user/Normal-Tangerine8609)

## Support

Thanks for the support of the [r/Scriptable](https://www.reddit.com/r/Scriptable/) community.

Thanks for [u/TheLongConIsGone](https://www.reddit.com/user/TheLongConIsGone) and [u/Glassounds](https://www.reddit.com/user/Glassounds) for answering some of my scriptable questions.

Thanks for [henryluki](https://github.com/henryluki), the creator of the  [HTML parser](https://github.com/henryluki/html-parser) used in the script.

Thanks for you visiting or trying out HTML Widget!
