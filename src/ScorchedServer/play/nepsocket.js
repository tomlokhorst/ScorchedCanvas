function NepSocket(url, polling) {
  var session = '';
  for ( var i = 0; i < 25; i++)
    session += '' + Math.floor(Math.random() * 10);

  this._open(url + '/' + session);
}

NepSocket.prototype = {
  queue : [],
  _url : "",
  _polling_delay : 500,
  _isOpen: false, // set to true when first reponse arrives, before first onmessage is fired

  _open : function(url) {
    this._url = url;
    var socket = this;
    // start the polling loop
    socket._ping();
  },

  send : function(msg) {
    //console.log('sending: ');
    //console.log(msg);
    this.queue.push(msg);
  },

  //executed when first reponse arrives, before first onmessage is fired
  onopen : function(msg) {
  },
  
  onmessage : function(msg) {
  },

  _ping : function() {
    // console.log("polling " + this._url);
    var _this = this;

    $.ajax({
      type: "POST",
      url: this._url + "?callback=?",
      data: { queue: JSON.stringify(this.queue) },
      dataType: "jsonp",
      // cache: false,
      success : function(datas) {
        if (!_this._isOpen)
        {
          _this._isOpen = true;
          _this.onopen();
        }
        // console.log("request complete");
        $.each(datas, function(i, data) {
          _this.onmessage(data);
        });
      },
      error : function(xhr, text, err) {
        console.log("error: " + text);
        _this.onerror(err);
      }
    });

    setTimeout(function() {
      _this._ping();
    }, _this._polling_delay);
    this.queue = [];
  }
};
