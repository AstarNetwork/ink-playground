const codeTemplate = String.raw`#![cfg_attr(not(feature = "std"), no_std)]

use ink_core::{
    env::DefaultSrmlTypes,
    memory::format,
    storage,
};
use ink_lang::contract;

contract! {
    #![env = DefaultSrmlTypes]
    
		struct Flipper {
        value: storage::Value<bool>,
    }

    impl Deploy for Flipper {
        fn deploy(&mut self) {
            self.value.set(false)
        }
    }

    impl Flipper {
        pub(external) fn flip(&mut self) {
            *self.value = !*self.value;
        }

        pub(external) fn get(&self) -> bool {
            env.println(&format!("Flipper Value: {:?}", *self.value));
            *self.value
        }
    }
}

#[cfg(test)]
mod tests {
    use super::Flipper;

    #[test]
    fn it_works() {
        let mut flipper = Flipper::deploy_mock();
        assert_eq!(flipper.get(), false);
        flipper.flip();
        assert_eq!(flipper.get(), true);
    }
}`

export default codeTemplate;
