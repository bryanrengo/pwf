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
        IGroupManager Groups { get; }
        IHubContext HubContext { get; }

        Game GetGame(Player player);
        Game GetOrCreateGame(string gameId);

        IEnumerable<Game> GetAllGames();        
        void RemoveGame(Game game);

        Player GetOrAddPlayer(string playerConnectionId, string playerName);
    }
}
