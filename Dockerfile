FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT 3000
RUN npx next build
EXPOSE 3000
CMD ["npx", "next", "start"]