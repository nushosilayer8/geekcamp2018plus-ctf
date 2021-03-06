#!/bin/sh

groups="cross-site-scripting image.php jinja-jail-break scrabble-quick-locator-interactive multiplier vssh0 vssh1 vssh2 vssh3"

for g in $groups; do
	cd $g/
	case "$1" in
		""|start)
			echo "Starting $g..."
			sudo docker-compose up -d
			;;
		stop)
			echo "Stopping $g..."
			sudo docker-compose down
			;;
		reset)
			echo "Resetting $g..."
			sudo docker-compose down
			sudo docker-compose up -d
			;;
		build)
			echo "Rebuilding $g..."
			sudo docker-compose build
			sudo docker-compose down
			sudo docker-compose up -d
			;;
		extract)
			echo "Extracting from $g..."
			sudo docker cp $(sudo docker-compose ps -q | head -n 1):/home/ctf/$g .
			;;
		help|*)
			echo "Supported operations: start, stop, reset, build, extract, help"
			exit 1
			;;
	esac
	cd ..
done
