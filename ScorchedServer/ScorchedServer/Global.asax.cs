using System;
using System.Collections.Generic;
using System.Linq;
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
          new { controller = "Game", action = "Updates", session = UrlParameter.Optional }
      );

    }

    protected void Application_Start()
    {
      AreaRegistration.RegisterAllAreas();

      RegisterRoutes(RouteTable.Routes);
    }
  }
}