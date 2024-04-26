# Helper Script

A webserver needs to be setup an running for this to work (e.g. Nginx or Apache).

```bash
#!/bin/bash

# Check if the script is run with sudo
if ! [ "$EUID" -ne 0 ]; then
    echo "This script must NOT be run with sudo."
    exit 1
fi

cd ~/website-rancic/
sudo rm -rf /var/www/html/
sudo mkdir -p /var/www/html/
sudo cp -r . /var/www/html/

cd ~/website-rancic/rustic/
cargo build
sudo ./target/debug/rustic
```
