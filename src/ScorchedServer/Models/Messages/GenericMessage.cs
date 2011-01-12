using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ScorchedServer.Models
{
  public class GenericMessage : Message
  {
    public string type;
    public double angle;
    public double power;
    public string weapon;
    public string name;
    public string color;

    public Message ToMessage()
    {
      if (type == "fireRequest")
        return new FireRequest { angle = angle, power = power };
      else if (type == "updatePlayer")
        return new UpdatePlayer { name = name, color = color };
      else
        return new UnknownMessage();
    }
  }
}