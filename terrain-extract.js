
const textDecoder = new TextDecoder();

export class TextureData {
  constructor() {
    this.scale = 1;
    this.orderIndex = 0;
    this.rotation = 0;
    this.mainFile = "";
    this.detailFile = "";

    /**@type {Uint8Array|undefined} Length fullBounds^2*/
    this.alphaData = undefined;
  }
  /**@param {number} v*/
  setScale(v) {
    this.scale = v;
  }
  /**@returns {number}*/
  getScale() {
    return this.scale;
  }
  /**@param {number} v*/
  setOrderIndex(v) {
    this.orderIndex = v;
  }
  /**@returns {number}*/
  getOrderIndex() {
    return this.orderIndex;
  }
  /**@param {number} v*/
  setRotation(v) {
    this.rotation = v;
  }
  /**@returns {number}*/
  getRotation() {
    return this.rotation;
  }
  /**@param {string}*/
  setMainFile(fname) {
    this.mainFile = fname;
  }
  /**@returns {string}*/
  getMainFile() {
    return this.mainFile;
  }
  /**@param {string}*/
  setDetailFile(fname) {
    this.detailFile = fname;
  }
  /**@returns {string}*/
  getDetailFile() {
    return this.detailFile;
  }
  /**@param {Uint8Array} data*/
  setAlphaData(data) {
    this.alphaData = data;
  }
  /**@returns {Uint8Array}*/
  getAlphaData() {
    return this.alphaData;
  }
}

export class WaterData {
  constructor() {
    this.height = 0;

    /**@type {ArrayBuffer|undefined} Length 8*/
    this.unused00 = undefined;

    this.uSpeed = 0;
    this.vSpeed = 0;
    this.uRepeat = 0;
    this.vRepeat = 0;
    this.color = 0;
  }
  /**@param {number} v*/
  setHeight(v) {
    this.height = v;
  }
  /**@returns {number}*/
  getHeight() {
    return this.height;
  }
  /**@param {number} v*/
  setUSpeed(v) {
    this.uSpeed = v;
  }
  /**@returns {number}*/
  getUSpeed() {
    return this.uSpeed;
  }
  /**@param {number} v*/
  setVSpeed(v) {
    this.vSpeed = v;
  }
  /**@returns {number}*/
  getVSpeed() {
    return this.vSpeed;
  }
  /**@param {number} v*/
  setURepeat(v) {
    this.uRepeat = v;
  }
  /**@returns {number}*/
  getURepeat() {
    return this.uRepeat;
  }
  /**@param {number} v*/
  setVRepeat(v) {
    this.vRepeat = v;
  }
  /**@returns {number}*/
  getVRepeat() {
    return this.vRepeat;
  }
  /**@param {number}*/
  setColor(v) {
    this.color = v;
  }
  /**@returns {number}*/
  getColor() {
    return this.color;
  }
  /**@param {string}*/
  setMainFile(fname) {
    this.mainFile = fname;
  }
  /**@returns {string}*/
  getMainFile() {
    return this.mainFile;
  }
}

