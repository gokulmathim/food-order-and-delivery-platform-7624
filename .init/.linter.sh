#!/bin/bash
cd /home/kavia/workspace/code-generation/food-order-and-delivery-platform-7624/food_ordering_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

