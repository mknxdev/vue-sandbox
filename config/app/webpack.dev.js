const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts")
const NodemonPlugin = require('nodemon-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// Utils

const rootDir = process.cwd()

function formatArgsToNode(options) {
  return Object.entries(options)
    .map((opt) => {
      if (opt[0] && opt[1]) {
        return `--${opt[0]}=${JSON.stringify(opt[1])}`
      }
      return null
    })
    .filter(opt => !!opt)
}

function formatEnvParams(params) {
  let formattedParams = {}
  for (const [key, name] of Object.entries(params)) {
    if (key !== 'WEBPACK_WATCH') {
      formattedParams[key] = name
    }
  }
  return formattedParams
}

// Config

module.exports = (env, opts) => {
  const fmtEnvArgs = formatEnvParams(env)
  return {
    mode: 'development',
    entry: './app/ui/main.js',
    output: {
      library: 'VS',
      libraryTarget: 'umd',
      libraryExport: 'default',
      path: path.join(rootDir, '/app/ui/assets/dist/'),
      publicPath: '/',
      filename: 'vue-sandbox.dev.js',
    },
    module: {
      rules: [
        // Pkg-related rules (internal)
        {
          test: /\.js$/i,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-proposal-class-properties'],
              }
            },
          ]
        },
        {
          test: /\.vue$/i,
          loader: 'vue-loader',
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.s[ac]ss$/i,
          exclude: [
            path.join(rootDir, '/public/components/'),
          ],
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  indentedSyntax: true,
                  indentWidth: 2,
                  includePaths: [
                    path.join(rootDir, '/app/ui/assets/sass'),
                  ],
                },
              },
            },
          ]
        },
      ]
    },
    resolve: {
      alias: {
        '@ui': path.join(rootDir, '/app/ui/'),
        '@server': path.join(rootDir, '/app/server/'),
        '@public': path.join(rootDir, '/public/'),
      }
    },
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: 'vue-sandbox.dev.css',
      }),
      new RemoveEmptyScriptsPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 9001,
        generateStatsFile: true,
        openAnalyzer: false,
      }),
      new NodemonPlugin({
        script: path.join(rootDir, '/app/server/main.js'),
        watch: path.join(rootDir, '/app/'),
        ignore: [
          path.join(rootDir, '/app/ui/assets/'),
        ],
        env: {
          VS_ENV: 'development',
        },
        args: formatArgsToNode(fmtEnvArgs),
        verbose: true,
      }),
    ],
  }
}
