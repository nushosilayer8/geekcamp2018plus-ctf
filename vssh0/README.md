# Pwn Challenge Docker Template

## Setup and deployment
- Move your binary to `./challenge/challenge`
- Add the flag to `./challenge/flag`
- Rename the `container_name` parameter in `./docker-compose.yml` with your challenge name
- Run `docker-compose up`
- The challenge will be at `nc localhost 31337`
