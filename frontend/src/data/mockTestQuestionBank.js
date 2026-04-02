/**
 * Mock Test Question Bank — Placement Readiness Assessment
 * 
 * Contains 400+ questions across 5 sections:
 * 1. Quantitative (80+ questions)
 * 2. English (80+ questions)
 * 3. Reasoning (80+ questions)
 * 4. Computer Science (60+ questions)
 * 5. DSA Pool (30+ questions, tagged by skill)
 * 
 * Each question has: id, question, options, answer (index), difficulty
 * Large banks ensure every test attempt gets a unique set of questions.
 */

import { MOCK_QUESTIONS } from './questions';

// ━━━━━━━━━ QUANTITATIVE ━━━━━━━━━
export const QUANTITATIVE_BANK = [
  // ─── Easy ───
  { id:"q1", question:"If 3x + 7 = 22, what is x?", options:["3","4","5","6"], answer:2, difficulty:"easy" },
  { id:"q2", question:"What is 15% of 240?", options:["32","36","40","48"], answer:1, difficulty:"easy" },
  { id:"q3", question:"A train 150m long passes a pole in 15 seconds. Its speed in km/h is:", options:["36","40","32","45"], answer:0, difficulty:"easy" },
  { id:"q4", question:"The HCF of 36 and 48 is:", options:["6","8","12","24"], answer:2, difficulty:"easy" },
  { id:"q5", question:"What is the value of √144 + √81?", options:["19","21","23","25"], answer:1, difficulty:"easy" },
  { id:"q6", question:"Find the average of 12, 15, 18, 21, 24.", options:["17","18","19","20"], answer:1, difficulty:"easy" },
  { id:"q11", question:"Simple interest on ₹5000 at 8% for 3 years is:", options:["₹1000","₹1100","₹1200","₹1300"], answer:2, difficulty:"easy" },
  { id:"q14", question:"Sum of first 20 natural numbers is:", options:["200","210","190","220"], answer:1, difficulty:"easy" },
  { id:"q15", question:"Two numbers are in ratio 3:7. If their sum is 50, the larger number is:", options:["30","35","40","15"], answer:1, difficulty:"easy" },
  { id:"q24", question:"Area of a triangle with sides 3, 4, 5 is:", options:["6","7.5","10","12"], answer:0, difficulty:"easy" },
  { id:"q25", question:"How many prime numbers are between 1 and 30?", options:["8","9","10","11"], answer:2, difficulty:"easy" },
  { id:"q26", question:"If 2ˣ = 64, then x is:", options:["4","5","6","7"], answer:2, difficulty:"easy" },
  { id:"q30", question:"Sum of interior angles of a hexagon:", options:["540°","620°","720°","800°"], answer:2, difficulty:"easy" },
  { id:"q32", question:"What is 0.125 as a fraction?", options:["1/4","1/6","1/8","1/10"], answer:2, difficulty:"easy" },
  { id:"q33", question:"If the perimeter of a rectangle is 40 cm and length is 12 cm, width is:", options:["6 cm","7 cm","8 cm","10 cm"], answer:2, difficulty:"easy" },
  { id:"q35", question:"What is the median of 3, 7, 2, 9, 5?", options:["3","5","7","9"], answer:1, difficulty:"easy" },
  { id:"q36", question:"What is 25% of 400?", options:["75","100","125","150"], answer:1, difficulty:"easy" },
  { id:"q37", question:"If a = 5 and b = 3, what is a² - b²?", options:["8","16","34","25"], answer:1, difficulty:"easy" },
  { id:"q38", question:"What is the perimeter of a square with side 7 cm?", options:["14 cm","21 cm","28 cm","49 cm"], answer:2, difficulty:"easy" },
  { id:"q39", question:"Convert 0.75 to a percentage:", options:["7.5%","25%","75%","750%"], answer:2, difficulty:"easy" },
  { id:"q40", question:"What is the cube root of 27?", options:["3","9","27","81"], answer:0, difficulty:"easy" },
  { id:"q41", question:"If the cost price is ₹200 and selling price is ₹250, profit % is:", options:["20%","25%","30%","50%"], answer:1, difficulty:"easy" },
  { id:"q42", question:"The value of 7! / 5! is:", options:["7","14","42","56"], answer:2, difficulty:"easy" },
  { id:"q43", question:"What is the sum of angles in a triangle?", options:["90°","180°","270°","360°"], answer:1, difficulty:"easy" },
  { id:"q44", question:"The LCM of 4 and 6 is:", options:["2","12","24","48"], answer:1, difficulty:"easy" },
  { id:"q45", question:"If 5x = 35, then x is:", options:["5","6","7","8"], answer:2, difficulty:"easy" },

  // ─── Medium ───
  { id:"q7", question:"If a:b = 3:5 and b:c = 2:3, then a:b:c is:", options:["6:10:15","3:5:6","6:10:12","3:5:9"], answer:0, difficulty:"medium" },
  { id:"q8", question:"A man sells an article for ₹600, making a 20% profit. The cost price is:", options:["₹450","₹480","₹500","₹520"], answer:2, difficulty:"medium" },
  { id:"q9", question:"Pipes A and B can fill a tank in 12 and 18 hours. Together, time to fill:", options:["6.5h","7.2h","8h","9h"], answer:1, difficulty:"medium" },
  { id:"q10", question:"In how many ways can 5 people sit around a circular table?", options:["120","60","24","20"], answer:2, difficulty:"medium" },
  { id:"q12", question:"If log₁₀(x) = 3, then x =", options:["30","100","1000","10000"], answer:2, difficulty:"medium" },
  { id:"q13", question:"A boat goes 12 km downstream in 1 hour and returns in 2 hours. Speed of current:", options:["2 km/h","3 km/h","4 km/h","6 km/h"], answer:1, difficulty:"medium" },
  { id:"q17", question:"Compound interest on ₹10000 at 10% for 2 years:", options:["₹2000","₹2100","₹2200","₹2500"], answer:1, difficulty:"medium" },
  { id:"q19", question:"If x² - 5x + 6 = 0, values of x are:", options:["2, 3","1, 6","-2, -3","3, -2"], answer:0, difficulty:"medium" },
  { id:"q20", question:"Probability of getting a sum of 7 with two dice:", options:["1/6","5/36","7/36","1/4"], answer:0, difficulty:"medium" },
  { id:"q21", question:"The LCM of 12, 15, 20 is:", options:["60","120","180","240"], answer:0, difficulty:"medium" },
  { id:"q22", question:"A man walks 5 km North, then 12 km East. Distance from start:", options:["13 km","17 km","10 km","15 km"], answer:0, difficulty:"medium" },
  { id:"q28", question:"The speed of a boat in still water is 10 km/h. Stream speed 2 km/h. Time to go 24 km upstream:", options:["2h","2.5h","3h","4h"], answer:2, difficulty:"medium" },
  { id:"q29", question:"If the diagonal of a square is 10√2 cm, its area is:", options:["50 cm²","100 cm²","200 cm²","150 cm²"], answer:1, difficulty:"medium" },
  { id:"q31", question:"A can do work in 10 days, B in 15 days. Working together:", options:["5 days","6 days","7 days","8 days"], answer:1, difficulty:"medium" },
  { id:"q46", question:"A mixture contains milk and water in ratio 5:1. If 5 litres of water is added, ratio becomes 5:2. Quantity of milk:", options:["20 L","25 L","30 L","35 L"], answer:1, difficulty:"medium" },
  { id:"q47", question:"The difference between CI and SI on ₹8000 for 2 years at 5% per annum:", options:["₹10","₹20","₹30","₹40"], answer:1, difficulty:"medium" },
  { id:"q48", question:"A number when multiplied by 13 and divided by 3 gives 169. The number is:", options:["39","36","33","42"], answer:0, difficulty:"medium" },
  { id:"q49", question:"If the area of a circle is 154 cm², its radius is:", options:["7 cm","14 cm","21 cm","49 cm"], answer:0, difficulty:"medium" },
  { id:"q50", question:"Two trains running in opposite directions cross each other in 10 sec. Speeds are 60 km/h and 48 km/h. Sum of lengths:", options:["200 m","250 m","300 m","350 m"], answer:2, difficulty:"medium" },
  { id:"q51", question:"If the sum of two numbers is 20 and their product is 96, the numbers are:", options:["8, 12","6, 14","10, 10","4, 16"], answer:0, difficulty:"medium" },
  { id:"q52", question:"A clock shows 4:30. The angle between the hour and minute hands is:", options:["30°","35°","40°","45°"], answer:3, difficulty:"medium" },
  { id:"q53", question:"If 40% of a number is 80, the number is:", options:["160","200","240","320"], answer:1, difficulty:"medium" },
  { id:"q54", question:"How many 3-digit numbers are divisible by 7?", options:["128","129","130","131"], answer:1, difficulty:"medium" },
  { id:"q55", question:"The surface area of a sphere with radius 7 cm is:", options:["308 cm²","616 cm²","924 cm²","1232 cm²"], answer:1, difficulty:"medium" },
  { id:"q56", question:"If A completes 1/3 of work in 5 days, how many days to complete full work?", options:["10","12","15","18"], answer:2, difficulty:"medium" },
  { id:"q57", question:"In a group of 100 people, 72 speak English and 43 speak French. How many speak both?", options:["15","25","29","35"], answer:0, difficulty:"medium" },
  { id:"q58", question:"A tank is filled by 3 pipes. Pipe A fills in 10h, B in 15h, C empties in 30h. Time to fill:", options:["6h","7.5h","8h","10h"], answer:1, difficulty:"medium" },

  // ─── Hard ───
  { id:"q16", question:"A car covers 300 km at 60 km/h and returns at 40 km/h. Average speed:", options:["48 km/h","50 km/h","55 km/h","45 km/h"], answer:0, difficulty:"hard" },
  { id:"q18", question:"In how many ways can the word 'APPLE' be arranged?", options:["120","60","50","30"], answer:1, difficulty:"hard" },
  { id:"q23", question:"If a number when divided by 5 gives remainder 3, and when divided by 7 gives remainder 4, the smallest such number is:", options:["18","23","38","53"], answer:1, difficulty:"hard" },
  { id:"q27", question:"A shopkeeper marks goods 40% above CP. He allows 20% discount. His profit %:", options:["10%","12%","15%","20%"], answer:1, difficulty:"hard" },
  { id:"q34", question:"Present ages of A and B are in ratio 5:7. After 6 years ratio is 3:4. A's present age:", options:["25","30","35","40"], answer:1, difficulty:"hard" },
  { id:"q59", question:"A sum of money doubles itself in 5 years at SI. Rate of interest:", options:["10%","15%","20%","25%"], answer:2, difficulty:"hard" },
  { id:"q60", question:"The number of diagonals in a decagon is:", options:["20","25","35","45"], answer:2, difficulty:"hard" },
  { id:"q61", question:"If log₂(log₃(x)) = 1, then x =", options:["3","8","9","27"], answer:2, difficulty:"hard" },
  { id:"q62", question:"In a race of 1000m, A beats B by 100m, and B beats C by 150m. A beats C by:", options:["235m","250m","200m","225m"], answer:0, difficulty:"hard" },
  { id:"q63", question:"A die is thrown twice. Probability of sum being at least 10:", options:["1/6","1/12","5/36","1/4"], answer:0, difficulty:"hard" },
  { id:"q64", question:"If P(n,2) = 90, then n is:", options:["8","9","10","11"], answer:2, difficulty:"hard" },
  { id:"q65", question:"A conical vessel has a base radius 5 cm and height 12 cm. Its volume is:", options:["100π cm³","200π cm³","300π cm³","60π cm³"], answer:0, difficulty:"hard" },
  { id:"q66", question:"Three unbiased coins are tossed. Probability of getting at least 2 heads:", options:["3/8","1/2","5/8","1/4"], answer:1, difficulty:"hard" },
  { id:"q67", question:"If 2ᵃ × 3ᵇ = 72, and a and b are positive integers, then a + b =", options:["4","5","6","7"], answer:2, difficulty:"hard" },
];

