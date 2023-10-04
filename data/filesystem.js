import * as FileSystem from 'expo-file-system';

export async function getUsedMemoryCapacity() {
    const freeDiskCapacity = await FileSystem.getFreeDiskStorageAsync();
    const usedDiskInfo = await FileSystem.getInfoAsync(`${FileSystem.cacheDirectory}/Camera`);
    const usedDiskCapacity = usedDiskInfo.size;
    const processedSize = bytesToGigabytesAndMegabytes(usedDiskCapacity);
    console.log(freeDiskCapacity, usedDiskCapacity);
    const index = (
        (freeDiskCapacity + usedDiskCapacity) >= Number.MAX_SAFE_INTEGER
    ) ?
        (usedDiskCapacity / freeDiskCapacity).toFixed(2) :
        (usedDiskCapacity / (freeDiskCapacity + usedDiskCapacity)).toFixed(2);
    return {
        size: processedSize.size,
        measure: processedSize.measure,
        index: +index,
    }
}

function bytesToGigabytesAndMegabytes(bytes) {
    if(bytes < 524289){
        return { measure: 'MB', size: 0}
    }
    const gigabytes = bytes / 1073741824;
    if (gigabytes >= 1) {
        return { size: gigabytes.toFixed(1), measure: 'GB' };
    } else {
        const megabytes = bytes / 1048576;
        return { measure: 'MB', size: Math.round(megabytes) };
    }
}