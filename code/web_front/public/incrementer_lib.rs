#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract(version = "0.1.0")]
mod sample {
    use ink_core::storage;

    #[ink(storage)]
    struct Sample {
        value: storage::Value<i32>,
    }

    impl Sample {
        #[ink(constructor)]
        fn new(&mut self, init_value: i32) {
            self.value.set(init_value);
        }

        #[ink(constructor)]
        fn default(&mut self) {
            self.new(0)
        }

        #[ink(message)]
        fn inc(&mut self, by: i32) {
            *self.value += by;
        }

        #[ink(message)]
        fn get(&self) -> i32 {
            *self.value
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn default_works() {
            let contract = Sample::default();
            assert_eq!(contract.get(), 0);
        }

        #[test]
        fn it_works() {
            let mut contract = Sample::new(42);
            assert_eq!(contract.get(), 42);
            contract.inc(5);
            assert_eq!(contract.get(), 47);
            contract.inc(-50);
            assert_eq!(contract.get(), -3);
        }
    }
}