// ━━━━━━━━━ ENGLISH ━━━━━━━━━
export const ENGLISH_BANK = [
  // ─── Easy ───
  { id:"e1", question:"Choose the synonym of 'Abundant':", options:["Scarce","Plentiful","Meager","Limited"], answer:1, difficulty:"easy" },
  { id:"e2", question:"Choose the antonym of 'Benevolent':", options:["Kind","Generous","Malevolent","Gracious"], answer:2, difficulty:"easy" },
  { id:"e3", question:"Fill in the blank: She ___ to the market yesterday.", options:["go","goes","went","gone"], answer:2, difficulty:"easy" },
  { id:"e4", question:"Identify the error: 'He don't know the answer.'", options:["He","don't","know","the answer"], answer:1, difficulty:"easy" },
  { id:"e5", question:"Choose the correct spelling:", options:["Accommodate","Accomodate","Acommodate","Acomodate"], answer:0, difficulty:"easy" },
  { id:"e10", question:"'A piece of cake' means:", options:["A bakery item","Something very easy","A reward","A celebration"], answer:1, difficulty:"easy" },
  { id:"e14", question:"'Burning the midnight oil' means:", options:["Wasting oil","Working late into the night","Starting a fire","Cooking late"], answer:1, difficulty:"easy" },
  { id:"e15", question:"Identify the part of speech of 'quickly' in: 'She runs quickly.'", options:["Adjective","Noun","Adverb","Verb"], answer:2, difficulty:"easy" },
  { id:"e18", question:"Choose the correct sentence:", options:["I and he went to school","He and I went to school","He and me went to school","Me and him went to school"], answer:1, difficulty:"easy" },
  { id:"e24", question:"'To cry over spilt milk' means:", options:["To clean up","To regret what cannot be undone","To be sad","To waste food"], answer:1, difficulty:"easy" },
  { id:"e25", question:"What is the comparative form of 'good'?", options:["Gooder","More good","Better","Best"], answer:2, difficulty:"easy" },
  { id:"e28", question:"Choose the synonym of 'Candid':", options:["Dishonest","Frank","Secretive","Timid"], answer:1, difficulty:"easy" },
  { id:"e29", question:"'He has been working ___ morning.'", options:["for","since","from","at"], answer:1, difficulty:"easy" },
  { id:"e31", question:"Choose the correct spelling:", options:["Occassion","Ocassion","Occasion","Occassion"], answer:2, difficulty:"easy" },
  { id:"e33", question:"'Break a leg' is an example of:", options:["Metaphor","Idiom","Simile","Onomatopoeia"], answer:1, difficulty:"easy" },
  { id:"e35", question:"Choose the synonym of 'Diligent':", options:["Lazy","Hardworking","Careless","Idle"], answer:1, difficulty:"easy" },
  { id:"e36", question:"Choose the antonym of 'Ancient':", options:["Old","Modern","Historic","Antique"], answer:1, difficulty:"easy" },
  { id:"e37", question:"What is the plural of 'child'?", options:["Childs","Childrens","Children","Childes"], answer:2, difficulty:"easy" },
  { id:"e38", question:"Fill in: He ___ playing football since morning.", options:["is","was","has been","had"], answer:2, difficulty:"easy" },
  { id:"e39", question:"Choose the synonym of 'Brave':", options:["Cowardly","Timid","Courageous","Shy"], answer:2, difficulty:"easy" },
  { id:"e40", question:"'Actions speak louder than words' is a:", options:["Simile","Metaphor","Proverb","Alliteration"], answer:2, difficulty:"easy" },
  { id:"e41", question:"Which is the correct sentence?", options:["She don't like pizza","She doesn't likes pizza","She doesn't like pizza","She not like pizza"], answer:2, difficulty:"easy" },
  { id:"e42", question:"The past tense of 'run' is:", options:["Runned","Ran","Runed","Running"], answer:1, difficulty:"easy" },
  { id:"e43", question:"Choose the antonym of 'Generous':", options:["Kind","Liberal","Stingy","Caring"], answer:2, difficulty:"easy" },
  { id:"e44", question:"'Let the cat out of the bag' means:", options:["Free an animal","Reveal a secret","Open a bag","Catch something"], answer:1, difficulty:"easy" },

  // ─── Medium ───
  { id:"e6", question:"'To beat around the bush' means:", options:["To hit something","To avoid the main topic","To explore a garden","To run fast"], answer:1, difficulty:"medium" },
  { id:"e7", question:"Choose the synonym of 'Pragmatic':", options:["Idealistic","Practical","Theoretical","Abstract"], answer:1, difficulty:"medium" },
  { id:"e8", question:"The passive voice of 'She writes a letter' is:", options:["A letter is written by she","A letter is written by her","A letter was written by her","A letter is wrote by her"], answer:1, difficulty:"medium" },
  { id:"e9", question:"Choose the antonym of 'Verbose':", options:["Wordy","Concise","Lengthy","Detailed"], answer:1, difficulty:"medium" },
  { id:"e11", question:"Choose the correct sentence:", options:["He is more taller than me","He is taller than me","He is taller than I am","Both B and C"], answer:3, difficulty:"medium" },
  { id:"e12", question:"The plural of 'phenomenon' is:", options:["Phenomenons","Phenomena","Phenomenas","Phenomenae"], answer:1, difficulty:"medium" },
  { id:"e17", question:"Fill in: Neither the teacher ___ the students were present.", options:["or","nor","and","but"], answer:1, difficulty:"medium" },
  { id:"e20", question:"Choose the synonym of 'Tenacious':", options:["Weak","Persistent","Fragile","Lazy"], answer:1, difficulty:"medium" },
  { id:"e21", question:"Which sentence uses the semicolon correctly?", options:["I like tea; and coffee","I like tea; however, she prefers coffee","I like; tea","Tea; is good"], answer:1, difficulty:"medium" },
  { id:"e23", question:"Choose the correct form: 'If I ___ rich, I would travel.'", options:["am","was","were","be"], answer:2, difficulty:"medium" },
  { id:"e26", question:"Choose the antonym of 'Frugal':", options:["Careful","Extravagant","Thrifty","Saving"], answer:1, difficulty:"medium" },
  { id:"e27", question:"Identify the figure of speech: 'The world is a stage.'", options:["Simile","Metaphor","Personification","Hyperbole"], answer:1, difficulty:"medium" },
  { id:"e32", question:"Choose the antonym of 'Lucid':", options:["Clear","Transparent","Confusing","Simple"], answer:2, difficulty:"medium" },
  { id:"e45", question:"Choose the synonym of 'Meticulous':", options:["Careless","Thorough","Lazy","Quick"], answer:1, difficulty:"medium" },
  { id:"e46", question:"The indirect speech of 'He said, I am tired' is:", options:["He said that he is tired","He said that he was tired","He told that he is tired","He says he was tired"], answer:1, difficulty:"medium" },
  { id:"e47", question:"Choose the correct usage: 'Each of the boys ___ given a prize.'", options:["were","are","was","have been"], answer:2, difficulty:"medium" },
  { id:"e48", question:"'He turned a blind eye' means:", options:["He went blind","He pretended not to notice","He looked away","He closed his eyes"], answer:1, difficulty:"medium" },
  { id:"e49", question:"Choose the synonym of 'Alleviate':", options:["Worsen","Reduce","Increase","Maintain"], answer:1, difficulty:"medium" },
  { id:"e50", question:"Fill in: The data ___ been analyzed.", options:["has","have","is","are"], answer:1, difficulty:"medium" },
  { id:"e51", question:"Choose the antonym of 'Prolific':", options:["Productive","Barren","Creative","Fertile"], answer:1, difficulty:"medium" },
  { id:"e52", question:"'A stitch in time saves nine' means:", options:["Sewing is important","Quick action prevents bigger problems","Nine is a lucky number","Time management is key"], answer:1, difficulty:"medium" },
  { id:"e53", question:"Choose the correct sentence:", options:["Who's book is this?","Whose book is this?","Whom book is this?","Who book is this?"], answer:1, difficulty:"medium" },
  { id:"e54", question:"The word 'ambiguous' means:", options:["Clear","Uncertain","Definite","Precise"], answer:1, difficulty:"medium" },
  { id:"e55", question:"Identify the clause type in: 'Although it rained, we went out.'", options:["Noun clause","Adverbial clause","Relative clause","Main clause"], answer:1, difficulty:"medium" },
  { id:"e56", question:"Choose the synonym of 'Imminent':", options:["Distant","Approaching","Past","Unlikely"], answer:1, difficulty:"medium" },
  { id:"e57", question:"The active voice of 'The book was read by her' is:", options:["She reads the book","She read the book","She is reading the book","She has read the book"], answer:1, difficulty:"medium" },

  // ─── Hard ───
  { id:"e13", question:"Choose the synonym of 'Ephemeral':", options:["Eternal","Permanent","Fleeting","Lasting"], answer:2, difficulty:"hard" },
  { id:"e16", question:"Choose the antonym of 'Gregarious':", options:["Social","Reclusive","Friendly","Outgoing"], answer:1, difficulty:"hard" },
  { id:"e19", question:"The meaning of 'ubiquitous' is:", options:["Rare","Found everywhere","Unique","Hidden"], answer:1, difficulty:"hard" },
  { id:"e22", question:"The word 'ameliorate' means:", options:["Worsen","Improve","Destroy","Ignore"], answer:1, difficulty:"hard" },
  { id:"e30", question:"The word 'cacophony' refers to:", options:["Harmony","Harsh sounds","Silence","Music"], answer:1, difficulty:"hard" },
  { id:"e34", question:"Fill in: The committee ___ divided in their opinions.", options:["is","are","was","were"], answer:3, difficulty:"hard" },
  { id:"e58", question:"The word 'sycophant' means:", options:["A leader","A flatterer","A rebel","A scholar"], answer:1, difficulty:"hard" },
  { id:"e59", question:"Choose the synonym of 'Obfuscate':", options:["Clarify","Confuse","Simplify","Explain"], answer:1, difficulty:"hard" },
  { id:"e60", question:"The word 'quintessential' means:", options:["Rare","Perfect example of a quality","Outdated","Basic"], answer:1, difficulty:"hard" },
  { id:"e61", question:"Choose the antonym of 'Sanguine':", options:["Optimistic","Hopeful","Pessimistic","Cheerful"], answer:2, difficulty:"hard" },
  { id:"e62", question:"'The pen is mightier than the sword' uses which figure of speech?", options:["Personification","Metonymy","Simile","Alliteration"], answer:1, difficulty:"hard" },
  { id:"e63", question:"The word 'supercilious' means:", options:["Humble","Arrogantly superior","Kind","Simple"], answer:1, difficulty:"hard" },
  { id:"e64", question:"Choose the synonym of 'Recalcitrant':", options:["Obedient","Rebellious","Quiet","Cooperative"], answer:1, difficulty:"hard" },
  { id:"e65", question:"The word 'perfunctory' means:", options:["Thorough","Done without care","Detailed","Passionate"], answer:1, difficulty:"hard" },
  { id:"e66", question:"Choose the antonym of 'Taciturn':", options:["Silent","Talkative","Reserved","Shy"], answer:1, difficulty:"hard" },
  { id:"e67", question:"The word 'inscrutable' means:", options:["Transparent","Impossible to understand","Obvious","Simple"], answer:1, difficulty:"hard" },
];

