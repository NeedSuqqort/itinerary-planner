import sys
from pathlib import Path

# Add backend app to path for imports
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))
