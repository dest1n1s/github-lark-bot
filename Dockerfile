FROM nikolaik/python-nodejs:python3.10-nodejs16 as builder

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn

COPY . /app

# write Github Secrets to .env
#RUN --mount=type=secret,id=GLB_PORT \
#    --mount=type=secret,id=GLB_USERNAME \
#    --mount=type=secret,id=GLB_PERSONAL_ACCESS_TOKEN \
#    --mount=type=secret,id=GLB_BASE_URL \
#    --mount=type=secret,id=GLB_APP_ID \
#    --mount=type=secret,id=GLB_APP_SECRET \
#    --mount=type=secret,id=GLB_BOT_OPEN_ID \
#    echo "GLB_PORT=$(cat /run/secrets/GLB_PORT)\n" >> .env && \
#    echo "GLB_USERNAME=$(cat /run/secrets/GLB_USERNAME)\n" >> .env && \
#    echo "GLB_PERSONAL_ACCESS_TOKEN=$(cat /run/secrets/GLB_PERSONAL_ACCESS_TOKEN)\n" >> .env && \
#    echo "GLB_BASE_URL=$(cat /run/secrets/GLB_BASE_URL)\n" >> .env && \
#    echo "GLB_APP_ID=$(cat /run/secrets/GLB_APP_ID)\n" >> .env && \
#    echo "GLB_APP_SECRET=$(cat /run/secrets/GLB_APP_SECRET)\n" >> .env && \
#    echo "GLB_BOT_OPEN_ID=$(cat /run/secrets/GLB_BOT_OPEN_ID)\n" >> .env

CMD yarn start

EXPOSE 3000
