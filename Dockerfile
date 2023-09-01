FROM node:16.17.0

COPY . .

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]