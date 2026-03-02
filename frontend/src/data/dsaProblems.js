export const DSA_PROBLEMS = [
    {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        acceptance: "52.4%",
        likes: "36.6K",
        dislikes: "1.1K",
        description: `Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers</em> such that they add up to <code>target</code>.

You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.

You can return the answer in any order.`,
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
                input: "nums = [3,2,4], target = 6",
                output: "[1,2]",
                explanation: null
            },
            {
                input: "nums = [3,3], target = 6",
                output: "[0,1]",
                explanation: null
            }
        ],
        constraints: [
            "2 <= nums.length <= 10<sup>4</sup>",
            "-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup>",
            "-10<sup>9</sup> <= target <= 10<sup>9</sup>",
            "Only one valid answer exists."
        ],
        defaultCode: {
            python: "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your solution here\n        pass",
            java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
            cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};",
            c: "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your solution here\n}"
        },
        testCases: [
            { input: "nums = [2,7,11,15], target = 9", expected: "[0,1]" },
            { input: "nums = [3,2,4], target = 6", expected: "[1,2]" }
        ]
    },
    {
        id: 2,
        title: "Reverse String",
        difficulty: "Easy",
        acceptance: "76.8%",
        likes: "8.2K",
        dislikes: "1.0K",
        description: `Write a function that reverses a string. The input string is given as an array of characters <code>s</code>.

You must do this by modifying the input array <strong>in-place</strong> with O(1) extra memory.`,
        examples: [
            {
                input: 's = ["h","e","l","l","o"]',
                output: '["o","l","l","e","h"]',
                explanation: null
            },
            {
                input: 's = ["H","a","n","n","a","h"]',
                output: '["h","a","n","n","a","H"]',
                explanation: null
            }
        ],
        constraints: [
            "1 <= s.length <= 10<sup>5</sup>",
            "s[i] is a printable ascii character."
        ],
        defaultCode: {
            python: "class Solution:\n    def reverseString(self, s: list[str]) -> None:\n        \"\"\"\n        Do not return anything, modify s in-place instead.\n        \"\"\"\n        pass",
            java: "class Solution {\n    public void reverseString(char[] s) {\n        // Write your solution here\n    }\n}",
            cpp: "class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Write your solution here\n    }\n};",
            c: "void reverseString(char* s, int sSize) {\n    // Write your solution here\n}"
        },
        testCases: [
            { input: 's = ["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' }
        ]
    },
    {
        id: 3,
        title: "Linked List Cycle",
        difficulty: "Medium",
        acceptance: "49.2%",
        likes: "14.1K",
        dislikes: "1.3K",
        description: `Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code>next</code> pointer.

Return <code>true</code> if there is a cycle in the linked list. Otherwise, return <code>false</code>.`,
        examples: [
            {
                input: "head = [3,2,0,-4], pos = 1",
                output: "true",
                explanation: "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed)."
            },
            {
                input: "head = [1,2], pos = 0",
                output: "true",
                explanation: "There is a cycle in the linked list, where the tail connects to the 0th node."
            }
        ],
        constraints: [
            "The number of nodes in the list is in the range [0, 10<sup>4</sup>].",
            "-10<sup>5</sup> <= Node.val <= 10<sup>5</sup>",
            "pos is -1 or a valid index in the linked-list."
        ],
        defaultCode: {
            python: "# class ListNode:\n#     def __init__(self, x):\n#         self.val = x\n#         self.next = None\n\nclass Solution:\n    def hasCycle(self, head) -> bool:\n        # Write your solution here\n        pass",
            java: "public class Solution {\n    public boolean hasCycle(ListNode head) {\n        // Write your solution here\n        return false;\n    }\n}",
            cpp: "class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        // Write your solution here\n    }\n};",
            c: "bool hasCycle(struct ListNode *head) {\n    // Write your solution here\n}"
        },
        testCases: [
            { input: "head = [3,2,0,-4], pos = 1", expected: "true" }
        ]
    },
    {
        id: 4,
        title: "Merge Intervals",
        difficulty: "Medium",
        acceptance: "47.1%",
        likes: "22.3K",
        dislikes: "780",
        description: `Given an array of <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, merge all overlapping intervals, and return <em>an array of the non-overlapping intervals that cover all the intervals in the input</em>.`,
        examples: [
            {
                input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
                output: "[[1,6],[8,10],[15,18]]",
                explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
            },
            {
                input: "intervals = [[1,4],[4,5]]",
                output: "[[1,5]]",
                explanation: "Intervals [1,4] and [4,5] are considered overlapping."
            }
        ],
        constraints: [
            "1 <= intervals.length <= 10<sup>4</sup>",
            "intervals[i].length == 2",
            "0 <= start<sub>i</sub> <= end<sub>i</sub> <= 10<sup>4</sup>"
        ],
        defaultCode: {
            python: "class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        # Write your solution here\n        pass",
            java: "class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your solution here\n        return new int[][]{};\n    }\n}",
            cpp: "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your solution here\n    }\n};",
            c: "int** merge(int** intervals, int intervalsSize, int* intervalsColSize, int* returnSize, int** returnColumnSizes) {\n    // Write your solution here\n}"
        },
        testCases: [
            { input: "intervals = [[1,3],[2,6],[8,10]]", expected: "[[1,6],[8,10]]" }
        ]
    },
    {
        id: 5,
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        acceptance: "38.9%",
        likes: "28.5K",
        dislikes: "3.1K",
        description: `Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return <strong>the median</strong> of the two sorted arrays.

The overall run time complexity should be <code>O(log (m+n))</code>.`,
        examples: [
            {
                input: "nums1 = [1,3], nums2 = [2]",
                output: "2.00000",
                explanation: "merged array = [1,2,3] and median is 2."
            },
            {
                input: "nums1 = [1,2], nums2 = [3,4]",
                output: "2.50000",
                explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
            }
        ],
        constraints: [
            "nums1.length == m",
            "nums2.length == n",
            "0 <= m <= 1000",
            "0 <= n <= 1000",
            "1 <= m + n <= 2000",
            "-10<sup>6</sup> <= nums1[i], nums2[i] <= 10<sup>6</sup>"
        ],
        defaultCode: {
            python: "class Solution:\n    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:\n        # Write your solution here\n        pass",
            java: "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your solution here\n        return 0.0;\n    }\n}",
            cpp: "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Write your solution here\n    }\n};",
            c: "double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size) {\n    // Write your solution here\n}"
        },
        testCases: [
            { input: "nums1 = [1,3], nums2 = [2]", expected: "2.00000" }
        ]
    }
];

export const LANG_LABELS = {
    python: 'Python 3',
    java: 'Java',
    cpp: 'C++',
    c: 'C'
};
