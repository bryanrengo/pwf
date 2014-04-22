using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(PwfAngularStart.Startup))]
namespace PwfAngularStart
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);

            // app.MapSignalR();
        }
    }
}
