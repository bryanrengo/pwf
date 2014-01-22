using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using PaintWithFriends.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaintWithFriends.Models
{
    public class GameState 
    {
        private readonly static Lazy<GameState> _instance = new Lazy<GameState>(() => new GameState(GlobalHost.ConnectionManager.GetHubContext<GameHub>()));
        private readonly ConcurrentDictionary<string, Player> _players = new ConcurrentDictionary<string, Player>(StringComparer.OrdinalIgnoreCase);
        private readonly ConcurrentDictionary<string, Game> _games = new ConcurrentDictionary<string, Game>(StringComparer.OrdinalIgnoreCase);

        public IHubConnectionContext Clients { get; set; }
        public IGroupManager Groups { get; set; }

        private GameState(IHubContext context)
        {
            Clients = context.Clients;
            Groups = context.Groups;
        }

        public static GameState Instance
        {
            get { return _instance.Value; }
        }

        public Player GetPlayer(string connectionId, string playerName)
        {
            Player player = _players.GetOrAdd(playerName, new Player(connectionId, playerName));

            // wire up the new game or join game
            
            return player;
        }

        public Player GetPlayer(string connectionId, int id)
        {
            return null;
        }

        public bool IsMatch(string connectionId, string match)
        {
            // find the group to find the game
            
            return false;
        }
    }
}