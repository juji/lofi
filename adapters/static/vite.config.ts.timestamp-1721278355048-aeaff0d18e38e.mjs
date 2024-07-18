// adapters/static/vite.config.ts
import { staticAdapter } from "file:///Users/juji/play/lofi/node_modules/@builder.io/qwik-city/adapters/static/vite/index.mjs";
import { extendConfig } from "file:///Users/juji/play/lofi/node_modules/@builder.io/qwik-city/vite/index.mjs";

// vite.config.ts
import { defineConfig } from "file:///Users/juji/play/lofi/node_modules/vite/dist/node/index.js";
import { qwikVite } from "file:///Users/juji/play/lofi/node_modules/@builder.io/qwik/optimizer.mjs";
import { qwikCity } from "file:///Users/juji/play/lofi/node_modules/@builder.io/qwik-city/vite/index.mjs";
import tsconfigPaths from "file:///Users/juji/play/lofi/node_modules/vite-tsconfig-paths/dist/index.mjs";

// package.json
var package_default = {
  name: "my-qwik-empty-starter",
  description: "Blank project with routing included",
  engines: {
    node: "^18.17.0 || ^20.3.0 || >=21.0.0"
  },
  "engines-annotation": "Mostly required by sharp which needs a Node-API v9 compatible runtime",
  private: true,
  trustedDependencies: [
    "sharp"
  ],
  "trustedDependencies-annotation": "Needed for bun to allow running install scripts",
  type: "module",
  scripts: {
    clean: "kill-port 5173; rimraf ./node_modules/.vite; rimraf ./dist; rimraf ./server",
    prebuild: "npm run clean",
    "build:qwik": "qwik build",
    build: "npx tauri build --target universal-apple-darwin",
    "build.client": "vite build",
    "build.preview": "vite build --ssr src/entry.preview.tsx",
    "build.server": "vite build -c adapters/static/vite.config.ts",
    "build.types": "tsc --incremental --noEmit",
    deploy: `echo 'Run "npm run qwik add" to install a server adapter'`,
    dev: "kill-port 5173; npx tauri dev; kill-port 5173",
    "dev:vite": "vite --port 5173 --mode ssr",
    "dev.debug": "node --inspect-brk ./node_modules/vite/bin/vite.js --mode ssr --force",
    fmt: "prettier --write .",
    "fmt.check": "prettier --check .",
    lint: 'eslint "src/**/*.ts*"',
    preview: "qwik build preview && vite preview --open",
    start: "vite --open --mode ssr",
    tauri: "tauri",
    qwik: "qwik"
  },
  devDependencies: {
    "@builder.io/qwik": "^1.7.1",
    "@builder.io/qwik-city": "^1.7.1",
    "@types/eslint": "^8.56.10",
    "@types/node": "^20.12.7",
    "@typescript-eslint/eslint-plugin": "^7.7.1",
    "@typescript-eslint/parser": "^7.7.1",
    eslint: "^8.57.0",
    "eslint-plugin-qwik": "^1.7.1",
    "kill-port": "^2.0.1",
    prettier: "^3.2.5",
    typescript: "5.4.5",
    undici: "*",
    vite: "^5.2.10",
    "vite-tsconfig-paths": "^4.2.1"
  },
  dependencies: {
    "@juji/axios-tauri-api-adapter": "^0.2.3",
    "@juji/preflight": "^1.0.1",
    "@juji/youtube-video-js": "^4.0.6",
    "@tauri-apps/api": "^1.6.0",
    "@tauri-apps/cli": "^1.6.0",
    axios: "^1.7.2",
    "date-fns": "^3.6.0",
    "icon-gen": "^4.0.0",
    rimraf: "^6.0.1",
    "youtube-video-js": "^4.0.1"
  },
  packageManager: "yarn@1.22.22"
};

