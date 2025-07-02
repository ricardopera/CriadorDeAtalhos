#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test script for Windows path handling in the Python implementation
"""

import os
import sys
import tempfile

def normalize_windows_path(path):
    """
    Normalize path to Windows format with backslashes
    """
    if not path:
        return path
    
    # Convert to Windows format
    normalized = os.path.normpath(path)
    # Ensure we use Windows backslashes
    if os.sep != '\\':
        normalized = normalized.replace('/', '\\')
    return normalized

def get_working_directory_for_shortcut(source_path):
    """
    Get the correct working directory for a shortcut
    For files: parent directory
    For folders: parent directory (not the folder itself)
    """
    if not source_path:
        return ""
    
    # Normalize the path first
    source_path = normalize_windows_path(source_path)
    
    # For both files and folders, we want the parent directory
    # The C# version uses Path.GetDirectoryName() which returns parent for both
    parent_dir = os.path.dirname(source_path)
    
    # Handle edge case where dirname might be empty
    if not parent_dir and ':' in source_path:
        # For root paths like "C:\", return the root
        parts = source_path.split('\\')
        if len(parts) > 1 and parts[0].endswith(':'):
            parent_dir = parts[0] + '\\'
    
    return normalize_windows_path(parent_dir)

def test_path_handling():
    """Test path handling functions"""
    print("Testing Windows path handling...")
    print("=" * 50)
    
    test_cases = [
        # Files
        (r"C:\Users\ricar\Downloads\MFL71697713\file.txt", "file"),
        ("C:/Users/ricar/Downloads/MFL71697713/file.txt", "file"),
        (r"C:\Users\ricar\Downloads\file.exe", "file"),
        
        # Folders  
        (r"C:\Users\ricar\Downloads\Folder", "folder"),
        ("C:/Users/ricar/Downloads/Folder", "folder"),
        (r"C:\Users\ricar\Downloads\MFL71697713\pt-br\res", "folder"),
        ("C:/Users/ricar/Downloads/MFL71697713/pt-br/res", "folder"),
        
        # Edge cases
        (r"C:" + "\\", "folder"),
        ("C:/", "folder"),
        (r"C:" + r"\file.txt", "file"),
    ]
    
    for path, path_type in test_cases:
        print(f"\nInput: {path} ({path_type})")
        normalized = normalize_windows_path(path)
        working_dir = get_working_directory_for_shortcut(path)
        
        print(f"  Normalized: {normalized}")
        print(f"  Working Directory: {working_dir}")
        
        # For folders, working directory should be parent
        # For files, working directory should also be parent  
        if path_type == "folder":
            expected_desc = f"Should be parent of '{os.path.basename(path.rstrip('/\\'))}'"
        else:
            expected_desc = f"Should be parent directory containing the file"
        print(f"  Expected: {expected_desc}")

def test_current_implementation():
    """Test how the current implementation handles paths"""
    print("\n" + "=" * 50)
    print("Testing current implementation logic...")
    print("=" * 50)
    
    # Simulate current implementation logic
    def current_working_directory_logic(source_path):
        """Current logic from _create_windows_shortcut"""
        if os.path.isfile(source_path):
            return os.path.dirname(source_path)
        else:
            return source_path  # This is the problem!
    
    test_cases = [
        r"C:\Users\ricar\Downloads\MFL71697713\file.txt",
        "C:/Users/ricar/Downloads/MFL71697713/file.txt", 
        r"C:\Users\ricar\Downloads\Folder",
        "C:/Users/ricar/Downloads/Folder",
    ]
    
    for path in test_cases:
        print(f"\nPath: {path}")
        current_wd = current_working_directory_logic(path)
        correct_wd = get_working_directory_for_shortcut(path)
        
        print(f"  Current WD:  {current_wd}")
        print(f"  Correct WD:  {correct_wd}")
        
        if current_wd != correct_wd:
            print(f"  ⚠️  ISSUE: Working directory incorrect!")
        else:
            print(f"  ✅ Working directory correct")

if __name__ == "__main__":
    test_path_handling()
    test_current_implementation()