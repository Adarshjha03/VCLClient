import React from "react";
import { classnames } from "../utils/general";

const CustomInput = ({ customInput, setCustomInput }) => {
    return (
        <>
            {" "}
            <textarea
                rows="5"

                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={`Custom input`}
                className={classnames(
                    "focus:outline-none w-full border-2 border-black z-10 rounded-md  px-4 py-2 bg-[#1e293b] shadow-lg rounded-md text-white font-normal text-sm mt-2"
                )}
            ></textarea>
        </>
    );
};

export default CustomInput;