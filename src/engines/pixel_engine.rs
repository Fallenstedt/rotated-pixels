use web_sys::ImageData;
use wasm_bindgen::Clamped;
use web_sys::CanvasRenderingContext2d;

pub struct PixelEngine {
    buffer_ctx: CanvasRenderingContext2d,
    target_ctx: CanvasRenderingContext2d,
    index: usize
}

impl PixelEngine {
    pub fn new(buffer_ctx: CanvasRenderingContext2d, target_ctx: CanvasRenderingContext2d) -> PixelEngine {
        PixelEngine {
            buffer_ctx,
            target_ctx,
            index: 0,
        }
    }

    pub fn stock_ticker(&mut self) {
        let mut buffer_data = self.get_buffer_image_data();
        let pixel_count = buffer_data.len() / 4;

        if self.index >= pixel_count {
            self.index = 0
        }

        buffer_data.rotate_right(4 * self.index);
        self.index += 1;

        let new_image_data = &self.create_image_data(buffer_data);
        &self.put_image_data_onto_target(new_image_data);
    }

    pub fn make_buffer_data_pink(&self) {
        let mut buffer_data = self.get_buffer_image_data();

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

        let new_image_data = &self.create_image_data(buffer_data);
        &self.put_image_data_onto_target(new_image_data);
    }
    

    fn put_image_data_onto_target(&self, data: &ImageData) {
        &self.target_ctx.put_image_data(data, 0.0, 0.0).unwrap();
    }

    fn create_image_data(&self, mut data: Clamped<Vec<u8>>) -> ImageData {
        ImageData::new_with_u8_clamped_array_and_sh(
            Clamped(data.as_mut_slice()), 640, 480
        ).expect("image must be created")
    }


    fn get_buffer_image_data(&self) -> Clamped<Vec<u8>> {
        self.buffer_ctx.get_image_data(0.0, 0.0, 640.0, 480.0)
            .expect("buffer canvas should have data")
            .data()
    }
}