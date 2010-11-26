using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ScorchedServer.Models
{
  public class GenericMessage : Message
  {
    public string type;
    public int angle;
    public int power;

    public Message ToMessage()
    {
      if (type == "fireRequest")
        return new FireRequest { angle = angle, power = power };
      else
        return new UnknownMessage();
    }
  }
}