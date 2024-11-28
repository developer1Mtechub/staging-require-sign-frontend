import fs from "fs";
import * as path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill";

export default () => {
  return defineConfig({
    plugins: [react()],
    define: {
      global: "global",
    },
    server: {
      port: 3000,
      proxy: "https://pixinvent.com/",
      cors: {
        origin: ["https://pixinvent.com/", "http://localhost:3000"],
        methods: ["GET", "PATCH", "PUT", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ["node_modules", "./src/assets"],
        },
      },
    },
    resolve: {
      alias: [
        {
          find: /^~.+/,
          replacement: (val) => {
            return val.replace(/^~/, "");
          },
        },
        { find: "stream", replacement: "stream-browserify" },
        { find: "crypto", replacement: "crypto-browserify" },
        { find: "@src", replacement: path.resolve(__dirname, "src") },
        { find: "@store", replacement: path.resolve(__dirname, "src/redux") },
        {
          find: "@configs",
          replacement: path.resolve(__dirname, "src/configs"),
        },
        {
          find: "@styles",
          replacement: path.resolve(__dirname, "src/@core/scss"),
        },
        { find: "@utils", replacement: path.resolve(__dirname, "src/utility") },
        {
          find: "@hooks",
          replacement: path.resolve(__dirname, "src/utility/hooks"),
        },
        {
          find: "@assets",
          replacement: path.resolve(__dirname, "src/@core/assets"),
        },
        { find: "@uselogo", replacement: path.resolve(__dirname, "src/apis") },

        {
          find: "@layouts",
          replacement: path.resolve(__dirname, "src/@core/layouts"),
        },
        {
          find: "@components",
          replacement: path.resolve(__dirname, "src/@core/components"),
        },
      ],
    },
    esbuild: {
      loader: "jsx",
      include: /.\/src\/.*\.js?$/,
      exclude: [],
      jsx: "automatic",
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: false,
            process: true,
          }),
          {
            name: "load-js-files-as-jsx",
            setup(build) {
              build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
                loader: "jsx",
                contents: await fs.readFileSync(args.path, "utf8"),
              }));
            },
          },
        ],
      },
    },
    build: {
      rollupOptions: {
        plugins: [rollupNodePolyFill()],
      },
    },
  });
};