export class TerrainData {
  constructor() {
    this.unused00 = 0; //Unused int32

    this.visBounds = {
      firstRow: 0,
      firstColumn: 0,
      lastRow: 0,
      lastColumn: 0
    };

    this.unused01 = 0; //Unused int32

    /**@type {Array<TextureData>}*/
    this.textures = new Array(16);
    for (let i = 0; i < this.textures.length; i++) {
      this.textures[i] = new TextureData();
    }

    this.heightScale = 0.01;
    this.widthScale = 8;

    this.unused02 = 0;

    this.fullBounds = 0;

    this.unused03 = 0;

    /**@type {ArrayBuffer|undefined} Length 68*/
    this.unused04 = undefined;

    /**@type {Array<WaterData>}*/
    this.waters = new Array(15);
    for (let i = 0; i < this.waters.length; i++) {
      this.waters[i] = new WaterData();
    }

    /**@type {ArrayBuffer|undefined} Length 524*/
    this.unused05 = undefined;

    /**@type {Uint16Array|undefined} Length 2 * fullBounds^2*/
    this.heightData = undefined;

    /**@type {Uint32Array|undefined} Length 4 * fullBounds^2*/
    this.colorData = undefined;

    /**@type {ArrayBuffer|undefined} Length 4 * fullBounds^2*/
    this.unused06 = undefined;
  }
  getVisualBoundsX () {
    return this.visBounds.lastColumn - this.visBounds.firstColumn;
  }
  getVisualBoundsY () {
    return this.visBounds.lastRow - this.visBounds.firstRow;
  }
  /**@param {number} v*/
  setHeightScale(v) {
    this.heightScale = v;
  }
  /**@returns {number}*/
  getHeightScale() {
    return this.heightScale;
  }
  /**@param {number} v*/
  setWidthScale(v) {
    this.widthScale = v;
  }
  /**@returns {number}*/
  getWidthScale() {
    return this.widthScale;
  }
  /**@param {number} v*/
  setFullBounds(v) {
    this.fullBounds = v;
  }
  /**@returns {number}*/
  getFullBounds() {
    return this.fullBounds;
  }
  /**Set the height data
   * @param {Uint16Array} data
   */
  setHeightData(data) {
    this.heightData = data;
  }
  /**Get the height data
   * @returns {Uint16Array|undefined}
   */
  getHeightData() {
    return this.heightData;
  }
  /**Set the color data
   * @param {Uint32Array} data
   */
  setColorData(data) {
    this.colorData = data;
  }
  /**Get the color data
   * @returns {Uint32Array|undefined}
   */
  getColorData() {
    return this.colorData;
  }
}

/**Get a string from a buffer
 * @param {ArrayBuffer} buffer
 * @param {number} start
 * @param {number} end
 * @returns {string}
 */
export const getStringFromBuffer = (buffer, start, end) => {
  return textDecoder.decode(buffer.slice(start, end));
}

/**Trim a string at first 0x00 char
 * @param {string} str
 */
export const cStringTrim = (str) => {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) === 0) {
      if (i === 0) return "";
      return str.substring(0, i);
    }
  }
  return str;
}

/**Create a Uint8Array from an ArrayBuffer
 * @param {ArrayBuffer} buffer 
 * @returns {Uint8Array}
 */
export const uint8arrayFromArrayBuffer = (buffer) => {
  let result = new Uint8Array(buffer.byteLength);
  for (let i=0; i<buffer.byteLength; i++) {
    result[i] = buffer[i];
  }
  return result;
}
/**Create a Uint16Array from an ArrayBuffer
 * @param {ArrayBuffer} buffer 
 * @returns {Uint16Array}
 */
export const uint16arrayFromArrayBuffer = (buffer) => {
  let view = new DataView(buffer);
  let result = new Uint16Array(Math.ceil( buffer.byteLength / Uint16Array.BYTES_PER_ELEMENT) );
  for (let i=0; i<result.length; i++) {
    result[i] = view.getUint16(i * Uint16Array.BYTES_PER_ELEMENT);
  }
  return result;
}
/**Create a Uint32Array from an ArrayBuffer
 * @param {ArrayBuffer} buffer 
 * @returns {Uint32Array}
 */
export const uint32arrayFromArrayBuffer = (buffer) => {
  console.log(buffer);
  let view = new DataView(buffer);
  let result = new Uint32Array(Math.ceil( buffer.byteLength / Uint32Array.BYTES_PER_ELEMENT) );
  for (let i=0; i<result.length; i++) {
    result[i] = view.getUint32(i * Uint32Array.BYTES_PER_ELEMENT);
  }
  return result;
}

/**Extract a *.TER buffer
 * @param {ArrayBuffer} buffer 
 */
