#!/usr/bin/env bash
# This isn't a good script
# But it works
cd ../build && \
gzip *.js -k -7 && \
gzip *.json -k -7 && \
gzip *.html -k -7 && \
cd icons && \
gzip * -k -7 && \
cd ../static && \
gzip * -r -k -7