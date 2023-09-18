###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Install /bin/pnpm
RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install app dependencies using /bin/pnpm
RUN /bin/pnpm install

# Install prisma client
RUN /bin/pnpm prisma generate

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

# Copy pnpm
COPY --from=development /bin/pnpm /bin/pnpm

RUN chmod +x /bin/pnpm

COPY --chown=node:node package.json pnpm-lock.yaml ./
COPY --chown=node:node prisma ./prisma/

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN /bin/pnpm prisma generate

# Run the build command which creates the production bundle
RUN /bin/pnpm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN /bin/pnpm install --prod --frozen-lockfile

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/main"]
