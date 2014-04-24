// --------------------------------------------------------------------------------------------------------------------
// <copyright file="RouteConfig.cs" company="">
//   Copyright © 2014 
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace App.PwfAngular
{
    using System.Web.Routing;

    using App.PwfAngular.Routing;
    using System.Web.Mvc;
    using System.Web.Http;
    using System.Net.Http;

    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.MapRoute(
                name: "Login",
                url: "Login",
                defaults: new { 
                    controller = "Login",
                    action = "Index"
                }
            );

            routes.Add("Default", new DefaultRoute());
        }
    }
}
