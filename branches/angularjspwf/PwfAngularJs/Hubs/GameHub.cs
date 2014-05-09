using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Timers;
using System.Diagnostics;
using App.Hubs.Models;

namespace App
{
    public class GameHub : Hub
    {
        public override System.Threading.Tasks.Task OnConnected()
        {
            return base.OnConnected();
        }

        public void SendSegments(segment[] segments)
        {
            Clients.AllExcept(Context.ConnectionId).drawSegments(segments);
        }

        public Player Join(string playerName)
        {
            Player player = GameState.Instance.GetOrAddPlayer(Context.ConnectionId, playerName);

            Clients.All.playerJoined(player);

            return player;
        }

        public IEnumerable<Game> GetGames()
        {
            return GameState.Instance.GetAllGames();
        }

        public IEnumerable<Player> GetGamePlayers(string gameId)
        {
            return GameState.Instance.GetOrCreateGame(gameId).Players;
        }
    }
}