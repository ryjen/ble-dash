
export const decodeTemperature = buffer => buffer.readInt16LE(0) / 100;
export const decodeHumidity = buffer => buffer.readUInt8(0);
