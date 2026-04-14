import type { GeneratedChallenge } from './api';

interface ChallengeBank {
  [language: string]: {
    [difficulty: string]: GeneratedChallenge[];
  };
}

const CHALLENGES: ChallengeBank = {
  JavaScript: {
    easy: [
      {
        title: 'FizzBuzz',
        description: 'Write a function that takes a number n and returns an array of strings from 1 to n. For multiples of 3, use "Fizz". For multiples of 5, use "Buzz". For multiples of both, use "FizzBuzz". Otherwise, use the number as a string.',
        expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
        sampleSolution: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(String(i));
  }
  return result;
}`,
      },
      {
        title: 'Reverse String',
        description: 'Write a function that takes a string and returns it reversed. Do not use the built-in reverse method.',
        expectedOutput: 'reverseString("hello") => "olleh"\nreverseString("world") => "dlrow"',
        sampleSolution: `function reverseString(str) {
  let result = "";
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}`,
      },
      {
        title: 'Count Vowels',
        description: 'Write a function that counts the number of vowels (a, e, i, o, u) in a given string. The function should be case-insensitive.',
        expectedOutput: 'countVowels("Hello World") => 3\ncountVowels("aEiOu") => 5',
        sampleSolution: `function countVowels(str) {
  const vowels = "aeiou";
  let count = 0;
  for (const char of str.toLowerCase()) {
    if (vowels.includes(char)) count++;
  }
  return count;
}`,
      },
    ],
    medium: [
      {
        title: 'Array Chunk',
        description: 'Write a function that splits an array into groups of a given size. If the array cannot be split evenly, the final chunk should contain the remaining elements.',
        expectedOutput: 'chunk([1,2,3,4,5], 2) => [[1,2],[3,4],[5]]\nchunk([1,2,3], 3) => [[1,2,3]]',
        sampleSolution: `function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}`,
      },
      {
        title: 'Anagram Check',
        description: 'Write a function that checks if two strings are anagrams of each other. Ignore spaces and capitalization. Two words are anagrams if they contain the same characters in a different order.',
        expectedOutput: 'isAnagram("listen", "silent") => true\nisAnagram("hello", "world") => false',
        sampleSolution: `function isAnagram(str1, str2) {
  const clean = s => s.toLowerCase().replace(/\\s/g, "").split("").sort().join("");
  return clean(str1) === clean(str2);
}`,
      },
      {
        title: 'Flatten Array',
        description: 'Write a function that takes a nested array and returns a single flat array with all values. Handle arrays nested to any depth.',
        expectedOutput: 'flatten([1, [2, [3, 4], 5], 6]) => [1, 2, 3, 4, 5, 6]',
        sampleSolution: `function flatten(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item));
    } else {
      result.push(item);
    }
  }
  return result;
}`,
      },
    ],
    hard: [
      {
        title: 'Deep Clone',
        description: 'Implement a deep clone function that creates a complete copy of an object, including nested objects and arrays. Handle objects, arrays, dates, and primitive values. Do not use JSON.parse/stringify.',
        expectedOutput: 'const obj = { a: 1, b: { c: [2, 3] } };\nconst copy = deepClone(obj);\ncopy.b.c.push(4);\nobj.b.c => [2, 3] // original unchanged',
        sampleSolution: `function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));
  const clone = {};
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key]);
  }
  return clone;
}`,
      },
      {
        title: 'LRU Cache',
        description: 'Implement a Least Recently Used (LRU) cache with a given capacity. It should support get(key) and put(key, value) operations in O(1) time. When the cache exceeds capacity, remove the least recently used item.',
        expectedOutput: 'cache = new LRUCache(2);\ncache.put(1, 1); cache.put(2, 2);\ncache.get(1) => 1\ncache.put(3, 3); // evicts key 2\ncache.get(2) => -1',
        sampleSolution: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key, value) {
    this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }
}`,
      },
    ],
  },
  Python: {
    easy: [
      {
        title: 'Palindrome Check',
        description: 'Write a function that checks if a given string is a palindrome (reads the same forwards and backwards). Ignore case and spaces.',
        expectedOutput: 'is_palindrome("racecar") => True\nis_palindrome("hello") => False\nis_palindrome("A man a plan a canal Panama") => True',
        sampleSolution: `def is_palindrome(s):
    cleaned = s.lower().replace(" ", "")
    return cleaned == cleaned[::-1]`,
      },
      {
        title: 'Sum of Digits',
        description: 'Write a function that takes a positive integer and returns the sum of its digits. For example, 123 should return 6 (1+2+3).',
        expectedOutput: 'sum_digits(123) => 6\nsum_digits(9999) => 36',
        sampleSolution: `def sum_digits(n):
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total`,
      },
    ],
    medium: [
      {
        title: 'Matrix Transpose',
        description: 'Write a function that takes a 2D matrix (list of lists) and returns its transpose. The transpose swaps rows and columns.',
        expectedOutput: 'transpose([[1,2,3],[4,5,6]]) => [[1,4],[2,5],[3,6]]',
        sampleSolution: `def transpose(matrix):
    return [list(row) for row in zip(*matrix)]`,
      },
      {
        title: 'Word Frequency',
        description: 'Write a function that takes a string of text and returns a dictionary with each word as a key and its frequency as the value. Convert to lowercase and ignore punctuation.',
        expectedOutput: 'word_freq("the cat sat on the mat") => {"the": 2, "cat": 1, "sat": 1, "on": 1, "mat": 1}',
        sampleSolution: `def word_freq(text):
    words = text.lower().split()
    freq = {}
    for word in words:
        clean = "".join(c for c in word if c.isalnum())
        if clean:
            freq[clean] = freq.get(clean, 0) + 1
    return freq`,
      },
    ],
    hard: [
      {
        title: 'Binary Search Tree',
        description: 'Implement a binary search tree with insert, search, and in-order traversal methods. The in_order method should return a sorted list of all values.',
        expectedOutput: 'bst = BST()\nbst.insert(5); bst.insert(3); bst.insert(7);\nbst.search(3) => True\nbst.in_order() => [3, 5, 7]',
        sampleSolution: `class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        if not self.root:
            self.root = Node(val)
        else:
            self._insert(self.root, val)

    def _insert(self, node, val):
        if val < node.val:
            if node.left:
                self._insert(node.left, val)
            else:
                node.left = Node(val)
        else:
            if node.right:
                self._insert(node.right, val)
            else:
                node.right = Node(val)

    def search(self, val):
        return self._search(self.root, val)

    def _search(self, node, val):
        if not node:
            return False
        if val == node.val:
            return True
        elif val < node.val:
            return self._search(node.left, val)
        else:
            return self._search(node.right, val)

    def in_order(self):
        result = []
        self._in_order(self.root, result)
        return result

    def _in_order(self, node, result):
        if node:
            self._in_order(node.left, result)
            result.append(node.val)
            self._in_order(node.right, result)`,
      },
    ],
  },
  TypeScript: {
    easy: [
      {
        title: 'Temperature Converter',
        description: 'Write a function that converts temperature between Celsius and Fahrenheit. It should take a number and a unit ("C" or "F") and return the converted value rounded to 1 decimal place.',
        expectedOutput: 'convert(100, "C") => 212.0\nconvert(32, "F") => 0.0',
        sampleSolution: `function convert(temp: number, unit: "C" | "F"): number {
  if (unit === "C") {
    return Math.round((temp * 9/5 + 32) * 10) / 10;
  }
  return Math.round((temp - 32) * 5/9 * 10) / 10;
}`,
      },
    ],
    medium: [
      {
        title: 'Group By Property',
        description: 'Write a generic function groupBy that takes an array of objects and a key name, and returns an object where each key is a unique value of that property, and each value is an array of matching objects.',
        expectedOutput: 'groupBy([{age: 20, name: "a"}, {age: 20, name: "b"}, {age: 30, name: "c"}], "age")\n=> { 20: [{age:20,name:"a"},{age:20,name:"b"}], 30: [{age:30,name:"c"}] }',
        sampleSolution: `function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const val = String(item[key]);
    if (!groups[val]) groups[val] = [];
    groups[val].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}`,
      },
    ],
    hard: [
      {
        title: 'Event Emitter',
        description: 'Implement a type-safe EventEmitter class with on(event, callback), off(event, callback), and emit(event, ...args) methods. Support multiple listeners per event.',
        expectedOutput: 'emitter.on("data", (x) => console.log(x));\nemitter.emit("data", 42); // logs 42\nemitter.off("data", callback);',
        sampleSolution: `class EventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const cbs = this.listeners.get(event);
    if (cbs) {
      this.listeners.set(event, cbs.filter(cb => cb !== callback));
    }
  }

  emit(event: string, ...args: unknown[]): void {
    const cbs = this.listeners.get(event);
    if (cbs) {
      cbs.forEach(cb => cb(...args));
    }
  }
}`,
      },
    ],
  },
  Java: {
    easy: [
      {
        title: 'Even or Odd',
        description: 'Write a method that takes an array of integers and returns a new array containing only the even numbers, in their original order.',
        expectedOutput: 'filterEven([1,2,3,4,5,6]) => [2,4,6]\nfilterEven([1,3,5]) => []',
        sampleSolution: `public static int[] filterEven(int[] nums) {
    return java.util.Arrays.stream(nums)
        .filter(n -> n % 2 == 0)
        .toArray();
}`,
      },
    ],
    medium: [
      {
        title: 'Stack with Min',
        description: 'Implement a stack that supports push, pop, peek, and getMin operations, all in O(1) time. getMin should return the minimum element currently in the stack.',
        expectedOutput: 'stack.push(3); stack.push(1); stack.push(2);\nstack.getMin() => 1\nstack.pop(); stack.pop();\nstack.getMin() => 3',
        sampleSolution: `import java.util.Stack;

class MinStack {
    Stack<Integer> stack = new Stack<>();
    Stack<Integer> minStack = new Stack<>();

    void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) {
            minStack.push(val);
        }
    }

    int pop() {
        int val = stack.pop();
        if (val == minStack.peek()) minStack.pop();
        return val;
    }

    int peek() { return stack.peek(); }
    int getMin() { return minStack.peek(); }
}`,
      },
    ],
    hard: [
      {
        title: 'Merge Intervals',
        description: 'Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals and return the non-overlapping intervals that cover all input ranges.',
        expectedOutput: 'merge([[1,3],[2,6],[8,10],[15,18]]) => [[1,6],[8,10],[15,18]]',
        sampleSolution: `import java.util.*;

public static int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> result = new ArrayList<>();
    int[] current = intervals[0];
    result.add(current);
    for (int[] interval : intervals) {
        if (interval[0] <= current[1]) {
            current[1] = Math.max(current[1], interval[1]);
        } else {
            current = interval;
            result.add(current);
        }
    }
    return result.toArray(new int[0][]);
}`,
      },
    ],
  },
  C: {
    easy: [
      {
        title: 'Find Maximum',
        description: 'Write a function that takes an array of integers and its length, and returns the maximum value in the array.',
        expectedOutput: 'findMax([3, 7, 2, 9, 1], 5) => 9\nfindMax([-1, -5, -2], 3) => -1',
        sampleSolution: `int findMax(int arr[], int len) {
    int max = arr[0];
    for (int i = 1; i < len; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}`,
      },
    ],
    medium: [
      {
        title: 'String Compression',
        description: 'Write a function that compresses a string by replacing consecutive repeated characters with the character followed by its count. If the compressed string is not shorter, return the original.',
        expectedOutput: 'compress("aabcccccaaa") => "a2b1c5a3"\ncompress("abc") => "abc"',
        sampleSolution: `#include <stdio.h>
#include <string.h>

void compress(const char* input, char* output) {
    int len = strlen(input);
    int j = 0;
    for (int i = 0; i < len; ) {
        char c = input[i];
        int count = 1;
        while (i + count < len && input[i + count] == c) count++;
        j += sprintf(output + j, "%c%d", c, count);
        i += count;
    }
    if (j >= len) strcpy(output, input);
}`,
      },
    ],
    hard: [
      {
        title: 'Linked List Reverse',
        description: 'Implement a singly linked list with insert and reverse functions. The reverse function should reverse the list in-place (no extra memory for a new list).',
        expectedOutput: 'insert 1, 2, 3 => 1->2->3\nreverse => 3->2->1',
        sampleSolution: `#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

Node* insert(Node* head, int data) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->data = data;
    newNode->next = NULL;
    if (!head) return newNode;
    Node* curr = head;
    while (curr->next) curr = curr->next;
    curr->next = newNode;
    return head;
}

Node* reverse(Node* head) {
    Node *prev = NULL, *curr = head, *next;
    while (curr) {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
      },
    ],
  },
};

let challengeCounters: Record<string, number> = {};

export function getOfflineChallenge(language: string, difficulty: string): GeneratedChallenge {
  const langChallenges = CHALLENGES[language]?.[difficulty];
  if (!langChallenges || langChallenges.length === 0) {
    return {
      title: 'Hello World',
      description: `Write a program that prints "Hello, World!" to the console in ${language}.`,
      expectedOutput: 'Hello, World!',
      sampleSolution: language === 'Python' ? 'print("Hello, World!")' : 'console.log("Hello, World!");',
    };
  }

  const key = `${language}-${difficulty}`;
  const index = (challengeCounters[key] ?? 0) % langChallenges.length;
  challengeCounters[key] = index + 1;

  return langChallenges[index];
}

export function getOfflineHint(description: string, code: string): string {
  if (!code || code.trim().length === 0) {
    return 'Start by reading the problem carefully. Break it down into smaller steps. What is the input? What should the output be? Try writing the function signature first.';
  }
  if (code.trim().length < 20) {
    return 'Good start! Think about what logic you need inside your function. Consider edge cases like empty inputs or special values.';
  }
  return 'You\'re making progress. Check that your logic handles all the expected outputs. Try tracing through your code with the example input step by step.';
}

export function getOfflineEvaluation(
  code: string,
): { pass: boolean; feedback: string; xpAwarded: boolean } {
  if (code.trim().length < 10) {
    return {
      pass: false,
      feedback: 'Your solution seems too short. Make sure you\'ve implemented the full logic.',
      xpAwarded: false,
    };
  }

  // In offline mode we can't truly evaluate, so we give benefit of the doubt for substantial code
  if (code.trim().length > 50) {
    return {
      pass: true,
      feedback: 'Your solution looks reasonable! (Note: running in offline mode without AI evaluation. Connect the backend for full code analysis.)',
      xpAwarded: true,
    };
  }

  return {
    pass: false,
    feedback: 'Your code needs more work. Try implementing the complete solution. (Running in offline mode - connect the backend for detailed feedback.)',
    xpAwarded: false,
  };
}
