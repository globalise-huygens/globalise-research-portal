# Globalise Research Portal

Integrate globalise design with search and document components.

Demo: https://dev.globalise.nl/

## Development

- First time: `pnpm install`

- Start: `pnpm start`
- Test: `pnpm test`
- Build: `pnpm build`
- Check types: `pnpm typecheck`

When adding a new package:
 - add path to root tsconfig.json
 - add dependency to consuming package.json
 - add path to consuming tsconfig.json

## nginx + db + compose

`docker-compose.yaml` example setup with nginx proxy and mounted db.
Start: `docker compose up -d`, and open http://127.0.0.1:3000.

- `globalise-research-portal` is build by CI, pushed to public `ghcr.io/globalise-huygens/globalise-research-portal:latest` 
- sqlite db is mounted from `./data/globalise.db` to `/data/globalise.db`, and configured with `GLOBALISE_DB`
- `nginx` is published on port 3000
