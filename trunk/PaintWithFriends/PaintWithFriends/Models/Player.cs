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
            this.IsDrawer = false;
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
        /// IsDrawer; this Player is drawer
        /// </summary>
        public bool IsDrawer { get; set; }
    }
}