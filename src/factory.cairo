use starknet::ContractAddress;
use starknet::class_hash::ClassHash;

#[starknet::interface]
trait FactoryTrait<T> {
    /// @dev Function that retrieves the admin role
    fn get_admin(self: @T) -> ContractAddress;
    /// @dev Function that retrieves the proposed_admin
    fn get_proposed_admin(self: @T) -> Option<ContractAddress>;
    /// @dev Function that allows the admin role to propose a new admin
    fn changeAdmin(ref self: T, new_admin: ContractAddress);
    /// @dev Function that allows a proposed admin to accept the admin role
    fn acceptAdmin(ref self: T);
    /// @dev Admin role can change class_hash of anchoring contract
    fn change_class_hash(ref self: T, new_class_hash: ClassHash);
    /// @dev Function that deploys a new anchoring contract
    fn deploy(ref self: T, whitelisted: ContractAddress) -> ContractAddress;
    /// @dev Function that retrieves owner of an anchoring contract
    fn get_anchor_contract_owner(
        self: @T, anchored_contract_address: ContractAddress
    ) -> ContractAddress;
    fn get_owner_contract_index(self: @T, owner: ContractAddress) -> u16;
    fn get_contract_by_owner_index(self: @T, owner: ContractAddress, index: u16) -> ContractAddress;
}

#[starknet::contract]
mod Factory {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::deploy_syscall;
    use starknet::class_hash::ClassHash;
    use starknet::get_block_timestamp;
    use array::ArrayTrait;
    use option::OptionTrait;
    use option::OptionTraitImpl;
    use traits::Into;

    // Storage variable used to store the anchored value
    #[storage]
    struct Storage {
        all_contracts: LegacyMap<ContractAddress,
        ContractAddress>, // anchored_contract_address, user_account_contract_address
        contracts_owner_index: LegacyMap<ContractAddress, u16>, // number of generated contracts by users
        contracts_by_owner: LegacyMap<(ContractAddress, u16),
        ContractAddress>, // user_account_contract_address, List of anchored_contract_address
        admin: ContractAddress, // account wallet authorized to push new contracts
        proposed_admin: Option<ContractAddress>, // Proposition for the admin role
        class_hash: ClassHash, // class hash of the anchoring contract
    }

    // Function used to initialize the contract
    #[constructor]
    fn constructor(ref self: ContractState, _admin: ContractAddress, _class_hash: ClassHash) {
        self.admin.write(_admin);
        self.proposed_admin.write(Option::None(()));
        self.class_hash.write(_class_hash);
    }

    #[external(v0)]
    impl FactoryImpl of super::FactoryTrait<ContractState> {
        /// @dev Returns the admin role
        fn get_admin(self: @ContractState) -> ContractAddress {
            self.admin.read()
        }

        /// @dev Returns the admin role
        fn get_proposed_admin(self: @ContractState) -> Option<ContractAddress> {
            self.proposed_admin.read()
        }

        /// @dev Admin role can propose a new admin
        fn changeAdmin(ref self: ContractState, new_admin: ContractAddress) {
            self._is_admin_caller();
            self.proposed_admin.write(Option::Some(new_admin));
        }

        /// @dev Admin role can propose a new admin
        fn acceptAdmin(ref self: ContractState) {
            self._is_proposed_admin_caller();
            let proposed_admin = self.proposed_admin.read();
            self.admin.write(proposed_admin.unwrap());
            self.proposed_admin.write(Option::None(()));
        }

        /// @dev Admin role can change class_hash of anchoring contract
        fn change_class_hash(ref self: ContractState, new_class_hash: ClassHash) {
            self._is_admin_caller();
            self.class_hash.write(new_class_hash);
        }

        /// @dev Deploy an anchoring contract
        fn deploy(ref self: ContractState, whitelisted: ContractAddress) -> ContractAddress {
            self._is_admin_caller();

            // Creating the call data for the deploy syscall
            let mut calldata_array = ArrayTrait::new();
            calldata_array.append(whitelisted.into());

            // Deploying the contract
            let result = deploy_syscall(
                self.class_hash.read(),
                get_block_timestamp().into(),
                // contract_address_salt: felt252, value used in order to calculate the futur contract address,
                // in the futur we need to add some randomness here otherwise we might be able to predict the
                // contract address and deploy a contract with the same address as an existing one.
                calldata_array
                    .span(), // calldata: Span<felt252>, // Should contain whitelisted value
                false,
            );

            // Adding the contract to the whitelist mapping
            let (deployed_addr, _err) = result.unwrap();
            self.all_contracts.write(deployed_addr, whitelisted);

            // Adding the contract to the contracts_by_owner mapping
            let nb_existing_contracts = self.contracts_owner_index.read(whitelisted);
            self.contracts_by_owner.write((whitelisted, nb_existing_contracts), deployed_addr);
            self.contracts_owner_index.write(whitelisted, nb_existing_contracts + 1);

            // Returning the deployed contract address
            deployed_addr
        }

        /// @dev Function that retrieves owner of an anchoring contract
        fn get_anchor_contract_owner(
            self: @ContractState, anchored_contract_address: ContractAddress
        ) -> ContractAddress {
            self.all_contracts.read(anchored_contract_address)
        }

        fn get_owner_contract_index(self: @ContractState, owner: ContractAddress) -> u16 {
            self.contracts_owner_index.read(owner)
        }

        fn get_contract_by_owner_index(
            self: @ContractState, owner: ContractAddress, index: u16
        ) -> ContractAddress {
            self.contracts_by_owner.read((owner, index))
        }
    }

    /// @dev Asserts implementation for the Factory contract
    #[generate_trait]
    impl AssertsImpl of AssertsTrait {
        /// @dev Internal function that checks if caller is the admin role
        fn _is_admin_caller(ref self: ContractState) {
            let admin = self.admin.read();
            assert(get_caller_address() == admin, 'NOT_ADMIN_CALLER');
        }

        /// @dev Internal function that checks if caller is the proposed_admin
        fn _is_proposed_admin_caller(ref self: ContractState) {
            let proposed_admin : Option<ContractAddress> = self.proposed_admin.read();
            assert(proposed_admin.is_some(), 'NO_PROPOSED_ADMIN');
            assert(get_caller_address() == proposed_admin.unwrap(), 'NOT_PROPOSED_ADMIN_CALLER');
        }
    }
}
