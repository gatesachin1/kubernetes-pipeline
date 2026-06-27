FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app

COPY package.json .
RUN npm install --production

COPY app.js .

EXPOSE 3000

USER node

CMD ["node", "app.js"]
