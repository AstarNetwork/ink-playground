FROM buildpack-deps:buster

ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH \
    INK_VERSION=b0429dea376e21cd24cdaa8fb8e3d43bc44c8924

SHELL ["/bin/bash","-c"]

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
    : "wasm from here"; \
    cargo install --force --git https://github.com/paritytech/ink --rev $INK_VERSION cargo-contract; \
    rustup target add wasm32-unknown-unknown; 

RUN set -eux; \
    mkdir /projects; \
    cd /projects; \
    cargo contract new sample; \
    cd sample; \
    cargo contract build; \
    cargo +nightly build --features ink-generate-abi; \
		cargo +nightly run -p abi-gen; \
    rm target/sample* target/old_abi.json target/abi.json;

WORKDIR /projects/sample

CMD rm ./src/lib.rs; \
		cp -f "/share/${NONCE}.rs" ./src/lib.rs; \
		mkdir "/share/${NONCE}"; \
		echo -e "[build wasm]\n cargo contract build" > "/share/${NONCE}/log.txt"; \
    cargo contract build >> "/share/${NONCE}/log.txt" 2>&1; \
    #cargo +nightly build --features ink-generate-abi >> "/share/${NONCE}/log.txt" 2>&1; \
    echo -e "\n[build abi]\n cargo +nightly run -p abi-gen" >> "/share/${NONCE}/log.txt"; \
    cargo +nightly run -p abi-gen >> "/share/${NONCE}/log.txt" 2>&1; \
    cp target/sample*.wasm "/share/${NONCE}"; \
		cp target/old_abi.json "/share/${NONCE}"; \
		cp target/abi.json "/share/${NONCE}";
