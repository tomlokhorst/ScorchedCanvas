using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Reactive;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Runtime.CompilerServices;
using System.Concurrency;

namespace ScorchedServer.Models
{
  public class Game
  {
    private int lastId = 0;
    private Dictionary<string, Connection> allConnections = new Dictionary<string, Connection>();
    private Subject<Connection> connectionJoins = new Subject<Connection>(Scheduler.CurrentThread);

    public Game()
    {
      ConnectionJoins();
      QuitPlayers();
      GameUpdates();

      var frs = from c in connectionJoins
                from m in c.Messages
                where m is FireRequest
                select new { c = c, fr = m as FireRequest };

      frs.Subscribe(cfr => 
      {
        cfr.c.Player.shoot(cfr.fr);
        SendMessageToAll(new { type = "aim", playerId = cfr.c.Player.id, angle = cfr.fr.angle });
      });
    }

    private void SendMessageToAll(object msg)
    {
      foreach (var c in allConnections.Values)
        c.SendMessage(msg);
    }

    private void ConnectionJoins()
    {
      var r = new Random();
      connectionJoins.Subscribe(conn =>
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

        SendMessageToAll(new { type = "newPlayer", player = conn.Player });
      });
    }

    private void QuitPlayers()
    {
      Observable.Interval(new TimeSpan(TimeSpan.TicksPerSecond)).Subscribe(l =>
      {
        var ps = new List<Player>();
        var keys = new List<String>();

        foreach (var kv in allConnections)
        {
          var c = kv.Value;
          if ((DateTime.Now - c.LastCheckin) > new TimeSpan(TimeSpan.TicksPerSecond * 5))
          {
            ps.Add(c.Player);
            keys.Add(kv.Key);
          }
        }

        foreach (var p in ps)
          SendMessageToAll(new { type = "quitPlayer", playerId = p.id });

        foreach (var k in keys)
          allConnections.Remove(k);
      });
    }

    private void GameUpdates()
    {
      Observable.Interval(new TimeSpan(TimeSpan.TicksPerSecond * 10)).Subscribe(l =>
      {
        var state = new List<object>();

        foreach (var p in allConnections.Values.Select(c => c.Player))
        {
          var o = p.getLastShot();
          if (o != null)
            state.Add(o);
        }

        foreach (var conn in allConnections.Values)
        {
          conn.SendMessage(new
          {
            type = "gameUpdate",
            state = state
          });
        }
      });
    }

    private object obj = new object();

    [MethodImpl(MethodImplOptions.Synchronized)]
    public IEnumerable<object> HandleMessages(string session, IEnumerable<Message> msgs)
    {
      Connection conn;

      if (allConnections.ContainsKey(session))
      {
        conn = allConnections[session];
      }
      else
      {
        conn = new Connection(lastId++);

        // First notify other connections...
        connectionJoins.OnNext(conn);
        // ...then add to allConnections (so newPlayer isn't send to own connection)
        allConnections.Add(session, conn);
      }

      foreach (var msg in msgs)
        conn.Messages.OnNext(msg);

      conn.LastCheckin = DateTime.Now;

      return conn.GenerateOutput();
    }
  }
}