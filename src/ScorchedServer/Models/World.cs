using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing;

namespace ScorchedServer.Models
{
    public class World
    {
        public Size Size { get; set; }
        public List<Player> Players { get; set; }
        public double[] Landscape { get; set; }
    }
}