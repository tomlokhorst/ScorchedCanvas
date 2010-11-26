﻿using System;
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

      connections.Subscribe(c => {
        foreach (var co in connectionDictionary.Values)
        {
          co.SendMessage(new
          {
            type = "newPlayer",
            id = c.Id,
            color = c.Color,
            pos = c.Pos
          });
        }
      });
    }

    private object obj = new object();

    public object HandleMessages(string session, IEnumerable<Message> msgs)
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

          var gameInitObj = new { type = "gameInit", id = conn.Id, landscape = landscape.Take(800).ToArray(), players = players };

          conn.SendMessage(gameInitObj);

          connections.OnNext(conn);
          foreach (var msg in msgs)
            conn.Messages.OnNext(msg);
        }

        return new { type = "gameUpdate", state = connectionDictionary.Values.Select(c => c.GetOutput()).SelectMany(x => x) };

        //return handleMessages(msgs);
      }
    }

    private string handleMessages(IEnumerable<Message> msgs)
    {
      JavaScriptSerializer jss = new JavaScriptSerializer();

      var r = new Random();

      if (r.Next(16) == 0)
      {

        var obj = new { type = "gameInit", landscape = landscape.Take(800).ToArray() };

        return jss.Serialize(obj);
      }
      else if (r.Next(6) == 0)
      {

        var obj = new { type = "gameUpdate", state = new object[] { new { type = "fire", id = 1 }, new { type = "updatePlayer", id = 2, health = 90 } } };

        return jss.Serialize(obj);
      }
      else if (r.Next(6) == 0)
      {

        var obj = new { type = "joke" };

        return jss.Serialize(obj);
      }
      else
      {
        return null;
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

    
    private int[] landscape = {100 ,101 ,102 ,103 ,104 ,105 ,106 ,107 ,108 ,109 ,110 ,111 ,112 ,113 ,114 ,115 ,116 ,117 ,118 ,119 ,120 ,121 ,122 ,123 ,124 ,125 
                                ,126 ,127 ,128 ,129 ,130 ,131 ,132 ,133 ,134 ,135 ,136 ,137 ,138 ,139 ,140 ,141 ,142 ,143 ,144 ,145 ,146 ,147 ,148 ,149 ,150 ,150 
                                ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 
                                ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,150 ,149 ,148 ,147 
                                ,146 ,145 ,144 ,143 ,142 ,141 ,140 ,139 ,138 ,137 ,136 ,135 ,134 ,133 ,132 ,131 ,130 ,129 ,128 ,127 ,126 ,125 ,124 ,123 ,122 ,121 
                                ,120 ,119 ,118 ,117 ,116 ,115 ,114 ,113 ,112 ,111 ,110 ,109 ,108 ,107 ,106 ,105 ,104 ,103 ,102 ,101 ,100 ,99, 98, 97, 96, 95, 94, 
                                93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62,
                                61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 
                                48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 
                                48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 
                                48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 
                                48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 
                                48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 
                                48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 
                                66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 
                                98, 99, 100 ,101 ,102 ,103 ,104 ,105 ,106 ,107 ,108 ,109 ,110 ,111 ,112 ,113 ,114 ,115 ,116 ,117 ,118 ,119 ,120 ,121 ,122 ,123 
                                ,124 ,125 ,126 ,127 ,128,129 ,130 ,131 ,132 ,133 ,134 ,135 ,136 ,137 ,138 ,139 ,140 ,141 ,142 ,143 ,144 ,145 ,146 ,147 ,148 ,149 
                                ,150 ,151 ,152 ,153 ,154 ,155 ,156 ,157 ,158 ,159 ,160 ,161 ,162 ,163 ,164 ,165 ,166 ,167 ,168 ,169 ,170 ,171 ,172 ,173 ,174 ,175 
                                ,176 ,177 ,178 ,179 ,180 ,181 ,182 ,183 ,184 ,185 ,186 ,187 ,188 ,189 ,190 ,191 ,192 ,193 ,194 ,195 ,196 ,197 ,198 ,199 ,200 ,201 
                                ,202 ,203 ,204 ,205 ,206 ,207 ,208 ,209 ,210 ,211 ,212 ,213 ,214 ,215 ,216 ,217 ,218 ,219 ,220 ,221 ,222 ,223 ,224 ,225 ,226 ,227 
                                ,228 ,229 ,230 ,231 ,232 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 
                                ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 
                                ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 
                                ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 
                                ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 
                                ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 
                                ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 ,233 
                                ,233 ,233 ,233 ,233 ,233 ,233 ,233};
  }
}