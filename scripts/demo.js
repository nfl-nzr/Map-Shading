function long2tile(l,zoom) {
    return ((l+180)/360) * Math.pow(2,zoom);
}
function lat2tile(l,zoom) {
    return (
        ((1 -
          Math.log(
            Math.tan((l * Math.PI) / 180) + 1 / Math.cos((l * Math.PI) / 180)
          ) /
            Math.PI) /
          2) *
        Math.pow(2, zoom)
      );
}

function loadImage(url) {
    return new Promise((resolve, error) => {
        const img = new Image();
        img.onload = () => {
            resolve(img);
        }
        img.onerror = error;
        img.crossOrigin = "anonymous";
        img.src = url;
    })
}

function tile2long(x, z) {
    return (x / Math.pow(2, z)) * 360 - 180;
  }

  function PingPong(regl, opts) {
    const fbos = [regl.framebuffer(opts), regl.framebuffer(opts)];
  
    let index = 0;
  
    function ping() {
      return fbos[index];
    }
  
    function pong() {
      return fbos[1 - index];
    }
  
    function swap() {
      index = 1 - index;
    }
  
    return {
      ping,
      pong,
      swap
    };
  }

  async function getRegion(tLat, tLong, zoom, api) {
    const canvas = document.createElement("canvas");
    canvas.width = 3 * 256;
    canvas.height = 3 * 256;
    const ctx = canvas.getContext("2d");
    for (let x = 0; x < 3; x++) {
      const _tLong = tLong + (x - 1);
      for (let y = 0; y < 3; y++) {
        const _tLat = tLat + (y - 1);
        const url = api
          .replace("zoom", zoom)
          .replace("tLat", _tLat)
          .replace("tLong", _tLong);
        const img = await loadImage(url);
        ctx.drawImage(img, x * 256, y * 256);
      }
    }
    return canvas;
  }

module.exports = {
    long2tile,
    lat2tile,
    loadImage,
    tile2long,
    PingPong,
    getRegion
}