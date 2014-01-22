﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaintWithFriends.Models
{
    public class Player
    {
        public Player(string id, string name)
        {
            this.Id = id;
            this.Name = name;
            this.IsDrawing = false;
            this.IsPlaying = false;
        }

        public string Id { get; set; }
        public string Name { get; set; }
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