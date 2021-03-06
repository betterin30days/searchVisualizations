#include <stdio.h>
#include "minunit.h"
#include "bst.c"

int tests_run = 0;

/* utility */
static Node *create_tree_of_height_two() {
    /*
         6
       /   \
      2     9
     / \   / \
    1   4 8  12
    */
    struct Node *bst = new_node(6, 60);
    insert(bst, 2, 20);
    insert(bst, 9, 90);
    insert(bst, 1, 10);
    insert(bst, 4, 40);
    insert(bst, 8, 80);
    insert(bst, 12, 120);
    return bst;
}

static BstArray create_array_of_height_two() {
    BstArray arr;
    init_array(&arr, 2);
    insert_into_array(&arr, 1, 10);
    insert_into_array(&arr, 2, 20);
    insert_into_array(&arr, 4, 40);
    insert_into_array(&arr, 6, 60);
    insert_into_array(&arr, 8, 80);
    insert_into_array(&arr, 9, 90);
    insert_into_array(&arr, 12, 120);
    return arr;
}

/* test cases */
static char * test_new_node() {
    struct Node *bst = new_node(6, 60);
    mu_assert("X new_node(): Key should be set", bst->key == 6);
    mu_assert("X new_node(): Value should be set", bst->value == 60);
    mu_assert("X new_node(): Left inits as null pointer", bst->left == NULL);
    mu_assert("X new_node(): Right inits as null pointer", bst->right == NULL);
    mu_assert("X new_node(): parent_to_self inits as null pointer", bst->parent_to_self == NULL);
    return 0;
}

static char * test_insert() {
    struct Node *bst = new_node(6, 60);
    insert(bst, 2, 20);
    mu_assert("X insert(): Inserts into left", bst->left->key == 2);
    mu_assert("X insert(): Includes parent's pointer to self (left)", bst->left->parent_to_self == &bst->left);
    insert(bst, 9, 90);
    mu_assert("X insert(): Inserts into right", bst->right->key == 9);
    mu_assert("X insert(): Includes parent's pointer to self (right)", bst->right->parent_to_self == &bst->right);
    insert(bst, 1, 10);
    mu_assert("X insert(): Traverses down left, inserts into left", bst->left->left->key == 1);
    insert(bst, 4, 40);
    mu_assert("X insert(): Traverses down left, inserts into right", bst->left->right->key == 4);
    insert(bst, 8, 80);
    mu_assert("X insert(): Traverses down right, inserts into left", bst->right->left->key == 8);
    insert(bst, 12, 120);
    mu_assert("X insert(): Traverses down right, inserts into right", bst->right->right->key == 12);
    // empty tree receiving root node
    struct Node *empty_tree = NULL;
    empty_tree = insert(empty_tree, 1, 10);
    mu_assert("X insert(): Insert into empty tree",
        empty_tree->key == 1 &&
        empty_tree->value == 10 &&
        empty_tree->left == NULL &&
        empty_tree->right == NULL &&
        empty_tree->parent_to_self == NULL
    );
    return 0;
}

static char * test_search() {
    struct Node *bst = create_tree_of_height_two();
    mu_assert("X search(): Returns pointer to node when key is found", search(bst, 8)->value == 80);
    mu_assert("X search(): Returns null pointer when key is not found", search(bst, 5) == NULL);
    return 0;
}

static char * test_find_min() {
    struct Node *bst = create_tree_of_height_two();
    mu_assert("X find_min(): Returns a pointer to the left most node", find_min(bst)->key == 1);
    return 0;
}

static char * test_find_max() {
    struct Node *bst = create_tree_of_height_two();
    mu_assert("X find_max(): Returns a pointer to the right most node", find_max(bst)->key == 12);
    return 0;
}

static char * test_remove_node() {
    struct Node *bst = create_tree_of_height_two();
    remove_node(bst, 12);
    mu_assert("X remove(): Remove a node with no children", bst->right->right == NULL);
    remove_node(bst, 9);
    mu_assert("X remove(): Remove a node with one child", bst->right->key == 8);
    remove_node(bst, 2);
    mu_assert("X remove(): Remove a node with two children", bst->left->key == 4);
    return 0;
}

static char * test_traverse() {
    struct Node *bst = create_tree_of_height_two();
    BstArray arr = traverse(bst);
    mu_assert("X traverse(): Lowest node is index 0", arr.array[0].value == 10);
    mu_assert("X traverse(): index 1", arr.array[1].value == 20);
    mu_assert("X traverse(): index 2", arr.array[2].value == 40);
    mu_assert("X traverse(): index 3", arr.array[3].value == 60);
    mu_assert("X traverse(): index 4", arr.array[4].value == 80);
    mu_assert("X traverse(): index 5", arr.array[5].value == 90);
    mu_assert("X traverse(): Highest node is index 6", arr.array[6].value == 120);
    return 0;
}

static char * test_create_from_ordered_array() {
    BstArray arr = create_array_of_height_two();
    struct Node *bst = create_from_ordered_array(&arr);
    mu_assert("X create_from_ordered_array(): root", bst->key == 6);
    mu_assert("X create_from_ordered_array(): left", bst->left->key == 2);
    mu_assert("X create_from_ordered_array(): right", bst->right->key == 9);
    mu_assert("X create_from_ordered_array(): left left", bst->left->left->key == 1);
    mu_assert("X create_from_ordered_array(): left right", bst->left->right->key == 4);
    mu_assert("X create_from_ordered_array(): right left", bst->right->left->key == 8);
    mu_assert("X create_from_ordered_array(): right right", bst->right->right->key == 12);
    return 0;
}

static char * test_balance() {
    /*
    unbalanced:
           8
         /   \
        6     9
       /       \
      2        12
     / \
    1   4
    balanced:
         6
       /   \
      2     9
     / \   / \
    1   4 8  12
    */
    struct Node *bst = new_node(8, 80);
    insert(bst, 6, 60);
    insert(bst, 9, 90);
    insert(bst, 2, 20);
    insert(bst, 12, 120);
    insert(bst, 1, 10);
    insert(bst, 4, 40);
    Node *bbst = balance(bst);
    mu_assert("X balance(): root", bbst->key == 6);
    mu_assert("X balance(): left", bbst->left->key == 2);
    mu_assert("X balance(): right", bbst->right->key == 9);
    mu_assert("X balance(): left left", bbst->left->left->key == 1);
    mu_assert("X balance(): left right", bbst->left->right->key == 4);
    mu_assert("X balance(): right left", bbst->right->left->key == 8);
    mu_assert("X balance(): right right", bbst->right->right->key == 12);
    return 0;
}
 
/* runner */
static char * all_tests() {
    mu_run_test(test_new_node);
    mu_run_test(test_insert);
    mu_run_test(test_search);
    mu_run_test(test_find_min);
    mu_run_test(test_find_max);
    mu_run_test(test_remove_node);
    mu_run_test(test_traverse);
    mu_run_test(test_create_from_ordered_array);
    mu_run_test(test_balance);
    return 0;
}

int main(int argc, char **argv) {
    char *result = all_tests();
    if (result != 0) {
        printf("%s\n", result);
    } else {
        printf("All tests have passed!\n");
    }
    printf("Tests run: %d\n", tests_run);

    return result != 0;
}