// ━━━━━━━━━ REASONING ━━━━━━━━━
export const REASONING_BANK = [
  // ─── Easy ───
  { id:"r6", question:"Find odd one out: 3, 5, 11, 14, 17, 21", options:["14","21","3","11"], answer:0, difficulty:"easy" },
  { id:"r10", question:"Mirror image of AMBULANCE when read in a mirror:", options:["ECNALUBMA","AMBULANCE","ƎƆNALUBMA","Cannot determine"], answer:1, difficulty:"easy" },
  { id:"r12", question:"Find missing: 1, 1, 2, 3, 5, 8, ?", options:["11","12","13","14"], answer:2, difficulty:"easy" },
  { id:"r14", question:"Statement: All dogs are cats. All cats are birds. Conclusion: All dogs are birds.", options:["True","False","Cannot say","Partially true"], answer:0, difficulty:"easy" },
  { id:"r17", question:"Find the odd one out: Lion, Tiger, Bear, Sparrow, Leopard", options:["Bear","Sparrow","Lion","Leopard"], answer:1, difficulty:"easy" },
  { id:"r21", question:"Which number replaces ?: 3, 9, 27, 81, ?", options:["162","243","324","729"], answer:1, difficulty:"easy" },
  { id:"r24", question:"Arrange: DECIPHER → 1.C 2.D 3.E 4.H 5.I 6.P 7.R. Alphabetical order:", options:["1234567","2135467","1235467","2134567"], answer:0, difficulty:"easy" },
  { id:"r29", question:"Find odd one out: 2, 3, 5, 7, 9, 11", options:["2","9","3","11"], answer:1, difficulty:"easy" },
  { id:"r31", question:"Complete the analogy: Book : Author :: Film : ?", options:["Actor","Director","Producer","Editor"], answer:1, difficulty:"easy" },
  { id:"r33", question:"A faces North, turns left, then turns right. Which direction is A facing?", options:["North","East","West","South"], answer:0, difficulty:"easy" },
  { id:"r36", question:"Find next: 2, 4, 8, 16, ?", options:["20","24","32","64"], answer:2, difficulty:"easy" },
  { id:"r37", question:"Odd one out: Apple, Mango, Potato, Banana", options:["Apple","Mango","Potato","Banana"], answer:2, difficulty:"easy" },
  { id:"r38", question:"If CUP = 3+21+16 = 40, then PEN = ?", options:["32","35","40","45"], answer:2, difficulty:"easy" },
  { id:"r39", question:"A is taller than B. C is shorter than B. Who is the shortest?", options:["A","B","C","Cannot say"], answer:2, difficulty:"easy" },
  { id:"r40", question:"How many days are in a leap year?", options:["364","365","366","367"], answer:2, difficulty:"easy" },
  { id:"r41", question:"Complete: Cat : Kitten :: Dog : ?", options:["Cub","Puppy","Calf","Foal"], answer:1, difficulty:"easy" },
  { id:"r42", question:"If Monday comes after Sunday, what comes after Thursday?", options:["Wednesday","Friday","Saturday","Sunday"], answer:1, difficulty:"easy" },
  { id:"r43", question:"Find the missing number: 5, 10, 15, ?, 25", options:["18","20","22","24"], answer:1, difficulty:"easy" },
  { id:"r44", question:"Odd one out: Circle, Square, Triangle, Cylinder", options:["Circle","Square","Triangle","Cylinder"], answer:3, difficulty:"easy" },
  { id:"r45", question:"If all Bloops are Razzies, and all Razzies are Lazzies, then all Bloops are definitely:", options:["Razzies only","Lazzies","Not Lazzies","Cannot determine"], answer:1, difficulty:"easy" },

  // ─── Medium ───
  { id:"r1", question:"If FRIEND is coded as HUMGPF, how is CANDLE coded?", options:["ECRFNG","ECPFMG","ECRFMG","DCQFNG"], answer:0, difficulty:"medium" },
  { id:"r2", question:"Find the next number: 2, 6, 12, 20, 30, ?", options:["40","42","44","36"], answer:1, difficulty:"medium" },
  { id:"r3", question:"All roses are flowers. Some flowers are red. Conclusion:", options:["All roses are red","Some roses are red","No conclusion","All flowers are roses"], answer:2, difficulty:"medium" },
  { id:"r4", question:"A is B's sister. C is B's mother. D is C's father. How is A related to D?", options:["Granddaughter","Daughter","Grandmother","Grandfather"], answer:0, difficulty:"medium" },
  { id:"r5", question:"In a row of 40 students, P is 9th from left and Q is 16th from right. How many between them?", options:["14","15","16","17"], answer:1, difficulty:"medium" },
  { id:"r8", question:"Pointing to a photo, X says 'He is the son of my father's only son'. How is the person related to X?", options:["Son","Nephew","Brother","Father"], answer:0, difficulty:"medium" },
  { id:"r9", question:"Complete the series: A, C, F, J, ?", options:["N","O","P","M"], answer:1, difficulty:"medium" },
  { id:"r13", question:"If 'CAT' = 24, 'DOG' = 26, then 'PIG' = ?", options:["32","30","28","34"], answer:0, difficulty:"medium" },
  { id:"r19", question:"What comes next? ZA, YB, XC, WD, ?", options:["VE","UF","VF","UE"], answer:0, difficulty:"medium" },
  { id:"r20", question:"A is twice as old as B. 5 years ago A was 3 times B's age. A's present age:", options:["20","30","40","10"], answer:0, difficulty:"medium" },
  { id:"r22", question:"Statement: Some books are pens. All pens are erasers. Conclusion: Some books are erasers.", options:["True","False","Uncertain","Irrelevant"], answer:0, difficulty:"medium" },
  { id:"r23", question:"If MACHINE = 13+1+3+8+9+14+5 = 53, then COMPUTER = ?", options:["111","103","98","108"], answer:1, difficulty:"medium" },
  { id:"r26", question:"If × = +, + = −, − = ×, then 5 × 3 + 2 − 4 = ?", options:["0","−2","1","3"], answer:0, difficulty:"medium" },
  { id:"r27", question:"Today is Monday. What day will it be 100 days from now?", options:["Wednesday","Thursday","Friday","Saturday"], answer:0, difficulty:"medium" },
  { id:"r28", question:"B is the brother of A. C is the daughter of A. D is the sister of B. How is D related to C?", options:["Mother","Aunt","Sister","Cousin"], answer:1, difficulty:"medium" },
  { id:"r32", question:"If GIVE is coded as 5765, TAKE is coded as 1478, what is GATE?", options:["5781","5178","5817","5718"], answer:0, difficulty:"medium" },
  { id:"r34", question:"If Jan 1 of a year is Friday, what day is March 1 (non-leap year)?", options:["Friday","Saturday","Sunday","Monday"], answer:2, difficulty:"medium" },
  { id:"r35", question:"Statement: No apple is a banana. All bananas are grapes. Conclusion: No apple is a grape.", options:["True","False","Uncertain","Definite"], answer:1, difficulty:"medium" },
  { id:"r46", question:"If 'SOLID' is coded as 'WPPMH', then 'DRIED' is coded as:", options:["HVMIH","HVMHG","HVIEW","HVMIG"], answer:0, difficulty:"medium" },
  { id:"r47", question:"P is Q's brother. R is Q's mother. S is R's father. T is S's mother. How is P related to T?", options:["Grandson","Great-grandson","Son","Grandfather"], answer:1, difficulty:"medium" },
  { id:"r48", question:"Find next in series: 1, 4, 9, 16, 25, ?", options:["30","36","49","64"], answer:1, difficulty:"medium" },
  { id:"r49", question:"If South becomes North-East, what does West become?", options:["South-East","North-West","South-West","North-East"], answer:0, difficulty:"medium" },
  { id:"r50", question:"Statement: All pencils are pens. Some pens are erasers. Conclusion: Some pencils are erasers.", options:["Definitely true","Probably true","Definitely false","Cannot be determined"], answer:3, difficulty:"medium" },
  { id:"r51", question:"If 72 ÷ 8 = 354, 56 ÷ 7 = 283, then 32 ÷ 4 = ?", options:["128","164","168","148"], answer:0, difficulty:"medium" },
  { id:"r52", question:"In a certain code, 'MOUSE' → 'PRUvh'. What is 'HOUSE'?", options:["KRUHE","KRXVH","KRUVH","KRUvh"], answer:3, difficulty:"medium" },

  // ─── Hard ───
  { id:"r7", question:"If '+' means '×', '–' means '÷', '×' means '–', '÷' means '+', then 8 + 6 – 2 × 5 ÷ 3 = ?", options:["22","27","19","21"], answer:0, difficulty:"hard" },
  { id:"r11", question:"How many triangles are in a pentagon with all diagonals drawn?", options:["8","10","12","35"], answer:1, difficulty:"hard" },
  { id:"r15", question:"A clock shows 3:15. Angle between hour and minute hands:", options:["0°","7.5°","22.5°","15°"], answer:1, difficulty:"hard" },
  { id:"r16", question:"In a family: A + B means A is father of B. A – B means A is wife of B. If P + Q – R, what is R to P?", options:["Son","Daughter-in-law","Wife","Son-in-law"], answer:3, difficulty:"hard" },
  { id:"r18", question:"If South-East becomes North, which direction does North-East become?", options:["South","West","North-West","South-West"], answer:1, difficulty:"hard" },
  { id:"r25", question:"How many squares are in a 4×4 grid?", options:["16","25","30","20"], answer:2, difficulty:"hard" },
  { id:"r30", question:"Cube has 6 faces painted. If cut into 27 small cubes, how many have exactly 2 faces painted?", options:["6","8","12","0"], answer:2, difficulty:"hard" },
  { id:"r53", question:"A paper is folded twice and a hole is punched. When unfolded, how many holes?", options:["2","3","4","8"], answer:2, difficulty:"hard" },
  { id:"r54", question:"In a round-robin tournament with 8 teams, total number of matches:", options:["16","28","56","64"], answer:1, difficulty:"hard" },
  { id:"r55", question:"If A * B means A is father of B, A + B means A is sister of B, A - B means A is mother of B. What does P * Q + R - S mean?", options:["S is granddaughter of P","S is grandson of P","S is the child of P's daughter","Both A and C"], answer:3, difficulty:"hard" },
  { id:"r56", question:"A cube is painted red on two opposite faces, blue on two, green on two. Cut into 64 cubes. How many have no paint?", options:["0","8","16","24"], answer:1, difficulty:"hard" },
  { id:"r57", question:"Find the missing number: 2, 10, 30, 68, ?", options:["100","120","130","126"], answer:3, difficulty:"hard" },
  { id:"r58", question:"There are 12 balls, one is heavier. Minimum weighings on a balance to find it:", options:["2","3","4","6"], answer:1, difficulty:"hard" },
  { id:"r59", question:"If you rearrange the letters 'CIFAIPC', you get the name of a/an:", options:["City","Animal","Country","Ocean"], answer:3, difficulty:"hard" },
  { id:"r60", question:"In how many ways can 4 people be seated in a row of 6 chairs?", options:["360","720","120","240"], answer:0, difficulty:"hard" },
];