export const extract = (buffer) => {
  let view = new DataView(buffer);
  let i = 0;
  let result = new TerrainData();
  let headerName = getStringFromBuffer(buffer, 0, 4);
  if (headerName !== "TERR") {
    throw `Terrain doesn't begin with header "TERR" : ${headerName}`;
  }
  i += 4;

  result.unused00 = view.getUint32(i); i += 4;

  result.visBounds.lastRow = view.getUint16(i); i += 2;
  result.visBounds.lastColumn = view.getUint16(i); i += 2;
  result.visBounds.firstRow = view.getUint16(i); i += 2;
  result.visBounds.firstColumn = view.getUint16(i); i += 2;

  result.unused01 = view.getUint32(i); i += 4;

  /**@type {TextureData|undefined}*/
  let texture = undefined;
  for (let it = 0; it < result.textures.length; it++) {
    texture = result.textures[it];

    texture.setScale(view.getFloat32(i));
    i += 4;
    texture.setOrderIndex(view.getUint8(i));
    i++;
    texture.setRotation(view.getFloat32(i));
    i += 4;
  }

  result.setHeightScale(view.getFloat32(i)); i += 4;

  result.setWidthScale(view.getFloat32(i)); i += 4;

  result.unused02 = view.getUint32(i); i += 4;

  result.setFullBounds(view.getUint32(i)); i += 4;

  result.unused03 = view.getUint32(i); i += 4;

  for (let it = 0; it < result.textures.length; it++) {
    texture = result.textures[it];
    let fname = cStringTrim(
      getStringFromBuffer(buffer, i, i + 32)
    );
    texture.setMainFile(fname);
    i += 32;
    fname = cStringTrim(
      getStringFromBuffer(buffer, i, i + 32)
    );
    texture.setDetailFile(fname);
    i += 32;
  }

  result.unused04 = buffer.slice(i, i + 68); i += 68;

  /**@type {WaterData|undefined}*/
  let water = undefined;
  for (let it = 0; it < result.waters.length; it++) {
    water = result.waters[it];
    if (!water) {
      console.log(water, result.waters, it);
      throw "Break";
    }
    water.setHeight(view.getFloat32(i));
    i += 4;
    //This is not a duplicate, apparently height is stored twice..
    water.setHeight(view.getFloat32(i));
    i += 4;
    water.unused00 = buffer.slice(i, i + 8);
    i += 8;
    water.setUSpeed(view.getFloat32(i));
    i += 4;
    water.setVSpeed(view.getFloat32(i));
    i += 4;
    water.setURepeat(view.getFloat32(i));
    i += 4;
    water.setVRepeat(view.getFloat32(i));
    i += 4;
    water.setColor(view.getUint32(i));
    i += 4;
    let fname = cStringTrim(
      getStringFromBuffer(buffer, i, i + 32)
    );
    water.setMainFile(fname);
    i += 32;
  }

  result.unused05 = buffer.slice(i, i + 524); i += 524;

  // let indicies = 2 * Math.pow(result.getFullBounds(), 2);
  let indicies = 2 * result.getVisualBoundsX() * result.getVisualBoundsY();

  if (buffer.byteLength < i + indicies) throw "Not enough data to parse height";
  result.setHeightData(
    uint16arrayFromArrayBuffer(
      buffer.slice(i, i + indicies)
    )
  );
  i += indicies;

  //indicies = 4 * Math.pow(result.getFullBounds(), 2);
  indicies = 4 * result.getVisualBoundsX() * result.getVisualBoundsY();

  if (buffer.byteLength < i + indicies) throw "Not enough data to parse height";
  result.setColorData(
    uint32arrayFromArrayBuffer(
      buffer.slice(i, i + indicies)
    )
  );
  i += indicies;

  result.unused06 = buffer.slice(i, i + indicies);
  i += indicies;

  indicies = Math.pow(result.getFullBounds(), 2);
  for (let it = 0; it < result.textures.length; it++) {
    texture = result.textures[it];
    texture.setAlphaData(
      uint8arrayFromArrayBuffer(
        buffer.slice(i, i + indicies)
      )
    );
    i += indicies;
  }

  console.warn("Skipping terrain water block");
  i += Math.pow(result.getFullBounds(), 2) / 2;

  console.warn("Skipping terrain foliage block");
  i += Math.pow(result.getFullBounds(), 2) / 2;

  return result;
}
