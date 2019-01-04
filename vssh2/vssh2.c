// gcc -z norelro -fno-stack-protector -no-pie -o vssh2 vssh2.c

#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h> 
#include <string.h>
#include <unistd.h>

void print_welcome() {
    puts("=== VerySecureSHell v2 ===");
    puts("");
}

int check_password(char* password) {
    int fd = open("flag", O_RDONLY);
    char correct[256];
    read(fd, correct, 256);
    
    if (!strcmp(password, correct))
        return 1;
    return 0;
}

void open_shell() {
    puts("Welcome, admin.");
    system("/bin/sh");
}

int setup(){
    // not important, just to make sure everything is printed without needing to flush stdin/stdout everytime
    setvbuf(stdin, 0, 2, 0);
    setvbuf(stdout, 0, 2, 0);
    return 1; 
}

int main(int argc, char **argv) {
    setup();

    char password[64];

    print_welcome();
    printf("Please enter password to authenticate: ");

    fgets(password, 64, stdin);

    if (!check_password(password)) {
        printf(password);
        puts(" is the wrong password!");
        puts("Go away, intruder!");
    } else {
        puts("Welcome, admin.");
        open_shell();
    }

    exit(0);
}
