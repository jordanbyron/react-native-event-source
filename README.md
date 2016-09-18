react-native event source
=========================

Server-Sent Events for your React Native apps! Based on @neilco's
[EventSource](https://github.com/neilco/EventSource).

_NOTE_: This is my first time playing with Obj-C and the iOS ecosystem. If you
see something I'm doing that makes you go :frowning: please let me know. I
:heart: pull requests.

## Installing

Run the following command in your project's directory to grab the latest published version of this code:

```bash
$ npm install react-native-event-source --save
```

### Using in your project

```js
import RNEventSource from 'react-native-event-source'
```

Now you're ready to connect to your SSE endpoint and start streaming updates!
:godmode:

```js
const eventSource = new RNEventSource('https://my-sse.com/stream');

eventSource.addEventListener('message', (event) {
  console.log(event.type); // message
  console.log(event.data);
});
```

Here is a full example that subscribes to a SSE stream and writes the results to `console.log`

```js
// TODO Write an example, including eventSource.removeAllListeners();
```

## License

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
