FROM node:18.16-alpine3.18

WORKDIR /app

COPY . .

EXPOSE 7014

ENTRYPOINT ["./entrypoint.sh"]
