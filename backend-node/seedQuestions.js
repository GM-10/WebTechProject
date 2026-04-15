const { Question } = require('./models/Test');

const allQuestions = [
  // ─── DSA: 10 questions ────────────────────────────────────────────────────
  {
    category: 'dsa',
    difficulty: 'easy',
    text: 'What is the time complexity of accessing an element by index in an array?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
    correctAnswer: 2,
    tags: ['arrays', 'complexity']
  },
  {
    category: 'dsa',
    difficulty: 'easy',
    text: 'Which data structure follows the LIFO (Last In, First Out) principle?',
    options: ['Queue', 'Stack', 'Heap', 'Linked List'],
    correctAnswer: 1,
    tags: ['stack', 'data-structures']
  },
  {
    category: 'dsa',
    difficulty: 'easy',
    text: 'What is the worst-case time complexity of Linear Search?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 2,
    tags: ['searching', 'complexity']
  },
  {
    category: 'dsa',
    difficulty: 'medium',
    text: 'What is the average-case time complexity of QuickSort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctAnswer: 1,
    tags: ['sorting', 'quicksort']
  },
  {
    category: 'dsa',
    difficulty: 'medium',
    text: 'Which traversal of a Binary Search Tree visits nodes in sorted order?',
    options: ['Pre-order', 'Post-order', 'Level-order', 'In-order'],
    correctAnswer: 3,
    tags: ['trees', 'bst', 'traversal']
  },
  {
    category: 'dsa',
    difficulty: 'medium',
    text: 'Given a singly linked list, which approach detects a cycle in O(n) time and O(1) space?',
    options: ['Hash Set', 'Floyd\'s Cycle Detection', 'Recursive DFS', 'Using Stack'],
    correctAnswer: 1,
    tags: ['linked-list', 'cycle', 'two-pointer']
  },
  {
    category: 'dsa',
    difficulty: 'medium',
    text: 'What is the space complexity of Merge Sort?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 2,
    tags: ['sorting', 'merge-sort', 'space']
  },
  {
    category: 'dsa',
    difficulty: 'hard',
    text: 'In Dijkstra\'s algorithm, what data structure provides the most efficient implementation?',
    options: ['Array', 'Stack', 'Min-Heap (Priority Queue)', 'Hash Map'],
    correctAnswer: 2,
    tags: ['graphs', 'dijkstra', 'shortest-path']
  },
  {
    category: 'dsa',
    difficulty: 'hard',
    text: 'What is the time complexity of building a heap from an arbitrary array using the heapify approach?',
    options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
    correctAnswer: 2,
    tags: ['heap', 'heapify', 'complexity']
  },
  {
    category: 'dsa',
    difficulty: 'hard',
    text: 'Which dynamic programming recurrence correctly describes the 0/1 Knapsack problem?',
    options: [
      'dp[i][w] = dp[i-1][w] + dp[i-1][w - wt[i]]',
      'dp[i][w] = max(dp[i-1][w], dp[i-1][w - wt[i]] + val[i])',
      'dp[i][w] = dp[i][w - wt[i]] + val[i]',
      'dp[i][w] = dp[i-1][w-1] + val[i]'
    ],
    correctAnswer: 1,
    tags: ['dp', 'knapsack']
  },

  // ─── System Design: 10 questions ─────────────────────────────────────────
  {
    category: 'sysdesign',
    difficulty: 'easy',
    text: 'What does "horizontal scaling" mean in system design?',
    options: [
      'Upgrading the CPU of an existing server',
      'Adding more machines to the pool of resources',
      'Increasing RAM in a single server',
      'Adding more storage to a single disk'
    ],
    correctAnswer: 1,
    tags: ['scaling', 'basics']
  },
  {
    category: 'sysdesign',
    difficulty: 'easy',
    text: 'Which HTTP status code indicates a successful GET request?',
    options: ['201', '404', '200', '500'],
    correctAnswer: 2,
    tags: ['http', 'rest', 'api']
  },
  {
    category: 'sysdesign',
    difficulty: 'easy',
    text: 'What is a CDN (Content Delivery Network) primarily used for?',
    options: [
      'Storing database backups',
      'Distributing static content geographically closer to users',
      'Encrypting user data',
      'Running serverless functions'
    ],
    correctAnswer: 1,
    tags: ['cdn', 'performance']
  },
  {
    category: 'sysdesign',
    difficulty: 'medium',
    text: 'What is the primary trade-off described by the CAP theorem?',
    options: [
      'Cost vs. Performance',
      'Consistency, Availability, Partition Tolerance — you can guarantee only 2 of 3',
      'Caching, Availability, Processing',
      'Concurrency, Atomicity, Persistence'
    ],
    correctAnswer: 1,
    tags: ['cap-theorem', 'distributed-systems']
  },
  {
    category: 'sysdesign',
    difficulty: 'medium',
    text: 'Which caching strategy writes data to cache and the database simultaneously?',
    options: ['Cache-aside', 'Write-through', 'Write-behind', 'Read-through'],
    correctAnswer: 1,
    tags: ['caching', 'write-through']
  },
  {
    category: 'sysdesign',
    difficulty: 'medium',
    text: 'What is the main purpose of a Message Queue (e.g., RabbitMQ, Kafka) in a microservices architecture?',
    options: [
      'To store user session data',
      'To decouple services and enable asynchronous communication',
      'To replace a relational database',
      'To serve static assets'
    ],
    correctAnswer: 1,
    tags: ['message-queue', 'microservices', 'async']
  },
  {
    category: 'sysdesign',
    difficulty: 'medium',
    text: 'In a load balancer, which algorithm routes each new request to the server with the fewest active connections?',
    options: ['Round Robin', 'IP Hash', 'Least Connections', 'Random'],
    correctAnswer: 2,
    tags: ['load-balancer', 'algorithms']
  },
  {
    category: 'sysdesign',
    difficulty: 'hard',
    text: 'Which consistency model guarantees that a read always returns the most recent write?',
    options: ['Eventual Consistency', 'Causal Consistency', 'Strong Consistency', 'Monotonic Read'],
    correctAnswer: 2,
    tags: ['consistency', 'distributed-systems']
  },
  {
    category: 'sysdesign',
    difficulty: 'hard',
    text: 'What technique does Twitter\'s Snowflake algorithm use to generate unique IDs at scale?',
    options: [
      'UUID v4 random generation',
      'Database auto-increment with sharding',
      'Time-based IDs combining timestamp, machine ID, and sequence number',
      'SHA-256 hash of user data'
    ],
    correctAnswer: 2,
    tags: ['id-generation', 'snowflake', 'distributed-systems']
  },
  {
    category: 'sysdesign',
    difficulty: 'hard',
    text: 'In consistent hashing, what is the primary benefit of using "virtual nodes" (vnodes)?',
    options: [
      'They reduce latency by caching responses',
      'They provide more uniform data distribution when nodes are added or removed',
      'They encrypt data across nodes',
      'They eliminate the need for replication'
    ],
    correctAnswer: 1,
    tags: ['consistent-hashing', 'vnodes', 'distributed-systems']
  },

  // ─── CS Core: 10 questions ────────────────────────────────────────────────
  {
    category: 'csCore',
    difficulty: 'easy',
    text: 'Which SQL clause is used to filter grouped results?',
    options: ['WHERE', 'ORDER BY', 'HAVING', 'GROUP BY'],
    correctAnswer: 2,
    tags: ['sql', 'dbms']
  },
  {
    category: 'csCore',
    difficulty: 'easy',
    text: 'What does DNS stand for?',
    options: ['Data Network System', 'Domain Name System', 'Dynamic Node Service', 'Digital Name Server'],
    correctAnswer: 1,
    tags: ['networking', 'dns']
  },
  {
    category: 'csCore',
    difficulty: 'easy',
    text: 'In an OS, what is a deadlock?',
    options: [
      'A process that uses 100% CPU',
      'A situation where two or more processes wait indefinitely for resources held by each other',
      'A corrupted memory page',
      'An OS kernel crash'
    ],
    correctAnswer: 1,
    tags: ['os', 'deadlock', 'processes']
  },
  {
    category: 'csCore',
    difficulty: 'medium',
    text: 'What is the purpose of a Transaction in a DBMS? Which property guarantees that a committed transaction survives system crashes?',
    options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
    correctAnswer: 3,
    tags: ['dbms', 'acid', 'transactions']
  },
  {
    category: 'csCore',
    difficulty: 'medium',
    text: 'Which page replacement algorithm suffers from Belady\'s anomaly?',
    options: ['LRU', 'Optimal', 'FIFO', 'LFU'],
    correctAnswer: 2,
    tags: ['os', 'memory', 'page-replacement']
  },
  {
    category: 'csCore',
    difficulty: 'medium',
    text: 'In the OSI model, which layer is responsible for reliable end-to-end delivery?',
    options: ['Network Layer', 'Data Link Layer', 'Transport Layer', 'Session Layer'],
    correctAnswer: 2,
    tags: ['networking', 'osi']
  },
  {
    category: 'csCore',
    difficulty: 'medium',
    text: 'What is the difference between SQL\'s INNER JOIN and LEFT JOIN?',
    options: [
      'INNER JOIN returns all rows from both tables; LEFT JOIN returns only matched rows',
      'LEFT JOIN returns all rows from the left table including unmatched; INNER JOIN returns only matched rows',
      'They produce the same result',
      'LEFT JOIN works only on foreign keys; INNER JOIN works on any columns'
    ],
    correctAnswer: 1,
    tags: ['sql', 'joins', 'dbms']
  },
  {
    category: 'csCore',
    difficulty: 'hard',
    text: 'Which scheduling algorithm minimizes average waiting time for a set of CPU burst times?',
    options: ['FCFS', 'Round Robin', 'Shortest Job First (SJF)', 'Priority Scheduling'],
    correctAnswer: 2,
    tags: ['os', 'cpu-scheduling', 'sjf']
  },
  {
    category: 'csCore',
    difficulty: 'hard',
    text: 'In database normalization, a relation is in Boyce-Codd Normal Form (BCNF) if:',
    options: [
      'Every non-prime attribute is fully functionally dependent on the primary key',
      'For every non-trivial functional dependency X → Y, X is a superkey',
      'There are no multi-valued dependencies',
      'Every attribute is atomic'
    ],
    correctAnswer: 1,
    tags: ['dbms', 'normalization', 'bcnf']
  },
  {
    category: 'csCore',
    difficulty: 'hard',
    text: 'In computer networks, what does the "three-way handshake" in TCP establish?',
    options: [
      'A secure TLS session',
      'Reliable data transfer by syncing sequence numbers between client and server (SYN, SYN-ACK, ACK)',
      'Routing path between two hosts',
      'IP address assignment via DHCP'
    ],
    correctAnswer: 1,
    tags: ['networking', 'tcp', 'three-way-handshake']
  },

  // ─── Aptitude: 10 questions ───────────────────────────────────────────────
  {
    category: 'aptitude',
    difficulty: 'easy',
    text: 'A train travels 180 km in 3 hours. What is its speed in km/h?',
    options: ['45', '54', '60', '90'],
    correctAnswer: 2,
    tags: ['speed-distance', 'basic-math']
  },
  {
    category: 'aptitude',
    difficulty: 'easy',
    text: 'What is 15% of 200?',
    options: ['20', '25', '30', '35'],
    correctAnswer: 2,
    tags: ['percentages', 'basic-math']
  },
  {
    category: 'aptitude',
    difficulty: 'easy',
    text: 'If the ratio of boys to girls in a class is 3:2 and there are 30 boys, how many girls are there?',
    options: ['15', '18', '20', '25'],
    correctAnswer: 2,
    tags: ['ratios', 'basic-math']
  },
  {
    category: 'aptitude',
    difficulty: 'medium',
    text: 'A and B can complete a job in 12 days and 18 days respectively. In how many days can they complete it together?',
    options: ['6', '7.2', '8', '9'],
    correctAnswer: 1,
    tags: ['work-time', 'medium-math']
  },
  {
    category: 'aptitude',
    difficulty: 'medium',
    text: 'What is the next number in the series: 2, 6, 12, 20, 30, __?',
    options: ['38', '40', '42', '44'],
    correctAnswer: 2,
    tags: ['number-series', 'pattern']
  },
  {
    category: 'aptitude',
    difficulty: 'medium',
    text: 'A shopkeeper marks a product 25% above cost and gives a 20% discount. What is the profit or loss percentage?',
    options: ['Loss 5%', 'Profit 5%', 'No profit no loss', 'Profit 2%'],
    correctAnswer: 0,
    tags: ['profit-loss', 'percentages']
  },
  {
    category: 'aptitude',
    difficulty: 'medium',
    text: 'Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both are opened simultaneously, how long to fill the tank?',
    options: ['10 min', '12 min', '15 min', '18 min'],
    correctAnswer: 1,
    tags: ['pipes-cistern', 'work-time']
  },
  {
    category: 'aptitude',
    difficulty: 'hard',
    text: 'A boat travels 16 km upstream and 24 km downstream in 6 hours. If the speed of the stream is 2 km/h, what is the speed of the boat in still water?',
    options: ['6 km/h', '7 km/h', '8 km/h', '10 km/h'],
    correctAnswer: 2,
    tags: ['boats-streams', 'hard-math']
  },
  {
    category: 'aptitude',
    difficulty: 'hard',
    text: 'In how many ways can 4 boys and 3 girls be seated in a row such that no two girls sit together?',
    options: ['144', '288', '576', '720'],
    correctAnswer: 2,
    tags: ['permutations', 'combinatorics']
  },
  {
    category: 'aptitude',
    difficulty: 'hard',
    text: 'The compound interest on a sum of money at 10% per annum for 2 years is ₹420. What is the simple interest on the same sum at the same rate for the same period?',
    options: ['₹380', '₹400', '₹410', '₹420'],
    correctAnswer: 1,
    tags: ['compound-interest', 'simple-interest', 'hard-math']
  }
];

async function seedQuestions() {
  try {
    for (const q of allQuestions) {
      const exists = await Question.findOne({ text: q.text });
      if (!exists) {
        await Question.create(q);
        console.log(`  ✅ [${q.category}/${q.difficulty}] ${q.text.slice(0, 55)}...`);
      }
    }
    console.log(`\n🎉 Question seed complete! ${allQuestions.length} questions ready.`);
  } catch (err) {
    console.error('Question seed error:', err.message);
  }
}

module.exports = { seedQuestions };
