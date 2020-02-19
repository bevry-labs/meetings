FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
CMD ["npm", "install"]
COPY . .
CMD ["npx", "next", "build"]
CMD ["npx", "next", "start"]