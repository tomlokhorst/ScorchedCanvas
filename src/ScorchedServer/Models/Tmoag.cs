using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Runtime.CompilerServices;

using Tmoag;

namespace ScorchedServer.Models
{
  public class Tmoag
  {
    private Game game;

    public Tmoag()
    {
      this.game = new Game();
    }

    [MethodImpl(MethodImplOptions.Synchronized)]
    public IEnumerable<object> HandleMessages(string session, IEnumerable<Message> msgs)
    {
      return game.HandleMessages(session, msgs);
    }
  }
}