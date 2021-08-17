import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default [
    {
        input: 'Resources/Private/Javascripts/GoogleMaps.js',
        plugins: [
            babel({
                exclude: 'node_modules/**',
                babelHelpers: 'bundled',
            }),
            terser({
                output: {
                    comments: false,
                },
            }),
        ],
        output: {
            sourcemap: true,
            file: 'Resources/Public/Main.js',
            format: 'iife',
        },
    },
    {
        input: 'Resources/Private/Javascripts/Backend.js',
        plugins: [
            babel({
                exclude: 'node_modules/**',
                babelHelpers: 'bundled',
            }),
            terser({
                output: {
                    comments: false,
                },
            }),
        ],
        output: {
            sourcemap: true,
            file: 'Resources/Public/Backend.js',
            format: 'iife',
        },
    },
];
