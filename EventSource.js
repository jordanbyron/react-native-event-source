// EventSource.js
// Original implementation from
// https://github.com/remy/polyfills/blob/master/EventSource.js
//
// Copyright (c) 2010 Remy Sharp, http://remysharp.com

var reTrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;

var EventSource = function(url, options) {
  var eventsource = this,
    interval = 500, // polling interval
    lastEventId = null,
    lastIndexProcessed = 0,
    eventType;

  if (!url || typeof url != 'string') {
    throw new SyntaxError('Not enough arguments');
  }

  this.URL = url;
  this.OPTIONS = options;
  this.readyState = this.CONNECTING;
  this._pollTimer = null;
  this._xhr = null;

  function pollAgain(interval) {
    eventsource._pollTimer = setTimeout(function() {
      poll.call(eventsource);
    }, interval);
  }

  function poll() {
    try {
      // force hiding of the error message... insane?
      if (eventsource.readyState == eventsource.CLOSED) return;

      // NOTE: IE7 and upwards support
      var xhr = new XMLHttpRequest();
      xhr.open(eventsource.OPTIONS.method || 'GET', eventsource.URL, true);
      if (eventsource.OPTIONS && eventsource.OPTIONS.headers) {
        Object.keys(eventsource.OPTIONS.headers).forEach(key => {
          xhr.setRequestHeader(key, eventsource.OPTIONS.headers[key]);
        });
      }
      xhr.setRequestHeader('Accept', 'text/event-stream');
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      // we must make use of this on the server side if we're working with Android - because they don't trigger
      // readychange until the server connection is closed
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      if (lastEventId != null)
        xhr.setRequestHeader('Last-Event-ID', lastEventId);
      lastIndexProcessed = 0;

      xhr.timeout =
        this.OPTIONS && this.OPTIONS.timeout !== undefined
          ? this.OPTIONS.timeout
          : 50000;

      xhr.onreadystatechange = function() {
        if (
          this.readyState == 3 ||
          (this.readyState == 4 && this.status == 200)
        ) {
          // on success
          if (eventsource.readyState == eventsource.CONNECTING) {
            eventsource.readyState = eventsource.OPEN;
            eventsource.dispatchEvent('open', { type: 'open' });
          }

          var responseText = '';
          try {
            responseText = this.responseText || '';
          } catch (e) {}

          // process this.responseText
          var parts = responseText.substr(lastIndexProcessed).split('\n'),
            data = [],
            i = 0,
            retry = 0,
            line = '';
          lastIndexProcessed = responseText.lastIndexOf('\n\n') + 2;

          // TODO handle 'event' (for buffer name), retry
          for (; i < parts.length; i++) {
            line = parts[i].replace(reTrim, '');
            if (line.indexOf('event') == 0) {
              eventType = line.replace(/event:?\s*/, '');
            } else if (line.indexOf('retry') == 0) {
              retry = parseInt(line.replace(/retry:?\s*/, ''));
              if (!isNaN(retry)) {
                interval = retry;
              }
            } else if (line.indexOf('data') == 0) {
              data.push(line.replace(/data:?\s*/, ''));
            } else if (line.indexOf('id:') == 0) {
              lastEventId = line.replace(/id:?\s*/, '');
            } else if (line.indexOf('id') == 0) {
              // this resets the id
              lastEventId = null;
            } else if (line == '') {
              if (data.length) {
                var event = new MessageEvent(
                  data.join('\n'),
                  eventsource.url,
                  lastEventId,
                );
                eventsource.dispatchEvent(eventType || 'message', event);
                data = [];
                eventType = undefined;
              }
            }
          }

          if (this.readyState == 4) pollAgain(interval);

          // don't need to poll again, because we're long-loading
        } else if (eventsource.readyState !== eventsource.CLOSED) {
          if (this.readyState == 4) {
            // and some other status
            pollAgain(interval);
          } else if (this.readyState == 0) {
            // likely aborted
            pollAgain(interval);
          }
        }
      };

      xhr.onerror = function(e) {
        // dispatch error
        eventsource.readyState = eventsource.CONNECTING;

        eventsource.dispatchEvent('error', {
          type: 'error',
          message: this.responseText,
        });
      };

      if (eventsource.OPTIONS.body) {
        xhr.send(eventsource.OPTIONS.body);
      } else {
        xhr.send();
      }

      if (xhr.timeout > 0) {
        setTimeout(function() {
          if (true || xhr.readyState == 3) xhr.abort();
        }, xhr.timeout);
      }

      eventsource._xhr = xhr;
    } catch (e) {
      // in an attempt to silence the errors
      eventsource.dispatchEvent('error', { type: 'error', data: e.message }); // ???
    }
  }

  poll(); // init now
};

EventSource.prototype = {
  close: function() {
    // closes the connection - disabling the polling
    this.readyState = this.CLOSED;
    clearInterval(this._pollTimer);
    this._xhr.abort();
  },
  CONNECTING: 0,
  OPEN: 1,
  CLOSED: 2,
  dispatchEvent: function(type, event) {
    var handlers = this['_' + type + 'Handlers'];
    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(this, event);
      }
    }

    if (this['on' + type]) {
      this['on' + type].call(this, event);
    }
  },
  addEventListener: function(type, handler) {
    if (!this['_' + type + 'Handlers']) {
      this['_' + type + 'Handlers'] = [];
    }

    this['_' + type + 'Handlers'].push(handler);
  },
  removeEventListener: function(type, handler) {
    var handlers = this['_' + type + 'Handlers'];
    if (!handlers) {
      return;
    }
    for (var i = handlers.length - 1; i >= 0; --i) {
      if (handlers[i] === handler) {
        handlers.splice(i, 1);
        break;
      }
    }
  },
  onerror: null,
  onmessage: null,
  onopen: null,
  readyState: 0,
  URL: '',
};

var MessageEvent = function(data, origin, lastEventId) {
  this.data = data;
  this.origin = origin;
  this.lastEventId = lastEventId || '';
};

MessageEvent.prototype = {
  data: null,
  type: 'message',
  lastEventId: '',
  origin: '',
};

export default EventSource;
