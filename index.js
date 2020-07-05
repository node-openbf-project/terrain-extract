
import { Renderer } from "./renderer.js";
import { extract } from "./terrain-extract.js";
import { get, on } from "./utils/aliases.js";
import { Component } from "./utils/component.js";

let container = new Component()
  .useNative(get("container"));

let renderer = new Renderer()
  .mount(container)
  .handleRedrawLoop()
  .fillParentSize()
  .handleResize();

/**Open a file(s) (upload)
 * @returns {Promise<FileList>}
 */
let fget = () => {
  return new Promise((resolve, reject) => {
    let fin = get("f-in");
    let listener = () => {
      if (fin.files.length === 0) {
        reject("No files opened");
      } else {
        resolve(fin.files);
      }
      fin.removeEventListener("change", listener);
    };
    on(fin, "change", listener);
    fin.click();
  });
}
/**Save a file (download)
 * @param {ArrayBuffer} buffer 
 * @param {string} mimeType 
 * @param {string} name 
 */
let fset = (buffer, mimeType, name = "output.png") => {
  let element = get("f-out");
  element.download = name;
  element.href = buffer;
  element.click();
}

let openBtn = new Component()
  .make("button")
  .mount(container)
  .textContent("Browse")
  .addClasses("btn")
  .on("click", async (evt) => {
    let result = await fget();
    if (result.length > 0) {
      let buffer = await result[0].arrayBuffer();
      let terrainData = extract(buffer);
      let heightData = terrainData.getHeightData();
      let width = terrainData.getVisualBoundsX();

      renderer.showHeightMap (heightData, terrainData.getVisualBoundsX(), terrainData.getVisualBoundsY());
    }
  });
