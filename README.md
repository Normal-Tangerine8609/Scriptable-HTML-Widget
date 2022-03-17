# HTML Widget
![Logo](/images/logo.jpeg) 

HTML Widget allows you to create [Scriptable](https://scriptable.app/) widgets in HTML-like syntax. HTML Widget is easy to use and supports all widget features.

## Documentation

[Link](https://normal-tangerine8609.gitbook.io/html-widget/)

## Example

![Small Reddit Widget](/images/RedditWidget.jpeg)

```javascript

const htmlWidget = importModule("html-widget")
const symbol = importModule("html-widget-symbol")
const addons = {symbol}

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
      align-text: center;
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
  <stack align-content="center">
    <symbol>arrow.up.circle.fill</symbol>
    <spacer space="2">
    <text class="content">${ups}</text>
    <spacer>
    <symbol>star.circle.fill</symbol>
    <spacer space="2">
    <text class="content">${awards}</text>
    <spacer>
    <symbol>message.circle.fill</symbol>
    <spacer space="2">
    <text class="content">${comments}</text>
  </stack>
</widget>
`, true, addons)
Script.setWidget(widget)
widget.presentSmall()
Script.complete()
```

## Bugs and Feedback 

If you find any bugs please message me. My preferred mode of communication is Reddit but fell free to post the issues to this respiratory.
 
[u/Normal-Tangerine8609](https://www.reddit.com/user/Normal-Tangerine8609)

## Support

Thanks for the support of the [r/Scriptable](https://www.reddit.com/r/Scriptable/) community.

Thanks for [u/TheLongConIsGone](https://www.reddit.com/user/TheLongConIsGone) and [u/Glassounds](https://www.reddit.com/user/Glassounds) for answering some of my scriptable questions.

Thanks for [henryluki](https://github.com/henryluki), the creator of the  [HTML parser](https://github.com/henryluki/html-parser) used in the script.

Thanks for you visiting or trying out HTML Widget!
