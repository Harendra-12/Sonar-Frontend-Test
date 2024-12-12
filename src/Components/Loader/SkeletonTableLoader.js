import React from 'react'

function SkeletonTableLoader({ col, row }) {
    return (
        <>
            {Array.from({ length: row }, (_, index) => (
                <tr>
                    {Array.from({ length: col }).map((_, i) => (
                        <td key={i}>
                            <div className='skeleton skeleton-text'></div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    )
}

export default SkeletonTableLoader