import sys
import os
sys.path.append('backend')
import predict_readiness
try:
    print(predict_readiness.predict_for_student('S001'))
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"Error: {e}")
