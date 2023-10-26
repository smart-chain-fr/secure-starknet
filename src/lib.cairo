mod factory;
mod anchoring;

#[cfg(test)]
mod tests {
    use snforge_std::{ declare, ContractClassTrait, start_prank, stop_prank, PrintTrait };
    use core::traits::PanicDestruct;
    use starknet::ContractAddress;
    use factory_anchor_long::factory::FactoryTraitDispatcherTrait;
    use super::factory;
    use factory_anchor_long::anchoring::AnchorTraitDispatcherTrait;
    use super::anchoring;
    use test::test_utils::assert_eq;
    // use core::option::OptionTrait;
    // use array::ArrayTrait;
    // use traits::Into;
    // use traits::TryInto;

    #[test]
    #[available_gas(1000000)]
    fn success_initial_state() {
        let admin: felt252 = 0x021b328153b45744778795f5c8edd9211da72fca894ef91ea389c479a31f1449;
        let class_hash = 0x2bcad2faa9adef1787dca061d108ab3e0eb4d4916fdc4642517c4102003b21c;

        // Prepare deployment parameters
        let mut calldata_array: Array<felt252> = ArrayTrait::new();
        calldata_array.append(admin);
        calldata_array.append(class_hash);

        // First declare and deploy a contract
        let contract = declare('Factory');
        let contract_address = contract.deploy(@calldata_array).unwrap();
        
        // Create a Dispatcher object that will allow interacting with the deployed contract
        let dispatcher = factory::FactoryTraitDispatcher { contract_address: contract_address };

        let current_admin = dispatcher.get_admin();
        let initial_admin : ContractAddress = admin.try_into().unwrap();
        assert_eq(@current_admin, @initial_admin , 'Wrong_admin');
    }

    #[test]
    #[available_gas(1000000)]
    #[should_panic(expected: ('NOT_ADMIN_CALLER', ))]
    fn failure_change_admin_because_not_admin() {
        let admin: felt252 = 0x021b328153b45744778795f5c8edd9211da72fca894ef91ea389c479a31f1449;
        let class_hash = 0x2bcad2faa9adef1787dca061d108ab3e0eb4d4916fdc4642517c4102003b21c;

        // Prepare deployment parameters
        let mut calldata_array = ArrayTrait::new();
        calldata_array.append(admin);
        calldata_array.append(class_hash);

        // First declare and deploy a contract
        let contract = declare('Factory');
        let contract_address = contract.deploy(@calldata_array).unwrap();
        
        // Create a Dispatcher object that will allow interacting with the deployed contract
        let dispatcher = factory::FactoryTraitDispatcher { contract_address: contract_address };

        let new_admin: felt252 = 0x02ce9c6303529f79e5bfbd09f9cf52421df68a962177977b8a8cc2074b84c097;
        dispatcher.changeAdmin(new_admin.try_into().unwrap())
    }

    #[test]
    #[available_gas(1000000)]
    fn success_change_admin() {
        let admin: felt252 = 0x021b328153b45744778795f5c8edd9211da72fca894ef91ea389c479a31f1449;
        let class_hash = 0x2bcad2faa9adef1787dca061d108ab3e0eb4d4916fdc4642517c4102003b21c;

        // Prepare deployment parameters
        let mut calldata_array: Array<felt252> = ArrayTrait::new();
        calldata_array.append(admin);
        calldata_array.append(class_hash);

        // First declare and deploy a contract
        let contract = declare('Factory');
        let contract_address = contract.deploy(@calldata_array).unwrap();
        
        // Create a Dispatcher object that will allow interacting with the deployed contract
        let dispatcher = factory::FactoryTraitDispatcher { contract_address: contract_address };

        let new_admin: felt252 = 0x02ce9c6303529f79e5bfbd09f9cf52421df68a962177977b8a8cc2074b84c097;
        start_prank(contract_address, admin.try_into().unwrap());
        dispatcher.changeAdmin(new_admin.try_into().unwrap());
        stop_prank(contract_address);

        let proposed_admin_opt = dispatcher.get_proposed_admin();
        assert(proposed_admin_opt.is_some() , 'no_proposed_admin');
        let expected_proposed_admin : ContractAddress = new_admin.try_into().unwrap();
        assert_eq(@proposed_admin_opt.unwrap(), @expected_proposed_admin , 'Wrong_propose_admin');
    }


