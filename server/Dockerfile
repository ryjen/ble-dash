# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Install Python and pip
RUN apk add --no-cache python3 py3-pip make

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+ produces package-lock.json)
COPY package*.json ./

RUN npm install

# Copy app source code
COPY index.js ./

# Command to run the application
CMD [ "npm", "start" ]

# Important Note for BLE in Docker:
# For the BLE server to work, the Docker container needs access to the host's Bluetooth adapter.
# This typically requires running the container with elevated privileges and/or specific device mappings.
# Example run command (adjust as per your system and Bluetooth adapter):
# docker run --net=host --privileged -it <your-image-name>
# Or, if you have a specific Bluetooth device:
# docker run --device=/dev/bluetooth --device=/dev/bus/usb/<bus>/<device> -it <your-image-name>
# Consult your system's documentation for proper Bluetooth device mapping in Docker.
