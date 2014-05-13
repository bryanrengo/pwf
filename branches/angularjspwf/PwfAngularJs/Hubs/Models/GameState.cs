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
        private static readonly ConcurrentDictionary<string, Player> players = new ConcurrentDictionary<string, Player>();
        private readonly IGroupManager groups;
        private readonly IHubContext hubContext;

        private GameState(IHubContext context)
        {
            groups = context.Groups;
            hubContext = context;
        }

        public static GameState Instance { get { return lazy.Value; } }

        public IGroupManager Groups { get { return groups; } }

        public IHubContext HubContext { get { return hubContext; } }

        public Game GetGame(Player player)
        {
            return games.Values.FirstOrDefault(g => g.Players.Any(p => p.Id == player.Id));
        }

        public Game GetOrCreateGame(string gameId)
        {
            Game retGame = games.GetOrAdd(gameId, new Game() { GameId = gameId });

            return retGame;
        }

        public IEnumerable<Game> GetAllGames()
        {
#if DEBUG
            games.AddOrUpdate("test", new Game() { GameId = "test", GameInstanceName = "test name" }, (id, game) => game);
            games.AddOrUpdate("test1", new Game() { GameId = "test1", GameInstanceName = "test1 name" }, (id, game) => game);
#endif

            return games.Values;
        }

        public void RemoveGame(Game game)
        {
            Game removedGame;

            games.TryRemove(game.GameId, out removedGame);
        }

        public Player GetOrAddPlayer(string playerConnectionId, string playerName)
        {
            Player retPlayer = null;

            players.TryGetValue(playerConnectionId, out retPlayer);

            if (retPlayer == null)
            {
                retPlayer = players.AddOrUpdate(playerConnectionId, new Player() { Id = playerConnectionId, Name = playerName }, (id, player) => player);
            }

            // if not, create and add
            return retPlayer;
        }

        public bool PlayerExists(string playerName)
        {
            return players.Values.Any(p => p.Name == playerName);
        }
    }
}