// ━━━━━━━━━ COMPUTER SCIENCE ━━━━━━━━━
export const CS_BANK = [
  // ─── Easy ───
  { id:"cs1", question:"Which layer of OSI model handles routing?", options:["Transport","Network","Data Link","Session"], answer:1, difficulty:"easy" },
  { id:"cs2", question:"What does DBMS stand for?", options:["Data Backup Management System","Database Management System","Data Binary Management System","Digital Base Management System"], answer:1, difficulty:"easy" },
  { id:"cs3", question:"What is the primary purpose of an Operating System?", options:["Run games","Manage hardware and software resources","Browse internet","Write code"], answer:1, difficulty:"easy" },
  { id:"cs4", question:"Which protocol is used for secure web browsing?", options:["HTTP","FTP","HTTPS","SMTP"], answer:2, difficulty:"easy" },
  { id:"cs5", question:"What does SDLC stand for?", options:["Software Development Life Cycle","System Design Life Cycle","Software Data Logic Circuit","System Development Logic Code"], answer:0, difficulty:"easy" },
  { id:"cs9", question:"TCP is a ___ protocol.", options:["Connectionless","Connection-oriented","Stateless","Broadcast"], answer:1, difficulty:"easy" },
  { id:"cs12", question:"What is the purpose of an index in a database?", options:["Delete records","Speed up data retrieval","Encrypt data","Compress tables"], answer:1, difficulty:"easy" },
  { id:"cs14", question:"What does DNS stand for?", options:["Data Network Service","Domain Name System","Digital Network Security","Dynamic Node Switch"], answer:1, difficulty:"easy" },
  { id:"cs15", question:"In Agile, what is a 'Sprint'?", options:["A bug","A time-boxed iteration","A testing phase","A deployment tool"], answer:1, difficulty:"easy" },
  { id:"cs17", question:"What is a foreign key?", options:["Primary key of same table","A key referencing primary key of another table","An encryption key","A sort key"], answer:1, difficulty:"easy" },
  { id:"cs18", question:"What is the default port for HTTP?", options:["21","22","80","443"], answer:2, difficulty:"easy" },
  { id:"cs19", question:"Which memory is fastest?", options:["RAM","Cache","Hard Disk","SSD"], answer:1, difficulty:"easy" },
  { id:"cs22", question:"What does API stand for?", options:["Application Programming Interface","Automated Process Integration","Application Public Index","Advanced Protocol Interface"], answer:0, difficulty:"easy" },
  { id:"cs24", question:"Which SDLC phase involves gathering requirements?", options:["Design","Testing","Requirements Analysis","Deployment"], answer:2, difficulty:"easy" },
  { id:"cs25", question:"What is a firewall?", options:["A hardware component","A security system that monitors network traffic","A programming language","A CPU feature"], answer:1, difficulty:"easy" },
  { id:"cs26", question:"What does RAM stand for?", options:["Random Access Memory","Read Access Mode","Run Application Memory","Remote Access Module"], answer:0, difficulty:"easy" },
  { id:"cs27", question:"Which programming paradigm does Java primarily follow?", options:["Functional","Procedural","Object-Oriented","Logic-based"], answer:2, difficulty:"easy" },
  { id:"cs28", question:"What is the time complexity of linear search?", options:["O(1)","O(log n)","O(n)","O(n²)"], answer:2, difficulty:"easy" },
  { id:"cs29", question:"What is the full form of HTML?", options:["Hyper Text Markup Language","High Tech Modern Language","Hyper Transfer Markup Language","Home Tool Markup Language"], answer:0, difficulty:"easy" },
  { id:"cs30", question:"Which data structure uses FIFO?", options:["Stack","Queue","Array","Tree"], answer:1, difficulty:"easy" },

  // ─── Medium ───
  { id:"cs6", question:"What is normalization in DBMS?", options:["Backing up data","Organizing data to reduce redundancy","Encrypting data","Compressing data"], answer:1, difficulty:"medium" },
  { id:"cs7", question:"Which scheduling algorithm gives minimum average waiting time?", options:["FCFS","SJF","Round Robin","Priority"], answer:1, difficulty:"medium" },
  { id:"cs8", question:"What is a deadlock?", options:["Fast process","Processes waiting for each other's resources indefinitely","Memory overflow","CPU overheating"], answer:1, difficulty:"medium" },
  { id:"cs10", question:"What is virtual memory?", options:["RAM","A technique using disk space to extend RAM","Cloud storage","Cache memory"], answer:1, difficulty:"medium" },
  { id:"cs11", question:"Which SDLC model revisits phases iteratively?", options:["Waterfall","V-Model","Spiral","Big Bang"], answer:2, difficulty:"medium" },
  { id:"cs13", question:"Which type of join returns all rows from both tables?", options:["INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL OUTER JOIN"], answer:3, difficulty:"medium" },
  { id:"cs16", question:"What is the difference between process and thread?", options:["No difference","Process is heavier; thread is a lightweight unit within a process","Thread is heavier","Process runs in browser only"], answer:1, difficulty:"medium" },
  { id:"cs20", question:"What is a subnet mask used for?", options:["Encryption","Dividing IP network into subnetworks","Data compression","Error detection"], answer:1, difficulty:"medium" },
  { id:"cs21", question:"What is ACID in databases?", options:["A data type","Atomicity, Consistency, Isolation, Durability","A programming paradigm","A network protocol"], answer:1, difficulty:"medium" },
  { id:"cs31", question:"What is the purpose of DNS caching?", options:["Encrypt DNS queries","Speed up domain name resolution","Block malicious domains","Compress DNS data"], answer:1, difficulty:"medium" },
  { id:"cs32", question:"What is a semaphore in OS?", options:["A GUI element","A synchronization mechanism for processes","A memory management tool","A CPU register"], answer:1, difficulty:"medium" },
  { id:"cs33", question:"What does the 'GROUP BY' clause do in SQL?", options:["Sorts results","Groups rows sharing common values","Joins tables","Filters rows"], answer:1, difficulty:"medium" },
  { id:"cs34", question:"What is the difference between TCP and UDP?", options:["TCP is faster","UDP guarantees delivery","TCP is connection-oriented, UDP is connectionless","No difference"], answer:2, difficulty:"medium" },
  { id:"cs35", question:"What is a B-tree primarily used for?", options:["Sorting algorithms","Database indexing","Graph traversal","Memory allocation"], answer:1, difficulty:"medium" },
  { id:"cs36", question:"What is the CAP theorem?", options:["A CPU architecture","Consistency, Availability, Partition tolerance trade-off","A data compression algorithm","A network protocol"], answer:1, difficulty:"medium" },
  { id:"cs37", question:"What is thrashing in OS?", options:["Fast execution","Excessive page swapping causing performance degradation","Memory leak","CPU overload"], answer:1, difficulty:"medium" },
  { id:"cs38", question:"What is the difference between HAVING and WHERE in SQL?", options:["No difference","WHERE filters rows, HAVING filters groups","HAVING is faster","WHERE works on aggregates"], answer:1, difficulty:"medium" },
  { id:"cs39", question:"What is a stored procedure?", options:["A type of index","A precompiled SQL code block stored in the database","A backup method","A constraint type"], answer:1, difficulty:"medium" },
  { id:"cs40", question:"What layer does a router work on?", options:["Physical","Data Link","Network","Transport"], answer:2, difficulty:"medium" },

  // ─── Hard ───
  { id:"cs23", question:"What is a race condition?", options:["A speed test","When multiple threads access shared data with unpredictable results","A network lag","A database lock"], answer:1, difficulty:"hard" },
  { id:"cs41", question:"What is the difference between horizontal and vertical scaling?", options:["No difference","Horizontal adds more machines, vertical adds more power to existing","Vertical is always better","Horizontal means more RAM"], answer:1, difficulty:"hard" },
  { id:"cs42", question:"What is a page fault?", options:["A hardware error","When a requested page is not in main memory","A network error","A display bug"], answer:1, difficulty:"hard" },
  { id:"cs43", question:"What is the Banker's Algorithm used for?", options:["Financial calculations","Deadlock avoidance","Sorting","Encryption"], answer:1, difficulty:"hard" },
  { id:"cs44", question:"What is the difference between 2NF and 3NF?", options:["No difference","3NF removes transitive dependencies","2NF is stricter","3NF allows redundancy"], answer:1, difficulty:"hard" },
  { id:"cs45", question:"What is a context switch?", options:["Switching between applications","Saving/restoring process state when CPU switches between processes","A network operation","A database operation"], answer:1, difficulty:"hard" },
  { id:"cs46", question:"What is the purpose of the ARP protocol?", options:["Routing packets","Resolving IP addresses to MAC addresses","DNS resolution","Data encryption"], answer:1, difficulty:"hard" },
  { id:"cs47", question:"What is the difference between clustered and non-clustered index?", options:["No difference","Clustered alters physical data order, non-clustered creates a separate structure","Non-clustered is always faster","Clustered allows duplicates"], answer:1, difficulty:"hard" },
  { id:"cs48", question:"What is a bitmap index best suited for?", options:["High-cardinality columns","Low-cardinality columns","Text search","Graph data"], answer:1, difficulty:"hard" },
  { id:"cs49", question:"In distributed systems, what does 'eventual consistency' mean?", options:["Immediate consistency","Data will become consistent given enough time","Data is never consistent","Strong consistency guarantee"], answer:1, difficulty:"hard" },
  { id:"cs50", question:"What is the purpose of a WAL (Write-Ahead Log)?", options:["Performance optimization","Ensuring data durability by logging changes before applying","User authentication","Network routing"], answer:1, difficulty:"hard" },
];

