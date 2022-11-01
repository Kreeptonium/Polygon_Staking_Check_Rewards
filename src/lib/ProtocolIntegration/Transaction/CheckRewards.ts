import Web3 from 'web3';
import dotenv from 'dotenv';
import {config} from "../../../settings";
import { funcGetValidatorContractAddress } from './getValidators';
import BN from 'bignumber.js';
import { ICheckRewardsOptions, ICheckRewardsRetValues } from '../Model/RewardResults';
dotenv.config();
//let encoded_tx;

export const checkRewards = async (params:ICheckRewardsOptions): Promise<Array<ICheckRewardsRetValues>> => {

    const web3 = new Web3(new Web3.providers.HttpProvider(config.MumbaiTestnet.providerURL));
    const buyDelegateABI = require('../../abi/validatorShareContract.json');
    
    try {

        //Call Validators Array
       const validatorArrayObj = await funcGetValidatorContractAddress();
       let rewardBalanceInfo:Array<ICheckRewardsRetValues>=new Array<ICheckRewardsRetValues>();

       for (const valObj of validatorArrayObj) {
        // Get contract instance
       const validatorShareContract = new web3.eth.Contract(buyDelegateABI, valObj.contractAddress);
       //Capturing the receipt for "Encoded ABI"
       try {

        let rewardBalance :number= await validatorShareContract.methods.getLiquidRewards(params.stakedAddress).call();
        rewardBalanceInfo.push({
            rewardBalance:new BN(rewardBalance).toFixed(),
            validatorContract:valObj.contractAddress,
            validatorName:valObj.validatorName
        })
       } catch (error) {
       }
    }
        return rewardBalanceInfo;
}
    catch (error) {
        throw (error);
    }
};
checkRewards({stakedAddress:'0x3Fd294009eEff2636e05f1A6c956d9df7e340287'}).then((result)=>(console.log("Result:",result)))