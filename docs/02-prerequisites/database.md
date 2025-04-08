---
sidebar_position: 2
---

# Database (optional)

Most applications require a database. If you require a database Gofs templates ship with a _docker-compose_ file to run a local postgres instance.

To run a local postgres you will need a container runtime such as:

- [Docker](https://www.docker.com)
- [Podman](https://podman.io)

Once this is setup and you have initialized a project you can start a Postgres instance with:

```bash
make dbup
```
