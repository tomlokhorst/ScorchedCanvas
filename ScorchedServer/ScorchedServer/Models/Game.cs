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

      connections.Subscribe(c =>
      {
        var players = allConnections.Values.Select(co => co.Player);

        var gameInitObj = new
        {
          type = "gameInit",
          playerId = c.Player.id,
          landscape = Landscape.fakeLandscape.Take(800).ToArray(),
          players = players
        };

        c.SendMessage(gameInitObj);

        foreach (var co in allConnections.Values)
        {
          co.SendMessage(new
                {
                  type = "newPlayer",
                  player = c.Player
                });
        }
      });
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
          allConnections.Add(session, conn);

          connections.OnNext(conn);

          foreach (var msg in msgs)
            conn.Messages.OnNext(msg);
        }

        return conn.GetOutput();
      }
    }

    private void startThread()
    {
      while (true)
      {
        Thread.Sleep(10000);
        foreach (var conn in allConnections.Values)
          conn.SendMessage(new { type = "gameUpdate", nextRound = 5000 });
      }
    }
  }
}