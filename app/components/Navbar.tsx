"use client";
import { useState, useEffect } from "react";
// Next.js Imports
import Image from "next/image";
// Images and Icons
import logo from "@/public/images/moonlamplogo.png";

import { AiOutlineShoppingCart } from "react-icons/ai";
import { Badge } from "antd";
import { fetchCustomerFrontData } from "@/types/fetchData";
import ModalCart from "./UI/modal/ModalCart";
import { useAppSelector } from "../store/store";
import { useSession } from "next-auth/react";

interface Props {
  orderDetail?: fetchCustomerFrontData;
}

const Navbar = ({ orderDetail }: Props) => {
  
  const { data: session } = useSession();
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [openCart, setOpenCart] = useState<boolean>(false);
  const { itemCart } = useAppSelector((state) => state?.cartSlice);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0 && !isScrolling) {
        setIsScrolling(true);
      } else if (window.scrollY === 0 && isScrolling) {
        setIsScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolling]);

  return (
    <nav className={`py-4 w-full fixed top-0 bg-white shadow-lg z-50`}>
      <div className="w-[95%] m-auto flex justify-between items-center">

        <a href="/">
          <Image src={logo} width={150} priority alt="logo" />
        </a>

        <div className="flex gap-4 items-center text-dark ml-auto md:ml-0">
          {orderDetail ?
            <>
              <div className="cursor-pointer relative" aria-label="Shopping Cart" onClick={() => setOpenCart(true)}>
                <Badge count={itemCart.length} size="small">
                  <AiOutlineShoppingCart size={20} />
                </Badge>
              </div>
              <ModalCart openCart={openCart} setOpenCart={setOpenCart} orderDetail={orderDetail}/>
            </>
          : 
          <div>
            <p>{session?.user.branch_name} ({session?.user.name} {session?.user.sub_name})</p>
          </div>
          }
        </div>
      </div>


    </nav>
  );
};

export default Navbar;