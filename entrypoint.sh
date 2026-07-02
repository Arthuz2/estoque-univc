#!/bin/sh
set -e

flask db upgrade
exec gunicorn --bind 0.0.0.0:${PORT:-5000} run:app
