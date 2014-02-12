using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using PaintWithFriends.Models;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Timers;

namespace PaintWithFriends
{
    public class GameHub : Hub
    {
        public class ChatMessage
        {
            public ChatMessage(string playerName, string message)
            {
                this.PlayerName = playerName;
                this.Message = message;
            }

            public string PlayerName { get; set; }
            public string Message { get; set; }
        }

        public class segment
        {
            public int x_from { get; set; }
            public int y_from { get; set; }
            public int x_to { get; set; }
            public int y_to { get; set; }
        }

        public void Clear()
        {
            Clients.AllExcept(new string[] { Context.ConnectionId }).clear();
        }

        public void DrawSegment(int x_from, int y_from, int x_to, int y_to)
        {
            Clients.AllExcept(new string[] { Context.ConnectionId }).drawSegment(x_from, y_from, x_to, y_to);
        }

        public void PushSegmentArray(segment[] segments)
        {
            Clients.AllExcept(new string[] { Context.ConnectionId }).drawSegments(segments);
        }

        public void PushSegmentArrayNoJson(int[] coords)
        {
            int cnt = (int)(coords.Length / 4.0);
            var segments = new segment[cnt];
            int j = 0;
            for (int i = 0; i < coords.Length; i += 4)
            {
                segments[j++] = new segment() { x_from = coords[i], y_from = coords[i + 1], x_to = coords[i + 2], y_to = coords[i + 3] };
            }
            PushSegmentArray(segments);
        }

        public List<Player> GetPlayers()
        {
            List<Player> players = new List<Player>();

            Game game = GameState.Instance.GetGame();

            if (game != null)
            {
                players.AddRange(game.Players.Values);
            }
           
            return players;
        }

        public Player Join(string playerName)
        {
            if (string.IsNullOrEmpty(playerName))
            {
                return null;
            }

            // find or create a new player, automatically adding them to the game if there is one currently queued
            Player player = GameState.Instance.GetPlayer(Context.ConnectionId, playerName);

            Game game = null;

            // find a game if one hasn't been started
            if (player.Game == null)
            {
                game = GameState.Instance.GetGame(player);
            }
            else
            {
                game = player.Game;
            }

            // send the new player the list of current players
            Clients.Client(player.ConnectionId).playersInGame(game.Players);

            // announce that a new player has joined the game
            Clients.Group(game.GroupId, player.ConnectionId).playerJoined(player);

            if (game.Players.Count >= 3)
            {
                // can start game if player count is 3 or more
                Clients.Client(game.Drawer.ConnectionId).enableStart();

                Clients.Group(game.GroupId).sendChat(new ChatMessage("server", "waiting for player '" + game.Drawer.Name + "' to start the game"));
            }
            else
            {
                // tell everyone we're waiting for more players
                Clients.Group(game.GroupId).waitingForPlayers(player);
            }

            // send the playerId to the client caller
            Clients.Caller.playerId = player.ConnectionId;

            return player;
        }

        public bool Start()
        {
            // get the connection id
            var connectionId = Context.ConnectionId;

            // get the game that the connection id is associated with 
            Game game = GameState.Instance.GetGame(connectionId);

            if (game != null)
            {
                // enable drawing on the drawer
                Clients.Client(game.Drawer.ConnectionId).enableDrawing(60, game.Match);

                // start the game on the rest of the players
                Clients.Group(game.GroupId, game.Drawer.ConnectionId).startGame(60);

                // tell the game state that the game has begun and is running
                game.IsRunning = true;
            }

            return true;
        }

        public bool Guess(string guess)
        {
            string connectionId = Context.ConnectionId;

            // get the game that the connection is attached to
            Game game = GameState.Instance.GetGame(connectionId);

            if (game.Guess(guess))
            {
                // guess was correct, game is over so stop the game and send back winning player name to clients.
                Player winner = GameState.Instance.GetPlayer(connectionId);

                // communicate that the current guess is the winner
                Clients.Group(game.GroupId).endGame(winner);

                game.ResetGame();

                // send the new player the list of current players
                Clients.Group(game.GroupId).playersInGame(game.Players);

                //Clients.Group(game.GroupId).sendChat(new ChatMessage("server", "waiting for player '" + game.Drawer.Name + "' to start the game"));

                return true;
            }
            else
            {
                // guess was incorrect. 
                // broadcast to other players what the incorrect guess was and which player submitted the guess
                Player player = GameState.Instance.GetPlayer(Context.ConnectionId, "nomatter");
                if (player == null)
                    throw new Exception("player not found");

                // Clients.AllExcept(Context.ConnectionId).incorrectGuess(new { playerName = player.Name, guess = guess });

                return false;
            }
        }

        public void SubmitChat(string chat)
        {
            HttpServerUtility Server = HttpContext.Current.Server;

            string chatOutput = Server.HtmlEncode(Regex.Replace(chat, "<[^>]*(>|$)", string.Empty));

            Player player = GameState.Instance.GetPlayer(Context.ConnectionId);

            if (player != null && player.Game != null)
            {
                if (player.Game.IsRunning && (chatOutput.Contains("/g ") || chatOutput.Contains("/guess ")))
                {
                    // is a guess!  find the guess string
                    string guess = chatOutput.Replace("/guess ", string.Empty);

                    guess = guess.Replace("/g ", string.Empty);

                    guess = guess.Trim();

                    if (!Guess(guess))
                    {
                        chatOutput = string.Format("guessed '{0}' but was incorrect", guess);
                    }
                }

                Clients.Group(player.Game.GroupId).sendChat(new ChatMessage(player.Name, chatOutput));
            }
        }

        public override Task OnDisconnected()
        {
            string connectionId = Context.ConnectionId;

            // find the game that the player was playing in
            Game game = GameState.Instance.GetGame(connectionId);

            // find the player
            Player player = GameState.Instance.GetPlayer(connectionId);

            if (player == null && game == null)
            {
                return base.OnDisconnected();
            }

            if (player != null && game != null && game.Drawer == player && game.Players.Count > 1)
            {
                // next player in the list is the drawer
                GameState.Instance.RemovePlayer(Context.ConnectionId);

                game.Drawer = game.Players.Values.FirstOrDefault();
                game.Drawer.IsDrawer = true;

                // send the new player the list of current players
                Clients.Group(game.GroupId).playersInGame(game.Players);
            }
            else
            {
                // remove the player from the game state
                GameState.Instance.RemovePlayer(Context.ConnectionId);
            }
            
            // send the new player the list of current players
            Clients.Group(game.GroupId).playersInGame(game.Players);

            // notify the drawer client to enable start if there is 3 or greater
            if (game.Players.Count >= 3)
            {
                Clients.Client(game.Drawer.ConnectionId).enableStart();
            }
            else if (game.Players.Count == 0)
            {
                GameState.Instance.RemoveGame(game);
            }
            else
            {
                Clients.Group(game.GroupId).disableStart();
            }

            // communicate to all other clients that the player left
            Clients.Group(game.GroupId).playerLeft(player);

            return base.OnDisconnected();
        }
    }
}