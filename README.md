# LoFi

A Desktop app to search and listen to LoFi.

Just turn it on, and forget it.
Also, you can bookmark your favorite LoFi.

## Build

You will need to build this yourself.

## On mac:
```bash
npm i
npx tauri build --target universal-apple-darwin
```

On Other platforms, checkout [Tauri Docs](https://tauri.app/v1/guides/building/)

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
