using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Tmoag;

namespace ScorchedServer.Models
{
  public class GenericMessage : Message
  {
    public string type;
    public double? angle;
    public double? power;
    public string weapon;
    public string name;
    public string color;

    public Message ToMessage()
    {
      if (type == "fireRequest" && angle != null && power != null)
        return new FireRequest { Angle = (double)angle, Power = (double)power };
      else if (type == "updatePlayer")
        return new UpdatePlayer { Name = name, Color = color };
      else
        return new UnknownMessage { Type = type };
    }
  }
}