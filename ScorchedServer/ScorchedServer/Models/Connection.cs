using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ScorchedServer.Models
{
  class Connection
  {
    public Subject<Message> Messages { get; private set; }
    public Player Player { get; private set; }

    private List<object> outputMsgs;

    public Connection(int id)
    {
      Messages = new Subject<Message>();

      var r = new Random();

      Player = new Player
      {
        id = id,
        color = "#" + r.Next(10).ToString() + r.Next(10).ToString() + r.Next(10).ToString(),
        pos = r.Next(800),
        health = r.Next(100)
      };

      outputMsgs = new List<object>();
    }

    public void SendMessage(object obj)
    {
      outputMsgs.Add(obj);
    }

    public IEnumerable<object> GetOutput()
    {
      var r = outputMsgs;
      outputMsgs = new List<object>();

      return r;
    }
  }
}
