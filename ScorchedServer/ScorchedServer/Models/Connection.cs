using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ScorchedServer.Models
{
  class Connection
  {
    public Subject<Message> Messages { get; private set; }
    public int Id { get; private set; }

    public string Color;
    public int Pos;

    private List<object> outputMsgs;

    public Connection(int id)
    {
      Id = id;
      Messages = new Subject<Message>();

      var r = new Random();

      Color = "#" + r.Next(10).ToString() + r.Next(10).ToString() + r.Next(10).ToString();
      Pos = r.Next(800);

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
