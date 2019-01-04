// gcc -fno-stack-protector -no-pie -o vssh3 vssh3.c

#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h> 
#include <string.h>
#include <unistd.h>

struct User {
    char* name;
    int user_level;
};

struct User *users[16];
int users_index = 0;

void print_welcome() {
    puts("=== VerySecureSHell v3 ===");
    puts("");
}

void print_menu() {
    puts("1. Create User");
    puts("2. Select User");
    puts("3. Delete User");
}

void open_shell() {
    puts("Welcome, admin.");
    system("/bin/sh");
}

int read_num() {
    char num[20];
    fgets(num, 20, stdin);
    return strtoul(num, 0, 10);
}

int check_password(char* password) {
    int fd = open("flag", O_RDONLY);
    char correct[256];
    read(fd, correct, 256);
    
    if (!strcmp(password, correct))
        return 1;
    return 0;
}

void create_user() {
    if (users_index >= 16) {
        puts("What do you need so many users for?");
        return;
    }

    struct User *user = (struct User*) malloc(sizeof(struct User));

    printf("Length of name: ");
    int len = read_num();
    
    user->name = (char*) malloc(len);
    printf("Enter your name: ");
    fgets(user->name, len, stdin);

    char password[64];
    printf("Enter admin password: ");
    fgets(password, 64, stdin);

    if (check_password(password)) {
        user->user_level = 9999;
    }
    else {
        user->user_level = 0;
    }

    users[users_index++] = user;
}

void select_user() {
    printf("Index: ");
    int num = read_num();

    if (num >= users_index || num < 0) {
        puts("Out of bounds!");
        return;
    }

    if (users[num]->user_level == 9999) {
        open_shell();
    }
    else {
        puts("You are just a normal user!");
    }
}

void delete_user() {
    printf("Index: ");
    int num = read_num();

    if (num >= users_index || num < 0) {
        puts("Out of bounds!");
        return;
    }

    free(users[num]->name);
    free(users[num]);
    printf("Deleted user %d\n.", num);
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

    while(1) {
        print_menu();
        printf("> ");
        int choice = read_num();

        switch(choice) {
        case 1:
            create_user();
            break;
        case 2:
            select_user();
            break;
        case 3:
            delete_user();
            break;
        default:
            break;
        }
    }

    exit(0);
}
