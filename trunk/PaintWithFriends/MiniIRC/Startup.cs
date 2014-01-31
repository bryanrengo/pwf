using Microsoft.Owin;
using Owin;
using MiniIRC;

[assembly: OwinStartup(typeof(MiniIRC.Startup))]

namespace MiniIRC
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}