// ━━━━━━━━━ DSA POOL (skill-tagged) ━━━━━━━━━
export const DSA_BANK = [
  { id:"dsa1", question:"Write a function to reverse a linked list. What is the time complexity?", type:"coding", hint:"Use three pointers: prev, current, next.", tags:["data-structures","algorithms"], difficulty:"medium" },
  { id:"dsa2", question:"Implement binary search on a sorted array. Explain when it fails.", type:"coding", hint:"Compare mid element, shrink search space by half each time.", tags:["algorithms","python","react"], difficulty:"easy" },
  { id:"dsa3", question:"Given a string, find the longest palindromic substring.", type:"coding", hint:"Expand around center technique or dynamic programming.", tags:["algorithms","python"], difficulty:"hard" },
  { id:"dsa4", question:"Design a LRU Cache with O(1) get and put operations.", type:"coding", hint:"Use a HashMap + Doubly Linked List.", tags:["data-structures","rest-api","python"], difficulty:"hard" },
  { id:"dsa5", question:"Explain the difference between BFS and DFS. When would you use each?", type:"theory", hint:"BFS uses Queue (level-order), DFS uses Stack/recursion (depth-first).", tags:["algorithms","data-structures"], difficulty:"medium" },
  { id:"dsa6", question:"What is the time complexity of inserting into a balanced BST vs an unbalanced one?", type:"theory", hint:"Balanced: O(log n), Unbalanced (worst): O(n).", tags:["data-structures","algorithms"], difficulty:"medium" },
  { id:"dsa7", question:"Implement a function to detect a cycle in a linked list.", type:"coding", hint:"Floyd's Tortoise and Hare algorithm — two pointers at different speeds.", tags:["data-structures","python","algorithms"], difficulty:"medium" },
  { id:"dsa8", question:"How would you find the kth largest element in an unsorted array?", type:"coding", hint:"Use a min-heap of size k, or QuickSelect algorithm.", tags:["algorithms","data-structures"], difficulty:"hard" },
  { id:"dsa9", question:"Explain how a Hash Map handles collisions. Implement a simple one.", type:"theory", hint:"Chaining (linked list at each bucket) or Open Addressing.", tags:["data-structures","python","rest-api"], difficulty:"medium" },
  { id:"dsa10", question:"Write a function to check if a binary tree is a valid BST.", type:"coding", hint:"Use in-order traversal or pass min/max bounds recursively.", tags:["data-structures","algorithms"], difficulty:"medium" },
  { id:"dsa11", question:"Implement Dijkstra's shortest path algorithm. State its limitations.", type:"coding", hint:"Use a priority queue. Doesn't work with negative edge weights.", tags:["algorithms","data-structures"], difficulty:"hard" },
  { id:"dsa12", question:"What is dynamic programming? Solve the coin change problem.", type:"coding", hint:"Break into subproblems, store results. dp[i] = min coins for amount i.", tags:["algorithms","python"], difficulty:"hard" },
  { id:"dsa13", question:"Explain the concept of amortized analysis with an example.", type:"theory", hint:"Think of dynamic array resizing — occasional O(n) but O(1) amortized.", tags:["algorithms","data-structures"], difficulty:"hard" },
  { id:"dsa14", question:"How would you implement a stack using two queues?", type:"coding", hint:"Push: enqueue to q1. Pop: dequeue all but last from q1 to q2, swap.", tags:["data-structures"], difficulty:"medium" },
  { id:"dsa15", question:"Merge two sorted arrays without extra space.", type:"coding", hint:"Start from end of both arrays, place larger element at the back.", tags:["algorithms","python"], difficulty:"medium" },
  { id:"dsa16", question:"How does a Trie data structure work? Give a use case.", type:"theory", hint:"Prefix tree for strings. Used in autocomplete, spell checkers.", tags:["data-structures","algorithms","rest-api"], difficulty:"medium" },
  { id:"dsa17", question:"Find all permutations of a given string.", type:"coding", hint:"Use backtracking: swap each character to each position recursively.", tags:["algorithms","python"], difficulty:"medium" },
  { id:"dsa18", question:"Explain the difference between Array and Linked List. When to use each?", type:"theory", hint:"Array: O(1) access, O(n) insert. LL: O(n) access, O(1) insert at head.", tags:["data-structures"], difficulty:"easy" },
  { id:"dsa19", question:"Implement a function to find the maximum subarray sum (Kadane's Algorithm).", type:"coding", hint:"Track current_max and global_max. Reset current_max if it goes negative.", tags:["algorithms","python","data-structures"], difficulty:"medium" },
  { id:"dsa20", question:"Design a rate limiter for an API endpoint.", type:"coding", hint:"Use sliding window or token bucket algorithm with a hash map.", tags:["rest-api","algorithms","docker","python"], difficulty:"hard" },
  { id:"dsa21", question:"Implement a function to check if two strings are anagrams.", type:"coding", hint:"Sort both strings or use character frequency count.", tags:["algorithms","python"], difficulty:"easy" },
  { id:"dsa22", question:"What is the difference between a Min Heap and Max Heap? Implement insert for a Min Heap.", type:"theory", hint:"Min Heap: parent ≤ children. Insert at end and bubble up.", tags:["data-structures","algorithms"], difficulty:"medium" },
  { id:"dsa23", question:"Implement topological sort for a DAG.", type:"coding", hint:"Use DFS with a stack, or Kahn's algorithm with BFS.", tags:["algorithms","data-structures"], difficulty:"hard" },
  { id:"dsa24", question:"Given a matrix, find the shortest path from top-left to bottom-right.", type:"coding", hint:"Use BFS for unweighted grid, Dijkstra for weighted.", tags:["algorithms","data-structures","python"], difficulty:"hard" },
  { id:"dsa25", question:"Explain time complexity of common operations on a hash table.", type:"theory", hint:"Average: O(1) for insert/search/delete. Worst: O(n) due to collisions.", tags:["data-structures","algorithms"], difficulty:"easy" },
  { id:"dsa26", question:"Implement the Merge Sort algorithm and explain its time complexity.", type:"coding", hint:"Divide array in half, recursively sort, merge. O(n log n) always.", tags:["algorithms","python"], difficulty:"medium" },
  { id:"dsa27", question:"How would you find the first non-repeating character in a string?", type:"coding", hint:"Use a hash map for character frequency, then scan string again.", tags:["algorithms","python","data-structures"], difficulty:"easy" },
  { id:"dsa28", question:"Explain the sliding window technique with an example.", type:"theory", hint:"Maintain a window that slides over data. E.g., max sum of k consecutive elements.", tags:["algorithms","python"], difficulty:"medium" },
  { id:"dsa29", question:"Implement a function to flatten a nested list.", type:"coding", hint:"Use recursion: if element is a list, recurse; otherwise add to result.", tags:["python","data-structures"], difficulty:"medium" },
  { id:"dsa30", question:"Design a stack that supports push, pop, and getMin in O(1).", type:"coding", hint:"Use an auxiliary stack to track minimum values.", tags:["data-structures","algorithms"], difficulty:"hard" },
];

