using System;
using System.Collections.Generic;
using System.Linq;

static class Landscape
{
    public static void Main()
    {
        var l = generateLandscape(50);
        l = l.increaseResolution(10);
        l = l.Take(1024);

        foreach (var x in l)
            Console.WriteLine(x);
    }

    private static IEnumerable<int> generateLandscape(int height)
    {
        var r = new Random();

        int y = height / 2;

        for (int x = 0; ; x++)
        {
            yield return y;

            // difference from previous y
            y += (int)(r.Next(-5, 6) ^ 4 / 400);

            // floor and ceiling
            y = Math.Max(0, Math.Min(height, y));
        }
    }

    private static IEnumerable<int> increaseResolution(this IEnumerable<int> xs, int nr)
    {
        bool first = true;
        int prev = 0;

        foreach (int x in xs.Select(y => y * 100))
        {
            if (!first)
            {
                int diff = (x - prev) / nr;

                for (int i = 0; i < nr; i ++)
                    yield return (prev + (diff * i))/100;
            }

            prev = x;
            first = false;
        }
    }
}

