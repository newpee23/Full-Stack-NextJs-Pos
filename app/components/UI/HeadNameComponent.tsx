type Props = {
    name: string
}

const HeadNameComponent = ({ name }: Props) => {
    return (
        <div className="text-center text-orange-600 mt-3">
            <p className="text-lg font-medium">{name}</p>
        </div>
    )
}

export default HeadNameComponent