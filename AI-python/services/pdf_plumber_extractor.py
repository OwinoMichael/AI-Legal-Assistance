# pdf_extractor.py


import pdfplumber
import logging
import pandas as pd
from typing import List, Dict, Any, Optional, Tuple
import re

logger = logging.getLogger(__name__)

class PdfPlumberExtractor:
    """Enhanced utility to extract text and tables from PDF files using pdfplumber."""

    def __init__(self, table_settings: Optional[Dict] = None):
        """
        Initialize with optional table detection settings.
        
        Args:
            table_settings: Dictionary of table detection parameters
        """
        # Default table detection settings - can be customized
        self.table_settings = table_settings or {
            "vertical_strategy": "lines",
            "horizontal_strategy": "lines", 
            "min_words_vertical": 3,
            "min_words_horizontal": 1,
            "snap_tolerance": 3,
            "join_tolerance": 3,
            "edge_min_length": 3,
            "intersection_tolerance": 3,
        }
    
    def extract_text(self, file_path: str) -> str:
        """Extract raw text from PDF at given file path."""
        try:
            full_text = []
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        full_text.append(page_text)

            combined = "\n".join(full_text).strip()
            logger.info(f"Extracted {len(combined)} characters of text from PDF: {file_path}")
            return combined

        except Exception as e:
            logger.error(f"Failed to extract text with pdfplumber: {e}")
            raise RuntimeError(f"PDF extraction failed: {e}")
    
    def extract_tables(self, file_path: str) -> List[pd.DataFrame]:
        """
        Extract all tables from PDF as pandas DataFrames.
        
        Returns:
            List of pandas DataFrames, one for each table found
        """
        tables = []
        try:
            with pdfplumber.open(file_path) as pdf:
                for page_num, page in enumerate(pdf.pages):
                    page_tables = page.extract_tables(self.table_settings)
                    
                    for table_num, table in enumerate(page_tables):
                        if table and len(table) > 0:
                            # Convert to DataFrame
                            df = pd.DataFrame(table[1:], columns=table[0])  # First row as headers
                            df.name = f"Page_{page_num + 1}_Table_{table_num + 1}"
                            tables.append(df)
                            
            logger.info(f"Extracted {len(tables)} tables from PDF: {file_path}")
            return tables
            
        except Exception as e:
            logger.error(f"Failed to extract tables with pdfplumber: {e}")
            raise RuntimeError(f"Table extraction failed: {e}")
    
    def extract_structured_content(self, file_path: str) -> Dict[str, Any]:
        """
        Extract both text and tables in a structured format.
        
        Returns:
            Dictionary containing extracted text, tables, and metadata
        """
        try:
            result = {
                "text": "",
                "tables": [],
                "table_count": 0,
                "pages": 0,
                "metadata": {}
            }
            
            with pdfplumber.open(file_path) as pdf:
                result["pages"] = len(pdf.pages)
                result["metadata"] = pdf.metadata or {}
                
                full_text = []
                all_tables = []
                
                for page_num, page in enumerate(pdf.pages):
                    # Extract text
                    page_text = page.extract_text()
                    if page_text:
                        full_text.append(f"--- Page {page_num + 1} ---\n{page_text}")
                    
                    # Extract tables
                    page_tables = page.extract_tables(self.table_settings)
                    for table_num, table in enumerate(page_tables):
                        if table and len(table) > 0:
                            df = pd.DataFrame(table[1:], columns=table[0])
                            df.name = f"Page_{page_num + 1}_Table_{table_num + 1}"
                            all_tables.append({
                                "page": page_num + 1,
                                "table_number": table_num + 1,
                                "dataframe": df,
                                "raw_data": table
                            })
                
                result["text"] = "\n\n".join(full_text)
                result["tables"] = all_tables
                result["table_count"] = len(all_tables)
                
            logger.info(f"Extracted structured content: {len(result['text'])} chars, {result['table_count']} tables")
            return result
            
        except Exception as e:
            logger.error(f"Failed to extract structured content: {e}")
            raise RuntimeError(f"Structured extraction failed: {e}")
    
    def find_invoice_tables(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Specifically look for invoice-like tables with common patterns.
        
        Returns:
            List of dictionaries containing potential invoice tables
        """
        invoice_tables = []
        
        try:
            structured_content = self.extract_structured_content(file_path)
            
            # Common invoice table headers to look for
            invoice_patterns = [
                r'item|description|product|service',
                r'qty|quantity|amount',
                r'price|rate|cost|unit',
                r'total|subtotal|sum',
                r'tax|vat|gst'
            ]
            
            for table_info in structured_content["tables"]:
                df = table_info["dataframe"]
                
                # Check if this looks like an invoice table
                headers = [str(col).lower() for col in df.columns if col]
                header_text = " ".join(headers)
                
                # Count matches with invoice patterns
                matches = sum(1 for pattern in invoice_patterns 
                            if re.search(pattern, header_text, re.IGNORECASE))
                
                if matches >= 2:  # At least 2 invoice-like headers
                    invoice_tables.append({
                        "page": table_info["page"],
                        "table_number": table_info["table_number"],
                        "dataframe": df,
                        "confidence": matches / len(invoice_patterns),
                        "headers": headers
                    })
            
            logger.info(f"Found {len(invoice_tables)} potential invoice tables")
            return invoice_tables
            
        except Exception as e:
            logger.error(f"Failed to find invoice tables: {e}")
            raise RuntimeError(f"Invoice table detection failed: {e}")
    
    def extract_with_coordinates(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Extract tables with their coordinate information for precise positioning.
        
        Returns:
            List of dictionaries containing table data and coordinates
        """
        tables_with_coords = []
        
        try:
            with pdfplumber.open(file_path) as pdf:
                for page_num, page in enumerate(pdf.pages):
                    # Find tables with coordinates
                    tables = page.find_tables(self.table_settings)
                    
                    for table_num, table in enumerate(tables):
                        # Extract the table data
                        table_data = table.extract()
                        
                        if table_data and len(table_data) > 0:
                            df = pd.DataFrame(table_data[1:], columns=table_data[0])
                            
                            tables_with_coords.append({
                                "page": page_num + 1,
                                "table_number": table_num + 1,
                                "dataframe": df,
                                "bbox": table.bbox,  # Bounding box coordinates
                                "raw_data": table_data
                            })
            
            logger.info(f"Extracted {len(tables_with_coords)} tables with coordinates")
            return tables_with_coords
            
        except Exception as e:
            logger.error(f"Failed to extract tables with coordinates: {e}")
            raise RuntimeError(f"Coordinate extraction failed: {e}")
