use js_sys::{Uint8ClampedArray};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct PixelRotator {}


#[wasm_bindgen]
impl PixelRotator {

    #[wasm_bindgen(constructor)]
    pub fn new() -> PixelRotator {
        PixelRotator {}
    }

    #[wasm_bindgen(method)]
    pub fn rotate_pixels(&self, pixels: Uint8ClampedArray) -> Uint8ClampedArray {         
        for i in 0..pixels.length() {
            if i % 2 == 0 {
                pixels.set_index(i, 125);
            }
            if i % 3 == 0 {
                pixels.set_index(i, 64);
            }
            if i % 5 == 0 {
                pixels.set_index(i, 96);
            }
        }
        
        pixels
    } 
}



