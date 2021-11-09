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
  <text>Hello, world!</text>
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
 <text font="system-ui, 13" center-align-text>Showerthoughts</text>
  <spacer space="5">
  <text font="system-ui, 11" minimum-scale-factor="0.3">${title}</text>
  <text font="system-ui, 11" minimum-scale-factor="0.3">${body}</text>
  <stack center-align-content>
    <symbol named="arrow.up.circle.fill" image-size="11,11">
    <spacer space="2">
    <text font="system-ui, 11">${ups}</text>
    <spacer>
    <symbol named="star.circle.fill" image-size="11,11">
    <spacer space="2">
    <text font="system-ui, 11">${awards}</text>
    <spacer>
    <symbol named="message.circle.fill" image-size="11,11">
    <spacer space="2">
    <text font="system-ui, 11">${comments}</text>
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

***

### <widget\>

```html
<widget>
</widget>
```

All tags must be nestled in the `widget` element. There must be a parent `widget` element. The `widget` element defines the widget.

#### Attributes

**background-color**

Defines the background color. Value must be a hex or two hexes separated by commas. If there are two hexes, the first is the light mode colour and the second is the dark mode colour.

**background-image**

Defines the background image. Value must be a valid url leading to an image or a data url starting with `data:image/jpeg;base64,` or `data:image/png;base64,` and with the base encoded image following.

**padding**

Defines the widget padding. Value must be 1, 2 or 4 integers separated by commas. 1 integer sets all padding. 2 integers sets the top and bottom padding to the first integer and left and right padding to the second. 4 integers sets the top padding to the first integer, right padding to the second, bottom padding to the third and left padding to the fourth integer.

**refresh-after-date**

Defines the minimum refresh time for the widget in minutes.  Value must be an integer.

**spacing**

Defines the spacing between widget elements. Value must be an integer.

**url**

Defines the widget url. Value must be a valid url.

***

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

Defines the background color. Value must be a hex or two hexes separated by commas. If there are two hexes, the first is the light mode colour and the second is the dark mode colour.

**background-image**

Defines the background image. Value must be a valid url leading to an image or a data url starting with `data:image/jpeg;base64,` or `data:image/png;base64,` and with the base encoded image following.

**border-color**

Defines the border color. Value must be a hex or two hexes separated by commas. If there are two hexes, the first is the light mode colour and the second is the dark mode colour.

**border-width**

Defines the border width.  Value must be an integer.

**corner-radius**

Defines the corner radius.  Value must be an integer.

**padding**

Defines the widget padding. Value must be 1, 2 or 4 integers separated by commas. 1 integer sets all padding. 2 integers sets the top and bottom padding to the first integer and left and right padding to the second. 4 integers sets the top padding to the first integer, right padding to the second, bottom padding to the third and left padding to the fourth integer.

**size**

Defines the size of the stack.  Value must be two integers separated by commas. The first integer is the width and the second is the height.

**spacing**

Defines the spacing between widget elements. Value must be an integer.

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

***

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


***

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

Defines the border color. Value must be a hex or two hexes separated by commas. If there are two hexes, the first is the light mode colour and the second is the dark mode colour.

**border-width**

Defines the border width.  Value must be an integer.

**corner-radius**

Defines the corner radius.  Value must be an integer.

**image-opacity**

Defines the opacity of the image. Value can be a integer or float with an optional  `%` at the end.

**image-size**

Defines the size of the image.  Value must be two integers separated by commas. The first integer is the width and the second is the height.

**tint-color**

Defines the tint color. Value must be a hex or two hexes separated by commas. If there are two hexes, the first is the light mode colour and the second is the dark mode colour.

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

**right-align-content**

Boolean attribute right aligns image.

***

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

The `symbol` element has all the attributes of the `img` element except for the `src` attribute.

***

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

Defines the font family and size of the text. Value  must be a valid font name and then a integer separated by commas.

**line-limit**

Defines the maximum line limit.  Value must be an integer.

**minimum-scale-factor**

Defines the minimum scale factor. Value can be a integer or float with an optional  `%` at the end.

**shadow-color**

Defines the shadow color. Value must be a hex or two hexes separated by commas. If there are two hexes, the first is the light mode colour and the second is the dark mode colour.

**shadow-offset**

Defines the shadow offset. Value must be 2 integers separated by commas. The first integer is the x and the second is the y.

**shadow radius**

Defines the shadow radius. Value must be an integer.

**text-color**

Defines the text color. Value must be a hex or two hexes separated by commas. If there are two hexes, the first is the light mode colour and the second is the dark mode colour.

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

## Unsupported Features 
* Date widget element
* Background gradient
* Applying pre-set fonts (`Font.boldSystemFont(12)`)

## Bugs and Feedback 

If you find any bugs please message me. My preferred mode of communication is Reddit but fell free to poste the issues to this respiratory.
 
[u/Normal-Tangerine8609](https://www.reddit.com/user/Normal-Tangerine8609)

## Support

Thanks for the support of the [r/Scriptable](https://www.reddit.com/r/Scriptable/) community.

Thanks for [u/TheLongConIsGone](https://www.reddit.com/user/TheLongConIsGone) and [u/Glassounds](https://www.reddit.com/user/Glassounds) for answering some of my scriptable questions.

Thanks for [henryluki](https://github.com/henryluki), the creator of the  [HTML parser](https://github.com/henryluki/html-parser) used in the script.

Thanks for you visiting or trying out HTML Widget!
