using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaintWithSignon.Models
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
}