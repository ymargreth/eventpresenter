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
