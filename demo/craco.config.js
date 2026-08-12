// craco.config.js
const macros = require("unplugin-parcel-macros");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { SwcMinifyWebpackPlugin } = require("swc-minify-webpack-plugin");
const { browserslistToTargets } = require("lightningcss");
const browserslist = require("browserslist");

const BROWSERSLIST = "last 2 Chrome versions, last 2 Safari versions, last 2 Firefox versions";

module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      const isProduction = env === "production";

      // Enable style macros
      webpackConfig.plugins.push(macros.webpack());

      // Always minimize CSS
      webpackConfig.optimization.minimize = true;

      webpackConfig.optimization.minimizer = [
        // SWC JS minification in production
        ...(isProduction ? [new SwcMinifyWebpackPlugin()] : []),

        // Lightning CSS
        new CssMinimizerPlugin({
          minify: CssMinimizerPlugin.lightningCssMinify,
          minimizerOptions: {
            minify: isProduction,
            targets: browserslistToTargets(browserslist(BROWSERSLIST)),
          },
        }),
      ];

      // Bundle S2 + macro generated CSS together
      webpackConfig.optimization.splitChunks = {
        ...webpackConfig.optimization.splitChunks,

        cacheGroups: {
          ...webpackConfig.optimization.splitChunks?.cacheGroups,

          s2: {
            name: "s2-styles",

            test(module) {
              return (
                module.type === "css/mini-extract" &&
                (module.identifier().includes("@react-spectrum/s2") || /.macro-(.*?)\.css/.test(module.identifier()))
              );
            },

            chunks: "all",
            enforce: true,
          },
        },
      };

      return webpackConfig;
    },
  },
};
