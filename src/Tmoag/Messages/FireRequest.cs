using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Tmoag
{
  public class FireRequest : Message
  {
    public double Angle { get; set; }
    public double Power { get; set; }
    public string Weapon { get; set; }
  }
}