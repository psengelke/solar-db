interface IconProps {
    name: string;
}

export default function Icon(props: IconProps) {
    const {name} = props;
    return (<span className="material-symbols-rounded">{name}</span>);
};
