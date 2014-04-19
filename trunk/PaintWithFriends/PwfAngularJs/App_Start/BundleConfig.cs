// --------------------------------------------------------------------------------------------------------------------
// <copyright file="BundleConfig.cs" company="KriaSoft LLC">
//   Copyright © 2013 Konstantin Tarkus, KriaSoft LLC. See LICENSE.txt
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace App
{
    using System.Web.Optimization;

    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/js/angular.js").Include(
                "~/scripts/angular/angular.js"));

            bundles.Add(new ScriptBundle("~/js/angular-route.js").Include(
                "~/scripts/angular/angular-route.js"));

            bundles.Add(new ScriptBundle("~/js/app.js").Include(
                "~/scripts/app.js",
                "~/scripts/filters.js",
                "~/scripts/services.js",
                "~/scripts/directives.js",
                "~/scripts/controllers.js"));

            bundles.Add(new StyleBundle("~/css/app").Include(
                "~/styles/app.css"));
        }
    }
}