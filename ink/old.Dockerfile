FROM buildpack-deps:buster

ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH \
    RUST_VERSION=1.41.0 \
    CARGO_CONTRACT_VERSION="v0.6.0" \
    NIGHTLY_VERSION="nightly-2020-01-20"

SHELL ["/bin/bash","-c"]

RUN set -eux; \
    dpkgArch="$(dpkg --print-architecture)"; \
    case "${dpkgArch##*-}" in \
        amd64) rustArch='x86_64-unknown-linux-gnu'; rustupSha256='e68f193542c68ce83c449809d2cad262cc2bbb99640eb47c58fc1dc58cc30add' ;; \
        armhf) rustArch='armv7-unknown-linux-gnueabihf'; rustupSha256='7c1c329a676e50c287d8183b88f30cd6afd0be140826a9fbbc0e3d717fab34d7' ;; \
        arm64) rustArch='aarch64-unknown-linux-gnu'; rustupSha256='d861cc86594776414de001b96964be645c4bfa27024052704f0976dc3aed1b18' ;; \
        i386) rustArch='i686-unknown-linux-gnu'; rustupSha256='89f1f797dca2e5c1d75790c3c6b7be0ee473a7f4eca9663e623a41272a358da0' ;; \
        *) echo >&2 "unsupported architecture: ${dpkgArch}"; exit 1 ;; \
    esac; \
    url="https://static.rust-lang.org/rustup/archive/1.20.2/${rustArch}/rustup-init"; \
    wget "$url"; \
    echo "${rustupSha256} *rustup-init" | sha256sum -c -; \
    chmod +x rustup-init; \
    ./rustup-init -y --no-modify-path --profile minimal --default-toolchain $RUST_VERSION; \
    rm rustup-init; \
    chmod -R a+w $RUSTUP_HOME $CARGO_HOME; \
    rustup --version; \
    cargo --version; \
    rustc --version;

RUN set -eux;\
    \
    apt-get update && apt-get install -y curl jq cmake; \
    JQ_URL="https://circle-downloads.s3.amazonaws.com/circleci-images/cache/linux-amd64/jq-latest"; \
    curl --silent --show-error --location --fail --retry 3 --output /usr/bin/jq $JQ_URL; \
    chmod +x /usr/bin/jq; \
    jq --version; \
    rustup install $NIGHTLY_VERSION;

RUN set -eux;\
    \ 
    cargo install --force --git https://github.com/paritytech/cargo-contract --rev $CARGO_CONTRACT_VERSION cargo-contract; \
    git clone https://github.com/WebAssembly/binaryen.git; \
    pushd binaryen; \
    cmake . && make; \
    cp bin/wasm-opt /usr/local/bin; \
    popd; \
    rm -rf binaryen;

RUN set -eux; \
    \
    rustup default $NIGHTLY_VERSION; \
    rustup target add wasm32-unknown-unknown --toolchain $NIGHTLY_VERSION; \
    rustup component add rust-src; \
    mkdir /projects; \
    cd /projects; \
    cargo contract new sample; \
    cd sample; \
    cargo contract build; \
    cargo contract generate-metadata; \
    rm target/sample* target/metadata.json;

WORKDIR /projects/sample

CMD rm ./lib.rs; \
    cp -f "/share/${NONCE}.rs" ./lib.rs; \
    mkdir "/share/${NONCE}"; \
    echo -e "[build wasm]\n cargo contract build" > "/share/${NONCE}/log.txt"; \
    cargo contract build >> "/share/${NONCE}/log.txt" 2>&1; \
    echo -e "\n[build abi]\n cargo contract generate-metadata" >> "/share/${NONCE}/log.txt"; \
    cargo contract generate-metadata >> "/share/${NONCE}/log.txt" 2>&1; \
    cp target/sample*.wasm "/share/${NONCE}"; \
    cp target/metadata.json "/share/${NONCE}";
