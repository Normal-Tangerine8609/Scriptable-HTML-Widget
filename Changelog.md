# Changelog

## 5.03

- 21.9 KB
- Instead of an error being thrown, when a property is attempted to be aplied to a tag and it is not in the mapping, it will be ignored. Previously a error was raised, but that makes the `*`  selector practically useless. This also makes it possible to share classes through different tags
- An error text was fixed

## 5.02

- 21.9 KB
- Fixed a bug with the children of stack elements being forced on the widget not the stack
- Added commas to css selectors
- Added validation for the image type
- Improved validation for padding and url type

## 5.01

- 21.5 KB
- Improved error messages
- Logged code is now indented to show nestled tags
- Fixed an issue where you would need the addons paramater to run the function 
- Fixed some error messages to work with template tags 

## 5.00

- 21.1 KB
- Many improvements and bug fixes
- Errors display more information 
- Users can make tag templates
- Most tag boolean attributes change

## 4.1

* 17.9 KB
* Improvments for the posibility of adding more add-ons (mostly those that use a canvas/DrawContext)
* Improvements to other aspects of add-ons
* Fixed a bug that would create an impropor css/attribute order

## 4.0

* 17.6 KB (html-widget.min.js file)
* Removed `symbol` and `hr` tag from normal script
* Now allows custom tags (also called add-ons)
* `symbol` and `hr` custom tag syntax can be found in their separate modules. All base tags and add-ons combined in the same code can be found in the [html-widget-expanded.js](https://github.com/Normal-Tangerine8609/Scriptable-HTML-Widget/blob/main/code/html-widget-expanded.js) file.
* `symbol` `named` attribute changes to inner text 

## 3.10

* 17.2 KB
* Fixed error messages to encompass properties as well as the attributes
* Fixed boolean attributes and css boolean properties
* Comments are now parsed into the debug code
* Added support for pre-set fonts based on its contents like `caption1`
* Added support for the `use-default-padding` attribute
* Added degree directions and colour locations to the `background-gradient` attribute

## 3.00

* 16 KB
* Fixed image opacity
* Added the `style` tag witch allows setting default styles for tags with css
* Added the `class` attribute

## 2.10

* 14.2 KB
* Removed loging of text when setting a gradient
* Colours have now changed to support all HTML colours including hsl, hsla, rgb, rgba, hex and css colour names like `red`
* Light mode/ dark mode colours have changed to be separated by hyphens instead of commas and do not need to go in brackets when in a gradient

## 2.00

* 14.7 KB
* Fixed a bug preventing line breaks in the text tag
* Removed logged text when making a gradient
* Gradients now support css directions (`to left`)
* Added a `hr` element
* Added a `date` element

## 1.11

* 11.3 KB
* Fixed URL setting on text

## 1.10

* 11.3 KB
* Added in pre-set fonts such as `lightRoundedSystemFont`

## 1.02

* 10.9 KB
* Fixed issue with stacks nestled in stacks

## 1.01

* 10.9 KB
* Fixed alpha values when they were not specified in a hex

## 1.00

* 10.9 KB
* First release of HTML Widget
