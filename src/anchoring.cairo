use array::ArrayTrait;
use starknet::ContractAddress;

#[starknet::interface]
trait AnchorTrait<T> {
    /// @dev Function that adds a user to the whitelist
    fn authorize(ref self: T, user: ContractAddress);
    /// @dev Function that removes a user to the whitelist
    fn unauthorize(ref self: T, user: ContractAddress);
    /// @dev Function that anchor a message
    fn anchor(ref self: T, message: felt252, extra_message: felt252);
    /// @dev Function that retrieves all anchored timestamps
    fn get_anchored_timestamps(self: @T) -> Array::<u64>;
    /// @dev Function that retrieves all anchored messages 
    fn get_anchored_values(self: @T) -> Array::<(felt252, felt252)>;
    /// @dev Function that retrieves the timestamps of a given anchored message 
    fn get_anchored_timestamp(self: @T, message: felt252, extra_message: felt252) -> u64;
}

#[starknet::contract]
mod Anchoring {
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;
    use starknet::ContractAddress;
    use array::ArrayTrait;

    // Storage variable used to store the anchored value
    #[storage]
    struct Storage {
        admin: ContractAddress, // The admin of the contract which can whitelist new users
        whitelisted: LegacyMap<ContractAddress, bool>, // The address of the whitelisted contract
        size_index: u128, // size of the array
        message_values: LegacyMap<u128, (felt252, felt252)>, // index, message
        message_timestamp: LegacyMap<(felt252, felt252), u64> // message, timestamp
    }

    // Function used to initialize the contract
    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress) {
        self.whitelisted.write(admin, true);
        self.size_index.write(0);
        self.admin.write(admin);
    }

    #[external(v0)]
    impl AnchorImpl of super::AnchorTrait<ContractState> {
        fn authorize(ref self: ContractState, user: ContractAddress) {
            self._is_admin_caller();
            self.whitelisted.write(user, true);
        }
        fn unauthorize(ref self: ContractState, user: ContractAddress) {
            self._is_admin_caller();
            self.whitelisted.write(user, false);
        }

        // Function used to anchor a new value
        fn anchor(ref self: ContractState, message: felt252, extra_message: felt252) {
            self._is_whitelisted_caller();
            assert(!(self.message_timestamp.read((message, extra_message)) > 0_u64), 'already_anchored');
            self.message_values.write(self.size_index.read(), (message, extra_message));
            self.message_timestamp.write((message, extra_message), get_block_timestamp());
            self.size_index.write(self.size_index.read() + 1);
        }

        fn get_anchored_timestamps(self: @ContractState) -> Array::<u64> {
            let mut values = ArrayTrait::new();
            self.construct_anchored_timestamps_array(values, 0_u128, self.size_index.read())
        }

        fn get_anchored_values(self: @ContractState) -> Array::<(felt252, felt252)> {
            let mut values = ArrayTrait::new();
            self.construct_anchored_values_array(values, 0_u128, self.size_index.read())
        }

        fn get_anchored_timestamp(self: @ContractState, message: felt252, extra_message: felt252) -> u64 {
            self.message_timestamp.read((message, extra_message))
        }
    }

    /// @dev Internal Functions implementation for the Anchoring contract
    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        /// @dev Construct an array with all message timestamps
        fn construct_anchored_timestamps_array(
            self: @ContractState, mut values: Array::<u64>, index: u128, last_index: u128
        ) -> Array::<u64> {
            if index < last_index {
                let message = self.message_values.read(index);
                values.append(self.message_timestamp.read(message));
                self.construct_anchored_timestamps_array(values, index + 1, last_index)
            } else {
                values
            }
        }
        /// @dev Construct an array with all anchored messages
        fn construct_anchored_values_array(
            self: @ContractState, mut values: Array::<(felt252, felt252)>, index: u128, last_index: u128
        ) -> Array::<(felt252, felt252)> {
            if index < last_index {
                values.append(self.message_values.read(index));
                self.construct_anchored_values_array(values, index + 1, last_index)
            } else {
                values
            }
        }
    }

    /// @dev Asserts implementation for the Anchoring contract
    #[generate_trait]
    impl AssertsImpl of AssertsTrait {
        /// @dev Internal function that checks if caller is the admin role
        fn _is_admin_caller(ref self: ContractState) {
            let admin = self.admin.read();
            assert(get_caller_address() == admin, 'NOT_ADMIN_CALLER');
        }

        /// @dev Internal function that checks if caller is whitelisted
        fn _is_whitelisted_caller(ref self: ContractState) {
            assert(self.whitelisted.read(get_caller_address()) == true, 'NOT_WHITELISTED');
        }
    }
}
