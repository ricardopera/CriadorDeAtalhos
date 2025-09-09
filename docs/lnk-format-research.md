# Windows .lnk File Format Research

## Overview
Windows .lnk files are binary files that store shortcut information. The format is documented by Microsoft and consists of several structures.

## Key Structures
1. **Shell Link Header** (76 bytes)
2. **LinkInfo Structure** (variable size)
3. **String Data** (variable size)
4. **Extra Data** (variable size, optional)

## Shell Link Header Structure
```
Offset  Size  Field
0x00    4     HeaderSize (always 0x4C = 76 bytes)
0x04    16    LinkCLSID (always {00021401-0000-0000-C000-000000000046})
0x14    4     LinkFlags (determines which structures are present)
0x18    4     FileAttributes
0x1C    8     CreationTime (FILETIME)
0x24    8     AccessTime (FILETIME) 
0x2C    8     WriteTime (FILETIME)
0x34    4     FileSize
0x38    4     IconIndex
0x3C    4     ShowCommand (SW_SHOWNORMAL = 1)
0x40    4     HotKey
0x44    4     Reserved1 (always 0)
0x48    4     Reserved2 (always 0)
```

## LinkFlags Values
- HasLinkTargetIDList = 0x01
- HasLinkInfo = 0x02
- HasName = 0x04
- HasRelativePath = 0x08
- HasWorkingDir = 0x10
- HasArguments = 0x20
- HasIconLocation = 0x40

## Implementation Strategy
For our JavaScript implementation, we'll focus on the minimal required structures:
1. Shell Link Header with basic flags
2. LinkInfo for target path
3. String data for working directory and description