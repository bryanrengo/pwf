using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaintWithFriends.Models
{
    public interface IGame
    {
        string Id { get; set; }
        string Match { get; set; }
        Player CurrentDrawer { get; set; }
        List<Player> Players { get; set; }
    }
}
