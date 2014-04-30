using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace App.Hubs.Models
{
    public interface IGameState
    {
        IGroupManager Groups { get; set; }
        Game GetGame(Player player);
        Player GetPlayer(string playerConnectionId);
        Player CreatePlayer(string playerName, string connectionId);
        IEnumerable<Player> GetAllPlayers();
        IEnumerable<Game> GetAllGames();        
        void RemoveGame(Game game);
        void RemovePlayer(Player player);
    }
}
