#!/usr/bin/env bash
# This isn't a good script
# But it works
cd ../build && \
gzip *.js -k -7 && \
brotli -9kf *.js && \
gzip *.json -k -7 && \
gzip *.html -k -7 && \
cd icons && \
brotli -9kf * && \
gzip *.png -k -7 && \
gzip *.ico -k -7 && \
cd ../static && \
brotli -9kf css/* && \
brotli -9kf js/* && \
gzip -k -9 css/*.css && \
gzip -k -9 js/*.js