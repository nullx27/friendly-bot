FROM node:12.4.0

WORKDIR /opt/bot
COPY . .

RUN npm ci --only=production
RUN npm run build

CMD ["npm", "run start"]
