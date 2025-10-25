FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run db:generate
RUN npm run build
RUN ls -la dist/

EXPOSE 3001

CMD ["npm", "start"]
