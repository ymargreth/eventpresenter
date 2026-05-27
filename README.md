# eventpresenter by _ymargreth_

> Self-hosted alternative to _LinkTree_

## Prerequisites

1. install `docker` and `docker-compose`

   ```sh
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

   > The purpose of the install script is for a convenience for quickly installing the latest Docker-CE releases on the supported linux distros. It is not recommended to depend on this script for deployment to production systems. For more thorough instructions for installing on the supported distros, see the [install instructions](https://docs.docker.com/engine/install/).

1. install `git`

   ```sh
   sudo apt install git
   ```

1. install `make` (optional)

   ```sh
   sudo apt install make
   ```

## Container Setup

1. clone the repo:

   ```sh
   git clone https://github.com/ymargreth/eventpresenter.git
   ```

1. start the container:

   ```sh
   docker-compose up -d
   ```

   or (optionally)

   ```sh
   make
   ```

1. use the following url:

   ```md
   (http://localhost:42080/)
   ```

   the following url opens the admin panel:

   ```md
   (http://localhost:42080/?q=admin)
   ```

   the following url opens the QR generator:

   ```md
   (http://localhost:42080/?q=qr)
   ```

## how to update to the latest release

if you cloned the repo like described above, just use the followin commands:

```
git pull
make rebuild
```

## MAKE commands

**all commands check for the docker engine to run first**

_SERVICE=xxx_ is **always** optional! (_xxx_ should be replaced by your **service name**!)

```sh
make up SERVICE=xxx
```

> docker-compose up xxx

```sh
make down SERVICE=xxx
```

> docker-compose down xxx

```sh
make pause SERVICE=xxx
make stop SERVICE=xxx
```

> docker-compose stop xxx

```sh
make start SERVICE=xxx
make run SERVICE=xxx
```

> docker-compose up -d xxx

```sh
make reset
```

> docker-compose down
>
> docker-compose run

```sh
make rebuild SERVICE=xxx
```

> docker-compose down
>
> docker-compose up -d --build xxx

```sh
make logs SERVICE=xxx
```

> docker-compose logs -f xxx
>
> docker-compose up -d --build

```sh
make status
make ps
```

> docker-compose ps

```sh
make status
make ps
```

> docker-compose down -v --remove-orphans
