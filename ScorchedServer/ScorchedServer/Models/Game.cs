using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Reactive;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace ScorchedServer.Models
{
  public class Game
  {
    private Dictionary<string, Connection> allConnections = new Dictionary<string, Connection>();
    private Subject<Connection> connections = new Subject<Connection>();

    public Game()
    {
      var t = new Thread(new ThreadStart(startThread));
      t.Start();

      var r = new Random();

      connections.Subscribe(conn =>
      {
        var players = allConnections.Values.Select(co => co.Player);

        var gameInitObj = new
        {
          type = "gameInit",
          playerId = conn.Player.id,
          landscape = Landscape.fakeLandscape.Take(800).ToArray(),
          players = players
        };

        conn.SendMessage(gameInitObj);

        foreach (var c in allConnections.Values)
        {
          c.SendMessage(new { type = "newPlayer", player = conn.Player });
        }
      });

      Observable.Interval(new TimeSpan(TimeSpan.TicksPerSecond)).Subscribe(l =>
      {
        var ps = new List<Player>();
        var keys = new List<String>();

        foreach (var kv in allConnections)
        {
          var c = kv.Value;
          if ((DateTime.Now - c.LastCheckin) > new TimeSpan(TimeSpan.TicksPerSecond))
          {
            ps.Add(c.Player);
            keys.Add(kv.Key);
          }
        }

        foreach (var c in allConnections.Values)
          foreach (var p in ps)
            c.SendMessage(new { type = "quitPlayer", playerId = p.id });

        foreach (var k in keys)
          allConnections.Remove(k);
      });
    }

    private void startThread()
    {
      while (true)
      {
        int roundTime = 10000;
        int nextRound = 5000;

        Thread.Sleep(nextRound + roundTime);
        foreach (var conn in allConnections.Values)
          conn.SendMessage(new
          {
            type = "gameUpdate",
            state = new object[]{ },
            nextRound = nextRound,
            roundTime = roundTime
          });
      }
    }

    private object obj = new object();

    public IEnumerable<object> HandleMessages(string session, IEnumerable<Message> msgs)
    {
      lock (obj)
      {
        Connection conn;

        if (allConnections.ContainsKey(session))
        {
          conn = allConnections[session];
        }
        else
        {
          conn = new Connection(allConnections.Keys.Count);

          // First notify other connections...
          connections.OnNext(conn);
          // ...then add to allConnections (so newPlayer isn't send to own connection)
          allConnections.Add(session, conn);
        }

        foreach (var msg in msgs)
          conn.Messages.OnNext(msg);

        conn.LastCheckin = DateTime.Now;

        return conn.GetOutput();
      }
    }
  }
}