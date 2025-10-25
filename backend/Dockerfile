FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run db:generate
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
