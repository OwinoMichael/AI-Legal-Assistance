# services/__init__.py
from .memory_store import MemoryStore

# Create the global instance
memory_store = MemoryStore()

# Export it so it can be imported
__all__ = ['memory_store']