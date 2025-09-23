
__all__ = ['memory_store']

from threading import Lock

class MemoryStore:
    def __init__(self):
        self._store = {}
        self._lock = Lock()
        self._last_doc_id = None 

    def save(self, doc_id, text):
        with self._lock:
            self._store[doc_id] = text
            self._last_doc_id = doc_id

    def get(self, doc_id):
        with self._lock:
            return self._store.get(doc_id)
    
    def get_last(self):
        """Get the most recently saved document"""
        with self._lock:
            if self._last_doc_id and self._last_doc_id in self._store:
                return self._store[self._last_doc_id]
            return None
    
    def get_last_doc_id(self):
        """Get the ID of the most recently saved document"""
        with self._lock:
            return self._last_doc_id
        
    def delete_last(self):
        """Delete the most recently saved document"""
        with self._lock:
            if self._last_doc_id and self._last_doc_id in self._store:
                del self._store[self._last_doc_id]
                self._last_doc_id = None
                return True
            return False

# Create a global instance to persist across requests
# memory_store = MemoryStore()



