using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using ScorchedServer.Models;

namespace ScorchedServer.Controllers
{
  public class GameController : Controller
  {
    public JavaScriptResult Updates(string session, string callback)
    {
      this.HttpContext.Response.AddHeader("Access-Control-Allow-Origin", "*");

      var data = Request.Form["queue"];
      if (data != null)
      {

        JavaScriptSerializer jss = new JavaScriptSerializer();
        List<GenericMessage> queue = jss.Deserialize<List<GenericMessage>>(data);

        var msgs = queue.Select(m => m.ToMessage());

        var game = HttpContext.Application["game"] as Game;
        var str = game.HandleMessages(msgs);

        if (str == null)
        {
          return new JavaScriptResult();
        }
        else
        {
          return new JavaScriptResult
          {
            Script = callback + "({" + str + ");"
          };
        }
      }
      else
      {
        return new JavaScriptResult
        {
          Script = callback + "({ type: 'error', msg: 'no queue sent'});"
        };
      }
    }
  }
}
