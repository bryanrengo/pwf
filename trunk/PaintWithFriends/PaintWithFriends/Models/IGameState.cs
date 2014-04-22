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
        Player GetPlayer(string connectionId);
        void RemovePlayer(string connectionId);
        Game GetGame(Player player);
    }
}
