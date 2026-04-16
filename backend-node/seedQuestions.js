const { Question } = require('./models/Test');

const allQuestions = [
  // ─── DSA (30) ─────────────────────────────────────────────────────────────
  { category: 'dsa', difficulty: 'easy', text: 'Time complexity of accessing an array element by index?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correctAnswer: 2, tags: ['arrays'], efficientTime: 30 },
  { category: 'dsa', difficulty: 'easy', text: 'Structure following LIFO principle?', options: ['Queue', 'Stack', 'Heap', 'Linked List'], correctAnswer: 1, tags: ['stack'], efficientTime: 30 },
  { category: 'dsa', difficulty: 'easy', text: 'Worst-case time complexity of Linear Search?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 2, tags: ['searching'], efficientTime: 40 },
  { category: 'dsa', difficulty: 'easy', text: 'Which data structure is used for BFS?', options: ['Stack', 'Queue', 'Tree', 'Array'], correctAnswer: 1, tags: ['graphs'], efficientTime: 45 },
  { category: 'dsa', difficulty: 'easy', text: 'Space complexity of an adjacency matrix?', options: ['O(V)', 'O(E)', 'O(V²)', 'O(V+E)'], correctAnswer: 2, tags: ['graphs'], efficientTime: 45 },
  
  { category: 'dsa', difficulty: 'medium', text: 'Average-case time complexity of QuickSort?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctAnswer: 1, tags: ['sorting'], efficientTime: 60 },
  { category: 'dsa', difficulty: 'medium', text: 'BST traversal visiting nodes in sorted order?', options: ['Pre-order', 'Post-order', 'Level-order', 'In-order'], correctAnswer: 3, tags: ['trees'], efficientTime: 60 },
  { category: 'dsa', difficulty: 'medium', text: 'Cycle detection algorithm in O(n) time/O(1) space?', options: ['Hash Set', 'Floyd\'s Cycle Detection', 'Recursive DFS', 'Using Stack'], correctAnswer: 1, tags: ['linked-list'], efficientTime: 90 },
  { category: 'dsa', difficulty: 'medium', text: 'Space complexity of Merge Sort?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 2, tags: ['sorting'], efficientTime: 90 },
  { category: 'dsa', difficulty: 'medium', text: 'Which data structure is best for implementing a LRU Cache?', options: ['Hash Map + Doubly Linked List', 'Max Heap', 'Binary Search Tree', 'Stack'], correctAnswer: 0, tags: ['data-structures'], efficientTime: 100 },
  
  { category: 'dsa', difficulty: 'hard', text: 'Efficient data structure for Dijkstra\'s algorithm?', options: ['Array', 'Stack', 'Min-Heap', 'Hash Map'], correctAnswer: 2, tags: ['graphs'], efficientTime: 120 },
  { category: 'dsa', difficulty: 'hard', text: 'Time complexity of building a heap from an array?', options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'], correctAnswer: 2, tags: ['heap'], efficientTime: 120 },
  { category: 'dsa', difficulty: 'hard', text: 'Recurrence for 0/1 Knapsack problem?', options: ['dp[i][w] = dp[i-1][w] + val[i]', 'dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]]+val[i])', 'dp[i][w] = dp[i][w-wt[i]]+val[i]', 'dp[i][w] = dp[i-1][w-1]'], correctAnswer: 1, tags: ['dp'], efficientTime: 150 },
  { category: 'dsa', difficulty: 'hard', text: 'Correct property of an AVL tree?', options: ['Height of left subtree is always greater', 'Balance factor of any node is -1, 0, or 1', 'Always deeper than a BST', 'Used only for integers'], correctAnswer: 1, tags: ['trees'], efficientTime: 140 },
  { category: 'dsa', difficulty: 'hard', text: 'Time complexity of Rabin-Karp string matching?', options: ['Avg: O(n+m), Worst: O(nm)', 'O(n)', 'O(m log n)', 'O(n²)'], correctAnswer: 0, tags: ['strings'], efficientTime: 150 },

  // (Adding more to reach 30 for DSA...)
  { category: 'dsa', difficulty: 'easy', text: 'Index of the last element in an array of size N?', options: ['N', 'N+1', 'N-1', '0'], correctAnswer: 2, tags: ['arrays'], efficientTime: 20 },
  { category: 'dsa', difficulty: 'easy', text: 'What is a full binary tree?', options: ['Every node has 0 or 2 children', 'All levels are full', 'Height is exactly log N', 'Is a BST'], correctAnswer: 0, tags: ['trees'], efficientTime: 40 },
  { category: 'dsa', difficulty: 'medium', text: 'Time complexity of Binary Search?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], correctAnswer: 1, tags: ['searching'], efficientTime: 45 },
  { category: 'dsa', difficulty: 'medium', text: 'Algorithm for finding Minimum Spanning Tree?', options: ['Dijkstra', 'Floyd-Warshall', 'Kruskal\'s', 'Bellman-Ford'], correctAnswer: 2, tags: ['graphs'], efficientTime: 90 },
  { category: 'dsa', difficulty: 'medium', text: 'What is a stable sorting algorithm?', options: ['Maintains relative order of equal elements', 'Always runs in O(n log n)', 'Uses minimal memory', 'Is recursive'], correctAnswer: 0, tags: ['sorting'], efficientTime: 60 },
  { category: 'dsa', difficulty: 'hard', text: 'Number of edges in a complete graph with n vertices?', options: ['n', 'n-1', 'n(n-1)/2', 'n²'], correctAnswer: 2, tags: ['graphs'], efficientTime: 80 },
  { category: 'dsa', difficulty: 'hard', text: 'Floyd-Warshall time complexity?', options: ['O(V)', 'O(V²)', 'O(V³)', 'O(VE)'], correctAnswer: 2, tags: ['graphs'], efficientTime: 100 },
  { category: 'dsa', difficulty: 'easy', text: 'Binary search works only on?', options: ['Sorted arrays', 'Unsorted arrays', 'LinkedLists', 'Heaps'], correctAnswer: 0, tags: ['searching'], efficientTime: 30 },
  { category: 'dsa', difficulty: 'medium', text: 'Post-order traversal of a tree with root A, left B, right C?', options: ['ABC', 'BAC', 'BCA', 'CBA'], correctAnswer: 2, tags: ['trees'], efficientTime: 45 },
  { category: 'dsa', difficulty: 'hard', text: 'Worst case complexity of QuickSort?', options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'], correctAnswer: 1, tags: ['sorting'], efficientTime: 70 },
  { category: 'dsa', difficulty: 'easy', text: 'Complexity to insert in beginning of a dynamic array?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 2, tags: ['arrays'], efficientTime: 40 },
  { category: 'dsa', difficulty: 'medium', text: 'Depth-first search uses?', options: ['Queue', 'Stack', 'Heap', 'Set'], correctAnswer: 1, tags: ['graphs'], efficientTime: 40 },
  { category: 'dsa', difficulty: 'hard', text: 'Lower bound for comparison-based sorting?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'], correctAnswer: 2, tags: ['sorting'], efficientTime: 120 },
  { category: 'dsa', difficulty: 'easy', text: 'A tree is a graph with no?', options: ['Edges', 'Vertices', 'Cycles', 'Roots'], correctAnswer: 2, tags: ['graphs'], efficientTime: 20 },
  { category: 'dsa', difficulty: 'medium', text: 'Max nodes at level L in a binary tree?', options: ['L²', '2^L', 'L!', '2L'], correctAnswer: 1, tags: ['trees'], efficientTime: 40 },

  // ─── System Design (30) ───────────────────────────────────────────────────
  { category: 'sysdesign', difficulty: 'easy', text: 'What is horizontal scaling?', options: ['Upgrading CPU', 'Adding more machines', 'Increasing RAM', 'More storage'], correctAnswer: 1, tags: ['scaling'], efficientTime: 40 },
  { category: 'sysdesign', difficulty: 'easy', text: 'GET status code for success?', options: ['201', '404', '200', '500'], correctAnswer: 2, tags: ['http'], efficientTime: 20 },
  { category: 'sysdesign', difficulty: 'easy', text: 'Primary use of a CDN?', options: ['Backups', 'Geographic distribution of static content', 'Encryption', 'Serverless'], correctAnswer: 1, tags: ['cdn'], efficientTime: 40 },
  { category: 'sysdesign', difficulty: 'easy', text: 'What does API stand for?', options: ['App Programming Interface', 'Application Programming Interface', 'Automated Program Info', 'Advanced Process Int'], correctAnswer: 1, tags: ['basics'], efficientTime: 20 },
  { category: 'sysdesign', difficulty: 'easy', text: 'Stateless protocol example?', options: ['TCP', 'HTTP', 'FTP', 'SSH'], correctAnswer: 1, tags: ['networking'], efficientTime: 30 },

  { category: 'sysdesign', difficulty: 'medium', text: 'Main trade-off in CAP theorem?', options: ['Cost vs Performance', 'Consistency/Availability/Partition Tolerance', 'Cache/Avail/Processing', 'Concurrency/Acid/Persistence'], correctAnswer: 1, tags: ['cap'], efficientTime: 60 },
  { category: 'sysdesign', difficulty: 'medium', text: 'Simultaneous write to cache and DB strategy?', options: ['Cache-aside', 'Write-through', 'Write-behind', 'Read-through'], correctAnswer: 1, tags: ['caching'], efficientTime: 60 },
  { category: 'sysdesign', difficulty: 'medium', text: 'Message Queue purpose?', options: ['Session storage', 'Decoupling services', 'DB replacement', 'Static assets'], correctAnswer: 1, tags: ['microservices'], efficientTime: 60 },
  { category: 'sysdesign', difficulty: 'medium', text: 'Load balancer "Fewest active connections" algo?', options: ['Round Robin', 'IP Hash', 'Least Connections', 'Random'], correctAnswer: 2, tags: ['lb'], efficientTime: 50 },
  { category: 'sysdesign', difficulty: 'medium', text: 'Shared-nothing architecture benefit?', options: ['Easy to scale', 'Complex sync', 'Centralized storage', 'Single point of failure'], correctAnswer: 0, tags: ['scaling'], efficientTime: 70 },

  { category: 'sysdesign', difficulty: 'hard', text: 'Consistency guaranteeing read returns latest write?', options: ['Eventual', 'Causal', 'Strong', 'Monotonic'], correctAnswer: 2, tags: ['distributed'], efficientTime: 100 },
  { category: 'sysdesign', difficulty: 'hard', text: 'Twitter\'s Snowflake logic?', options: ['UUID v4', 'Auto-increment', 'Time-based IDs', 'SHA-256'], correctAnswer: 2, tags: ['distributed'], efficientTime: 120 },
  { category: 'sysdesign', difficulty: 'hard', text: 'Consistent hashing "vnodes" benefit?', options: ['Caching', 'Uniform distribution', 'Encryption', 'No replication'], correctAnswer: 1, tags: ['distributed'], efficientTime: 110 },
  { category: 'sysdesign', difficulty: 'hard', text: 'Gossip protocol is?', options: ['Centralized', 'Peer-to-peer info sharing', 'Database sync', 'Load balancing'], correctAnswer: 1, tags: ['distributed'], efficientTime: 120 },
  { category: 'sysdesign', difficulty: 'hard', text: 'Blue-Green deployment advantage?', options: ['Slow updates', 'Zero downtime', 'High cost only', 'Manual testing only'], correctAnswer: 1, tags: ['devops'], efficientTime: 100 },

  // (System design fillers...)
  { category: 'sysdesign', difficulty: 'easy', text: 'IP address is used in which layer?', options: ['Physical', 'Link', 'Network', 'Transport'], correctAnswer: 2, tags: ['networking'], efficientTime: 30 },
  { category: 'sysdesign', difficulty: 'medium', text: 'Database Sharding is?', options: ['Vertical scaling', 'Horizontal partitioning', 'Indexing', 'Replication'], correctAnswer: 1, tags: ['scaling'], efficientTime: 60 },
  { category: 'sysdesign', difficulty: 'hard', text: 'What is Read-your-writes consistency?', options: ['Users always see their own updates', 'Everyone sees same state', 'Sync writes only', 'Read from master only'], correctAnswer: 0, tags: ['consistency'], efficientTime: 90 },
  { category: 'sysdesign', difficulty: 'easy', text: 'Caching occurs in?', options: ['Client side', 'Server side', 'Reverse proxy', 'All of the above'], correctAnswer: 3, tags: ['caching'], efficientTime: 30 },
  { category: 'sysdesign', difficulty: 'medium', text: 'Monolith vs Microservices?', options: ['Monolith is faster to build initially', 'Microservices harder to scale', 'Microservices has shared database', 'Monolith is always better'], correctAnswer: 0, tags: ['microservices'], efficientTime: 60 },
  { category: 'sysdesign', difficulty: 'hard', text: 'Two-phase commit primary use?', options: ['Distributed transactions', 'Caching', 'Load balancing', 'Frontend routing'], correctAnswer: 0, tags: ['distributed'], efficientTime: 120 },
  { category: 'sysdesign', difficulty: 'easy', text: 'Which is a NoSQL database?', options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'], correctAnswer: 2, tags: ['db'], efficientTime: 20 },
  { category: 'sysdesign', difficulty: 'medium', text: 'Reverse proxy purpose?', options: ['Security', 'Load balancing', 'Caching', 'All of the above'], correctAnswer: 3, tags: ['proxy'], efficientTime: 40 },
  { category: 'sysdesign', difficulty: 'hard', text: 'Leader election algorithm?', options: ['Paxos', 'Baft', 'Raft', 'Both Paxos and Raft'], correctAnswer: 3, tags: ['distributed'], efficientTime: 150 },
  { category: 'sysdesign', difficulty: 'easy', text: 'DNS translates?', options: ['IP to MAC', 'Domain to IP', 'Text to Binary', 'HTTP to FTP'], correctAnswer: 1, tags: ['networking'], efficientTime: 20 },
  { category: 'sysdesign', difficulty: 'medium', text: 'Sticky sessions relate to?', options: ['Load balancing', 'Caching', 'Security', 'Database'], correctAnswer: 0, tags: ['lb'], efficientTime: 50 },
  { category: 'sysdesign', difficulty: 'hard', text: 'Bloom filter is?', options: ['Probabilistic structure for membership', 'Exact search', 'Sorting algo', 'B-tree variant'], correctAnswer: 0, tags: ['data-structures'], efficientTime: 120 },
  { category: 'sysdesign', difficulty: 'easy', text: 'Latency means?', options: ['Throughput', 'Time delay', 'Memory size', 'Network bandwidth'], correctAnswer: 1, tags: ['performance'], efficientTime: 20 },
  { category: 'sysdesign', difficulty: 'medium', text: 'Heartbeat signal use?', options: ['Health monitoring', 'Data transfer', 'Encryption', 'Routing'], correctAnswer: 0, tags: ['monitoring'], efficientTime: 50 },
  { category: 'sysdesign', difficulty: 'hard', text: 'Circuit Breaker pattern?', options: ['Prevents cascading failures', 'Speeds up responses', 'DB recovery', 'UI feedback'], correctAnswer: 0, tags: ['microservices'], efficientTime: 100 },

  // ─── CS Core (30) ──────────────────────────────────────────────────────────
  { category: 'csCore', difficulty: 'easy', text: 'SQL clause for grouped result filtering?', options: ['WHERE', 'ORDER BY', 'HAVING', 'GROUP BY'], correctAnswer: 2, tags: ['sql'], efficientTime: 30 },
  { category: 'csCore', difficulty: 'easy', text: 'OS Deadlock definition?', options: ['High CPU used', 'Processes waiting for each other\'s resources', 'Corrupt RAM', 'Kernel crash'], correctAnswer: 1, tags: ['os'], efficientTime: 40 },
  { category: 'csCore', difficulty: 'easy', text: 'DNS stands for?', options: ['Data Network System', 'Domain Name System', 'Dynamic Node Service', 'Digital Name Server'], correctAnswer: 1, tags: ['networking'], efficientTime: 20 },
  { category: 'csCore', difficulty: 'easy', text: 'HTTP 404 means?', options: ['Success', 'Forbidden', 'Not Found', 'Internal Error'], correctAnswer: 2, tags: ['web'], efficientTime: 20 },
  { category: 'csCore', difficulty: 'easy', text: 'Memory management unit (MMU)?', options: ['Maps virtual to physical address', 'Allocates disk space', 'Manages I/O', 'Controls CPU speed'], correctAnswer: 0, tags: ['os'], efficientTime: 40 },

  { category: 'csCore', difficulty: 'medium', text: 'ACID: Property for crash survival?', options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'], correctAnswer: 3, tags: ['dbms'], efficientTime: 50 },
  { category: 'csCore', difficulty: 'medium', text: 'Paging anomaly found in FIFO?', options: ['Belady\'s Anomaly', 'Dining Philosophers', 'Thirsting', 'Starvation'], correctAnswer: 0, tags: ['os'], efficientTime: 60 },
  { category: 'csCore', difficulty: 'medium', text: 'OSI layer for reliable delivery?', options: ['Network', 'Data Link', 'Transport', 'Session'], correctAnswer: 2, tags: ['networking'], efficientTime: 50 },
  { category: 'csCore', difficulty: 'medium', text: 'SQL INNER vs LEFT JOIN difference?', options: ['INNER returns all', 'LEFT returns unmatched from left table', 'Same result', 'LEFT works only on FK'], correctAnswer: 1, tags: ['sql'], efficientTime: 60 },
  { category: 'csCore', difficulty: 'medium', text: 'What is a process?', options: ['Program in execution', 'Static file', 'Header file', 'Function pointer'], correctAnswer: 0, tags: ['os'], efficientTime: 30 },

  { category: 'csCore', difficulty: 'hard', text: 'Min avg waiting time algorithm?', options: ['FCFS', 'Round Robin', 'SJF', 'Priority'], correctAnswer: 2, tags: ['os'], efficientTime: 90 },
  { category: 'csCore', difficulty: 'hard', text: 'BCNF condition?', options: ['Full dependency', 'X is a superkey for X->Y', 'No multi-valued deps', 'Atomic attributes'], correctAnswer: 1, tags: ['dbms'], efficientTime: 120 },
  { category: 'csCore', difficulty: 'hard', text: 'TCP 3-way handshake purpose?', options: ['TLS session', 'Sync sequence numbers (SYN, SYN-ACK, ACK)', 'Routing path', 'IP assignment'], correctAnswer: 1, tags: ['networking'], efficientTime: 100 },
  { category: 'csCore', difficulty: 'hard', text: 'Indexing structure for range queries?', options: ['Hash Map', 'B+ Tree', 'Linked List', 'Stack'], correctAnswer: 1, tags: ['dbms'], efficientTime: 90 },
  { category: 'csCore', difficulty: 'hard', text: 'Thrashing in OS means?', options: ['Disk failure', 'Excessive paging/swapping', 'High CPU temp', 'Malware attack'], correctAnswer: 1, tags: ['os'], efficientTime: 110 },

  // (CS Core fillers...)
  { category: 'csCore', difficulty: 'easy', text: 'SMTP is used for?', options: ['Emails', 'File transfer', 'Remote login', 'Web browsing'], correctAnswer: 0, tags: ['networking'], efficientTime: 30 },
  { category: 'csCore', difficulty: 'medium', text: 'Virtual Memory is?', options: ['Extra RAM', 'Hard disk used as RAM', 'Cache', 'Permanent storage'], correctAnswer: 1, tags: ['os'], efficientTime: 40 },
  { category: 'csCore', difficulty: 'hard', text: 'Two-phase locking goal?', options: ['Concurrency control', 'Caching', 'Security', 'Indexing'], correctAnswer: 0, tags: ['dbms'], efficientTime: 100 },
  { category: 'csCore', difficulty: 'easy', text: 'Primary Key is?', options: ['Unique + Not Null', 'Duplicate allowed', 'Null allowed', 'Can be multiple per table'], correctAnswer: 0, tags: ['dbms'], efficientTime: 20 },
  { category: 'csCore', difficulty: 'medium', text: 'TCP vs UDP?', options: ['TCP is connection-less', 'UDP is reliable', 'TCP ensures order', 'UDP is slower'], correctAnswer: 2, tags: ['networking'], efficientTime: 40 },
  { category: 'csCore', difficulty: 'hard', text: 'Preemptive vs Non-preemptive?', options: ['Preemptive can interrupt', 'Non-preemptive is faster', 'Preemptive uses less CPU', 'None'], correctAnswer: 0, tags: ['os'], efficientTime: 60 },
  { category: 'csCore', difficulty: 'easy', text: 'What is a Foreign Key?', options: ['Reference to PK in another table', 'Uniqueness constraint', 'Math operation', 'UI element'], correctAnswer: 0, tags: ['dbms'], efficientTime: 30 },
  { category: 'csCore', difficulty: 'medium', text: 'Thread vs Process?', options: ['Process has own memory', 'Thread is bigger', 'Processes share heap', 'Threads are slower'], correctAnswer: 0, tags: ['os'], efficientTime: 50 },
  { category: 'csCore', difficulty: 'hard', text: 'B-tree degree N can have how many children?', options: ['Exactly N', 'Min N/2, Max N', 'Always 2', 'N+1'], correctAnswer: 1, tags: ['dbms'], efficientTime: 120 },
  { category: 'csCore', difficulty: 'easy', text: 'MAC address size?', options: ['32 bits', '48 bits', '64 bits', '128 bits'], correctAnswer: 1, tags: ['networking'], efficientTime: 30 },
  { category: 'csCore', difficulty: 'medium', text: 'Context Switching is?', options: ['Switching between processes', 'Format conversion', 'Rebooting', 'Disk formatting'], correctAnswer: 0, tags: ['os'], efficientTime: 40 },
  { category: 'csCore', difficulty: 'hard', text: 'Wait-for graph is used for?', options: ['Deadlock detection', 'Memory management', 'CPU load', 'Routing'], correctAnswer: 0, tags: ['os'], efficientTime: 90 },
  { category: 'csCore', difficulty: 'easy', text: 'Router works on?', options: ['Physical', 'Link', 'Network', 'Transport'], correctAnswer: 2, tags: ['networking'], efficientTime: 20 },
  { category: 'csCore', difficulty: 'medium', text: 'Dirty Page means?', options: ['Modified page in cache but not disk', 'Corrupt page', 'Inaccessible page', 'Newly allocated page'], correctAnswer: 0, tags: ['os'], efficientTime: 50 },
  { category: 'csCore', difficulty: 'hard', text: 'Normal form for multi-valued dependency?', options: ['1NF', '2NF', '3NF', '4NF'], correctAnswer: 3, tags: ['dbms'], efficientTime: 130 },

  // ─── Quantitative Aptitude (30) ──────────────────────────────────────────
  { category: 'aptitude', difficulty: 'easy', text: 'Train travels 180km in 3h. Speed?', options: ['45', '54', '60', '90'], correctAnswer: 2, tags: ['math'], efficientTime: 30 },
  { category: 'aptitude', difficulty: 'easy', text: '15% of 200?', options: ['20', '25', '30', '35'], correctAnswer: 2, tags: ['math'], efficientTime: 20 },
  { category: 'aptitude', difficulty: 'easy', text: 'Ratio boys:girls 3:2. 30 boys, how many girls?', options: ['15', '18', '20', '25'], correctAnswer: 2, tags: ['math'], efficientTime: 30 },
  { category: 'aptitude', difficulty: 'easy', text: 'Average of 10, 20, 30?', options: ['15', '20', '25', '30'], correctAnswer: 1, tags: ['math'], efficientTime: 20 },
  { category: 'aptitude', difficulty: 'easy', text: 'Area of circle with radius 7 (use 22/7)?', options: ['44', '154', '308', '49'], correctAnswer: 1, tags: ['math'], efficientTime: 40 },

  { category: 'aptitude', difficulty: 'medium', text: 'A, B do job in 12, 18 days. Together?', options: ['6', '7.2', '8', '9'], correctAnswer: 1, tags: ['math'], efficientTime: 90 },
  { category: 'aptitude', difficulty: 'medium', text: 'Series: 2, 6, 12, 20, 30, ?', options: ['38', '40', '42', '44'], correctAnswer: 2, tags: ['math'], efficientTime: 60 },
  { category: 'aptitude', difficulty: 'medium', text: 'Marks up 25%, 20% discount. Profit?', options: ['Loss 5%', 'Profit 5%', 'No profit loss', 'Profit 2%'], correctAnswer: 2, tags: ['math'], efficientTime: 70 },
  { category: 'aptitude', difficulty: 'medium', text: 'Pipes A, B fill in 20, 30 mins. Together?', options: ['10', '12', '15', '18'], correctAnswer: 1, tags: ['math'], efficientTime: 60 },
  { category: 'aptitude', difficulty: 'medium', text: 'Probability of rolling a 4 on a fair die?', options: ['1/2', '1/3', '1/6', '1/4'], correctAnswer: 2, tags: ['math'], efficientTime: 30 },

  { category: 'aptitude', difficulty: 'hard', text: 'Boat 16km up, 24km down in 6h. Stream 2km/h. Boat speed?', options: ['6', '7', '8', '10'], correctAnswer: 2, tags: ['math'], efficientTime: 150 },
  { category: 'aptitude', difficulty: 'hard', text: 'Seating 4 boys, 3 girls. No two girls together?', options: ['144', '288', '576', '1440'], correctAnswer: 3, tags: ['math'], efficientTime: 120 },
  { category: 'aptitude', difficulty: 'hard', text: 'CI on sum @ 10% for 2yr is 420. SI?', options: ['380', '400', '410', '420'], correctAnswer: 1, tags: ['math'], efficientTime: 120 },
  { category: 'aptitude', difficulty: 'hard', text: 'A sum triples in 15 years. Years to get 9 times at SI?', options: ['30', '45', '60', '75'], correctAnswer: 2, tags: ['math'], efficientTime: 140 },
  { category: 'aptitude', difficulty: 'hard', text: 'Surface area of sphere with radius 7?', options: ['154', '308', '616', '1078'], correctAnswer: 2, tags: ['math'], efficientTime: 100 },

  // (Aptitude fillers...)
  { category: 'aptitude', difficulty: 'easy', text: 'Difference between largest 2-digit number and smallest 3-digit?', options: ['1', '9', '10', '11'], correctAnswer: 0, tags: ['math'], efficientTime: 20 },
  { category: 'aptitude', difficulty: 'medium', text: 'HCF of 24, 36, 40?', options: ['4', '6', '12', '2'], correctAnswer: 0, tags: ['math'], efficientTime: 60 },
  { category: 'aptitude', difficulty: 'hard', text: 'Two numbers in ratio 3:4. LCM is 84. Greater number?', options: ['21', '24', '28', '32'], correctAnswer: 2, tags: ['math'], efficientTime: 80 },
  { category: 'aptitude', difficulty: 'easy', text: 'Value of 0.05 * 0.5?', options: ['0.25', '0.025', '0.0025', '0.5'], correctAnswer: 1, tags: ['math'], efficientTime: 20 },
  { category: 'aptitude', difficulty: 'medium', text: 'Median of 3, 5, 7, 9, 11?', options: ['5', '7', '9', '8'], correctAnswer: 1, tags: ['stats'], efficientTime: 30 },
  { category: 'aptitude', difficulty: 'hard', text: 'Side of cube whose volume is 343?', options: ['6', '7', '8', '9'], correctAnswer: 1, tags: ['math'], efficientTime: 40 },
  { category: 'aptitude', difficulty: 'easy', text: 'Square root of 625?', options: ['15', '25', '35', '45'], correctAnswer: 1, tags: ['math'], efficientTime: 10 },
  { category: 'aptitude', difficulty: 'medium', text: 'A is 20% older than B. How much % is B younger than A?', options: ['20%', '16.66%', '25%', '15%'], correctAnswer: 1, tags: ['math'], efficientTime: 60 },
  { category: 'aptitude', difficulty: 'hard', text: 'Work: 10 men finish in 15 days. 15 women finish in 20 days. 10 men + 15 women?', options: ['8', '8.57', '9', '10'], correctAnswer: 1, tags: ['math'], efficientTime: 180 },
  { category: 'aptitude', difficulty: 'easy', text: 'Next in series: 5, 10, 15, 20?', options: ['21', '22', '25', '30'], correctAnswer: 2, tags: ['math'], efficientTime: 10 },
  { category: 'aptitude', difficulty: 'medium', text: 'Angle between hands of clock at 3:00?', options: ['60', '90', '120', '0'], correctAnswer: 1, tags: ['math'], efficientTime: 20 },
  { category: 'aptitude', difficulty: 'hard', text: 'Find remainder of 2^31 divided by 7?', options: ['1', '2', '3', '4'], correctAnswer: 1, tags: ['math'], efficientTime: 120 },
  { category: 'aptitude', difficulty: 'easy', text: '1/3 + 1/6 = ?', options: ['1/9', '2/9', '1/2', '1/4'], correctAnswer: 2, tags: ['math'], efficientTime: 20 },
  { category: 'aptitude', difficulty: 'medium', text: 'Selling price when CP=200 and profit=10%?', options: ['210', '220', '230', '240'], correctAnswer: 1, tags: ['math'], efficientTime: 20 },
  { category: 'aptitude', difficulty: 'hard', text: 'Sum of internal angles of a hexagon?', options: ['360', '540', '720', '900'], correctAnswer: 2, tags: ['math'], efficientTime: 50 },

  // ─── Logical Reasoning (30) ────────────────────────────────────────────────
  { category: 'logicalReasoning', difficulty: 'easy', text: 'If 1=3, 2=5, 3=7, then 4=?', options: ['8', '9', '10', '11'], correctAnswer: 1, tags: ['logic'], efficientTime: 30 },
  { category: 'logicalReasoning', difficulty: 'easy', text: 'Pointing to a man, a woman says: "His mother is the only daughter of my mother". How is she related?', options: ['Sister', 'Mother', 'Niece', 'Aunt'], correctAnswer: 1, tags: ['blood-relation'], efficientTime: 60 },
  { category: 'logicalReasoning', difficulty: 'easy', text: 'Which word does NOT belong?', options: ['Apple', 'Banana', 'Carrot', 'Grape'], correctAnswer: 2, tags: ['odd-one'], efficientTime: 20 },
  { category: 'logicalReasoning', difficulty: 'easy', text: 'North, East, South, ?', options: ['Up', 'Down', 'West', 'Left'], correctAnswer: 2, tags: ['logic'], efficientTime: 10 },
  { category: 'logicalReasoning', difficulty: 'easy', text: 'Alphabet series: A, C, E, G, ?', options: ['H', 'I', 'J', 'K'], correctAnswer: 1, tags: ['series'], efficientTime: 20 },

  { category: 'logicalReasoning', difficulty: 'medium', text: 'If BEYOND is C f z p o e, then SPRING is?', options: ['T q s j o h', 'T q s j n h', 'T q s k o h', 'T r s j o h'], correctAnswer: 0, tags: ['coding'], efficientTime: 90 },
  { category: 'logicalReasoning', difficulty: 'medium', text: 'Man goes 5km N, turns R 3km, turns R 2km. Distance from start?', options: ['4km', 'sqrt(34)km', 'sqrt(13)km', '5km'], correctAnswer: 2, tags: ['direction'], efficientTime: 90 },
  { category: 'logicalReasoning', difficulty: 'medium', text: 'Syllogism: All cats are dogs. All dogs are birds. then?', options: ['Some birds are cats', 'All cats are birds', 'No cat is bird', 'Both 1 and 2'], correctAnswer: 3, tags: ['syllogism'], efficientTime: 60 },
  { category: 'logicalReasoning', difficulty: 'medium', text: 'Odd one out?', options: ['81', '64', '49', '35'], correctAnswer: 3, tags: ['logic'], efficientTime: 20 },
  { category: 'logicalReasoning', difficulty: 'medium', text: 'Series: 1, 4, 9, 16, ?', options: ['20', '25', '30', '36'], correctAnswer: 1, tags: ['series'], efficientTime: 20 },

  { category: 'logicalReasoning', difficulty: 'hard', text: 'Cube painted red on all faces is cut into 27 small cubes. How many have 0 faces painted?', options: ['0', '1', '4', '8'], correctAnswer: 1, tags: ['cubes'], efficientTime: 120 },
  { category: 'logicalReasoning', difficulty: 'hard', text: 'Clock shows 3:40. Mirror image?', options: ['8:20', '9:20', '8:40', '9:40'], correctAnswer: 0, tags: ['clock'], efficientTime: 80 },
  { category: 'logicalReasoning', difficulty: 'hard', text: 'If RAIN=42, then WATER=?', options: ['67', '45', '60', '71'], correctAnswer: 0, tags: ['coding'], efficientTime: 140 },
  { category: 'logicalReasoning', difficulty: 'hard', text: 'Find missing: 4, 18, ?, 100, 180', options: ['32', '48', '60', '72'], correctAnswer: 1, tags: ['series'], efficientTime: 150 },
  { category: 'logicalReasoning', difficulty: 'hard', text: '7 people in circle. A between B and C. D is R of C...', options: ['Data Incomplete', 'Logic Error', 'Complex Puzzle Result', 'None'], correctAnswer: 2, tags: ['arrangement'], efficientTime: 200 },

  // (Logical fillers...)
  { category: 'logicalReasoning', difficulty: 'easy', text: 'If COLD is DPME, then HEAT is?', options: ['IFBU', 'HEBT', 'IEBU', 'GDU'], correctAnswer: 0, tags: ['coding'], efficientTime: 40 },
  { category: 'logicalReasoning', difficulty: 'medium', text: 'Calendar: 1st Jan 2024 was Monday. 1st Jan 2025?', options: ['Tuesday', 'Wednesday', 'Thursday', 'Monday'], correctAnswer: 1, tags: ['calendar'], efficientTime: 90 },
  { category: 'logicalReasoning', difficulty: 'hard', text: 'Dice: Opposite to 6?', options: ['Usually 1', 'Depends on image', 'Data missing', 'None'], correctAnswer: 0, tags: ['dice'], efficientTime: 60 },
  { category: 'logicalReasoning', difficulty: 'easy', text: 'Complete: Tree : Forest :: ? : Library', options: ['Wood', 'Student', 'Book', 'Shelves'], correctAnswer: 2, tags: ['analogy'], efficientTime: 20 },
  { category: 'logicalReasoning', difficulty: 'medium', text: 'John is taller than Peter, shorter than Mark. Who is tallest?', options: ['John', 'Peter', 'Mark', 'Cannot tell'], correctAnswer: 2, tags: ['logic'], efficientTime: 30 },
  { category: 'logicalReasoning', difficulty: 'hard', text: 'How many triangles in a star shape?', options: ['5', '8', '10', '12'], correctAnswer: 2, tags: ['visual'], efficientTime: 80 },
  { category: 'logicalReasoning', difficulty: 'easy', text: 'Odd one: Earth, Moon, Mars, Venus?', options: ['Earth', 'Moon', 'Mars', 'Venus'], correctAnswer: 1, tags: ['logic'], efficientTime: 20 },
  { category: 'logicalReasoning', difficulty: 'medium', text: 'Brother logic: A is B\'s brother. C is B\'s father. D is C\'s father. Relation A to D?', options: ['Son', 'Grandson', 'Brother', 'Uncle'], correctAnswer: 1, tags: ['blood-relation'], efficientTime: 60 },
  { category: 'logicalReasoning', difficulty: 'hard', text: 'Cipher: 123=ABC, then 321=?', options: ['CBA', 'CAB', 'BAC', 'ABC'], correctAnswer: 0, tags: ['logic'], efficientTime: 20 },
  { category: 'logicalReasoning', difficulty: 'easy', text: '3, 6, 9, 12, ?', options: ['13', '14', '15', '18'], correctAnswer: 2, tags: ['series'], efficientTime: 10 },
  { category: 'logicalReasoning', difficulty: 'medium', text: 'If red is blue, blue is green, green is yellow, color of sky?', options: ['Blue', 'Green', 'Red', 'Yellow'], correctAnswer: 1, tags: ['coding'], efficientTime: 30 },
  { category: 'logicalReasoning', difficulty: 'hard', text: 'Complex syllogism: Some A are B. All B are C. No C is D. conclusion?', options: ['Some A are not D', 'All A are C', 'All B are D', 'None'], correctAnswer: 0, tags: ['logic'], efficientTime: 120 },
  { category: 'logicalReasoning', difficulty: 'easy', text: 'Find missing: 2, 5, 10, ?, 26', options: ['15', '17', '19', '21'], correctAnswer: 1, tags: ['series'], efficientTime: 30 },
  { category: 'logicalReasoning', difficulty: 'medium', text: 'Ranking: Ram is 7th from top, 28th from bottom. Total?', options: ['34', '35', '36', '33'], correctAnswer: 0, tags: ['ranking'], efficientTime: 40 },
  { category: 'logicalReasoning', difficulty: 'hard', text: 'Direction: Walk 10m L, 10m R, 10m Back. displacement?', options: ['0', '10', '20', '30'], correctAnswer: 1, tags: ['direction'], efficientTime: 60 },

  // ─── Verbal Ability (30) ───────────────────────────────────────────────────
  { category: 'verbalAbility', difficulty: 'easy', text: 'Synonym of "Fragile"?', options: ['Strong', 'Weak', 'Delicate', 'Hard'], correctAnswer: 2, tags: ['english'], efficientTime: 20 },
  { category: 'verbalAbility', difficulty: 'easy', text: 'Antonym of "Ancient"?', options: ['Old', 'Modern', 'Historic', 'Slow'], correctAnswer: 1, tags: ['english'], efficientTime: 20 },
  { category: 'verbalAbility', difficulty: 'easy', text: 'Correct spelling?', options: ['Acommodation', 'Accommodation', 'Acomodation', 'Accomodation'], correctAnswer: 1, tags: ['english'], efficientTime: 30 },
  { category: 'verbalAbility', difficulty: 'easy', text: 'Fill: He ____ playing football.', options: ['like', 'likes', 'liking', 'is likes'], correctAnswer: 1, tags: ['english'], efficientTime: 15 },
  { category: 'verbalAbility', difficulty: 'easy', text: 'A person who writes books?', options: ['Artist', 'Author', 'Actor', 'Archer'], correctAnswer: 1, tags: ['english'], efficientTime: 10 },

  { category: 'verbalAbility', difficulty: 'medium', text: 'Idiom "Piece of cake" means?', options: ['Food item', 'Very easy task', 'Difficult job', 'A gift'], correctAnswer: 1, tags: ['english'], efficientTime: 30 },
  { category: 'verbalAbility', difficulty: 'medium', text: 'Change to passive: "She sings a song"', options: ['Song is sang by her', 'Song is sung by her', 'Song sung by her', 'Song is singing'], correctAnswer: 1, tags: ['english'], efficientTime: 40 },
  { category: 'verbalAbility', difficulty: 'medium', text: 'Fill: Although he was tired, ____ he finished the work.', options: ['but', 'yet', 'then', 'and'], correctAnswer: 1, tags: ['english'], efficientTime: 40 },
  { category: 'verbalAbility', difficulty: 'medium', text: 'Synonym of "Exuberant"?', options: ['Sad', 'Energetic', 'Boring', 'Small'], correctAnswer: 1, tags: ['english'], efficientTime: 30 },
  { category: 'verbalAbility', difficulty: 'medium', text: 'Analogy: Pen : Write :: Fork : ?', options: ['Drink', 'Eat', 'Draw', 'Sleep'], correctAnswer: 1, tags: ['english'], efficientTime: 15 },

  { category: 'verbalAbility', difficulty: 'hard', text: 'Meaning of "Ambiguous"?', options: ['Clear', 'Double meaning/unclear', 'Large', 'Ancient'], correctAnswer: 1, tags: ['english'], efficientTime: 40 },
  { category: 'verbalAbility', difficulty: 'hard', text: 'Find error: "He have been working since morning."', options: ['He', 'have been', 'working', 'since'], correctAnswer: 1, tags: ['english'], efficientTime: 50 },
  { category: 'verbalAbility', difficulty: 'hard', text: 'One word: "A place where bees are kept"?', options: ['Aviary', 'Apiary', 'Zoo', 'Aquarium'], correctAnswer: 1, tags: ['english'], efficientTime: 40 },
  { category: 'verbalAbility', difficulty: 'hard', text: 'Antonym of "Candid"?', options: ['Honest', 'Deceptive', 'Direct', 'Brave'], correctAnswer: 1, tags: ['english'], efficientTime: 40 },
  { category: 'verbalAbility', difficulty: 'hard', text: 'Identify voice: "The bill was paid by him."', options: ['Active', 'Passive', 'Direct', 'Indirect'], correctAnswer: 1, tags: ['english'], efficientTime: 20 },

  // (Verbal fillers...)
  { category: 'verbalAbility', difficulty: 'easy', text: 'Plural of "Child"?', options: ['Childs', 'Children', 'Childrens', 'Childes'], correctAnswer: 1, tags: ['english'], efficientTime: 10 },
  { category: 'verbalAbility', difficulty: 'medium', text: 'Correct "Its" or "It\'s" for "The dog wagged ___ tail"?', options: ['Its', 'It\'s', 'I’ts', 'Its’'], correctAnswer: 0, tags: ['english'], efficientTime: 20 },
  { category: 'verbalAbility', difficulty: 'hard', text: 'Sentence with correct punctuation?', options: ['"Go away!" she yelled.', '"Go away" she yelled!', 'Go away she yelled.', 'She yelled go away.'], correctAnswer: 0, tags: ['english'], efficientTime: 40 },
  { category: 'verbalAbility', difficulty: 'easy', text: 'Opposite of "Victory"?', options: ['Win', 'Loss', 'Defeat', 'Triumph'], correctAnswer: 2, tags: ['english'], efficientTime: 10 },
  { category: 'verbalAbility', difficulty: 'medium', text: 'Meaning of "Prudent"?', options: ['Careful', 'Careless', 'Fast', 'Strong'], correctAnswer: 0, tags: ['english'], efficientTime: 40 },
  { category: 'verbalAbility', difficulty: 'hard', text: 'One word substitute: "A person who hates mankind"', options: ['Optimist', 'Pessimist', 'Misanthrope', 'Philanthropist'], correctAnswer: 2, tags: ['english'], efficientTime: 40 },
  { category: 'verbalAbility', difficulty: 'easy', text: 'Article: "This is ___ unicorn."', options: ['a', 'an', 'the', 'no article'], correctAnswer: 0, tags: ['english'], efficientTime: 20 },
  { category: 'verbalAbility', difficulty: 'medium', text: 'Correct form: "If I ___ you, I would go."', options: ['am', 'was', 'were', 'be'], correctAnswer: 2, tags: ['english'], efficientTime: 30 },
  { category: 'verbalAbility', difficulty: 'hard', text: 'Synonym of "Mitigate"?', options: ['Increase', 'Worsen', 'Alleviate/Less', 'Identify'], correctAnswer: 2, tags: ['english'], efficientTime: 40 },
  { category: 'verbalAbility', difficulty: 'easy', text: 'Vowel count in "EDUCATION"?', options: ['4', '5', '6', '7'], correctAnswer: 1, tags: ['english'], efficientTime: 20 },
  { category: 'verbalAbility', difficulty: 'medium', text: 'Meaning of "Elicit"?', options: ['Illegal', 'Draw out', 'Hide', 'Direct'], correctAnswer: 1, tags: ['english'], efficientTime: 40 },
  { category: 'verbalAbility', difficulty: 'hard', text: 'Tense of: "I had finished the work."', options: ['Past perfect', 'Present perfect', 'Future perfect', 'Past simple'], correctAnswer: 0, tags: ['english'], efficientTime: 20 },
  { category: 'verbalAbility', difficulty: 'easy', text: 'Meaning of "Annual"?', options: ['Weekly', 'Monthly', 'Yearly', 'Daily'], correctAnswer: 2, tags: ['english'], efficientTime: 10 },
  { category: 'verbalAbility', difficulty: 'medium', text: 'Opposite of "Vague"?', options: ['Clear', 'Blur', 'Large', 'Small'], correctAnswer: 0, tags: ['english'], efficientTime: 20 },
  { category: 'verbalAbility', difficulty: 'hard', text: 'Meaning of "Eloquent"?', options: ['Silent', 'Fluent/Persuasive in speaking', 'Messy', 'Fast'], correctAnswer: 1, tags: ['english'], efficientTime: 40 }
];

async function seedQuestions() {
  try {
    for (const q of allQuestions) {
      const exists = await Question.findOne({ text: q.text, category: q.category });
      if (!exists) {
        await Question.create(q);
        console.log(`  ✅ [${q.category}/${q.difficulty}] ${q.text.slice(0, 55)}...`);
      }
    }
    console.log(`\n🎉 Domain expansion complete! ${allQuestions.length} questions ready.`);
  } catch (err) {
    console.error('Question seed error:', err.message);
  }
}

module.exports = { seedQuestions };
