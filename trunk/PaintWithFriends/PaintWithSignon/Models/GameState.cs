using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using PaintWithSignon.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaintWithSignon.Models
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

        public Game GetGame()
        {
            return _games.Values.FirstOrDefault(p => !p.IsRunning);
        }

        /// <summary>
        /// Gets the game.
        /// </summary>
        /// <returns>if no games are started or queing, create a new one</returns>
        public Game GetGame(Player player)
        {
            Game game = _games.Values.FirstOrDefault(p => !p.IsRunning);

            if (game == null)
            {
                string group = Guid.NewGuid().ToString("d");

                game = new Game(group);

                player.IsDrawer = true;

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

        public Game GetGame(string connectionId)
        {
            Player currentPlayer = this.GetPlayer(connectionId);

            if (currentPlayer != null)
            {
                return currentPlayer.Game;
            }
            else
            {
                return null;
            }
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

                    Groups.Remove(removedPlayer.ConnectionId, playerGame.GroupId);
                }
            }
        }

        public void RemoveGame(Game game)
        {            
            if (game != null)
            {
                Game gameToRemove;

                _games.TryRemove(game.GroupId, out gameToRemove);

            }
        }
    }
}