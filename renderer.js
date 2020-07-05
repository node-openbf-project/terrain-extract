
import { on } from "./utils/aliases.js";
import { Component } from "./utils/component.js";
import { lerp, Utils, dist } from "./utils/math.js";

export class Renderer extends Component {
  constructor() {
    super();
    this.make("canvas");
    /**@type {CanvasRenderingContext2D}*/
    this.ctx = this.element.getContext("2d");

    /**@type {ImageData|undefined} */
    this.imagedata = undefined;

    this.zoom = 1;

    this.needsRedraw = false;
    this.shouldHandleRedrawLoop = false;
    this.onAnimFrame = () => {
      if (this.shouldHandleRedrawLoop) {
        if (this.needsRedraw) {
          this.render();
        }
        window.requestAnimationFrame(this.onAnimFrame);
      }
    }
  }
  /**Tell the renderer to handle its own resizing
   * This will cause resize when window fires resize event
   * @returns {Renderer} self
   */
  handleResize() {
    on(window, "resize", () => this.onResize());
    return this;
  }
  /**Tell the renderer to handle its own redraw loop
   * This will cause redraw when functions invoked that call markRedraw:
   * addColor, removeColor, etc
   * @returns {Renderer} self
   */
  handleRedrawLoop() {
    this.shouldHandleRedrawLoop = true;
    window.requestAnimationFrame(this.onAnimFrame);
    return this;
  }
  fillParentSize() {
    this.element.style.width = "100%";
    this.element.style.height = "100%";
    this.onResize();
    return this;
  }
  markRedraw() {
    this.needsRedraw = true;
    return this;
  }
  clearRedraw() {
    this.needsRedraw = false;
    return this;
  }
  /**Recalculates the image data
   * Will notify renderer that redraw needs to happen
   * @returns {Renderer} self
   */
  onResize() {
    // this.element.width = Math.floor(this.rect.width);
    // this.element.height = Math.floor(this.rect.height);
    this.markRedraw();
    return this;
  }
  /**Set a pixel on the canvas at rgb offset index
   * @param {number} ind 
   * @param {number} r 
   * @param {number} g 
   * @param {number} b
   * @returns {Renderer} self
   */
  setPixelAtIndex(ind, r, g, b) {
    this.imagedata.data[ind + 0] = Math.floor(r);
    this.imagedata.data[ind + 1] = Math.floor(g);
    this.imagedata.data[ind + 2] = Math.floor(b);
    this.imagedata.data[ind + 3] = 255; //Full alpha
    return this;
  }
  /**Set a pixel on the canvas at xy position
   * @param {number} x 
   * @param {number} y 
   * @param {number} r 
   * @param {number} g 
   * @param {number} b 
   */
  setPixelAtXY(x, y, r, g, b) {
    let ind = Utils.TwoDimToIndex(x, y, this.imagedata.width) * 4;
    this.setPixelAtIndex(ind, r, g, b);
    return this;
  }
  /**Set a color on the canvas at xy position
   * @param {number} x 
   * @param {number} y 
   * @param {rendererColor} c
   * @return {Renderer} self
   */
  setColorAtXY(x, y, c) {
    this.setPixelAtXY(x, y, c.r, c.g, c.b);
  }
  /**Check if byte offset contained in imagedata.data.length
   * @param {number} ind
   * @returns {boolean} true if good to access
   */
  checkIndexBounds(ind) {
    return !(ind < 0 || ind > this.imagedata.data.length);
  }
  checkXYBounds(x, y) {
    return !(x < 0 || x > this.imagedata.width || y < 0 || y > this.imagedata.height);
  }
  /**Internal, should not be called unless you know what you're doing
   * This will redraw the entire canvas
   */
  render() {
    this.clearRedraw();
    this.ctx.save();
    if (this.imagedata) {
      this.ctx.putImageData(this.imagedata, 0, 0);
    }
    this.ctx.restore();
  }
  /**Overridden from component.js because I want autocomplete..
   * @param {HTMLELement|Component} p 
   * @returns {Renderer} self
   */
  mount(p) {
    super.mount(p);
    return this;
  }

  /**Show a height map
   * @param {Uint16Array} data 
   * @param {number} width
   * @param {{firstRow:0,firstColumn:0,lastRow:0,lastColumn:0}} visBounds
   */
  showHeightMap(data, width, height) {
    let view = new DataView(data.buffer);
    this.imagedata = new ImageData(width, height);
    this.element.width = width;
    this.element.height = height;

    let heightIndex = 0;
    let pixelIndex = 0;
    let v = 0;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        heightIndex = Utils.TwoDimToIndex(x, y, width)*2;
        pixelIndex = Utils.TwoDimToIndex(x, y, width)*4;
        // v = Math.floor(0xff*(view.getUint16(heightIndex) / 0xffff));
        v = view.getInt16(heightIndex);

        this.imagedata.data[pixelIndex + 0] = v;
        this.imagedata.data[pixelIndex + 1] = v;
        this.imagedata.data[pixelIndex + 2] = v;
        this.imagedata.data[pixelIndex + 3] = 255;
      }
    }
    this.markRedraw();
  }
}
