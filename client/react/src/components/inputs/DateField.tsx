import {DateTime} from "luxon";
import {useEffect, useState} from "react";
import InputBase from "@/components/inputs/InputBase.tsx";
import classNames from "classnames";
import InputLabel from "@/components/inputs/InputLabel.tsx";
import IconButton from "@/components/buttons/IconButton.tsx";
import Icon from "@/components/Icon.tsx";

interface DateFieldProps {
    label?: string;
    placeholder?: string;
    value: DateTime | null | undefined;
    onChange: (date: DateTime | null) => void;
}

export default function DateField(props: DateFieldProps) {

    const initStringVal = props.value?.toFormat("yyyy-MM-dd");
    const [stringVal, setStringVal] = useState(initStringVal);
    useEffect(() => void setStringVal(initStringVal), [initStringVal]);

    const [focused, setFocused] = useState(false);

    return (

        <InputBase focused={focused}>

            <input

                className={classNames({
                    "bg-transparent focus:outline-none w-full text-base ml-1": true,
                    "transition-colors duration-200": true,
                    "placeholder:text-transparent": !focused,
                })}

                placeholder={props.placeholder}
                value={stringVal}
                onChange={e => {

                    const v = e.target.value;
                    setStringVal(v);

                    const dv = v ? DateTime.fromFormat(v, "yyyy-MM-dd") : null;
                    if (dv == null || dv.isValid) props.onChange(dv);

                }}

                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}

            />

            <InputLabel shrink={focused || !!stringVal}>
                {props.label}
            </InputLabel>

            <IconButton
                icon={<Icon name={"event"}/>}
                onClick={() => {
                    // todo show picker
                }}/>

        </InputBase>

    );
}
