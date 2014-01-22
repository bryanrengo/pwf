using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaintWithFriends.Models
{
    public interface IGameState
    {
        Player GetPlayer(string connectionId, string playerName);
        Player GetPlayer(string connectionId, int id);
        bool IsMatch(string connectionId, string match);
    }
}
