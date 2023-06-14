const chain = "hyperspace"

// user at least 0 ETH
export const zeroETHaccessControlCondition = [
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
export const tenthETHaccessControlCondition = [
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