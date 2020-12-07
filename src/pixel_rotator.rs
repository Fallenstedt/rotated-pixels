use web_sys::ImageData;
use wasm_bindgen::Clamped;
use web_sys::CanvasRenderingContext2d;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct PixelRotator {
    buffer_ctx: CanvasRenderingContext2d,
    target_ctx: CanvasRenderingContext2d
}


#[wasm_bindgen]
impl PixelRotator {

    #[wasm_bindgen(constructor)]
    pub fn new(buffer_ctx: CanvasRenderingContext2d, target_ctx: CanvasRenderingContext2d) -> PixelRotator {
        PixelRotator {
            buffer_ctx,
            target_ctx
        }
    }

    #[wasm_bindgen(method)]
    pub fn rotate_pixels(&self) {         
        let manipulated_buffer_data = self.make_pink();
        let new_image_data = &self.create_image_data(manipulated_buffer_data);
        
        &self.put_image_data_onto_target(new_image_data);
    } 

    fn put_image_data_onto_target(&self, data: &ImageData) {
        &self.target_ctx.put_image_data(data, 0.0, 0.0).unwrap();
    }

    fn create_image_data(&self, mut data: Clamped<Vec<u8>>) -> ImageData {
        // how to handle this error? This is catastrophic. 
        // Should we set an error property on the instance so JS can see this message?
        match  ImageData::new_with_u8_clamped_array_and_sh(Clamped(data.as_mut_slice()), 640, 480) {
            Ok(data) => data,
            Err(_err) => panic!("Failed to create image data")
        }
    }


    fn make_pink(&self) -> Clamped<Vec<u8>> {
        let mut buffer_data = self.get_buffer_image_data();
        log!("{}", buffer_data.len());
        for i in 0..buffer_data.len() {
            if i % 2 == 0 {
                buffer_data[i] = 255;
            }
            if i % 3 == 0 {
                buffer_data[i] = 255;
            }
            if i % 5 == 0 {
                buffer_data[i] = 255;
            }
        }
        buffer_data
    }
    

    fn get_buffer_image_data(&self) -> Clamped<Vec<u8>> {
        let image_data = match self.buffer_ctx.get_image_data(0.0, 0.0, 640.0, 480.0) {
            Ok(d) => d,
            Err(_err) => panic!("failed to fetch buffer image data")
        };
        
        image_data.data()
    }
}



