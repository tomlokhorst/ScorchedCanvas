using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing;

namespace ScorchedServer.Models
{
    public class Shot
    {
        public Weapon Weapon { get; set; }
        public Point Origin { get; set; }
        public float Angle { get; set; }
        public float Power { get; set; }
    }
}