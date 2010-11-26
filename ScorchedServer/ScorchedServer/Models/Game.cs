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
    private Dictionary<string, Connection> connectionDictionary = new Dictionary<string, Connection>();
    private Subject<Connection> connections = new Subject<Connection>();
    private List<object> output = new List<object>();
    private int x;

    public Game()
    {
      var t = new Thread(new ThreadStart(startThread));
      t.Start();

      var r = new Random();

      connections.Subscribe(c =>
      {
        foreach (var co in connectionDictionary.Values)
        {
          co.SendMessage(new{
        type = "gameUpdate",
        state = new
          {
            type = "newPlayer",
            id = c.Id,
            color = c.Color,
            pos = c.Pos
          }
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

        if (connectionDictionary.ContainsKey(session))
        {
          conn = connectionDictionary[session];
        }
        else
        {
          conn = new Connection(connectionDictionary.Keys.Count);
          connectionDictionary.Add(session, conn);

          var players = connectionDictionary.Values.Select(c => new { id = c.Id, color = c.Color, pos = c.Pos });

          var gameInitObj = new { type = "gameInit", id = conn.Id, landscape = Landscape.fakeLandscape.Take(800).ToArray(), players = players };

          conn.SendMessage(gameInitObj);

          connections.OnNext(conn);
          foreach (var msg in msgs)
            conn.Messages.OnNext(msg);
        }

        return conn.GetOutput();

        //return handleMessages(msgs);
      }
    }

    private void startThread()
    {
      while (true)
      {
        x++;
        Thread.Sleep(2000);
      }
    }
  }
}