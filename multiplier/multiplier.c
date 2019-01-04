// gcc -no-pie -o multiplier multiplier.c

#include <stdio.h>
#include <stdlib.h>

void flag() {
    system("cat flag");
}

void print_menu() {
    puts("1. Add number");
    puts("2. View top number");
    puts("3. Remove top number");
    puts("4. Calculate product");
    puts("5. Reset");
}

int read_num() {
    char num[20];
    fgets(num, 20, stdin);
    return strtoul(num, 0, 10);
}

int calculate_product(int numbers[], int index) {
    int result = 1;
    for (int *i = numbers; i != numbers + index; ++i) {
        result *= *i;
    }
    return result;
}

int main() {
    int index;
    int numbers[100];

    while(1) {
        print_menu();
        printf("> ");
        int choice = read_num();

        switch(choice) {
        case 1:
            printf("Number: ");
            numbers[index++] = read_num();
            break;
        case 2:
            printf("%d\n", numbers[index - 1]);
            break;
        case 3:
            --index;
            break;
        case 4:
            printf("%d\n", calculate_product(numbers, index));
            break;
        case 5:
            index = 0;
            break;
        default:
            break;
        }
    }

    return 0;
}
