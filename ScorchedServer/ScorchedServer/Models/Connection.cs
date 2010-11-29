﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Concurrency;
using ScorchedServer.Properties;

namespace ScorchedServer.Models
{
  class Connection
  {
    public Subject<Message> Messages { get; private set; }
    public Player Player { get; private set; }
    public DateTime LastCheckin { get; set; }

    public List<object> State = new List<object>();

    private List<object> outputMsgs;

    public Connection(int id)
    {
      Messages = new Subject<Message>();

      var r = new Random();

      int x = r.Next(760) + 20;
      var position = Vector.FromCart(Convert.ToDouble(x), Landscape.fakeLandscape[x]);
      var angle = computeOptimalAngle(position);

      Player = new Player
      {
        id = id,
        color = "#" + r.Next(10).ToString() + r.Next(10).ToString() + r.Next(10).ToString(),
        pos = x,
        angle = angle,
        barrelAngle = angle + Math.PI * .75,
        health = 1,
        position = position
      };

      LastCheckin = DateTime.Now;

      outputMsgs = new List<object>();
    }

    private double computeOptimalAngle(Vector v)
    {
      var rect = Rectangle.FromCenter(v, Settings.Default.tankWidth, Settings.Default.tankHeight);

      var dx = rect.CenterRight.X - rect.Center.X;
      var dy = Landscape.fakeLandscape[Convert.ToInt32(rect.CenterRight.X)] - rect.Center.Y;
      var alpha = Math.Atan2(dy, dx);

      dx = rect.Center.X - rect.CenterLeft.X;
      dy = rect.Center.Y - Landscape.fakeLandscape[Convert.ToInt32(rect.CenterLeft.X)];
      var beta = Math.Atan2(dy, dx);

      return (alpha + beta) / 2;
    }

    public void SendMessage(object obj)
    {
      outputMsgs.Add(obj);
    }

    public IEnumerable<object> GenerateOutput()
    {
      var r = outputMsgs;
      outputMsgs = new List<object>();

      return r;
    }
  }
}
