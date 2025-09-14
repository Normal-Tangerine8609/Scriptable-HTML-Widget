# HTML Widget
![Logo](/images/logo.jpeg) 

HTML Widget allows you to create [Scriptable](https://scriptable.app/) widgets in HTML-like syntax. HTML Widget is easy to use and supports all widget features.

## Documentation

[Link](https://normal-tangerine8609.gitbook.io/html-widget/)

## Features

* Simplifies gradients: `to top left, #134E5E, #71B280`.
* Supports HSL, HSLA, RGB, RGBA, hex or CSS colour names like `red`.
* Style elemnts with a CSS-like syntax or attributes.
* Easily share styles between elements with classes.
* Use addons like `symbol` to simplify adding SFSymbols to widgets.

## Example

![Small Reddit Widget](/images/RedditWidget.jpeg)

```javascript
const htmlWidget = importModule("html-widget");
const symbol = importModule("html-widget-symbol");
const addons = { symbol };

const json = await new Request(
  "https://www.reddit.com/r/Showerthoughts.json"
).loadJSON();
const post = json.data.children[Math.floor(Math.random() * 10)].data;
const title = post.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
const body = post.selftext.replace(/</g, "&lt;").replace(/>/g, "&gt;");
const ups = post.ups;
const upsRatio = post.upvote_ratio;
const comments = post.num_comments;
const url = post.url;
const widget = await htmlWidget(
  `
<widget refresh-after-date="15" url="${url}">
  <style>
    symbol {
      image-size: 13,13;
    }
    text {
      font: system-ui, 11;
      minimum-scale-factor: 0.3;
    }
    .title {
      font: system-ui, 13;
      align-text: center;
    }
    .bottom-bar {
      align-content: center;
    }
    .bottom-bar > text {
      line-limit: 1
    }
  </style>
  <text class="title">Showerthoughts</text>
  <spacer space="5"/>
  <text>${title}</text>
  <text>${body}</text>
  <stack class="bottom-bar">
    <symbol>arrow.up.circle.fill</symbol>
    <spacer space="2"/>
    <text>${ups}</text>
    <spacer/>
    <symbol>star.circle.fill</symbol>
    <spacer space="2"/>
    <text>${upsRatio}</text>
    <spacer/>
    <symbol>message.circle.fill</symbol>
    <spacer space="2"/>
    <text>${comments}</text>
  </stack>
</widget>
`,
  true,
  addons
);
Script.setWidget(widget);
widget.presentSmall();
Script.complete();
```

## Module

If you would prefer to use a module instead of a function follow these steps:

1. Copy the file from the [html-widget.js](cody/html-widget.js) and paste it into a new Scriptable script 
2. Rename the script to `Scriptable-HTML-Widget`
3. Create a new script and paste `const htmlWidget = importModule("Scriptable-HTML-Widget")` at the top of the file
4. Start to create the widget as you would normally

## Bugs and Feedback 

If you find any bugs please message me. My preferred mode of communication is Reddit but fell free to post the issues to this respiratory.
 
[u/Normal-Tangerine8609](https://www.reddit.com/user/Normal-Tangerine8609)

## Support

Thanks for the support of the [r/Scriptable](https://www.reddit.com/r/Scriptable/) community.

Thanks for [u/TheLongConIsGone](https://www.reddit.com/user/TheLongConIsGone) and [u/Glassounds](https://www.reddit.com/user/Glassounds) for answering some of my scriptable questions.

Thanks for [henryluki](https://github.com/henryluki), the creator of the  [HTML parser](https://github.com/henryluki/html-parser) once used in the script.

Thanks for you visiting or trying out HTML Widget!
