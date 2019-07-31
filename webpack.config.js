const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')


module.exports = {
    entry: './src/ui/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    // devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                ]
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js', '.vue', '.json' ],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
}
