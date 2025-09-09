/**
 * Windows .lnk File Generator
 * Generates Windows shortcut files in browser using binary format
 * 
 * Based on Microsoft's Shell Link Binary File Format specification
 * https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-shllink/
 */

class LnkGenerator {
    constructor() {
        // Shell Link Header constants
        this.HEADER_SIZE = 0x4C; // 76 bytes
        this.LINK_CLSID = new Uint8Array([
            0x01, 0x14, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00,
            0xC0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x46
        ]);
        
        // LinkFlags values
        this.LinkFlags = {
            HasLinkTargetIDList: 0x00000001,
            HasLinkInfo: 0x00000002,
            HasName: 0x00000004,
            HasRelativePath: 0x00000008,
            HasWorkingDir: 0x00000010,
            HasArguments: 0x00000020,
            HasIconLocation: 0x00000040,
            IsUnicode: 0x00000080,
            ForceNoLinkInfo: 0x00000100,
            HasExpString: 0x00000200,
            RunInSeparateProcess: 0x00000400,
            HasLogo3ID: 0x00000800,
            HasDarwinID: 0x00001000,
            RunAsUser: 0x00002000,
            HasExpIcon: 0x00004000,
            NoPidlAlias: 0x00008000,
            ForceUncName: 0x00010000,
            RunWithShimLayer: 0x00020000,
            ForceNoLinkTrack: 0x00040000,
            EnableTargetMetadata: 0x00080000,
            DisableLinkPathTracking: 0x00100000,
            DisableKnownFolderTracking: 0x00200000,
            DisableKnownFolderAlias: 0x00400000,
            AllowLinkToLink: 0x00800000,
            UnaliasOnSave: 0x01000000,
            PreferEnvironmentPath: 0x02000000,
            KeepLocalIDListForUNCTarget: 0x04000000
        };
        
        // ShowCommand values
        this.ShowCommand = {
            SW_HIDE: 0,
            SW_NORMAL: 1,
            SW_SHOWMINIMIZED: 2,
            SW_SHOWMAXIMIZED: 3,
            SW_SHOWNOACTIVATE: 4,
            SW_SHOW: 5,
            SW_MINIMIZE: 6,
            SW_SHOWMINNOACTIVE: 7,
            SW_SHOWNA: 8,
            SW_RESTORE: 9,
            SW_SHOWDEFAULT: 10
        };
    }

    /**
     * Creates a Windows .lnk file as a Uint8Array
     * @param {Object} options - Shortcut options
     * @param {string} options.target - Target path
     * @param {string} [options.workingDirectory] - Working directory
     * @param {string} [options.description] - Description
     * @param {string} [options.arguments] - Arguments
     * @param {number} [options.showCommand] - Show command
     * @returns {Uint8Array} Binary .lnk file data
     */
    create(options) {
        const {
            target,
            workingDirectory = this.getParentDirectory(target),
            description = `Shortcut to ${this.getFileName(target)}`,
            arguments: args = '',
            showCommand = this.ShowCommand.SW_NORMAL
        } = options;

        // Calculate flags and sizes
        let flags = this.LinkFlags.HasLinkInfo;
        
        if (workingDirectory) flags |= this.LinkFlags.HasWorkingDir;
        if (description) flags |= this.LinkFlags.HasName;
        if (args) flags |= this.LinkFlags.HasArguments;
        
        // Always use Unicode for modern compatibility
        flags |= this.LinkFlags.IsUnicode;

        // Create binary sections
        const header = this.createShellLinkHeader(flags, showCommand);
        const linkInfo = this.createLinkInfo(target);
        const stringData = this.createStringData({
            name: description,
            workingDir: workingDirectory,
            arguments: args
        }, flags);

        // Combine all sections
        const totalSize = header.length + linkInfo.length + stringData.length;
        const result = new Uint8Array(totalSize);
        
        let offset = 0;
        result.set(header, offset);
        offset += header.length;
        result.set(linkInfo, offset);
        offset += linkInfo.length;
        result.set(stringData, offset);

        return result;
    }

    /**
     * Creates the Shell Link Header (76 bytes)
     */
    createShellLinkHeader(flags, showCommand) {
        const header = new Uint8Array(this.HEADER_SIZE);
        const view = new DataView(header.buffer);

        // HeaderSize (4 bytes)
        view.setUint32(0x00, this.HEADER_SIZE, true);
        
        // LinkCLSID (16 bytes)
        header.set(this.LINK_CLSID, 0x04);
        
        // LinkFlags (4 bytes)
        view.setUint32(0x14, flags, true);
        
        // FileAttributes (4 bytes) - default to 0
        view.setUint32(0x18, 0, true);
        
        // Creation, Access, Write times (8 bytes each) - use current time
        const now = this.toFileTime(new Date());
        for (let i = 0; i < 3; i++) {
            view.setBigUint64(0x1C + (i * 8), now, true);
        }
        
        // FileSize (4 bytes) - 0 for directories/unknown
        view.setUint32(0x34, 0, true);
        
        // IconIndex (4 bytes)
        view.setUint32(0x38, 0, true);
        
        // ShowCommand (4 bytes)
        view.setUint32(0x3C, showCommand, true);
        
        // HotKey (4 bytes)
        view.setUint32(0x40, 0, true);
        
        // Reserved fields (8 bytes total)
        view.setUint32(0x44, 0, true);
        view.setUint32(0x48, 0, true);

        return header;
    }

