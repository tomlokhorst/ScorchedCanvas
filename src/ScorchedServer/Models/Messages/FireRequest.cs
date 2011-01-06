using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ScorchedServer.Models
{
  public class FireRequest : Message
  {
    public double angle;
    public double power;
    public string weapon;
  }
}