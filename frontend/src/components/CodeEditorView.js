import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, XCircle, Code, ChevronRight, Info, Globe } from 'lucide-react';

const DSA_PROBLEMS = [
    {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        constraints: ["2 <= nums.length <= 104", "-109 <= nums[i] <= 109"],
        defaultCode: {
            python: "def two_sum(nums, target):\n    # Write your code here\n    pass",
            java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}",
            cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};",
            c: "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n}"
        }
    },
    {
        id: 2,
        title: "Reverse String",
        difficulty: "Easy",
        description: "Write a function that reverses a string. The input string is given as an array of characters s.",
        constraints: ["1 <= s.length <= 105"],
        defaultCode: {
            python: "def reverse_string(s):\n    # Write your code here\n    pass",
            java: "class Solution {\n    public void reverseString(char[] s) {\n        // Write your code here\n    }\n}",
            cpp: "class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Write your code here\n    }\n};",
            c: "void reverseString(char* s, int sSize) {\n    // Write your code here\n}"
        }
    },
    {
        id: 3,
        title: "Linked List Cycle",
        difficulty: "Medium",
        description: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
        constraints: ["The number of nodes in the list is in the range [0, 104].", "-105 <= Node.val <= 105"],
        defaultCode: {
            python: "def hasCycle(head):\n    # Write your code here\n    pass",
            java: "public class Solution {\n    public boolean hasCycle(ListNode head) {\n        // Write your code here\n        return false;\n    }\n}",
            cpp: "class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        // Write your code here\n    }\n};",
            c: "bool hasCycle(struct ListNode *head) {\n    // Write your code here\n}"
        }
    },
    {
        id: 4,
        title: "Merge Intervals",
        difficulty: "Medium",
        description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
        constraints: ["1 <= intervals.length <= 104", "0 <= starti <= endi <= 104"],
        defaultCode: {
            python: "def merge(intervals):\n    # Write your code here\n    pass",
            java: "class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your code here\n        return new int[][]{};\n    }\n}",
            cpp: "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your code here\n    }\n};",
            c: "int** merge(int** intervals, int intervalsSize, int* intervalsColSize, int* returnSize, int** returnColumnSizes) {\n    // Write your code here\n}"
        }
    },
    {
        id: 5,
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
        constraints: ["nums1.length == m", "nums2.length == n", "0 <= m, n <= 1000"],
        defaultCode: {
            python: "def findMedianSortedArrays(nums1, nums2):\n    # Write your code here\n    pass",
            java: "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your code here\n        return 0.0;\n    }\n}",
            cpp: "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Write your code here\n    }\n};",
            c: "double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size) {\n    // Write your code here\n}"
        }
    }
];

const CodeEditorView = () => {
    const [selectedProblem, setSelectedProblem] = useState(DSA_PROBLEMS[0]);
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState(selectedProblem.defaultCode[language]);
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState(null);

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        setCode(selectedProblem.defaultCode[newLang]);
    };

    const handleProblemChange = (prob) => {
        setSelectedProblem(prob);
        setCode(prob.defaultCode[language]);
        setOutput("");
        setResults(null);
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput("Compiling and running against test cases...");
        setResults(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/compile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code,
                    problem_id: selectedProblem.id,
                    language: language
                })
            });

            const data = await response.json();
            setOutput(data.output || data.error || "Execution finished.");
            if (data.results) {
                setResults(data.results);
            }
        } catch (err) {
            setOutput("Error connecting to compilation server. Make sure the backend is running.");
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-160px)] animate-in">
            {/* Left: Problem Sidebar */}
            <div className="lg:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                <div className="premium-card p-8 bg-white overflow-hidden relative">
                    <div className={`absolute top-0 right-0 px-4 py-2 text-[10px] font-black uppercase tracking-widest ${selectedProblem.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-600' :
                        selectedProblem.difficulty === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                        {selectedProblem.difficulty}
                    </div>
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Code size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-black">Question: {selectedProblem.title}</h2>
                    </div>
                    <p className="text-slate-800 mb-8 font-bold leading-relaxed">
                        {selectedProblem.description}
                    </p>
                    <div className="space-y-4 pt-6 border-t border-slate-50">
                        <h4 className="text-xs font-black text-black uppercase tracking-widest flex items-center">
                            <Info size={14} className="mr-2" /> Constraints
                        </h4>
                        <ul className="space-y-2">
                            {selectedProblem.constraints.map((c, i) => (
                                <li key={i} className="text-sm font-bold text-slate-900 flex items-center">
                                    <ChevronRight size={14} className="mr-2 text-indigo-500" /> {c}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-black text-black px-2 uppercase tracking-widest">Other Problems</h4>
                    {DSA_PROBLEMS.map(p => (
                        <button
                            key={p.id}
                            onClick={() => handleProblemChange(p)}
                            className={`w-full p-5 rounded-2xl text-left transition-all flex items-center justify-between group ${selectedProblem.id === p.id
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                                : 'bg-white border border-slate-100 text-slate-800 hover:border-indigo-200 font-bold'
                                }`}
                        >
                            <span className="font-bold">{p.title}</span>
                            <ChevronRight size={16} className={selectedProblem.id === p.id ? 'text-indigo-200' : 'text-slate-400 group-hover:text-indigo-600'} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Code Editor & Console */}
            <div className="lg:w-2/3 flex flex-col gap-6 h-full">
                <div className="premium-card flex-1 flex flex-col bg-slate-900 overflow-hidden border-none shadow-2xl">
                    <div className="px-6 py-4 bg-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex space-x-1.5 mr-4">
                                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            </div>
                            <div className="flex items-center bg-white rounded-lg px-3 py-1.5 border border-white/10 shadow-sm">
                                <Globe size={14} className="text-indigo-600 mr-2" />
                                <select
                                    value={language}
                                    onChange={(e) => handleLanguageChange(e.target.value)}
                                    className="bg-transparent text-[10px] font-black text-black focus:outline-none cursor-pointer uppercase tracking-widest"
                                >
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                    <option value="c">C</option>
                                </select>
                            </div>
                            <span className="text-[10px] font-black text-black bg-white px-3 py-1.5 rounded-lg shadow-sm">Solution Editor</span>
                        </div>
                        <button
                            onClick={handleRunCode}
                            disabled={isRunning}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-black flex items-center transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {isRunning ? "Running..." : <><Play size={14} className="mr-2" /> Run Solution</>}
                        </button>
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-transparent text-indigo-100 p-8 font-mono text-sm resize-none focus:outline-none custom-scrollbar"
                        spellCheck="false"
                    />
                </div>

                <div className="h-1/3 premium-card bg-slate-950 flex flex-col overflow-hidden border-none shadow-2xl">
                    <div className="px-6 py-3 bg-slate-900 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center text-slate-400">
                            <Terminal size={14} className="mr-2 text-white" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-black bg-white px-2 py-1 rounded">Execution Console</span>
                        </div>
                    </div>
                    <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar">
                        {results && (
                            <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {results.map((res, i) => (
                                    <div key={i} className={`p-3 rounded-xl flex items-center space-x-2 ${res.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                        }`}>
                                        {res.passed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                        <span className="text-[10px] font-bold">Case {i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <pre className="text-indigo-300 whitespace-pre-wrap">{output || "> Ready to execute..."}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditorView;
