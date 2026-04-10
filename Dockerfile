FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm install express tsx
COPY --from=builder /app/dist ./dist
COPY server.ts ./
ENV PORT=3000
EXPOSE 3000
CMD ["npx", "tsx", "server.ts"]