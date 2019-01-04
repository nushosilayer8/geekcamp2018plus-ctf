// gcc -O0 -fno-stack-protector -no-pie vssh0.c -o vssh0

#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h> 
#include <string.h>
#include <unistd.h>

void print_welcome() {
    puts("=== VerySecureSHell v0 ===");
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

int main(int argc, char **argv) {
    volatile int user_level;
    char password[64];

    print_welcome();
    printf("Please enter password to authenticate: ");

    user_level = 0;
    gets(password);

    if (check_password(password)) {
        user_level = 9999;
    }

    if (user_level != 9999) {
        puts("Go away, intruder!");
    } else {
        puts("Welcome, admin.");
        open_shell();
    }

    exit(0);
}