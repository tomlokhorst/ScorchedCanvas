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

    public Message ToMessage()
    {
      if (type == "fireRequest")
        return new FireRequest { angle = 0.0, power = 0.0 };
      else
        return new UnknownMessage();
    }
  }
}