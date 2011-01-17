using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

using ScorchedServer.Models;
using Tmoag;
using System.Web.Script.Serialization;

namespace TestApplication
{
  public class Test
  {
    private static JavaScriptSerializer jss = new JavaScriptSerializer();
    private static ScorchedServer.Models.Tmoag tmoag;

    public static void Main()
    {
      tmoag = new ScorchedServer.Models.Tmoag();

      Console.WriteLine("Started");

      new Thread(new ThreadStart(start0)).Start();
      new Thread(new ThreadStart(start1)).Start();
      new Thread(new ThreadStart(start2)).Start();

      Thread.Sleep(1000 * 60);
      Console.WriteLine("End");
    }

    private static void start0()
    {
      int i = 1;

      while (true)
      {
        var xs = tmoag.HandleMessages(Thread.CurrentThread.ManagedThreadId.ToString(), new List<Message>());

        foreach (var x in xs.Skip(i--))
        {
          var s = jss.Serialize(x);
          Console.WriteLine(s.Length > 200 ? s.Substring(0, 200) : s);
        }

        Thread.Sleep(1000);
      }
    }

    private static void start1()
    {
      int i = 0;

      while (true)
      {
        Thread.Sleep(3000);

        var xs = new List<Message>();

        if (i == 2)
        {
          xs = new List<Message> { new FireRequest { Angle = 0, Power = 0.2 } };
        }
        if (i == 4)
        {
          xs = new List<Message> { new UpdatePlayer { Name = "Tom" } };
        }
        if (i == 6)
        {
          xs = new List<Message> { new FireRequest { Angle = 0, Power = 0.2 } };
        }

        tmoag.HandleMessages(Thread.CurrentThread.ManagedThreadId.ToString(), xs);

        //foreach (var x in xs)
        //  Console.WriteLine(jss.Serialize(x));

        i++;
      }
    }

    private static void start2()
    {
      Thread.Sleep(3000);

      tmoag.HandleMessages(Thread.CurrentThread.ManagedThreadId.ToString(), new List<Message>());

      Thread.Sleep(6000);

      tmoag.HandleMessages(Thread.CurrentThread.ManagedThreadId.ToString(), new List<Message> { new UpdatePlayer { Name = "Hello" } });

      for (var i = 0; i < 6; i++)
      {
        Thread.Sleep(3000);

        tmoag.HandleMessages(Thread.CurrentThread.ManagedThreadId.ToString(), new List<Message>());
      }
    }
  }
}
