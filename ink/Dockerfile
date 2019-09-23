FROM buildpack-deps:buster

ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH

RUN set -eux; \
    \
    url="https://static.rust-lang.org/rustup/dist/x86_64-unknown-linux-gnu/rustup-init"; \
    wget "$url"; \
    chmod +x rustup-init; \
    ./rustup-init -y --no-modify-path --default-toolchain nightly; \
    rm rustup-init; \
    chmod -R a+w $RUSTUP_HOME $CARGO_HOME; \
    rustup --version; \
    cargo --version; \
    rustc --version;

RUN set -eux;\
    \
    apt-get update && apt-get install -y curl jq; \
    JQ_URL="https://circle-downloads.s3.amazonaws.com/circleci-images/cache/linux-amd64/jq-latest"; \
    curl --silent --show-error --location --fail --retry 3 --output /usr/bin/jq $JQ_URL; \
    chmod +x /usr/bin/jq; \
    jq --version; \
    : "ここからwasm"; \
    mkdir ~/.cargo; \
    mkdir ~/.cargo/bin; \
    curl https://raw.githubusercontent.com/paritytech/scripts/master/install-wasm-binaries.sh -sSf |bash -s;\
    ls ~/.cargo/bin; \
    #cp -f ~/.cargo/bin/wat2wasm ${CARGO_HOME}/bin/; \
    #cp -f ~/.cargo/bin/wasm2wat ${CARGO_HOME}/bin/; \
    rm -rf ~/.cargo; \
    cargo install pwasm-utils-cli --bin wasm-prune --force; \
    cargo install --force --git https://github.com/paritytech/ink cargo-contract; \
    rustup target add wasm32-unknown-unknown; 

RUN set -eux;\
    mkdir /projects; \
    cd /projects; \
    cargo contract new sample; \
    cd sample; \
    ./build.sh; \
    cargo +nightly build --features ink-generate-abi; \
    rm target/sample* target/old_abi.json src/lib.rs;

WORKDIR /projects/sample

CMD cp -f "/share/${NONCE}.rs" ./src/lib.rs; \
    ./build.sh; \
    cargo +nightly build --features ink-generate-abi; \
    tar -cvzf target.tgz target/sample* target/old_abi.json; \
		mkdir "/share/${NONCE}"; \
    cp -f ./target.tgz /share/${NONCE}; \
		cp target/sample*.wat "/share/${NONCE}";
