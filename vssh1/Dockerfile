FROM ubuntu:xenial AS build

RUN apt-get update
RUN apt-get install -y \
	build-essential
# Add any build dependencies above

COPY vssh1.c ./
RUN gcc -fno-stack-protector -no-pie -o vssh1 vssh1.c


FROM ubuntu:xenial

RUN apt-get update \
	&& apt-get install -y \
	xinetd \
	&& rm -rf /var/lib/apt/lists/*
# Add any runtime dependencies above

RUN useradd -m ctf

# Challenge service
COPY xinetd.conf /etc/xinetd.d/vssh1
RUN echo '#!/bin/sh\ncd /home/ctf && "$@"' > /bin/run
RUN chmod +x /bin/run

# Challenge files
COPY --from=build vssh1 /home/ctf/vssh1
COPY flag /home/ctf/

# Permissions
RUN chown -R root:ctf /home/ctf
RUN chmod -R go-w /home/ctf

CMD ["/usr/sbin/xinetd", "-stayalive", "-dontfork"]
