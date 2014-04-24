// --------------------------------------------------------------------------------------------------------------------
// <copyright file="BundleConfig.cs" company="">
//   Copyright © 2014 
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace App.PwfAngular
{
    using System.Web;
    using System.Web.Optimization;

    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles
                .Add(new StyleBundle("~/content/css/app")
                .Include("~/content/app.css"));

            bundles
                .Add(new ScriptBundle("~/js/jquery")
                .Include("~/scripts/vendor/jquery-{version}.js",
                         "~/scripts/vendor/bootstrap.js"));

            bundles
                .Add(new ScriptBundle("~/js/angular")
                .Include("~/scripts/vendor/angular.js",
                         "~/scripts/vendor/angular-resource.js",
                         "~/scripts/vendor/angular-ui-router.js"));

            bundles
                .Add(new ScriptBundle("~/js/app")
                .Include("~/scripts/filters/filters.js",
                         "~/scripts/services/services.js",
                         "~/scripts/directives/directives.js",
                         "~/scripts/controllers/controllers.js",
                         "~/scripts/app.js"));
        }
    }
}
