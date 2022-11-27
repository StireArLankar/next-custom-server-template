FROM endeveit/docker-jq AS deps

WORKDIR /tmp

COPY package.json temp.json
RUN jq '{ dependencies, devDependencies, resolutions, scripts, private, name }' < /tmp/temp.json > /tmp/package.json
RUN rm /tmp/temp.json

FROM node:16-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY yarn.lock tsconfig.json tsconfig.server.json ./
COPY --from=deps /tmp /app

ENV CI=true

RUN yarn install --frozen-lockfile

COPY src src
COPY public public
COPY types types
COPY _esbuild.ts .editorconfig .eslintrc.json .prettierrc next-env.d.ts next.config.js next-i18next.config.js ./
RUN yarn build

COPY next.config.copy.ts ./
RUN yarn build:esbuild

FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/dist/dev.js ./server.js
COPY --from=builder --chown=nextjs:nodejs /app/dist/server1.js ./server1/index.js
# COPY --from=builder --chown=nextjs:nodejs /app/config/config.yml ./config/config.yml

COPY --from=builder --chown=nextjs:nodejs /app/node_modules/swagger-ui-dist ./node_modules/swagger-ui-dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/swagger-ui-express ./node_modules/swagger-ui-express

USER nextjs

# EXPOSE 9002
# EXPOSE 3000

# ENV PORT 3000
RUN ls -al
ARG VERSION
ENV VERSION=${VERSION}
CMD ["node", "server.js"]
