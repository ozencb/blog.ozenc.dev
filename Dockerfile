FROM mcr.microsoft.com/playwright:focal

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build:prod

CMD ["npm", "start"]
