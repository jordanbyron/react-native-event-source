react-native event source
=========================

Server-Sent Events for your React Native apps! Based on @neilco's
[EventSource](https://github.com/neilco/EventSource).

_NOTE_: This is my first time playing with Obj-C and the iOS ecosystem. If you
see something I'm doing that makes you go :frowning: please let me know. I
:heart: pull requests.

## Installing

First cd into your project's directory and grab the latest version of this code:

```bash
$ npm install react-native-event-source --save
```

In XCode add the library from
`node_modules/react-native-event-source/RNEventSource.xcodeproj` to your project
then add `libRNEventSource` to your project's __Build Phase__ > __Link Binary With
Libraries__ list.

![adding to XCode](http://brentvatne.ca/images/packaging/7-add-link.gif)

## Using in your javascript code

First, you'll need to make sure `DeviceEventEmitter` is added to the list of
requires for React.

```js
var React = require('react-native');
var {
  //....things you need plus....
  DeviceEventEmitter
} = React;

```

Next grab `RNEventSource` and assign it to a variable.

```js
var EventSource = require('NativeModules').RNEventSource;
```

Now you're ready to connect to your SSE endpoint and start streaming updates!
:godmode:
Use `DeviceEventEmitter` to listen for `EventSourceMessage` messages. You can
also subscribe to `EventSourceConnected` and `EventSourceError` to be notified
when your connection is established or encounters any errors.

```js
var subscription = DeviceEventEmitter.addListener(
  'EventSourceMessage', function(message) {
    console.log(message.event);
    console.log(message.data);
  });

EventSource.connectWithURL("http://your-sse-url.com/stream");
```

Here is a full example that subscribes to a SSE stream and writes the results to `console.log`

```js
var React = require('react-native');
var {
  AppRegistry,
  Text,
  View,
  DeviceEventEmitter,
} = React;

var EventSource = require('NativeModules').RNEventSource;

var MyFancyApp = React.createClass({
  getDefaultProps: function() {
    return {
      url: "http://your-sse-url.com/stream"
    };
  },
  componentDidMount: function() {
    var subscription = DeviceEventEmitter.addListener(
      'EventSourceMessage', function(message) {
        console.log(message.event);
      });

    EventSource.connectWithURL(this.props.url);
  },
  componentDidUmnount: function() {
    subscription.remove();
  },
  render: function() {
    return (<View><Text>SSE in React!</Text></View>)
  }
});
```

## License

See [EventSource](https://github.com/neilco/EventSource/blob/master/LICENSE.txt)
for additional license details.

Copyright (c) 2015 Jordan Byron (http://github.com/jordanbyron/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
