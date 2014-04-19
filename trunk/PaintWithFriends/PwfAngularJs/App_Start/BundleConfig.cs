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
            bundles.Add(new Bundle("~/js/angular").Include(
                "~/scripts/angular/angular.js"));

            bundles.Add(new Bundle("~/js/angular-route").Include(
                "~/scripts/angular/angular-route.js"));

            bundles.Add(new Bundle("~/js/app").Include(
                "~/scripts/app.js",
                "~/scripts/filters.js",
                "~/scripts/services.js",
                "~/scripts/directives.js",
                "~/scripts/controllers.js"));

            bundles.Add(new Bundle("~/css/app").Include(
                "~/styles/app.css"));
        }
    }
}