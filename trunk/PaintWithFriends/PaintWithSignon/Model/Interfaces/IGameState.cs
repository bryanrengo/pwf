using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaintWithSignon.Model.Interfaces
{
    public interface IGameState
    {
        ConcurrentDictionary<string, IGame> Games { get; set; }
        IGame GetGame(IPlayer player);
    }
}
