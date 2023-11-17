import React from 'react'


type Props = {}

function HeadTitle({ }: Props) {
    return (
        <div className={`p-4 w-full top-0 bg-white shadow-md rounded-lg flex justify-between`}>
            <div className="flex items-center text-orange-600 drop-shadow-md">
                Home
            </div>
        </div>
    )
}

export default HeadTitle