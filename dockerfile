FROM node:18

WORKDIR /backend/
COPY ./package.json /backend/
COPY ./yarn.lock /backend/
COPY ./prisma/schema.prisma ./prisma/schema.prisma
RUN yarn install
RUN yarn prisma generate

COPY . /backend/
CMD yarn start:dev