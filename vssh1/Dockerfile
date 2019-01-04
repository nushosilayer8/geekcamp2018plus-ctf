FROM ubuntu:xenial AS build

RUN apt-get update
RUN apt-get install -y \
	build-essential
# Add any build dependencies above

COPY vssh1.c ./
RUN gcc -fno-stack-protector -no-pie -o vssh2 vssh2.c


FROM ubuntu:xenial

RUN apt-get update \
	&& apt-get install -y \
	xinetd \
	&& rm -rf /var/lib/apt/lists/*
# Add any runtime dependencies above

RUN useradd -m ctf

# Challenge service
COPY xinetd.conf /etc/xinetd.d/vssh1

# Challenge files
COPY --from=build vssh2 /home/ctf/vssh2
COPY flag /home/ctf/

# Permissions
RUN chown -R root:ctf /home/ctf
RUN chmod -R go-w /home/ctf

CMD ["/usr/sbin/xinetd", "-stayalive", "-dontfork"]
