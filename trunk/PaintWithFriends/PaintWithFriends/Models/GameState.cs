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
    public class GameState : IGameState
    {
        private readonly static Lazy<GameState> _instance = new Lazy<GameState>(() => new GameState(GlobalHost.ConnectionManager.GetHubContext<GameHub>()));
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
            Player player = _games.Values.Select(p => p.Players.Values.FirstOrDefault(v => v.ConnectionId == connectionId)).FirstOrDefault();

            if (player == null)
            {
                return new Player(connectionId, playerName);
            }
            else
            {
                return player;
            }          
        }

        public Player GetPlayer(string connectionId)
        {
            return  _games.Values.Select(p => p.Players.Values.FirstOrDefault(v => v.ConnectionId == connectionId)).FirstOrDefault();
        }

        public bool IsMatch(string connectionId, string match)
        {
            // find the group to find the game

            return false;
        }

        /// <summary>
        /// Gets the game.
        /// </summary>
        /// <returns>if no games are started, create a new one</returns>
        public Game GetGame(Player player)
        {
            Game game = _games.Values.FirstOrDefault(p => !p.IsRunning);

            if (game == null)
            {
                string group = Guid.NewGuid().ToString("d");

                game = new Game(group);

                game.Drawer = player;

                game.Players.TryAdd(player.ConnectionId, player);

                _games[group] = game;
            }
            else
            {
                game.Players.TryAdd(player.ConnectionId, player);
            }

            player.Game = game;

            Groups.Add(player.ConnectionId, game.GroupId);

            return game;
        }

        public void RemovePlayer(string connectionId)
        {
            Player playerToRemove = this.GetPlayer(connectionId);

            if (playerToRemove != null)
            {
                Game playerGame = playerToRemove.Game;

                Player removedPlayer;

                if (playerGame != null)
                {
                    playerGame.Players.TryRemove(playerToRemove.ConnectionId, out removedPlayer);
                }
            }
        }
    }
}