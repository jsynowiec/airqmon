const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const { dependencies: externals } = require('./package.json');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const watch = process.env.WEBPACK_WATCH === 'true';

const buildPath = path.resolve(__dirname, 'build');

function srcPath(subdir) {
  return path.join(__dirname, 'src', subdir);
}

const base = {
  mode,
  watch,
  devtool: mode == 'development' ? 'source-map' : false,
  externals: [...Object.keys(externals || {})],
  output: {
    path: buildPath,
    publicPath: '',
    chunkFilename: '[name].chunk.js',
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@root': __dirname,
      app: srcPath('app'),
      common: srcPath('common'),
      data: srcPath('data'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: `tsconfig${mode == 'production' ? '.release' : ''}.json`,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(eot|woff|ttf)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [new ESLintPlugin()],
};

const renderPlugins = [
  new HtmlWebpackPlugin({ title: 'Airqmon', chunks: ['main'], filename: 'main.html' }),
  new HtmlWebpackPlugin({
    title: 'Preferences',
    chunks: ['preferencesWindow'],
    filename: 'preferencesWindow.html',
  }),
  new MiniCssExtractPlugin({ filename: '[name].css' }),
  new webpack.ProvidePlugin({ React: 'react' }),
];
const renderer = {
  ...base,
  target: 'electron-renderer',
  output: {
    ...base.output,
    path: path.resolve(base.output.path, 'renderer'),
  },
  entry: {
    main: path.resolve(__dirname, 'src/app/entry.tsx'),
    preferencesWindow: path.resolve(__dirname, 'src/app/preferences-window/entry.tsx'),
  },
  plugins: [...base.plugins, ...renderPlugins],
};

const main = {
  ...base,
  target: 'electron-main',
  entry: {
    main: path.resolve(__dirname, 'src/main.ts'),
  },
};

module.exports = [main, renderer];
