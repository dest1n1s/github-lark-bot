FROM nikolaik/python-nodejs:python3.10-nodejs16 as builder

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn

COPY . /app

CMD yarn start

EXPOSE 3000
