/**
 * Skill Data Module — Frontend Skill Extraction + Quiz Bank
 * 
 * This module enables FULLY CLIENT-SIDE resume parsing & skill verification.
 * No LLM needed — uses keyword matching + predefined quiz bank.
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PART 1: Skill Keywords for Resume Extraction
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SKILL_KEYWORDS = {
    python: {
        keywords: ["python", "django", "flask", "fastapi", "pandas", "numpy", "scipy", "matplotlib", "jupyter", "pip", "pytest", "celery", "pydantic"],
        category: "Programming Language",
        icon: "🐍"
    },
    sql: {
        keywords: ["sql", "mysql", "postgresql", "postgres", "sqlite", "oracle", "sql server", "stored procedure", "database", "dbms", "rdbms", "query", "nosql", "mongodb"],
        category: "Database",
        icon: "🗄️"
    },
    react: {
        keywords: ["react", "reactjs", "react.js", "redux", "jsx", "next.js", "nextjs", "react hooks", "react native", "context api"],
        category: "Frontend",
        icon: "⚛️"
    },
    git: {
        keywords: ["git", "github", "gitlab", "bitbucket", "version control", "source control", "pull request", "branching"],
        category: "Version Control",
        icon: "🔀"
    },
    algorithms: {
        keywords: ["algorithm", "sorting", "searching", "dynamic programming", "greedy", "backtracking", "bfs", "dfs", "dijkstra", "binary search", "recursion", "big o", "time complexity"],
        category: "Computer Science",
        icon: "🧮"
    },
    "data-structures": {
        keywords: ["data structure", "array", "linked list", "stack", "queue", "hash table", "hash map", "heap", "binary tree", "graph", "trie"],
        category: "Computer Science",
        icon: "🏗️"
    },
    "rest-api": {
        keywords: ["rest api", "restful", "api", "endpoint", "http", "crud", "graphql", "swagger", "postman", "microservice"],
        category: "Backend",
        icon: "🔌"
    },
    docker: {
        keywords: ["docker", "container", "dockerfile", "docker-compose", "docker hub", "containerization"],
        category: "DevOps",
        icon: "🐳"
    },
    kubernetes: {
        keywords: ["kubernetes", "k8s", "kubectl", "helm", "pod", "container orchestration", "minikube"],
        category: "DevOps",
        icon: "☸️"
    },
    aws: {
        keywords: ["aws", "amazon web services", "ec2", "s3", "lambda", "cloudformation", "dynamodb", "rds", "sqs", "iam", "vpc"],
        category: "Cloud",
        icon: "☁️"
    },
    "machine-learning": {
        keywords: ["machine learning", "deep learning", "neural network", "tensorflow", "pytorch", "keras", "scikit-learn", "classification", "regression", "clustering", "nlp", "cnn", "rnn", "xgboost"],
        category: "AI/ML",
        icon: "🤖"
    },
    statistics: {
        keywords: ["statistics", "statistical", "probability", "hypothesis testing", "regression analysis", "bayesian", "p-value", "confidence interval", "anova", "correlation"],
        category: "Mathematics",
        icon: "📊"
    },
    pandas: {
        keywords: ["pandas", "dataframe", "data manipulation", "data wrangling", "data cleaning"],
        category: "Data Science",
        icon: "🐼"
    },
    linux: {
        keywords: ["linux", "ubuntu", "centos", "debian", "unix", "chmod", "grep", "awk", "sed", "systemd"],
        category: "Operating System",
        icon: "🐧"
    },
    bash: {
        keywords: ["bash", "shell scripting", "shell script", "command line", "terminal", "zsh", "cron"],
        category: "Scripting",
        icon: "💲"
    },
    "ci-cd": {
        keywords: ["ci/cd", "ci cd", "continuous integration", "continuous deployment", "jenkins", "github actions", "circleci", "travis ci", "pipeline"],
        category: "DevOps",
        icon: "🔄"
    },
    monitoring: {
        keywords: ["monitoring", "prometheus", "grafana", "nagios", "datadog", "alerting", "logging", "elk stack", "observability"],
        category: "DevOps",
        icon: "📡"
    }
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PART 2: Client-side Skill Extraction Function
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function extractSkillsFromText(text) {
    const textLower = text.toLowerCase();
    const results = {};

    Object.entries(SKILL_KEYWORDS).forEach(([skillId, skillInfo]) => {
        let totalMatches = 0;
        const foundKeywords = [];

        skillInfo.keywords.forEach(keyword => {
            // Escape special regex chars in keyword, then match with word boundaries
            const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = new RegExp(`\\b${escaped}(?:s|es|ing|ed)?\\b`, 'gi');
            const matches = textLower.match(pattern);
            if (matches) {
                totalMatches += matches.length;
                if (!foundKeywords.includes(keyword)) {
                    foundKeywords.push(keyword);
                }
            }
        });

        if (totalMatches > 0) {
            const confidence = Math.min(95, 20 + totalMatches * 18);
            results[skillId] = {
                skill: skillId,
                category: skillInfo.category,
                icon: skillInfo.icon,
                confidence,
                matchCount: totalMatches,
                matchedKeywords: foundKeywords,
                status: "unverified",         // unverified | verifying | verified
                verifiedLevel: null,          // null | "expert" | "proficient" | "beginner" | "failed"
                quizScore: null
            };
        }
    });

    return results;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PART 3: Skill Verification Quiz Bank (3 questions per skill)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SKILL_QUIZZES = {
    python: [
        {
            question: "What is the output of: len([1, 2, 3, 4])?",
            options: ["3", "4", "5", "Error"],
            correct: 1,
            explanation: "len() returns the number of elements. The list has 4 elements."
        },
        {
            question: "Which keyword is used to define a function in Python?",
            options: ["function", "func", "def", "define"],
            correct: 2,
            explanation: "In Python, 'def' is used to define a function."
        },
        {
            question: "What does 'self' refer to in a Python class method?",
            options: ["The class itself", "The current instance of the class", "A global variable", "The parent class"],
            correct: 1,
            explanation: "'self' refers to the current instance of the class, allowing access to instance attributes and methods."
        }
    ],
    sql: [
        {
            question: "Which SQL statement is used to extract data from a database?",
            options: ["GET", "EXTRACT", "SELECT", "PULL"],
            correct: 2,
            explanation: "SELECT is the SQL command used to retrieve data from a database."
        },
        {
            question: "What does the SQL JOIN clause do?",
            options: ["Deletes rows from two tables", "Combines rows from two or more tables", "Creates a new table", "Sorts the results"],
            correct: 1,
            explanation: "JOIN combines rows from two or more tables based on a related column."
        },
        {
            question: "Which SQL clause is used to filter grouped results?",
            options: ["WHERE", "FILTER", "HAVING", "GROUP FILTER"],
            correct: 2,
            explanation: "HAVING is used to filter groups created by GROUP BY. WHERE filters individual rows before grouping."
        }
    ],
    react: [
        {
            question: "What does useState() return in React?",
            options: ["A single value", "An array with [state, setState]", "An object", "A promise"],
            correct: 1,
            explanation: "useState returns an array: the current state value and a function to update it."
        },
        {
            question: "What is JSX in React?",
            options: ["A database query language", "A syntax extension that allows HTML in JavaScript", "A CSS framework", "A testing library"],
            correct: 1,
            explanation: "JSX is a syntax extension for JavaScript that lets you write HTML-like markup."
        },
        {
            question: "What is the Virtual DOM in React?",
            options: ["A copy of the browser's DOM kept in memory", "A CSS styling system", "A routing mechanism", "A server-side feature"],
            correct: 0,
            explanation: "The Virtual DOM is a lightweight copy of the real DOM that React uses to optimize updates."
        }
    ],
    git: [
        {
            question: "What does 'git clone' do?",
            options: ["Creates a new branch", "Copies a remote repository locally", "Merges two branches", "Deletes a repository"],
            correct: 1,
            explanation: "git clone creates a local copy of a remote repository."
        },
        {
            question: "What is a 'branch' in Git?",
            options: ["A copy of the entire project", "A parallel version of the repository", "A commit message", "A merge conflict"],
            correct: 1,
            explanation: "A branch is an independent line of development, allowing parallel work."
        },
        {
            question: "What does 'git pull' do?",
            options: ["Pushes local changes to remote", "Fetches and merges changes from remote", "Creates a new branch", "Reverts the last commit"],
            correct: 1,
            explanation: "git pull fetches changes from the remote and merges them into the local branch."
        }
    ],
    algorithms: [
        {
            question: "What is the time complexity of binary search?",
            options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
            correct: 2,
            explanation: "Binary search halves the search space each step, giving O(log n) complexity."
        },
        {
            question: "Which technique solves problems by breaking them into overlapping subproblems?",
            options: ["Greedy", "Divide and Conquer", "Dynamic Programming", "Brute Force"],
            correct: 2,
            explanation: "Dynamic Programming solves problems by storing solutions to overlapping subproblems."
        },
        {
            question: "What does BFS stand for and what data structure does it use?",
            options: ["Best First Search — Stack", "Breadth First Search — Queue", "Binary File Search — Array", "Backward Flow Search — Tree"],
            correct: 1,
            explanation: "Breadth First Search explores level by level using a Queue."
        }
    ],
    "data-structures": [
        {
            question: "Which data structure follows LIFO (Last In, First Out)?",
            options: ["Queue", "Stack", "Array", "Linked List"],
            correct: 1,
            explanation: "A Stack follows LIFO — the last element added is the first one removed."
        },
        {
            question: "What is the average time complexity of searching in a Hash Table?",
            options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
            correct: 2,
            explanation: "Hash tables provide O(1) average-case lookup using hash functions."
        },
        {
            question: "What type of data structure is a Binary Search Tree?",
            options: ["Linear", "Hierarchical", "Graph-based", "Hash-based"],
            correct: 1,
            explanation: "A BST is a hierarchical tree structure where left child < parent < right child."
        }
    ],
    "rest-api": [
        {
            question: "Which HTTP method is used to update an existing resource?",
            options: ["GET", "POST", "PUT", "DELETE"],
            correct: 2,
            explanation: "PUT is used to update an existing resource at a specific URI."
        },
        {
            question: "What does REST stand for?",
            options: ["Remote Execution Service Transfer", "Representational State Transfer", "Request-Event-Service-Transaction", "Reliable Endpoint Service Technology"],
            correct: 1,
            explanation: "REST stands for Representational State Transfer, an architectural style for APIs."
        },
        {
            question: "What HTTP status code indicates 'Not Found'?",
            options: ["200", "301", "404", "500"],
            correct: 2,
            explanation: "404 means the requested resource was not found on the server."
        }
    ],
    docker: [
        {
            question: "What is a Docker container?",
            options: ["A virtual machine", "A lightweight isolated runtime environment", "A database", "A web server"],
            correct: 1,
            explanation: "A Docker container is a lightweight, isolated environment that runs an application with its dependencies."
        },
        {
            question: "What file defines the instructions to build a Docker image?",
            options: ["docker-compose.yml", "Dockerfile", "package.json", "config.yml"],
            correct: 1,
            explanation: "A Dockerfile contains the instructions to build a Docker image."
        },
        {
            question: "What command starts a Docker container from an image?",
            options: ["docker build", "docker run", "docker start", "docker create"],
            correct: 1,
            explanation: "docker run creates and starts a new container from the specified image."
        }
    ],
    kubernetes: [
        {
            question: "What is the smallest deployable unit in Kubernetes?",
            options: ["Container", "Pod", "Node", "Cluster"],
            correct: 1,
            explanation: "A Pod is the smallest deployable unit and can contain one or more containers."
        },
        {
            question: "What does 'kubectl' do?",
            options: ["Builds Docker images", "Command-line tool to interact with Kubernetes", "Monitors server logs", "Creates cloud instances"],
            correct: 1,
            explanation: "kubectl is the CLI tool used to manage Kubernetes clusters."
        },
        {
            question: "What is a Kubernetes Service?",
            options: ["A running container", "An abstraction that exposes pods to network traffic", "A storage volume", "A config file"],
            correct: 1,
            explanation: "A Service provides stable networking and load balancing for a set of Pods."
        }
    ],
    aws: [
        {
            question: "What AWS service provides scalable object storage?",
            options: ["EC2", "S3", "RDS", "Lambda"],
            correct: 1,
            explanation: "Amazon S3 (Simple Storage Service) provides scalable object storage."
        },
        {
            question: "What is AWS Lambda?",
            options: ["A virtual machine service", "A serverless compute service", "A database service", "A DNS service"],
            correct: 1,
            explanation: "AWS Lambda lets you run code without provisioning servers (serverless)."
        },
        {
            question: "What does IAM stand for in AWS?",
            options: ["Internet Access Management", "Identity and Access Management", "Integrated Application Module", "Instance Allocation Manager"],
            correct: 1,
            explanation: "IAM (Identity and Access Management) controls user access to AWS resources."
        }
    ],
    "machine-learning": [
        {
            question: "What is overfitting in machine learning?",
            options: ["Model performs well on all data", "Model memorizes training data and fails on new data", "Model is too simple", "Model trains too slowly"],
            correct: 1,
            explanation: "Overfitting means the model learns noise in training data and generalizes poorly."
        },
        {
            question: "Which algorithm is used for both classification and regression?",
            options: ["K-Means", "Random Forest", "Apriori", "PageRank"],
            correct: 1,
            explanation: "Random Forest can handle both classification and regression tasks."
        },
        {
            question: "What is the purpose of a train-test split?",
            options: ["Speed up training", "Evaluate model on unseen data", "Reduce dataset size", "Remove outliers"],
            correct: 1,
            explanation: "Splitting data ensures the model is evaluated on data it hasn't seen during training."
        }
    ],
    statistics: [
        {
            question: "What does a p-value less than 0.05 typically indicate?",
            options: ["No significance", "Statistical significance", "Perfect correlation", "Data error"],
            correct: 1,
            explanation: "A p-value < 0.05 typically means the result is statistically significant."
        },
        {
            question: "What measure describes the spread of data around the mean?",
            options: ["Mean", "Median", "Standard Deviation", "Mode"],
            correct: 2,
            explanation: "Standard deviation measures how spread out data points are from the mean."
        },
        {
            question: "What type of correlation has a coefficient of -0.9?",
            options: ["Weak positive", "Strong negative", "No correlation", "Strong positive"],
            correct: 1,
            explanation: "A coefficient of -0.9 indicates a strong negative (inverse) correlation."
        }
    ],
    pandas: [
        {
            question: "What is a DataFrame in Pandas?",
            options: ["A single column of data", "A 2D labeled data structure like a table", "A chart type", "A database connection"],
            correct: 1,
            explanation: "A DataFrame is a 2D labeled data structure with columns and rows, similar to a spreadsheet."
        },
        {
            question: "Which method reads a CSV file into a DataFrame?",
            options: ["pd.open_csv()", "pd.read_csv()", "pd.load_csv()", "pd.import_csv()"],
            correct: 1,
            explanation: "pd.read_csv() is the standard method to read CSV files into a DataFrame."
        },
        {
            question: "What does df.dropna() do?",
            options: ["Drops all columns", "Removes rows with missing values", "Resets the index", "Sorts the data"],
            correct: 1,
            explanation: "dropna() removes rows (or columns) that contain missing/NaN values."
        }
    ],
    linux: [
        {
            question: "What does the 'chmod' command do in Linux?",
            options: ["Changes directory", "Changes file permissions", "Creates a file", "Moves a file"],
            correct: 1,
            explanation: "chmod (change mode) modifies the read/write/execute permissions of files."
        },
        {
            question: "What command lists files in a directory?",
            options: ["dir", "ls", "list", "show"],
            correct: 1,
            explanation: "ls (list) shows files and directories in the current or specified path."
        },
        {
            question: "What does 'grep' do?",
            options: ["Compiles code", "Searches for patterns in text", "Compresses files", "Installs packages"],
            correct: 1,
            explanation: "grep searches for text patterns (including regex) in files or input streams."
        }
    ],
    bash: [
        {
            question: "What is the shebang line in a bash script?",
            options: ["A comment", "#!/bin/bash — tells the system which interpreter to use", "A variable declaration", "An error handler"],
            correct: 1,
            explanation: "#!/bin/bash at the top of a script tells the OS to use bash as the interpreter."
        },
        {
            question: "How do you make a bash script executable?",
            options: ["bash run script.sh", "chmod +x script.sh", "exec script.sh", "run script.sh"],
            correct: 1,
            explanation: "chmod +x adds execute permission to the script file."
        },
        {
            question: "What does $? represent in bash?",
            options: ["Current process ID", "Exit status of the last command", "Number of arguments", "Script filename"],
            correct: 1,
            explanation: "$? holds the exit status of the most recently executed command (0 = success)."
        }
    ],
    "ci-cd": [
        {
            question: "What does CI stand for in CI/CD?",
            options: ["Code Integration", "Continuous Integration", "Central Infrastructure", "Cloud Instance"],
            correct: 1,
            explanation: "CI stands for Continuous Integration — automatically building and testing code changes."
        },
        {
            question: "What is the primary purpose of a CI/CD pipeline?",
            options: ["Write code faster", "Automate building, testing, and deploying code", "Monitor production", "Design databases"],
            correct: 1,
            explanation: "CI/CD pipelines automate the process of building, testing, and deploying applications."
        },
        {
            question: "Which of these is a popular CI/CD tool?",
            options: ["Photoshop", "Jenkins", "Excel", "Notepad"],
            correct: 1,
            explanation: "Jenkins is one of the most popular open-source CI/CD automation tools."
        }
    ],
    monitoring: [
        {
            question: "What is Prometheus primarily used for?",
            options: ["Code deployment", "Metrics collection and alerting", "Database management", "File storage"],
            correct: 1,
            explanation: "Prometheus is an open-source monitoring system for collecting metrics and triggering alerts."
        },
        {
            question: "What does Grafana do?",
            options: ["Collects logs", "Visualizes metrics through dashboards", "Deploys containers", "Manages databases"],
            correct: 1,
            explanation: "Grafana creates visualizations and dashboards from metrics data sources."
        },
        {
            question: "What does the ELK stack stand for?",
            options: ["Elastic, Lambda, Kafka", "Elasticsearch, Logstash, Kibana", "Express, Linux, Kubernetes", "None of these"],
            correct: 1,
            explanation: "ELK = Elasticsearch (search), Logstash (log processing), Kibana (visualization)."
        }
    ]
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PART 4: Verification Level Calculator
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function calculateVerifiedLevel(quizScore, totalQuestions) {
    const percentage = (quizScore / totalQuestions) * 100;
    if (percentage === 100) return { level: "expert", label: "Expert", adjustedConfidence: 100, color: "emerald" };
    if (percentage >= 66) return { level: "proficient", label: "Proficient", adjustedConfidence: 75, color: "blue" };
    if (percentage >= 33) return { level: "beginner", label: "Beginner", adjustedConfidence: 40, color: "amber" };
    return { level: "failed", label: "Not Verified", adjustedConfidence: 0, color: "rose" };
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PART 5: Sample Resume for Demo
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SAMPLE_RESUME = `JOHN DOE
Software Engineer | Full Stack Developer
john.doe@email.com | github.com/johndoe

SUMMARY
Experienced software engineer with 3+ years of expertise in Python, React, and cloud technologies. 
Passionate about building scalable REST APIs and deploying with Docker and Kubernetes.

SKILLS
Programming: Python, JavaScript, SQL, Bash
Frameworks: React, Django, Flask, FastAPI  
Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, Kubernetes, CI/CD (GitHub Actions, Jenkins)
Data: Pandas, NumPy, Machine Learning basics, Statistics
Tools: Git, Linux, Monitoring (Prometheus, Grafana)

EXPERIENCE

Software Engineer — TechCorp Inc. (2022-Present)
• Built REST API microservices using Python and FastAPI serving 10k+ daily requests
• Deployed containerized applications using Docker and Kubernetes on AWS ECS
• Implemented CI/CD pipelines with GitHub Actions for automated testing and deployment
• Managed PostgreSQL databases with complex SQL queries for analytics
• Monitored system health using Prometheus and Grafana dashboards

Junior Developer — StartupXYZ (2020-2022)
• Developed React frontend with Redux state management
• Created data pipelines using Pandas for ETL processing
• Used Git for version control with feature branching workflow
• Wrote Bash scripts for server automation on Linux servers

EDUCATION
B.Tech Computer Science — National Institute of Technology (2020)
CGPA: 8.5/10

PROJECTS
• ML Price Predictor: Built a machine learning regression model using scikit-learn and statistics
• API Gateway: Designed REST API gateway with rate limiting using Python and Docker
• Dashboard App: Full-stack React + FastAPI application with SQL database

CERTIFICATIONS
• AWS Solutions Architect Associate
• Docker Certified Associate
`;
