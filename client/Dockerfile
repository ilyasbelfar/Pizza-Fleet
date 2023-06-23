FROM node:14

WORKDIR /app

copy package.json .

copy . .

RUN npm i

EXPOSE 3000

CMD ["npm", "start"]
