using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaintWithFriends.Models
{
    public class Player
    {
        public Player(string connectionId, string name)
        {
            this.ConnectionId = connectionId;
            this.Name = name;
            this.IsDrawing = false;
            this.IsPlaying = false;
        }

        public string ConnectionId { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public Game Game { get; set; }
        
        /// <summary>
        /// IsPlaying; this Player has joined a game
        /// </summary>
        public bool IsPlaying { get; set; }

        /// <summary>
        /// IsDrawing; this Player is drawing
        /// </summary>
        public bool IsDrawing { get; set; }
    }
}