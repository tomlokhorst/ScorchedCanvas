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
        public int pos { get; set; } // x position
        public string color { get; set; }
        public int health { get; set; }
        public int score { get; set; }
        public int angle { get; set; }

        public Player()
        {
          angle = Convert.ToInt32(Math.PI / 2);
        }
    }
}