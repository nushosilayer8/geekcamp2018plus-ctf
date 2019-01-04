FROM ubuntu:xenial AS build

RUN apt-get update
RUN apt-get install -y \
	build-essential
# Add any build dependencies above

COPY multiplier.c ./
RUN gcc -no-pie -o multiplier multiplier.c


FROM ubuntu:xenial

RUN apt-get update \
	&& apt-get install -y \
	xinetd \
	&& rm -rf /var/lib/apt/lists/*
# Add any runtime dependencies above

RUN useradd -m ctf

# Challenge service
COPY xinetd.conf /etc/xinetd.d/multiplier

# Challenge files
COPY --from=build multiplier /home/ctf/multiplier
COPY flag /home/ctf/

# Permissions
RUN chown -R root:ctf /home/ctf
RUN chmod -R go-w /home/ctf

CMD ["/usr/sbin/xinetd", "-stayalive", "-dontfork"]
