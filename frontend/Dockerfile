FROM node:20

# Set work directory
ARG WORKDIR=/frontend

WORKDIR ${WORKDIR}

# Install dependencies
COPY package.json .

RUN npm install --legacy-peer-deps

ENTRYPOINT [ "npm", "run", "dev" ]