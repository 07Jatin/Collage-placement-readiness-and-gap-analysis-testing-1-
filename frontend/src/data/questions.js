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
            category: "Machine Learning",
            question: "In the context of Bias-Variance tradeoff, what does 'High Variance' typically indicate?",
            options: ["Underfitting", "Overfitting", "Low model complexity", "High training error"],
            correct: 1,
            explanation: "High variance indicates that the model is too sensitive to the training data and fails to generalize, which is characteristic of overfitting.",
            difficulty: "Hard"
        },
        {
            id: "ds_4",
            category: "Deep Learning",
            question: "Which activation function is commonly used in the hidden layers of a Deep Neural Network to avoid the vanishing gradient problem?",
            options: ["Sigmoid", "ReLU", "Tanh", "Softmax"],
            correct: 1,
            explanation: "ReLU (Rectified Linear Unit) helps mitigate the vanishing gradient problem and is computationally efficient.",
            difficulty: "Medium"
        },
        {
            id: "ds_5",
            category: "Model Evaluation",
            question: "What does an AUC-ROC score of 0.5 represent for a binary classifier?",
            options: ["Perfect Classifier", "Random Classifier", "Always Incorrect Classifier", "Multi-class Classifier"],
            correct: 1,
            explanation: "An AUC of 0.5 means the model has no discrimination capacity to distinguish between positive and negative classes, performing like random guessing.",
            difficulty: "Medium"
        },
        {
            id: "ds_6",
            category: "Statistics",
            question: "What is the primary concern when independent variables in a regression model are highly correlated?",
            options: ["Heteroscedasticity", "Autocorrelation", "Multicollinearity", "Normality"],
            correct: 2,
            explanation: "Multicollinearity occurs when predictor variables are correlated, which can make the coefficient estimates unstable and difficult to interpret.",
            difficulty: "Hard"
        },
        {
            id: "ds_7",
            category: "Big Data",
            question: "Which concept in Apache Spark allows it to optimize the execution plan by delaying computations until an action is called?",
            options: ["Caching", "Lazy Evaluation", "Checkpointing", "Broadcasting"],
            correct: 1,
            explanation: "Lazy evaluation means Spark doesn't execute transformations immediately; it builds a DAG (Directed Acyclic Graph) and executes only when an action (like collect or count) is triggered.",
            difficulty: "Hard"
        },
        {
            id: "ds_8",
            category: "Feature Engineering",
            question: "When dealing with high-cardinality categorical variables, which encoding method is often preferred to avoid the 'curse of dimensionality'?",
            options: ["One-Hot Encoding", "Label Encoding", "Target Encoding", "Binary Encoding"],
            correct: 2,
            explanation: "Target encoding converts categories into the mean of the target variable, keeping the feature space small compared to One-Hot encoding.",
            difficulty: "Hard"
        },
        {
            id: "ds_9",
            category: "Machine Learning",
            question: "Which ensemble technique builds multiple models independently and then averages their predictions?",
            options: ["Bagging", "Boosting", "Stacking", "Cascading"],
            correct: 0,
            explanation: "Bagging (Bootstrap Aggregating), like Random Forest, reduces variance by training models on different subsets of data in parallel.",
            difficulty: "Medium"
        },
        {
            id: "ds_10",
            category: "NLP",
            question: "Which technique is used to convert text data into numerical vectors by considering the relative frequency of words across documents?",
            options: ["Word2Vec", "TF-IDF", "One-Hot Encoding", "Bag of Words"],
            correct: 1,
            explanation: "TF-IDF (Term Frequency-Inverse Document Frequency) weights words based on how common they are in a document relative to the entire corpus.",
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
            category: "Probability",
            question: "Three unbiased coins are tossed. What is the probability of getting at least two heads?",
            options: ["1/4", "3/8", "1/2", "5/8"],
            correct: 2,
            explanation: "Total outcomes = 2^3 = 8. Favorable (HHH, HHT, HTH, THH) = 4. Prob = 4/8 = 1/2.",
            difficulty: "Medium"
        },
        {
            id: "apt_3",
            category: "Quantitative",
            question: "A shopkeeper sells an article at a discount of 20% and still makes a profit of 20%. By what percent is the marked price above the cost price?",
            options: ["40%", "50%", "60%", "25%"],
            correct: 1,
            explanation: "Let CP = 100. Profit 20% => SP = 120. SP is 80% of MP (20% discount). 0.8 * MP = 120 => MP = 150. MP is 50% above CP.",
            difficulty: "Hard"
        },
        {
            id: "apt_4",
            category: "Time & Work",
            question: "A can do a piece of work in 10 days, and B can do it in 15 days. If they work on alternate days starting with A, in how many days will the work be completed?",
            options: ["12 days", "13 days", "12.5 days", "11 days"],
            correct: 0,
            explanation: "Total work = 30 units (LCM). Efficiency A = 3, B = 2. In 2 days, 5 units done. To do 30 units, it takes (30/5) * 2 = 12 days.",
            difficulty: "Hard"
        },
        {
            id: "apt_5",
            category: "Number System",
            question: "What is the remainder when 2^31 is divided by 5?",
            options: ["1", "2", "3", "4"],
            correct: 2,
            explanation: "Powers of 2: 2^1=2, 2^2=4, 2^3=8, 2^4=16. Units digit cycle: 2, 4, 8, 6. 31 mod 4 = 3. 2^3 ends in 8. 8 divided by 5 leaves remainder 3.",
            difficulty: "Hard"
        },
        {
            id: "apt_6",
            category: "Permutation & Combination",
            question: "In how many ways can the letters of the word 'LEADER' be arranged such that the vowels always come together?",
            options: ["72", "144", "120", "36"],
            correct: 0,
            explanation: "LEADER: L, E, A, D, E, R. Vowels (E, A, E). Consonants (L, D, R). Treat (EAE) as one unit + 3 cons = 4 units. Ways = 4! * (3!/2!) / (2! for L,D,R is none... but wait). Vowels: EAE (3!/2! = 3 ways). Total units = 4 units (L, D, R, [EAE]). Ways = 4! * 3 = 24 * 3 = 72.",
            difficulty: "Hard"
        },
        {
            id: "apt_7",
            category: "Logical",
            question: "If 'COBBLER' is coded as 'DPCBMFS', how is 'DOCTOR' coded?",
            options: ["EPDUPS", "EPDVPS", "EPDUSP", "FQEVQT"],
            correct: 0,
            explanation: "Each letter is shifted by +1 in the alphabet. D->E, O->P, C->D, T->U, O->P, R->S.",
            difficulty: "Medium"
        },
        {
            id: "apt_8",
            category: "Quantitative",
            question: "A man covers 1/3 of his journey at 40 km/h and the remaining 2/3 at 60 km/h. His average speed is?",
            options: ["48 km/h", "50 km/h", "51.4 km/h", "52 km/h"],
            correct: 2,
            explanation: "Avg Speed = Total dist / Total time. Let dist = 300. Time1 = 100/40 = 2.5h. Time2 = 200/60 = 3.33h. Avg = 300 / 5.83 = 51.4 km/h.",
            difficulty: "Hard"
        },
        {
            id: "apt_9",
            category: "Geometry",
            question: "The ratio of the areas of a square and the circle inscribed in it is:",
            options: ["4 : π", "π : 4", "2 : π", "π : 2"],
            correct: 0,
            explanation: "Let side of square be 2r. Area square = 4r^2. Radius of in-circle = r. Area circle = πr^2. Ratio = 4r^2 : πr^2 = 4 : π.",
            difficulty: "Medium"
        },
        {
            id: "apt_10",
            category: "Mixture & Alligation",
            question: "A container contains 40 litres of milk. From this container 4 litres of milk was taken out and replaced by water. This process was repeated further two times. How much milk is now contained by the container?",
            options: ["26.34 litres", "27.36 litres", "28 litres", "29.16 litres"],
            correct: 3,
            explanation: "Final Volume = Initial Vol * (1 - x/V)^n. V=40, x=4, n=3. Vol = 40 * (1 - 4/40)^3 = 40 * (0.9)^3 = 40 * 0.729 = 29.16 litres.",
            difficulty: "Hard"
        }
    ]
};
