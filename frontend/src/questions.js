export const MOCK_QUESTIONS = {
    software_engineering: [
        {
            id: "se_1",
            category: "Data Structures",
            question: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
            options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
            correct: 2,
            explanation: "In a balanced BST, the height is log n. Searching involves traversing from root to leaf, taking O(log n) time.",
            difficulty: "Medium"
        },
        {
            id: "se_2",
            category: "Algorithms",
            question: "Which algorithm is used for finding the shortest path in a weighted graph without negative edges?",
            options: ["Prim's", "Dijkstra's", "Kruskal's", "Bellman-Ford"],
            correct: 1,
            explanation: "Dijkstra's algorithm is the standard choice for single-source shortest paths in graphs with non-negative weights.",
            difficulty: "Medium"
        },
        {
            id: "se_3",
            category: "System Design",
            question: "Which of the following is most critical for achieving 'High Availability' in a distributed system?",
            options: ["Normalization", "Redundancy", "Caching", "Indexing"],
            correct: 1,
            explanation: "Redundancy (having multiple instances) ensures that if one component fails, others can take over, ensuring availability.",
            difficulty: "Hard"
        },
        {
            id: "se_4",
            category: "Operating Systems",
            question: "What is a 'deadlock' in OS?",
            options: ["A process that finishes early", "Multiple processes waiting for resources held by each other", "A memory leak", "A fast process execution"],
            correct: 1,
            explanation: "Deadlock is a state where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.",
            difficulty: "Medium"
        },
        {
            id: "se_5",
            category: "DBMS",
            question: "Which SQL property ensures that a transaction is all or nothing?",
            options: ["Consistency", "Isolation", "Durability", "Atomicity"],
            correct: 3,
            explanation: "Atomicity ensures that all operations within a transaction are completed successfully; if not, the transaction is aborted.",
            difficulty: "Easy"
        },
        {
            id: "se_6",
            category: "Web Development",
            question: "What is the function of 'Key' prop in React lists?",
            options: ["To style elements", "To help React identify which items have changed", "To secure the data", "To link to a database"],
            correct: 1,
            explanation: "Keys help React identify which items have changed, are added, or are removed, giving the elements a stable identity.",
            difficulty: "Medium"
        },
        {
            id: "se_7",
            category: "Software Engineering",
            question: "Which of these is a SOLID principle?",
            options: ["Single Responsibility", "Multiple Inheritance", "Global State", "Coupling"],
            correct: 0,
            explanation: "SOLID stands for Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
            difficulty: "Easy"
        },
        {
            id: "se_8",
            category: "Algorithms",
            question: "What is the worst-case time complexity of QuickSort?",
            options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
            correct: 2,
            explanation: "The worst case for QuickSort occurs when the pivot is the smallest or largest element, leading to O(n²) complexity.",
            difficulty: "Hard"
        }
    ],
    data_science: [
        {
            id: "ds_1",
            category: "Machine Learning",
            question: "What is the primary purpose of 'Regularization' in Machine Learning?",
            options: ["Increase accuracy", "Reduce Overfitting", "Reduce Underfitting", "Increase training speed"],
            correct: 1,
            explanation: "Regularization (like L1/L2) adds a penalty to the loss function to prevent the model from becoming too complex and overfitting the training data.",
            difficulty: "Medium"
        },
        {
            id: "ds_2",
            category: "Statistics",
            question: "Which of the following is used to measure the strength and direction of a linear relationship between two variables?",
            options: ["Standard Deviation", "P-Value", "Correlation Coefficient", "Mean Absolute Error"],
            correct: 2,
            explanation: "The Pearson correlation coefficient ranges from -1 to 1, indicating the strength and direction of a linear relationship.",
            difficulty: "Easy"
        },
        {
            id: "ds_3",
            category: "Data Processing",
            question: "In Pandas, which function is used to handle missing values by filling them with a specific value?",
            options: ["dropna()", "fillna()", "replace()", "isnull()"],
            correct: 1,
            explanation: "fillna() is specifically designed to replace NaN/null values with a given value or method (like ffill).",
            difficulty: "Easy"
        },
        {
            id: "ds_4",
            category: "Deep Learning",
            question: "Which activation function is commonly used in the hidden layers of a Deep Neural Network to avoid the vanishing gradient problem?",
            options: ["Sigmoid", "ReLU", "Tanh", "Softmax"],
            correct: 1,
            explanation: "ReLU (Rectified Linear Unit) helps mitigate the vanishing gradient problem and is computationally efficient.",
            difficulty: "Medium"
        }
    ],
    aptitude: [
        {
            id: "apt_1",
            category: "Quantitative",
            question: "A sum of money doubles itself in 8 years at simple interest. What is the rate of interest per annum?",
            options: ["10%", "12.5%", "15%", "18%"],
            correct: 1,
            explanation: "If P becomes 2P, SI = P. P = (P * R * 8) / 100 => R = 100/8 = 12.5%.",
            difficulty: "Medium"
        },
        {
            id: "apt_2",
            category: "Logical",
            question: "Find the missing number in the series: 2, 6, 12, 20, 30, ?",
            options: ["36", "40", "42", "48"],
            correct: 2,
            explanation: "The differences are 4, 6, 8, 10... the next difference is 12. 30 + 12 = 42.",
            difficulty: "Easy"
        },
        {
            id: "apt_3",
            category: "Verbal",
            question: "Choose the word most nearly opposite in meaning to 'ABUNDANT'.",
            options: ["Plentiful", "Scarce", "Ample", "Copious"],
            correct: 1,
            explanation: "Scarce means deficient in quantity, which is the opposite of abundant.",
            difficulty: "Easy"
        }
    ]
};