    #[test]
    #[available_gas(1000000)]
    fn success_change_and_accept_admin() {
        let admin: felt252 = 0x021b328153b45744778795f5c8edd9211da72fca894ef91ea389c479a31f1449;
        let class_hash = 0x2bcad2faa9adef1787dca061d108ab3e0eb4d4916fdc4642517c4102003b21c;

        // Prepare deployment parameters
        let mut calldata_array: Array<felt252> = ArrayTrait::new();
        calldata_array.append(admin);
        calldata_array.append(class_hash);

        // First declare and deploy a contract
        let contract = declare('Factory');
        let contract_address = contract.deploy(@calldata_array).unwrap();
        
        // Create a Dispatcher object that will allow interacting with the deployed contract
        let dispatcher = factory::FactoryTraitDispatcher { contract_address: contract_address };

        let new_admin: felt252 = 0x02ce9c6303529f79e5bfbd09f9cf52421df68a962177977b8a8cc2074b84c097;
        start_prank(contract_address, admin.try_into().unwrap());
        dispatcher.changeAdmin(new_admin.try_into().unwrap());
        stop_prank(contract_address);

        start_prank(contract_address, new_admin.try_into().unwrap());
        dispatcher.acceptAdmin();
        stop_prank(contract_address);

        let current_admin = dispatcher.get_admin();
        let expected_admin : ContractAddress = new_admin.try_into().unwrap();
        assert_eq(@current_admin, @expected_admin , 'Wrong_admin');
    }

    #[test]
    #[available_gas(1000000)]
    #[should_panic(expected: ('NOT_PROPOSED_ADMIN_CALLER', ))]
    fn failure_accept_admin_because_not_proposed_admin() {
        let admin: felt252 = 0x021b328153b45744778795f5c8edd9211da72fca894ef91ea389c479a31f1449;
        let class_hash = 0x2bcad2faa9adef1787dca061d108ab3e0eb4d4916fdc4642517c4102003b21c;

        // Prepare deployment parameters
        let mut calldata_array: Array<felt252> = ArrayTrait::new();
        calldata_array.append(admin);
        calldata_array.append(class_hash);

        // First declare and deploy a contract
        let contract = declare('Factory');
        let contract_address = contract.deploy(@calldata_array).unwrap();
        
        // Create a Dispatcher object that will allow interacting with the deployed contract
        let dispatcher = factory::FactoryTraitDispatcher { contract_address: contract_address };

        let new_admin: felt252 = 0x02ce9c6303529f79e5bfbd09f9cf52421df68a962177977b8a8cc2074b84c097;
        start_prank(contract_address, admin.try_into().unwrap());
        dispatcher.changeAdmin(new_admin.try_into().unwrap());

        dispatcher.acceptAdmin();
        stop_prank(contract_address);
    }

    #[test]
    #[available_gas(1000000)]
    fn success_deploy() {
        let admin: felt252 = 0x021b328153b45744778795f5c8edd9211da72fca894ef91ea389c479a31f1449;
        // let class_hash = 0x2bcad2faa9adef1787dca061d108ab3e0eb4d4916fdc4642517c4102003b21c;
        let anchoring_contract_class = declare('Anchoring');
        
        // Prepare deployment parameters
        let mut calldata_array: Array<felt252> = ArrayTrait::new();
        calldata_array.append(admin);
        calldata_array.append(anchoring_contract_class.class_hash.into());

        // First declare and deploy a contract

        let factory_contract = declare('Factory');
        let factory_contract_address = factory_contract.deploy(@calldata_array).unwrap();
        
        // Create a Dispatcher object that will allow interacting with the deployed contract
        let factory_dispatcher = factory::FactoryTraitDispatcher { contract_address: factory_contract_address };

        let new_admin: felt252 = 0x02ce9c6303529f79e5bfbd09f9cf52421df68a962177977b8a8cc2074b84c097;
        start_prank(factory_contract_address, admin.try_into().unwrap());
        factory_dispatcher.deploy(new_admin.try_into().unwrap());
        stop_prank(factory_contract_address);

        let index = factory_dispatcher.get_owner_contract_index(new_admin.try_into().unwrap());
        assert_eq(@index, @1, 'Wrong_number_of_contracts');

        let last_deployed_anchor = factory_dispatcher.get_contract_by_owner_index(new_admin.try_into().unwrap(), index - 1);
        let anchor_address : felt252 = last_deployed_anchor.into();
        // anchor_address.print();
        
    }


