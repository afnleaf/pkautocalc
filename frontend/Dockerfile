# image
FROM oven/bun:1.0

# where are we working
WORKDIR /home/bun/app

# copy package json to directory
COPY ./package.json .

# install dependencies
RUN bun install

# copy all files in this directory to working directory inside container
COPY . .

# some scripts
CMD [ "bun", "run", "dev"]