// vite.config.ts
var { dependencies = {}, devDependencies = {} } = package_default;
errorOnDuplicatesPkgDeps(devDependencies, dependencies);
var vite_config_default = defineConfig(({ command, mode }) => {
  return {
    plugins: [
      qwikCity(),
      qwikVite(),
      tsconfigPaths()
    ],
    // This tells Vite which dependencies to pre-build in dev mode.
    optimizeDeps: {
      // Put problematic deps that break bundling here, mostly those with binaries.
      // For example ['better-sqlite3'] if you use that in server functions.
      exclude: []
    },
    /**
     * This is an advanced setting. It improves the bundling of your server code. To use it, make sure you understand when your consumed packages are dependencies or dev dependencies. (otherwise things will break in production)
     */
    // ssr:
    //   command === "build" && mode === "production"
    //     ? {
    //         // All dev dependencies should be bundled in the server build
    //         noExternal: Object.keys(devDependencies),
    //         // Anything marked as a dependency will not be bundled
    //         // These should only be production binary deps (including deps of deps), CLI deps, and their module graph
    //         // If a dep-of-dep needs to be external, add it here
    //         // For example, if something uses `bcrypt` but you don't have it as a dep, you can write
    //         // external: [...Object.keys(dependencies), 'bcrypt']
    //         external: Object.keys(dependencies),
    //       }
    //     : undefined,
    server: {
      headers: {
        // Don't cache the server response in dev mode
        "Cache-Control": "public, max-age=0"
      }
    },
    preview: {
      headers: {
        // Do cache the server response in preview (non-adapter production build)
        "Cache-Control": "public, max-age=600"
      }
    }
  };
});
function errorOnDuplicatesPkgDeps(devDependencies2, dependencies2) {
  let msg = "";
  const duplicateDeps = Object.keys(devDependencies2).filter(
    (dep) => dependencies2[dep]
  );
  const qwikPkg = Object.keys(dependencies2).filter(
    (value) => /qwik/i.test(value)
  );
  msg = `Move qwik packages ${qwikPkg.join(", ")} to devDependencies`;
  if (qwikPkg.length > 0) {
    throw new Error(msg);
  }
  msg = `
    Warning: The dependency "${duplicateDeps.join(", ")}" is listed in both "devDependencies" and "dependencies".
    Please move the duplicated dependencies to "devDependencies" only and remove it from "dependencies"
  `;
  if (duplicateDeps.length > 0) {
    throw new Error(msg);
  }
}

