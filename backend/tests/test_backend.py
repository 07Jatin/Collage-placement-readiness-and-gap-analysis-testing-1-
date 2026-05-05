import sys
import os
sys.path.append('backend')
import skill_analyzer
try:
    print(skill_analyzer.analyze_student('S001'))
    print("Success")
except Exception as e:
    print(f"Error: {e}")
