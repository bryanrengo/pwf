using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaintWithSignon.Model.Interfaces
{
    public interface IGame
    {
        string GameId { get; set; }
        string Answer { get; set; }
        bool IsRunning { get; set; }
        IPlayer Host { get; set; }
        ConcurrentDictionary<string, string> Guesses { get; set; }
        ConcurrentDictionary<string, IPlayer> Players { get; set; }
        bool Guess(string answer);
    }
}
