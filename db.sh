#!/bin/bash
set -e

source .env.prod

EXEC="docker exec -i mariadb-mtas bash -c"

startMariadb() {
    if [ "$(docker ps -q -f name=mariadb-mtas)" ]; then
        echo "Mariadb already running."
        return
    fi

    echo "Starting mariadb..."
    docker run -d --name mariadb-mtas -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD -e MYSQL_DATABASE=$MYSQL_DATABASE -e MYSQL_USER=$MYSQL_USER -e MYSQL_PASSWORD=$MYSQL_PASSWORD mariadb:10.4
}

stopMariadb() {
    echo "Stopping mariadb..."
    docker stop mariadb-mtas
    echo "Removing mariadb..."
    docker rm mariadb-mtas
}

dbDump() {
    startMariadb

    echo "Dumping database..."
    if $EXEC "mysqldump -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE" >./sql/dump.sql; then
        echo "Database dumped successfully."
    else
        echo "Database dump failed."
        docker logs mariadb-mtas
    fi

    stopMariadb
}

dbImport() {
    startMariadb

    echo "Importing database..."
    if $EXEC "mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE" <./sql/dump.sql; then
        echo "Database imported successfully."
    else
        echo "Database import failed."
        docker logs mariadb-mtas
    fi
    stopMariadb
}

# Route commands
case "$1" in
db:dump)
    dbDump
    ;;
db:import)
    dbImport
    ;;
db:start)
    startMariadb
    ;;
db:stop)
    stopMariadb
    ;;
db:logs)
    docker logs mariadb-mtas --follow
    ;;
*)
    echo "Usage: $0 {db:dump|db:import}"
    exit 1
    ;;
esac
