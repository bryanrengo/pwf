using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace App.Hubs.Models
{
    public sealed class GameState : IGameState
    {
        private static readonly Lazy<GameState> lazy = new Lazy<GameState>(() => new GameState(GlobalHost.ConnectionManager.GetHubContext<GameHub>()));
        private static readonly ConcurrentDictionary<string, Game> games = new ConcurrentDictionary<string, Game>();

        private GameState(IHubContext context)
        {
            Groups = context.Groups;
        }

        public static GameState Instance
        {
            get
            {
                return lazy.Value;
            }
        }

        public IGroupManager Groups { get; set; }

        public Game GetGame(Player player)
        {
            return games.Values.FirstOrDefault(g => g.Players.Any(p => p.Id == player.Id));
        }

        public Player GetPlayer(string playerConnectionId)
        {
            return (from game in games.Values
                    from player in game.Players
                    where player.Id == playerConnectionId
                    select player).FirstOrDefault();
        }

        public IEnumerable<Player> GetAllPlayers()
        {
            return games.SelectMany(p => p.Value.Players);
        }

        public IEnumerable<Game> GetAllGames()
        {
            return games.Values;
        }

        public void RemoveGame(Game game)
        {
            Game removedGame;

            games.TryRemove(game.GameId, out removedGame);
        }

        public Player CreatePlayer(string playerName, string connectionId)
        {
            return new Player()
            {
                Id = connectionId,
                Name = playerName
            };
        }

        public void RemovePlayer(Player player)
        {
            Game removePlayerGame = this.GetGame(player);

            removePlayerGame.RemovePlayer(player);
        }
    }
}