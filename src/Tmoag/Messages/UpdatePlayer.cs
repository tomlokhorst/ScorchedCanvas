using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Tmoag
{
  public class UpdatePlayer : Message
  {
    public string Name { get; set; }
    public string Color { get; set; }
  }
}