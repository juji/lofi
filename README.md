# LoFi

A Desktop app to search and listen to LoFi.

Just turn it on, and forget it.
Also, you can bookmark your favorite LoFi.

<p align="center"><image 
src="https://raw.githubusercontent.com/juji/lofi/main/utils/screen.png" 
width="1193px" 
height="auto" style="max-width:100%" /></p>

## Build

You will need to build this yourself.

## On mac:
```bash
npm i
npx tauri build
```

If that didn't work, try this:
```bash
npm i
rustup target add universal-apple-darwin
npx tauri build --target universal-apple-darwin
```

On Other platforms, checkout [Tauri Docs](https://tauri.app/v1/guides/building/). But it will probably be:

```
npm i
npx tauri build
```

## Last Known Config
```bash
➜  ~ cargo --version --verbose
cargo 1.79.0 (ffa9cf99a 2024-06-03)
release: 1.79.0
commit-hash: ffa9cf99a594e59032757403d4c780b46dc2c43a
commit-date: 2024-06-03
host: aarch64-apple-darwin
libgit2: 1.7.2 (sys:0.18.3 vendored)
libcurl: 8.6.0 (sys:0.4.72+curl-8.6.0 system ssl:(SecureTransport) LibreSSL/3.3.6)
ssl: OpenSSL 1.1.1w  11 Sep 2023
os: Mac OS 14.5.0 [64-bit]
➜  ~ npm -v
10.7.0
➜  ~ node -v
v20.15.0
```
<!--  -->