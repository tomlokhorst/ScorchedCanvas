using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Runtime.CompilerServices;

using Tmoag;

namespace ScorchedServer.Models
{
  public class Tmoag
  {
    private Game game;
    private Dictionary<string, TimeConnection> allConnections = new Dictionary<string, TimeConnection>();

    public Tmoag()
    {
      this.game = new Game();

      var second = TimeSpan.FromSeconds(1);
      Observable.Interval(second).Subscribe(l =>
      {
        var keys = new List<string>();

        foreach (var x in allConnections)
        {
          var time = x.Value.Time;
          var conn = x.Value.Conn;
          if ((DateTime.Now - time) > TimeSpan.FromSeconds(5))
          {
            keys.Add(x.Key);
            conn.Disconnect.OnNext(null);
            conn.Disconnect.OnCompleted();
          }
        }

        foreach (var key in keys)
          allConnections.Remove(key);
      });

      //var timer = new Timer(new TimerCallback(secondTick), null, second, second);
    }

    private void secondTick(object o)
    {
      var keys = new List<string>();

      foreach (var x in allConnections)
      {
        var time = x.Value.Time;
        var conn = x.Value.Conn;
        if ((DateTime.Now - time) > TimeSpan.FromSeconds(5))
        {
          keys.Add(x.Key);
          conn.Disconnect.OnNext(null);
          conn.Disconnect.OnCompleted();
        }
      }

      foreach (var key in keys)
        allConnections.Remove(key);
    }

    private int lastId = 0;

    [MethodImpl(MethodImplOptions.Synchronized)]
    public IEnumerable<object> HandleMessages(string session, IEnumerable<Message> msgs)
    {
      Connection conn;

      if (allConnections.ContainsKey(session))
      {
        var x = allConnections[session];
        x.Time = DateTime.Now;
        conn = x.Conn;
      }
      else
      {
        conn = new Connection(lastId++);

        // First notify other connections...
        game.Connections.OnNext(conn);
        // ...then add to allConnections (so newPlayer isn't send to own connection)
        allConnections.Add(session, new TimeConnection { Time = DateTime.Now, Conn = conn });
      }

      foreach (var msg in msgs)
        conn.Messages.OnNext(msg);

      return conn.GenerateOutput();
      //return game.HandleMessages(session, msgs);
    }

    class TimeConnection
    {
      public DateTime Time { get; set; }
      public Connection Conn { get; set; }
    }
  }
}