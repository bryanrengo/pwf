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

        public bool PlayerExists(string playerName)
        {
            return GameState.Instance.PlayerExists(playerName);
        }

        public IEnumerable<Game> GetGames()
        {
            return GameState.Instance.GetAllGames();
        }

        public IEnumerable<Player> GetGamePlayers(string gameId)
        {
            return GameState.Instance.GetOrCreateGame(gameId).Players;
        }

        public void ClearBoard()
        {
            Clients.All.clearBoard();
        }

        public void SendColor(string color)
        {
            Clients.All.updateColor(color);
        }

        public void SendMessage(string message)
        {
            Player player = GameState.Instance.GetPlayer(Context.ConnectionId);
            ChatMessage chatMessage = null;

            if (player == null)
            {
                chatMessage = new ChatMessage(string.Empty, message);
            }
            else
            {
                chatMessage = new ChatMessage(player.Name, message);
            }

            Clients.All.messageSent(chatMessage);
        }
    }
}