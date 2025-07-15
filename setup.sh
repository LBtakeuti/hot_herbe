#!/bin/bash

echo "Setting up HOT HERBE Next.js project..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if everything is working
echo "Testing build..."
npm run build

echo "Setup complete! Run 'npm run dev' to start the development server."