// Map external MOCK_QUESTIONS into the static banks to ensure 
// the largest possible pool of questions, driving repetition near zero.
if (MOCK_QUESTIONS) {
  if (MOCK_QUESTIONS.aptitude) {
    MOCK_QUESTIONS.aptitude.forEach(q => {
      const formattedQ = {
        id: q.id,
        question: q.question,
        options: q.options,
        answer: q.correct,
        difficulty: q.difficulty ? q.difficulty.toLowerCase() : 'medium'
      };
      if (['Quantitative', 'Time & Work', 'Geometry', 'Mixture & Alligation', 'Number System'].includes(q.category)) {
        QUANTITATIVE_BANK.push(formattedQ);
      } else {
        REASONING_BANK.push(formattedQ);
      }
    });
  }

  if (MOCK_QUESTIONS.software_engineering) {
    MOCK_QUESTIONS.software_engineering.forEach(q => {
      const formattedQ = {
        id: q.id,
        question: q.question,
        options: q.options,
        answer: q.correct,
        difficulty: q.difficulty ? q.difficulty.toLowerCase() : 'medium'
      };
      if (['Data Structures', 'Algorithms'].includes(q.category)) {
        DSA_BANK.push({ ...formattedQ, type: 'theory', tags: ['algorithms', 'data-structures'] });
      } else {
        CS_BANK.push(formattedQ);
      }
    });
  }

  if (MOCK_QUESTIONS.data_science) {
    MOCK_QUESTIONS.data_science.forEach(q => {
      const formattedQ = {
        id: q.id,
        question: q.question,
        options: q.options,
        answer: q.correct,
        difficulty: q.difficulty ? q.difficulty.toLowerCase() : 'medium'
      };
      CS_BANK.push(formattedQ);
    });
  }
}
