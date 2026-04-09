const mongoose = require('mongoose');
const { Question } = require('./models/Test');

const questions = [
    // DSA
    { text: "What is the time complexity of searching in a Balanced Binary Search Tree?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctAnswer: 1, category: "dsa", difficulty: "easy" },
    { text: "Which data structure is best for implementing a LRU Cache?", options: ["Queue + Map", "Stack + Set", "Doubly Linked List + Map", "Array + Heap"], correctAnswer: 2, category: "dsa", difficulty: "medium" },
    
    // CS Core
    { text: "Which HTTP status code represents 'Internal Server Error'?", options: ["404", "500", "502", "503"], correctAnswer: 1, category: "csCore", difficulty: "easy" },
    { text: "What is the primary purpose of an index in a database?", options: ["Data Security", "Data Redundancy", "Query Speed Optimization", "Atomicity"], correctAnswer: 2, category: "csCore", difficulty: "easy" },
    
    // Aptitude
    { text: "A train 150m long is running at 54 km/hr. How much time will it take to pass a pole?", options: ["8 secs", "10 secs", "12 secs", "15 secs"], correctAnswer: 1, category: "aptitude", difficulty: "medium" },
    
    // System Design
    { text: "Which mechanism ensures data consistency across distributed database nodes?", options: ["Hashing", "Replication", "Load Balancing", "Quorum"], correctAnswer: 3, category: "sysdesign", difficulty: "hard" }
];

async function seed() {
    try {
        await mongoose.connect('mongodb://localhost:27017/placement_ecosystem');
        await Question.deleteMany({});
        await Question.insertMany(questions);
        console.log("Seed complete!");
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seed();
