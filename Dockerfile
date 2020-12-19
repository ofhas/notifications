FROM node:14
WORKDIR /opt/pini/notification
COPY . .
RUN npm install
RUN npm run build
RUN npm prune --production
EXPOSE 8080
CMD [ "node", "dist/index.js"  ]
