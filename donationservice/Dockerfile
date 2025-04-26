# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory in the container

WORKDIR /usr/src/donationservice


# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

ARG REDIRECTION_URI="http://localhost:3000"
ENV REDIRECTION_PAGE=$REDIRECTION_URI

ARG DONATION_SERVICE_URI="http://localhost:8006"
ENV DONATION_SERVICE=$DONATION_SERVICE_URI


# Copy the app source code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 8006

# Define the command to run your app

CMD ["node", "donate.js"]