    #[test]
    #[available_gas(10000000)]
    fn anchoring_authorize_success() {
        let admin: felt252 = 0x021b328153b45744778795f5c8edd9211da72fca894ef91ea389c479a31f1449;
        // declare contracts
        let anchoring_contract_class = declare('Anchoring');
        let factory_contract_class = declare('Factory');
        
        // Deploy Factory instance
        let mut calldata_array: Array<felt252> = ArrayTrait::new();
        calldata_array.append(admin);
        calldata_array.append(anchoring_contract_class.class_hash.into());
        let factory_contract_address = factory_contract_class.deploy(@calldata_array).unwrap();
        let factory_dispatcher = factory::FactoryTraitDispatcher { contract_address: factory_contract_address };

        // Deploy Anchoring instance
        let anchor_admin: felt252 = 0x02ce9c6303529f79e5bfbd09f9cf52421df68a962177977b8a8cc2074b84c097;
        start_prank(factory_contract_address, admin.try_into().unwrap());
        factory_dispatcher.deploy(anchor_admin.try_into().unwrap());
        stop_prank(factory_contract_address);

        // Retrieve Anchoring dispatcher
        let index = factory_dispatcher.get_owner_contract_index(anchor_admin.try_into().unwrap());
        assert_eq(@index, @1, 'Wrong_number_of_contracts');
        let anchor_address = factory_dispatcher.get_contract_by_owner_index(anchor_admin.try_into().unwrap(), index - 1);
        let anchor_dispatcher = anchoring::AnchorTraitDispatcher { contract_address: anchor_address };

        // Authorize another address
        start_prank(anchor_address, anchor_admin.try_into().unwrap());
        let last_anchor = anchor_dispatcher.authorize(admin.try_into().unwrap());
        stop_prank(anchor_address);
    }

    #[test]
    #[available_gas(10000000)]
    fn anchoring_unauthorize_success() {
        let admin: felt252 = 0x021b328153b45744778795f5c8edd9211da72fca894ef91ea389c479a31f1449;
        // declare contracts
        let anchoring_contract_class = declare('Anchoring');
        let factory_contract_class = declare('Factory');
        
        // Deploy Factory instance
        let mut calldata_array: Array<felt252> = ArrayTrait::new();
        calldata_array.append(admin);
        calldata_array.append(anchoring_contract_class.class_hash.into());
        let factory_contract_address = factory_contract_class.deploy(@calldata_array).unwrap();
        let factory_dispatcher = factory::FactoryTraitDispatcher { contract_address: factory_contract_address };

        // Deploy Anchoring instance
        let anchor_admin: felt252 = 0x02ce9c6303529f79e5bfbd09f9cf52421df68a962177977b8a8cc2074b84c097;
        start_prank(factory_contract_address, admin.try_into().unwrap());
        factory_dispatcher.deploy(anchor_admin.try_into().unwrap());
        stop_prank(factory_contract_address);

        // Retrieve Anchoring dispatcher
        let index = factory_dispatcher.get_owner_contract_index(anchor_admin.try_into().unwrap());
        assert_eq(@index, @1, 'Wrong_number_of_contracts');
        let anchor_address = factory_dispatcher.get_contract_by_owner_index(anchor_admin.try_into().unwrap(), index - 1);
        let anchor_dispatcher = anchoring::AnchorTraitDispatcher { contract_address: anchor_address };

        // Authorize another address
        start_prank(anchor_address, anchor_admin.try_into().unwrap());
        let last_anchor = anchor_dispatcher.unauthorize(anchor_admin.try_into().unwrap());
        stop_prank(anchor_address);
    }

    #[test]
    #[available_gas(10000000)]
    #[should_panic(expected: ('NOT_ADMIN_CALLER', ))]
    fn anchoring_unauthorize_failure_because_not_admin() {
        let admin: felt252 = 0x021b328153b45744778795f5c8edd9211da72fca894ef91ea389c479a31f1449;
        // declare contracts
        let anchoring_contract_class = declare('Anchoring');
        let factory_contract_class = declare('Factory');
        
        // Deploy Factory instance
        let mut calldata_array: Array<felt252> = ArrayTrait::new();
        calldata_array.append(admin);
        calldata_array.append(anchoring_contract_class.class_hash.into());
        let factory_contract_address = factory_contract_class.deploy(@calldata_array).unwrap();
        let factory_dispatcher = factory::FactoryTraitDispatcher { contract_address: factory_contract_address };

        // Deploy Anchoring instance
        let anchor_admin: felt252 = 0x02ce9c6303529f79e5bfbd09f9cf52421df68a962177977b8a8cc2074b84c097;
        start_prank(factory_contract_address, admin.try_into().unwrap());
        factory_dispatcher.deploy(anchor_admin.try_into().unwrap());
        stop_prank(factory_contract_address);

        // Retrieve Anchoring dispatcher
        let index = factory_dispatcher.get_owner_contract_index(anchor_admin.try_into().unwrap());
        assert_eq(@index, @1, 'Wrong_number_of_contracts');
        let anchor_address = factory_dispatcher.get_contract_by_owner_index(anchor_admin.try_into().unwrap(), index - 1);
        let anchor_dispatcher = anchoring::AnchorTraitDispatcher { contract_address: anchor_address };

        // Unauthorize an address with caller not admin
        let last_anchor = anchor_dispatcher.unauthorize(anchor_admin.try_into().unwrap());
    }