// adapters/static/vite.config.ts
var vite_config_default2 = extendConfig(vite_config_default, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["@qwik-city-plan"]
      }
    },
    plugins: [
      staticAdapter({
        origin: "http://localhost"
      })
    ]
  };
});
export {
  vite_config_default2 as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYWRhcHRlcnMvc3RhdGljL3ZpdGUuY29uZmlnLnRzIiwgInZpdGUuY29uZmlnLnRzIiwgInBhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9qdWppL3BsYXkvbG9maS9hZGFwdGVycy9zdGF0aWNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9qdWppL3BsYXkvbG9maS9hZGFwdGVycy9zdGF0aWMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2p1amkvcGxheS9sb2ZpL2FkYXB0ZXJzL3N0YXRpYy92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IHN0YXRpY0FkYXB0ZXIgfSBmcm9tIFwiQGJ1aWxkZXIuaW8vcXdpay1jaXR5L2FkYXB0ZXJzL3N0YXRpYy92aXRlXCI7XG5pbXBvcnQgeyBleHRlbmRDb25maWcgfSBmcm9tIFwiQGJ1aWxkZXIuaW8vcXdpay1jaXR5L3ZpdGVcIjtcbmltcG9ydCBiYXNlQ29uZmlnIGZyb20gXCIuLi8uLi92aXRlLmNvbmZpZ1wiO1xuXG5leHBvcnQgZGVmYXVsdCBleHRlbmRDb25maWcoYmFzZUNvbmZpZywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIGJ1aWxkOiB7XG4gICAgICBzc3I6IHRydWUsXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIGlucHV0OiBbXCJAcXdpay1jaXR5LXBsYW5cIl0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgc3RhdGljQWRhcHRlcih7XG4gICAgICAgIG9yaWdpbjogXCJodHRwOi8vbG9jYWxob3N0XCIsXG4gICAgICB9KSxcbiAgICBdLFxuICB9O1xufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9qdWppL3BsYXkvbG9maVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2p1amkvcGxheS9sb2ZpL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9qdWppL3BsYXkvbG9maS92aXRlLmNvbmZpZy50c1wiOy8qKlxuICogVGhpcyBpcyB0aGUgYmFzZSBjb25maWcgZm9yIHZpdGUuXG4gKiBXaGVuIGJ1aWxkaW5nLCB0aGUgYWRhcHRlciBjb25maWcgaXMgdXNlZCB3aGljaCBsb2FkcyB0aGlzIGZpbGUgYW5kIGV4dGVuZHMgaXQuXG4gKi9cbmltcG9ydCB7IGRlZmluZUNvbmZpZywgdHlwZSBVc2VyQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IHF3aWtWaXRlIH0gZnJvbSBcIkBidWlsZGVyLmlvL3F3aWsvb3B0aW1pemVyXCI7XG5pbXBvcnQgeyBxd2lrQ2l0eSB9IGZyb20gXCJAYnVpbGRlci5pby9xd2lrLWNpdHkvdml0ZVwiO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcbmltcG9ydCBwa2cgZnJvbSBcIi4vcGFja2FnZS5qc29uXCI7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcInBhdGhcIjtcbnR5cGUgUGtnRGVwID0gUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbmNvbnN0IHsgZGVwZW5kZW5jaWVzID0ge30sIGRldkRlcGVuZGVuY2llcyA9IHt9IH0gPSBwa2cgYXMgYW55IGFzIHtcbiAgZGVwZW5kZW5jaWVzOiBQa2dEZXA7XG4gIGRldkRlcGVuZGVuY2llczogUGtnRGVwO1xuICBba2V5OiBzdHJpbmddOiB1bmtub3duO1xufTtcbmVycm9yT25EdXBsaWNhdGVzUGtnRGVwcyhkZXZEZXBlbmRlbmNpZXMsIGRlcGVuZGVuY2llcyk7XG4vKipcbiAqIE5vdGUgdGhhdCBWaXRlIG5vcm1hbGx5IHN0YXJ0cyBmcm9tIGBpbmRleC5odG1sYCBidXQgdGhlIHF3aWtDaXR5IHBsdWdpbiBtYWtlcyBzdGFydCBhdCBgc3JjL2VudHJ5LnNzci50c3hgIGluc3RlYWQuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSk6IFVzZXJDb25maWcgPT4ge1xuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHF3aWtDaXR5KCksXG4gICAgICBxd2lrVml0ZSgpLFxuICAgICAgdHNjb25maWdQYXRocygpLFxuICAgIF0sXG4gICAgLy8gVGhpcyB0ZWxscyBWaXRlIHdoaWNoIGRlcGVuZGVuY2llcyB0byBwcmUtYnVpbGQgaW4gZGV2IG1vZGUuXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICAvLyBQdXQgcHJvYmxlbWF0aWMgZGVwcyB0aGF0IGJyZWFrIGJ1bmRsaW5nIGhlcmUsIG1vc3RseSB0aG9zZSB3aXRoIGJpbmFyaWVzLlxuICAgICAgLy8gRm9yIGV4YW1wbGUgWydiZXR0ZXItc3FsaXRlMyddIGlmIHlvdSB1c2UgdGhhdCBpbiBzZXJ2ZXIgZnVuY3Rpb25zLlxuICAgICAgZXhjbHVkZTogW10sXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGFuIGFkdmFuY2VkIHNldHRpbmcuIEl0IGltcHJvdmVzIHRoZSBidW5kbGluZyBvZiB5b3VyIHNlcnZlciBjb2RlLiBUbyB1c2UgaXQsIG1ha2Ugc3VyZSB5b3UgdW5kZXJzdGFuZCB3aGVuIHlvdXIgY29uc3VtZWQgcGFja2FnZXMgYXJlIGRlcGVuZGVuY2llcyBvciBkZXYgZGVwZW5kZW5jaWVzLiAob3RoZXJ3aXNlIHRoaW5ncyB3aWxsIGJyZWFrIGluIHByb2R1Y3Rpb24pXG4gICAgICovXG4gICAgLy8gc3NyOlxuICAgIC8vICAgY29tbWFuZCA9PT0gXCJidWlsZFwiICYmIG1vZGUgPT09IFwicHJvZHVjdGlvblwiXG4gICAgLy8gICAgID8ge1xuICAgIC8vICAgICAgICAgLy8gQWxsIGRldiBkZXBlbmRlbmNpZXMgc2hvdWxkIGJlIGJ1bmRsZWQgaW4gdGhlIHNlcnZlciBidWlsZFxuICAgIC8vICAgICAgICAgbm9FeHRlcm5hbDogT2JqZWN0LmtleXMoZGV2RGVwZW5kZW5jaWVzKSxcbiAgICAvLyAgICAgICAgIC8vIEFueXRoaW5nIG1hcmtlZCBhcyBhIGRlcGVuZGVuY3kgd2lsbCBub3QgYmUgYnVuZGxlZFxuICAgIC8vICAgICAgICAgLy8gVGhlc2Ugc2hvdWxkIG9ubHkgYmUgcHJvZHVjdGlvbiBiaW5hcnkgZGVwcyAoaW5jbHVkaW5nIGRlcHMgb2YgZGVwcyksIENMSSBkZXBzLCBhbmQgdGhlaXIgbW9kdWxlIGdyYXBoXG4gICAgLy8gICAgICAgICAvLyBJZiBhIGRlcC1vZi1kZXAgbmVlZHMgdG8gYmUgZXh0ZXJuYWwsIGFkZCBpdCBoZXJlXG4gICAgLy8gICAgICAgICAvLyBGb3IgZXhhbXBsZSwgaWYgc29tZXRoaW5nIHVzZXMgYGJjcnlwdGAgYnV0IHlvdSBkb24ndCBoYXZlIGl0IGFzIGEgZGVwLCB5b3UgY2FuIHdyaXRlXG4gICAgLy8gICAgICAgICAvLyBleHRlcm5hbDogWy4uLk9iamVjdC5rZXlzKGRlcGVuZGVuY2llcyksICdiY3J5cHQnXVxuICAgIC8vICAgICAgICAgZXh0ZXJuYWw6IE9iamVjdC5rZXlzKGRlcGVuZGVuY2llcyksXG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICA6IHVuZGVmaW5lZCxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgLy8gRG9uJ3QgY2FjaGUgdGhlIHNlcnZlciByZXNwb25zZSBpbiBkZXYgbW9kZVxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJwdWJsaWMsIG1heC1hZ2U9MFwiLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHByZXZpZXc6IHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgLy8gRG8gY2FjaGUgdGhlIHNlcnZlciByZXNwb25zZSBpbiBwcmV2aWV3IChub24tYWRhcHRlciBwcm9kdWN0aW9uIGJ1aWxkKVxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJwdWJsaWMsIG1heC1hZ2U9NjAwXCIsXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59KTtcbi8vICoqKiB1dGlscyAqKipcbi8qKlxuICogRnVuY3Rpb24gdG8gaWRlbnRpZnkgZHVwbGljYXRlIGRlcGVuZGVuY2llcyBhbmQgdGhyb3cgYW4gZXJyb3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXZEZXBlbmRlbmNpZXMgLSBMaXN0IG9mIGRldmVsb3BtZW50IGRlcGVuZGVuY2llc1xuICogQHBhcmFtIHtPYmplY3R9IGRlcGVuZGVuY2llcyAtIExpc3Qgb2YgcHJvZHVjdGlvbiBkZXBlbmRlbmNpZXNcbiAqL1xuZnVuY3Rpb24gZXJyb3JPbkR1cGxpY2F0ZXNQa2dEZXBzKFxuICBkZXZEZXBlbmRlbmNpZXM6IFBrZ0RlcCxcbiAgZGVwZW5kZW5jaWVzOiBQa2dEZXAsXG4pIHtcbiAgbGV0IG1zZyA9IFwiXCI7XG4gIC8vIENyZWF0ZSBhbiBhcnJheSAnZHVwbGljYXRlRGVwcycgYnkgZmlsdGVyaW5nIGRldkRlcGVuZGVuY2llcy5cbiAgLy8gSWYgYSBkZXBlbmRlbmN5IGFsc28gZXhpc3RzIGluIGRlcGVuZGVuY2llcywgaXQgaXMgY29uc2lkZXJlZCBhIGR1cGxpY2F0ZS5cbiAgY29uc3QgZHVwbGljYXRlRGVwcyA9IE9iamVjdC5rZXlzKGRldkRlcGVuZGVuY2llcykuZmlsdGVyKFxuICAgIChkZXApID0+IGRlcGVuZGVuY2llc1tkZXBdLFxuICApO1xuICAvLyBpbmNsdWRlIGFueSBrbm93biBxd2lrIHBhY2thZ2VzXG4gIGNvbnN0IHF3aWtQa2cgPSBPYmplY3Qua2V5cyhkZXBlbmRlbmNpZXMpLmZpbHRlcigodmFsdWUpID0+XG4gICAgL3F3aWsvaS50ZXN0KHZhbHVlKSxcbiAgKTtcbiAgLy8gYW55IGVycm9ycyBmb3IgbWlzc2luZyBcInF3aWstY2l0eS1wbGFuXCJcbiAgLy8gW1BMVUdJTl9FUlJPUl06IEludmFsaWQgbW9kdWxlIFwiQHF3aWstY2l0eS1wbGFuXCIgaXMgbm90IGEgdmFsaWQgcGFja2FnZVxuICBtc2cgPSBgTW92ZSBxd2lrIHBhY2thZ2VzICR7cXdpa1BrZy5qb2luKFwiLCBcIil9IHRvIGRldkRlcGVuZGVuY2llc2A7XG4gIGlmIChxd2lrUGtnLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgfVxuICAvLyBGb3JtYXQgdGhlIGVycm9yIG1lc3NhZ2Ugd2l0aCB0aGUgZHVwbGljYXRlcyBsaXN0LlxuICAvLyBUaGUgYGpvaW5gIGZ1bmN0aW9uIGlzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBlbGVtZW50cyBvZiB0aGUgJ2R1cGxpY2F0ZURlcHMnIGFycmF5IGFzIGEgY29tbWEtc2VwYXJhdGVkIHN0cmluZy5cbiAgbXNnID0gYFxuICAgIFdhcm5pbmc6IFRoZSBkZXBlbmRlbmN5IFwiJHtkdXBsaWNhdGVEZXBzLmpvaW4oXCIsIFwiKX1cIiBpcyBsaXN0ZWQgaW4gYm90aCBcImRldkRlcGVuZGVuY2llc1wiIGFuZCBcImRlcGVuZGVuY2llc1wiLlxuICAgIFBsZWFzZSBtb3ZlIHRoZSBkdXBsaWNhdGVkIGRlcGVuZGVuY2llcyB0byBcImRldkRlcGVuZGVuY2llc1wiIG9ubHkgYW5kIHJlbW92ZSBpdCBmcm9tIFwiZGVwZW5kZW5jaWVzXCJcbiAgYDtcbiAgLy8gVGhyb3cgYW4gZXJyb3Igd2l0aCB0aGUgY29uc3RydWN0ZWQgbWVzc2FnZS5cbiAgaWYgKGR1cGxpY2F0ZURlcHMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICB9XG59XG4iLCAie1xuICBcIm5hbWVcIjogXCJteS1xd2lrLWVtcHR5LXN0YXJ0ZXJcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkJsYW5rIHByb2plY3Qgd2l0aCByb3V0aW5nIGluY2x1ZGVkXCIsXG4gIFwiZW5naW5lc1wiOiB7XG4gICAgXCJub2RlXCI6IFwiXjE4LjE3LjAgfHwgXjIwLjMuMCB8fCA+PTIxLjAuMFwiXG4gIH0sXG4gIFwiZW5naW5lcy1hbm5vdGF0aW9uXCI6IFwiTW9zdGx5IHJlcXVpcmVkIGJ5IHNoYXJwIHdoaWNoIG5lZWRzIGEgTm9kZS1BUEkgdjkgY29tcGF0aWJsZSBydW50aW1lXCIsXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxuICBcInRydXN0ZWREZXBlbmRlbmNpZXNcIjogW1xuICAgIFwic2hhcnBcIlxuICBdLFxuICBcInRydXN0ZWREZXBlbmRlbmNpZXMtYW5ub3RhdGlvblwiOiBcIk5lZWRlZCBmb3IgYnVuIHRvIGFsbG93IHJ1bm5pbmcgaW5zdGFsbCBzY3JpcHRzXCIsXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiY2xlYW5cIjogXCJraWxsLXBvcnQgNTE3MzsgcmltcmFmIC4vbm9kZV9tb2R1bGVzLy52aXRlOyByaW1yYWYgLi9kaXN0OyByaW1yYWYgLi9zZXJ2ZXJcIixcbiAgICBcInByZWJ1aWxkXCI6IFwibnBtIHJ1biBjbGVhblwiLFxuICAgIFwiYnVpbGQ6cXdpa1wiOiBcInF3aWsgYnVpbGRcIixcbiAgICBcImJ1aWxkXCI6IFwibnB4IHRhdXJpIGJ1aWxkIC0tdGFyZ2V0IHVuaXZlcnNhbC1hcHBsZS1kYXJ3aW5cIixcbiAgICBcImJ1aWxkLmNsaWVudFwiOiBcInZpdGUgYnVpbGRcIixcbiAgICBcImJ1aWxkLnByZXZpZXdcIjogXCJ2aXRlIGJ1aWxkIC0tc3NyIHNyYy9lbnRyeS5wcmV2aWV3LnRzeFwiLFxuICAgIFwiYnVpbGQuc2VydmVyXCI6IFwidml0ZSBidWlsZCAtYyBhZGFwdGVycy9zdGF0aWMvdml0ZS5jb25maWcudHNcIixcbiAgICBcImJ1aWxkLnR5cGVzXCI6IFwidHNjIC0taW5jcmVtZW50YWwgLS1ub0VtaXRcIixcbiAgICBcImRlcGxveVwiOiBcImVjaG8gJ1J1biBcXFwibnBtIHJ1biBxd2lrIGFkZFxcXCIgdG8gaW5zdGFsbCBhIHNlcnZlciBhZGFwdGVyJ1wiLFxuICAgIFwiZGV2XCI6IFwia2lsbC1wb3J0IDUxNzM7IG5weCB0YXVyaSBkZXY7IGtpbGwtcG9ydCA1MTczXCIsXG4gICAgXCJkZXY6dml0ZVwiOiBcInZpdGUgLS1wb3J0IDUxNzMgLS1tb2RlIHNzclwiLFxuICAgIFwiZGV2LmRlYnVnXCI6IFwibm9kZSAtLWluc3BlY3QtYnJrIC4vbm9kZV9tb2R1bGVzL3ZpdGUvYmluL3ZpdGUuanMgLS1tb2RlIHNzciAtLWZvcmNlXCIsXG4gICAgXCJmbXRcIjogXCJwcmV0dGllciAtLXdyaXRlIC5cIixcbiAgICBcImZtdC5jaGVja1wiOiBcInByZXR0aWVyIC0tY2hlY2sgLlwiLFxuICAgIFwibGludFwiOiBcImVzbGludCBcXFwic3JjLyoqLyoudHMqXFxcIlwiLFxuICAgIFwicHJldmlld1wiOiBcInF3aWsgYnVpbGQgcHJldmlldyAmJiB2aXRlIHByZXZpZXcgLS1vcGVuXCIsXG4gICAgXCJzdGFydFwiOiBcInZpdGUgLS1vcGVuIC0tbW9kZSBzc3JcIixcbiAgICBcInRhdXJpXCI6IFwidGF1cmlcIixcbiAgICBcInF3aWtcIjogXCJxd2lrXCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGJ1aWxkZXIuaW8vcXdpa1wiOiBcIl4xLjcuMVwiLFxuICAgIFwiQGJ1aWxkZXIuaW8vcXdpay1jaXR5XCI6IFwiXjEuNy4xXCIsXG4gICAgXCJAdHlwZXMvZXNsaW50XCI6IFwiXjguNTYuMTBcIixcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiXjIwLjEyLjdcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjcuNy4xXCIsXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvcGFyc2VyXCI6IFwiXjcuNy4xXCIsXG4gICAgXCJlc2xpbnRcIjogXCJeOC41Ny4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXF3aWtcIjogXCJeMS43LjFcIixcbiAgICBcImtpbGwtcG9ydFwiOiBcIl4yLjAuMVwiLFxuICAgIFwicHJldHRpZXJcIjogXCJeMy4yLjVcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCI1LjQuNVwiLFxuICAgIFwidW5kaWNpXCI6IFwiKlwiLFxuICAgIFwidml0ZVwiOiBcIl41LjIuMTBcIixcbiAgICBcInZpdGUtdHNjb25maWctcGF0aHNcIjogXCJeNC4yLjFcIlxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAanVqaS9heGlvcy10YXVyaS1hcGktYWRhcHRlclwiOiBcIl4wLjIuM1wiLFxuICAgIFwiQGp1amkvcHJlZmxpZ2h0XCI6IFwiXjEuMC4xXCIsXG4gICAgXCJAanVqaS95b3V0dWJlLXZpZGVvLWpzXCI6IFwiXjQuMC42XCIsXG4gICAgXCJAdGF1cmktYXBwcy9hcGlcIjogXCJeMS42LjBcIixcbiAgICBcIkB0YXVyaS1hcHBzL2NsaVwiOiBcIl4xLjYuMFwiLFxuICAgIFwiYXhpb3NcIjogXCJeMS43LjJcIixcbiAgICBcImRhdGUtZm5zXCI6IFwiXjMuNi4wXCIsXG4gICAgXCJpY29uLWdlblwiOiBcIl40LjAuMFwiLFxuICAgIFwicmltcmFmXCI6IFwiXjYuMC4xXCIsXG4gICAgXCJ5b3V0dWJlLXZpZGVvLWpzXCI6IFwiXjQuMC4xXCJcbiAgfSxcbiAgXCJwYWNrYWdlTWFuYWdlclwiOiBcInlhcm5AMS4yMi4yMlwiXG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlTLFNBQVMscUJBQXFCO0FBQy9ULFNBQVMsb0JBQW9COzs7QUNHN0IsU0FBUyxvQkFBcUM7QUFDOUMsU0FBUyxnQkFBZ0I7QUFDekIsU0FBUyxnQkFBZ0I7QUFDekIsT0FBTyxtQkFBbUI7OztBQ1AxQjtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsYUFBZTtBQUFBLEVBQ2YsU0FBVztBQUFBLElBQ1QsTUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLHNCQUFzQjtBQUFBLEVBQ3RCLFNBQVc7QUFBQSxFQUNYLHFCQUF1QjtBQUFBLElBQ3JCO0FBQUEsRUFDRjtBQUFBLEVBQ0Esa0NBQWtDO0FBQUEsRUFDbEMsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLElBQ1QsT0FBUztBQUFBLElBQ1QsVUFBWTtBQUFBLElBQ1osY0FBYztBQUFBLElBQ2QsT0FBUztBQUFBLElBQ1QsZ0JBQWdCO0FBQUEsSUFDaEIsaUJBQWlCO0FBQUEsSUFDakIsZ0JBQWdCO0FBQUEsSUFDaEIsZUFBZTtBQUFBLElBQ2YsUUFBVTtBQUFBLElBQ1YsS0FBTztBQUFBLElBQ1AsWUFBWTtBQUFBLElBQ1osYUFBYTtBQUFBLElBQ2IsS0FBTztBQUFBLElBQ1AsYUFBYTtBQUFBLElBQ2IsTUFBUTtBQUFBLElBQ1IsU0FBVztBQUFBLElBQ1gsT0FBUztBQUFBLElBQ1QsT0FBUztBQUFBLElBQ1QsTUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLGlCQUFtQjtBQUFBLElBQ2pCLG9CQUFvQjtBQUFBLElBQ3BCLHlCQUF5QjtBQUFBLElBQ3pCLGlCQUFpQjtBQUFBLElBQ2pCLGVBQWU7QUFBQSxJQUNmLG9DQUFvQztBQUFBLElBQ3BDLDZCQUE2QjtBQUFBLElBQzdCLFFBQVU7QUFBQSxJQUNWLHNCQUFzQjtBQUFBLElBQ3RCLGFBQWE7QUFBQSxJQUNiLFVBQVk7QUFBQSxJQUNaLFlBQWM7QUFBQSxJQUNkLFFBQVU7QUFBQSxJQUNWLE1BQVE7QUFBQSxJQUNSLHVCQUF1QjtBQUFBLEVBQ3pCO0FBQUEsRUFDQSxjQUFnQjtBQUFBLElBQ2QsaUNBQWlDO0FBQUEsSUFDakMsbUJBQW1CO0FBQUEsSUFDbkIsMEJBQTBCO0FBQUEsSUFDMUIsbUJBQW1CO0FBQUEsSUFDbkIsbUJBQW1CO0FBQUEsSUFDbkIsT0FBUztBQUFBLElBQ1QsWUFBWTtBQUFBLElBQ1osWUFBWTtBQUFBLElBQ1osUUFBVTtBQUFBLElBQ1Ysb0JBQW9CO0FBQUEsRUFDdEI7QUFBQSxFQUNBLGdCQUFrQjtBQUNwQjs7O0FEcERBLElBQU0sRUFBRSxlQUFlLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLElBQUk7QUFLcEQseUJBQXlCLGlCQUFpQixZQUFZO0FBS3RELElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQWtCO0FBQzdELFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNULGNBQWM7QUFBQSxJQUNoQjtBQUFBO0FBQUEsSUFFQSxjQUFjO0FBQUE7QUFBQTtBQUFBLE1BR1osU0FBUyxDQUFDO0FBQUEsSUFDWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFpQkEsUUFBUTtBQUFBLE1BQ04sU0FBUztBQUFBO0FBQUEsUUFFUCxpQkFBaUI7QUFBQSxNQUNuQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQTtBQUFBLFFBRVAsaUJBQWlCO0FBQUEsTUFDbkI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7QUFPRCxTQUFTLHlCQUNQQSxrQkFDQUMsZUFDQTtBQUNBLE1BQUksTUFBTTtBQUdWLFFBQU0sZ0JBQWdCLE9BQU8sS0FBS0QsZ0JBQWUsRUFBRTtBQUFBLElBQ2pELENBQUMsUUFBUUMsY0FBYSxHQUFHO0FBQUEsRUFDM0I7QUFFQSxRQUFNLFVBQVUsT0FBTyxLQUFLQSxhQUFZLEVBQUU7QUFBQSxJQUFPLENBQUMsVUFDaEQsUUFBUSxLQUFLLEtBQUs7QUFBQSxFQUNwQjtBQUdBLFFBQU0sc0JBQXNCLFFBQVEsS0FBSyxJQUFJLENBQUM7QUFDOUMsTUFBSSxRQUFRLFNBQVMsR0FBRztBQUN0QixVQUFNLElBQUksTUFBTSxHQUFHO0FBQUEsRUFDckI7QUFHQSxRQUFNO0FBQUEsK0JBQ3VCLGNBQWMsS0FBSyxJQUFJLENBQUM7QUFBQTtBQUFBO0FBSXJELE1BQUksY0FBYyxTQUFTLEdBQUc7QUFDNUIsVUFBTSxJQUFJLE1BQU0sR0FBRztBQUFBLEVBQ3JCO0FBQ0Y7OztBRGhHQSxJQUFPQyx1QkFBUSxhQUFhLHFCQUFZLE1BQU07QUFDNUMsU0FBTztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0wsS0FBSztBQUFBLE1BQ0wsZUFBZTtBQUFBLFFBQ2IsT0FBTyxDQUFDLGlCQUFpQjtBQUFBLE1BQzNCO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsY0FBYztBQUFBLFFBQ1osUUFBUTtBQUFBLE1BQ1YsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsiZGV2RGVwZW5kZW5jaWVzIiwgImRlcGVuZGVuY2llcyIsICJ2aXRlX2NvbmZpZ19kZWZhdWx0Il0KfQo=
