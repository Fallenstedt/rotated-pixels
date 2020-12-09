use web_sys::CanvasRenderingContext2d;
use wasm_bindgen::prelude::*;

use crate::engines::pixel_engine::PixelEngine;

#[wasm_bindgen]
pub struct PixelManager {
    pixel_engine: PixelEngine
}


#[wasm_bindgen]
impl PixelManager {

    #[wasm_bindgen(constructor)]
    pub fn new(buffer_ctx: CanvasRenderingContext2d, target_ctx: CanvasRenderingContext2d) -> PixelManager {
        let pixel_engine = PixelEngine::new(buffer_ctx, target_ctx);

        PixelManager {
            pixel_engine
        }
    }

    #[wasm_bindgen(method)]
    pub fn rotate_pixels(&self) {         
        self.pixel_engine.make_buffer_data_pink();
    } 

}