    #[test]
    #[available_gas(20000000)]
    fn anchoring_anchor_success() {
        let admin: felt252 = 0x021b328153b45744778795f5c8edd9211da72fca894ef91ea389c479a31f1449;
        // declare contracts
        let anchoring_contract_class = declare('Anchoring');
        let factory_contract_class = declare('Factory');
        
        // Deploy Factory instance
        let mut calldata_array: Array<felt252> = ArrayTrait::new();
        calldata_array.append(admin);
        calldata_array.append(anchoring_contract_class.class_hash.into());
        let factory_contract_address = factory_contract_class.deploy(@calldata_array).unwrap();
        let factory_dispatcher = factory::FactoryTraitDispatcher { contract_address: factory_contract_address };

        // Deploy Anchoring instance
        let anchor_admin: felt252 = 0x02ce9c6303529f79e5bfbd09f9cf52421df68a962177977b8a8cc2074b84c097;
        start_prank(factory_contract_address, admin.try_into().unwrap());
        factory_dispatcher.deploy(anchor_admin.try_into().unwrap());
        stop_prank(factory_contract_address);

        // Retrieve Anchoring dispatcher
        let index = factory_dispatcher.get_owner_contract_index(anchor_admin.try_into().unwrap());
        assert_eq(@index, @1, 'Wrong_number_of_contracts');
        let anchor_address = factory_dispatcher.get_contract_by_owner_index(anchor_admin.try_into().unwrap(), index - 1);
        let anchor_dispatcher = anchoring::AnchorTraitDispatcher { contract_address: anchor_address };

        // Anchor a test message
        let all_anchors_before = anchor_dispatcher.get_anchored_values();
        assert_eq(@all_anchors_before.len(), @0, 'Wrong_number_of_anchors');

        start_prank(anchor_address, anchor_admin.try_into().unwrap());
        let message_part_1 : felt252 = 'test_part_1';
        let message_part_2 : felt252 = 'test_part_2';
        anchor_dispatcher.anchor(message_part_1, message_part_2);
        stop_prank(anchor_address);

        let all_anchors_after = anchor_dispatcher.get_anchored_values();
        assert_eq(@all_anchors_after.len(), @1, 'Wrong_number_of_anchors');
        
        // Print timestamp of the test message
        // let message_test : felt252 = 'test';
        // let message_timestamp = anchor_dispatcher.get_anchored_timestamp(message_test);
        // assert(message_timestamp > 0_u64, 'Wrong_timestamp');
        
        let all_timestamps = anchor_dispatcher.get_anchored_timestamps();
        assert(all_timestamps.len() >= 1_u32, 'Wrong_number_of_timestamps'); 
    }

    #[test]
    #[available_gas(20000000)]
    #[should_panic(expected: ('NOT_WHITELISTED', ))]
    fn anchoring_anchor_failure_because_not_whitelisted() {
        let admin: felt252 = 0x021b328153b45744778795f5c8edd9211da72fca894ef91ea389c479a31f1449;
        // declare contracts
        let anchoring_contract_class = declare('Anchoring');
        let factory_contract_class = declare('Factory');
        
        // Deploy Factory instance
        let mut calldata_array: Array<felt252> = ArrayTrait::new();
        calldata_array.append(admin);
        calldata_array.append(anchoring_contract_class.class_hash.into());
        let factory_contract_address = factory_contract_class.deploy(@calldata_array).unwrap();
        let factory_dispatcher = factory::FactoryTraitDispatcher { contract_address: factory_contract_address };

        // Deploy Anchoring instance
        let anchor_admin: felt252 = 0x02ce9c6303529f79e5bfbd09f9cf52421df68a962177977b8a8cc2074b84c097;
        start_prank(factory_contract_address, admin.try_into().unwrap());
        factory_dispatcher.deploy(anchor_admin.try_into().unwrap());
        stop_prank(factory_contract_address);

        // Retrieve Anchoring dispatcher
        let index = factory_dispatcher.get_owner_contract_index(anchor_admin.try_into().unwrap());
        assert_eq(@index, @1, 'Wrong_number_of_contracts');
        let anchor_address = factory_dispatcher.get_contract_by_owner_index(anchor_admin.try_into().unwrap(), index - 1);
        let anchor_dispatcher = anchoring::AnchorTraitDispatcher { contract_address: anchor_address };
        
        // Anchor a test message with caller not whitelisted
        let message : felt252 = 'test';
        let message2 : felt252 = 'test2';
        anchor_dispatcher.anchor(message, message2);
    }

}
