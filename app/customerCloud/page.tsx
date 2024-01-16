"use client"
import React, { useState, useEffect, ReactNode } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import MenuPage from "../components/MenuPage";
import BlockContens from "./BlockContens";
import Navbar from "../components/Navbar";
import FloatBtn from "../components/UI/btn/FloatBtn";
import "@/app/customerCloud/page.css"
import "@/app/components/menuPage.css";
import "@/app/components/Table/table.css";

const HomeCloudPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedComponent, setSelectedComponent] = useState<React.Key | null>("1");
  const [employee, setEmployee] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleMenuClick = (key: React.Key) => {

    // ให้เปลี่ยน state เมื่อมีการคลิกที่เมนู
    if (key === "13") signOut({ callbackUrl: "/auth" });
    setSelectedComponent(key);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = session?.user.accessToken;
      if (token && !employee) {
        if (status === "unauthenticated") {
          return router.push("/auth", { scroll: false });
        }
        setEmployee(true);
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/employee`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });

          if (!response.data) {
            return router.push("/auth", { scroll: false });
          }

          router.push("/customerCloud", { scroll: false });
        } catch (error) {
          console.error("Error making API request:", error);

          // Handle different error scenarios more explicitly
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.log("Employee not found.");
          } else {
            console.error("An unexpected error occurred.");
          }

          return router.push("/auth", { scroll: false });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [session, employee]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center mx-0">
        <div role="status">
          <svg aria-hidden="true" className="w-12 h-12 mr-2 text-gray-200 animate-spin fill-orange-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
          <span className="sr-only mt-80">Loading...</span>
        </div>
        <div className="px-5 py-3 text-xl font-medium leading-none text-center text-orange-800 bg-orange-200 rounded-full animate-pulse">Loading...</div>
      </div>
    );
  }


  return (
    <>
      <Navbar />
      <main>
        <div className="flex mt-14 bg-slate-50">
          <MenuPage onMenuClick={handleMenuClick} />
          <div className="w-full min-w-[400px] bg-slate-50">
            {selectedComponent ? (
              // แสดง component ที่ถูกเลือก
              <BlockContens idComponents={selectedComponent} />

            ) : null}
          </div>
        </div>
        <FloatBtn />
      </main>
    </>
  );
};

export default HomeCloudPage;
