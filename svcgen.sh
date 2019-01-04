#!/bin/bash

shopt -s extglob

show_help() {
	echo "Usage: ./svcgen.sh [workdir]"
	echo "Generate CTF challenge deployment files"
	echo "It also reads C comments to find the proper build command"
}

if [[ -d "$1" ]]; then
	cd "$1"
elif [[ -f "$1" ]]; then
	echo "Please specify a directory, not a file"
	echo
	show_help
	exit 1
fi

NAME="$(basename "$(pwd)")"

SOURCES="$(echo *.@(c|cpp))"
if [[ -z "$SOURCES" ]]; then
	echo "No C/C++ files found. Please specify a folder with at least one source file"
	echo
	show_help
	exit 1
fi

BUILD_COMMAND="$(grep -hE '/[/*][ ]*g(cc|\+\+) ' $SOURCES | head -n 1 | sed -E 's/ *(\/\/|\/\*|\*\/) *//g')"
if [[ -z "$BUILD_COMMAND" ]]; then
	echo "No build command found in source. Using default"
	BUILD_COMMAND="gcc *.c"
fi
BUILD_COMMAND="$BUILD_COMMAND"

BUILD_OUTPUT=""
BUILD_COMMAND_ARRAY=($BUILD_COMMAND)
for i in "${!BUILD_COMMAND_ARRAY[@]}"; do
	if [[ "${BUILD_COMMAND_ARRAY[i]}" == "-o" ]]; then
		BUILD_OUTPUT="${BUILD_COMMAND_ARRAY[i+1]}"
	fi
done

if [[ -z "$BUILD_OUTPUT" ]]; then
	echo "No build output name found. Using challenge name"
	BUILD_COMMAND+=" -o $NAME"
	BUILD_OUTPUT="$NAME"
fi

FLAG_FILES="$(echo flag*)"

PORT="$(( $RANDOM % 1000 + 4000 ))"

echo "Challenge name:           $NAME"
echo "Source files found:       $SOURCES"
echo "Using build command:      $BUILD_COMMAND"
echo "Identified build output:  $BUILD_OUTPUT"
echo "Flag files found:         $FLAG_FILES"
echo "Randomly generated port:  $PORT"

cat > Dockerfile << EOF
FROM ubuntu:xenial AS build

RUN apt-get update
RUN apt-get install -y \\
	build-essential
# Add any build dependencies above

COPY $SOURCES ./
RUN $BUILD_COMMAND


FROM ubuntu:xenial

RUN apt-get update \\
	&& apt-get install -y \\
	xinetd \\
	&& rm -rf /var/lib/apt/lists/*
# Add any runtime dependencies above

RUN useradd -m ctf

# Challenge service
COPY xinetd.conf /etc/xinetd.d/$NAME
RUN echo '#!/bin/sh\\ncd /home/ctf && "\$@"' > /bin/run
RUN chmod +x /bin/run

# Challenge files
COPY --from=build $BUILD_OUTPUT /home/ctf/$BUILD_OUTPUT
COPY $FLAG_FILES /home/ctf/

# Permissions
RUN chown -R root:ctf /home/ctf
RUN chmod -R go-w /home/ctf

CMD ["/usr/sbin/xinetd", "-stayalive", "-dontfork"]
EOF

cat > xinetd.conf << EOF
service $NAME
{
	disable = no
	socket_type = stream
	protocol = tcp
	wait = no
	user = ctf
	type = UNLISTED
	bind = 0.0.0.0
	port = 31337
	server = /bin/run
	server_args = /home/ctf/$BUILD_OUTPUT
	#per_source	= 10 # the maximum instances of this service per source IP address
	#rlimit_cpu	= 20 # the maximum number of CPU seconds that the service may use
	#rlimit_as  = 1024M # the Address Space resource limit for the service
	#access_times = 2:00-9:00 12:00-24:00
}
EOF

cat > docker-compose.yml << EOF
version: '3'

services:
  $NAME:
    build:
      context: .
    read_only: true
    ports:
    - $PORT:31337
EOF
