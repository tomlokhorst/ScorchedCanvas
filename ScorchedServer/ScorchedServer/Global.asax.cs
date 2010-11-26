using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace ScorchedServer
{
  public class MvcApplication : System.Web.HttpApplication
  {
    public static void RegisterRoutes(RouteCollection routes)
    {
      routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

      routes.MapRoute(
          "Default",
          "gameupdates/{session}",
          new { controller = "Game", action = "Updates" }
      );

    }

    protected void Application_Start()
    {
      AreaRegistration.RegisterAllAreas();

      RegisterRoutes(RouteTable.Routes);

      Application["x"] = 0;

      var t = new Thread(new ThreadStart(startThread));
      t.Start();
    }

    private void startThread()
    {
      int x = (int)Application["x"];

      while (true)
      {
        Application["x"] = x++;

        Thread.Sleep(1000);
      }
    }
  }
}