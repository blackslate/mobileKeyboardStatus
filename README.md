# Detect presence of on-screen keyboard on mobile device
On a touchscreen, tapping on an editable text field will bring up an on-screen keyboard, and this will change the amount of screen space available. Left untreated, this may hide key elements, or push a footer out of place.

On a laptop or desktop computer, opening an editable text field creates no such layout changes.

If you want to ensure that certain key items are visible even when a virtual keyboard is open, you need to detect when such a change occurs. You can then add a class to the `body` element, to change the layout to suit the presence of the keyboard.

* There is no perfect way of knowing that your code is running on a mobile device
* There are non-mobile devices that have touchscreens, and which may also have keyboards
* A focus element may not be editable
* `contentEditable` elements will open the on-screen keyboard
* The address bar may decide to reappear and take up essential screen space at the same time the virtual keyboard appears, squeezing the available space even more.

The solution that I have come up with relies on detecting a change in height of the window within a second of the keyboard focus changing. In my tests, this may give a false positive if the user is using a computer with a touchscreen and a keyboard and mouse, and uses the mouse first to (de-)select an editable element and then immediately changes the window height. If you find other false positives or negatives, either on a computer or a mobile device, please let me know.
## Use
Add the Keyboard class to your project, then use `keyboard.addEventListener(<event>, <listener function>)` to receive notification of events. Here are the events and the arguments for the callbacks:

* keyboardchange (&lt;"shown"|"hidden"&gt;, { width: &lt;integer width&gt;, height: &lt;integer height&gt; })
* resize ({ width: &lt;integer width&gt;, height: &lt;integer height&gt; }, &lt;"portrait"|"landscape"&gt;)
* focuschange (&lt;HTML element with focus|null&gt;, &lt;"NODENAME[type=xxx]"|""&gt; })