    /**
     * Creates the LinkInfo structure
     */
    createLinkInfo(targetPath) {
        // Simplified LinkInfo structure
        // For local paths, we create a minimal structure
        
        const pathBytes = this.stringToBytes(targetPath, false); // ASCII for LinkInfo
        const linkInfoSize = 28 + pathBytes.length + 1; // Base size + path + null terminator
        
        const linkInfo = new Uint8Array(linkInfoSize);
        const view = new DataView(linkInfo.buffer);
        
        // LinkInfoSize
        view.setUint32(0x00, linkInfoSize, true);
        
        // LinkInfoHeaderSize
        view.setUint32(0x04, 28, true);
        
        // LinkInfoFlags (local path)
        view.setUint32(0x08, 0x01, true);
        
        // VolumeIDOffset
        view.setUint32(0x0C, 0, true);
        
        // LocalBasePathOffset
        view.setUint32(0x10, 28, true);
        
        // CommonNetworkRelativeLinkOffset
        view.setUint32(0x14, 0, true);
        
        // CommonPathSuffixOffset
        view.setUint32(0x18, 28 + pathBytes.length + 1, true);
        
        // Copy path bytes starting at offset 28
        linkInfo.set(pathBytes, 28);
        // Null terminator is already there (array initialized to zeros)
        
        return linkInfo;
    }

    /**
     * Creates string data section
     */
    createStringData(strings, flags) {
        let data = new Uint8Array(0);
        
        // Add name/description
        if ((flags & this.LinkFlags.HasName) && strings.name) {
            data = this.appendStringData(data, strings.name);
        }
        
        // Add working directory
        if ((flags & this.LinkFlags.HasWorkingDir) && strings.workingDir) {
            data = this.appendStringData(data, strings.workingDir);
        }
        
        // Add arguments
        if ((flags & this.LinkFlags.HasArguments) && strings.arguments) {
            data = this.appendStringData(data, strings.arguments);
        }
        
        return data;
    }

    /**
     * Appends a Unicode string to the string data
     */
    appendStringData(currentData, str) {
        const stringBytes = this.stringToBytes(str, true); // Unicode
        const stringLength = str.length;
        
        // Create new array with space for length + string
        const newData = new Uint8Array(currentData.length + 2 + stringBytes.length);
        
        // Copy existing data
        newData.set(currentData, 0);
        
        // Add string length (2 bytes)
        const view = new DataView(newData.buffer, currentData.length);
        view.setUint16(0, stringLength, true);
        
        // Add string data
        newData.set(stringBytes, currentData.length + 2);
        
        return newData;
    }

    /**
     * Converts string to bytes (ASCII or Unicode)
     */
    stringToBytes(str, unicode = true) {
        if (unicode) {
            // UTF-16LE encoding
            const bytes = new Uint8Array(str.length * 2);
            for (let i = 0; i < str.length; i++) {
                const code = str.charCodeAt(i);
                bytes[i * 2] = code & 0xFF;
                bytes[i * 2 + 1] = (code >> 8) & 0xFF;
            }
            return bytes;
        } else {
            // ASCII encoding
            const bytes = new Uint8Array(str.length);
            for (let i = 0; i < str.length; i++) {
                bytes[i] = str.charCodeAt(i) & 0xFF;
            }
            return bytes;
        }
    }

    /**
     * Converts Date to Windows FILETIME (100-nanosecond intervals since 1601-01-01)
     */
    toFileTime(date) {
        const FILETIME_EPOCH = new Date('1601-01-01T00:00:00Z');
        const diff = date.getTime() - FILETIME_EPOCH.getTime();
        // Convert milliseconds to 100-nanosecond intervals
        return BigInt(diff * 10000);
    }

    /**
     * Gets parent directory from a path
     */
    getParentDirectory(path) {
        if (!path) return '';
        
        // Normalize path separators
        const normalized = path.replace(/\//g, '\\');
        const lastSlash = normalized.lastIndexOf('\\');
        
        if (lastSlash === -1) {
            // No directory separator found
            return '';
        }
        
        const parent = normalized.substring(0, lastSlash);
        
        // Handle drive root (e.g., "C:")
        if (parent.length === 2 && parent.endsWith(':')) {
            return parent + '\\';
        }
        
        return parent || '';
    }

    /**
     * Gets filename from a path
     */
    getFileName(path) {
        if (!path) return '';
        
        // Normalize path separators
        const normalized = path.replace(/\//g, '\\');
        const lastSlash = normalized.lastIndexOf('\\');
        
        if (lastSlash === -1) {
            return path;
        }
        
        return normalized.substring(lastSlash + 1);
    }

    /**
     * Downloads the .lnk file
     */
    download(lnkData, filename) {
        const blob = new Blob([lnkData], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.endsWith('.lnk') ? filename : `${filename}.lnk`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
}