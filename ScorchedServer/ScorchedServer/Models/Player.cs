﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing;

namespace ScorchedServer.Models
{
  public class Player
  {
    public int id { get; set; }
    public string name { get; set; }
    public Vector position { get; set; }
    public double pos { get; set; } // x position
    public string color { get; set; }
    public double health { get; set; }
    public int score { get; set; }
    public double angle { get; set; }

    private IEnumerable<Vector> lastShot;

    public Player()
    {
      angle = Convert.ToInt32(Math.PI / 2);
    }

    public void shoot(FireRequest fr)
    {
      lastShot = Shot.Trace(position, Vector.FromPolar(fr.angle, fr.power), Vector.FromCart(0, -0.01))
        .TakeWhile(v => (Convert.ToInt32(v.X) > Landscape.fakeLandscape.Length && Convert.ToInt32(v.X) >= 0) ? false : Convert.ToInt32(v.Y) >= Landscape.fakeLandscape[Convert.ToInt32(v.X)]);
    }

    internal object getLastShot()
    {
      if (lastShot == null)
        return null;
      else
      {
        var o = new { type = "fire", playerId = id, arc = lastShot.Select(v => new { x = v.X, y = v.Y }) };
        lastShot = null;
        return o;
      }
    }
  }
}