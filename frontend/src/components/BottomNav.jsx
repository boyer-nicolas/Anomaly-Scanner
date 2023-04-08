import React from "react"
import
{
    BiHome,
    BiScan
} from "react-icons/bi";
import { Link } from "react-router-dom"

export default function BottomNav()
{
    return (
        <>
            <div className="btm-nav lg:hidden">
                <Link to='/'>
                    <BiHome size={24} />
                </Link>
                <Link to='/scan'>
                    <BiScan size={24} />
                </Link>
            </div>
        </>
    )
}