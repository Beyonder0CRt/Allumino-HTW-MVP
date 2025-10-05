#!/bin/bash

# Start the ML service
cd "$(dirname "$0")"
source venv/bin/activate
python app.py
