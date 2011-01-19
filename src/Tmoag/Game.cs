﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Reactive;
using System.Web;
using System.Web.Script.Serialization;
using System.Runtime.CompilerServices;
using System.Concurrency;

namespace Tmoag
{
  public class Game
  {
    private int lastId = 0;
    private Dictionary<string, Connection> allConnections = new Dictionary<string, Connection>();
    private Subject<Connection> connectionJoins = new Subject<Connection>(Scheduler.CurrentThread);
    public Subject<Connection> Connections { get; private set; }

    private DateTime nextRoundBegin;

    public Game()
    {
      this.Connections = new Subject<Connection>();
      this.connectionJoins = this.Connections;

      ConnectionJoins();
      //QuitPlayers();
      GameUpdates();

      var qcs = from c in Connections
                from d in c.Disconnect
                select c;

      qcs.Subscribe(c =>
      {
        SendMessageToAll(new { type = "quitPlayer", playerId = c.Player.id });

        string key = null;

        foreach (var kv in allConnections)
          if (kv.Value == c)
            key = kv.Key;

        if (key != null)
          allConnections.Remove(key);
      });

      var frs = from c in connectionJoins
                from m in c.Messages
                where m is FireRequest
                select new { c = c, fr = m as FireRequest };

      frs.Subscribe(cfr =>
      {
        cfr.c.Player.barrelAngle = cfr.fr.Angle;
        cfr.c.Player.shoot(cfr.fr);
        SendMessageToAll(new { type = "aim", playerId = cfr.c.Player.id, angle = cfr.fr.Angle });
      });

      var ups = from c in connectionJoins
                from m in c.Messages
                where m is UpdatePlayer
                select new { c = c, up = m as UpdatePlayer };

      ups.Subscribe(cup =>
      {
        if (cup.up.Name != null)
          cup.c.Player.name = cup.up.Name;

        if (cup.up.Color != null)
          cup.c.Player.color = cup.up.Color;

        SendMessageToAll(new { type = "gameUpdate", state = new[] { new { type = "updatePlayer", player = cup.c.Player } } });
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
        allConnections.Add(conn.Player.id.ToString(), conn);

        var gameInitObj = new
        {
          type = "gameInit",
          nextRound = (nextRoundBegin - DateTime.Now).Milliseconds,
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
      int roundTime = 10;

      Observable.Interval(new TimeSpan(TimeSpan.TicksPerSecond * roundTime)).Subscribe(l =>
      {
        nextRoundBegin = DateTime.Now + new TimeSpan(TimeSpan.TicksPerSecond * roundTime);
        var state = new List<object>();

        var players = allConnections.Values.Select(c => c.Player);

        foreach (var p in players)
        {
          state.AddRange(p.getLastShotAndPlayerHit(players));

          p.clearLastShot();
        }


        SendMessageToAll(new { type = "gameUpdate", state = state });

        foreach (var p in players)
        {
          if (p.health <= 0)
            SendMessageToAll(new { type = "quitPlayer", playerId = p.id });
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
