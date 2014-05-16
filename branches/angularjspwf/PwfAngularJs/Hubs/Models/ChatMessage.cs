using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace App.Hubs.Models
{
    public class ChatMessage
    {
        public ChatMessage(string playerName, string message)
        {
            PlayerName = playerName;
            Message = message;
            MessageId = Guid.NewGuid().ToString();
        }

        public string PlayerName { get; set; }
        public string MessageId { get; set; }
        public string Message { get; set; }
    }
}