using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaintWithFriends.Models
{
    public interface IGame
    {
        string GroupId { get; set; }
        string Match { get; set; }
        bool IsRunning { get; set; }
        Player Drawer { get; set; }
        ConcurrentDictionary<string, Player> Players { get; set; }
    }
}
