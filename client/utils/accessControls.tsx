const chain = "hyperspace"

// user at least 0 ETH
const zeroETHaccessControlCondition = [
    {
        contractAddress: "",
        standardContractType: "",
        chain,
        method: "eth_getBalance",
        parameters: [":userAddress", "latest"],
        returnValueTest: {
          comparator: ">=",
          value: "0",
        },
    },
]

// user at least 0.1 ETH
const tenthETHaccessControlCondition = [
    {
        contractAddress: "",
        standardContractType: "",
        chain,
        method: "eth_getBalance",
        parameters: [":userAddress", "latest"],
        returnValueTest: {
            comparator: ">=",
            value: "100000000000000000",
        },
    },
]

export const accessControls = {
    zeroETHaccessControlCondition,
    tenthETHaccessControlCondition,
}