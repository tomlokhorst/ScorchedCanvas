using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ScorchedServer.Models
{
  public class UpdatePlayer : Message
  {
    public string name;
    public string color;
  }
}