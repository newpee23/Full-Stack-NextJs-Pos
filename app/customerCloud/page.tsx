"use client"
import React, { useState, useEffect, ReactNode } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import MenuPage from "../components/MenuPage";
import HomePage from "./pages/HomePage";


const HomeCloudPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [selectedComponent, setSelectedComponent] = useState<ReactNode | null>(null);
  const [employee, setEmployee] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleMenuClick = (key: React.Key) => {
    // ให้เปลี่ยน state เมื่อมีการคลิกที่เมนู
    switch (key) {
      case "1":
        setSelectedComponent(<HomePage />);
        break;
      case "13":
        signOut({ callbackUrl: "/auth" })
        break;

      // เพิ่ม case ตามต้องการ
      default:
        setSelectedComponent(null);
    }

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
    return <div>Loading...</div>;
  }

  return (
    <>
    
    <section>
      <div className="flex">
        <MenuPage onMenuClick={handleMenuClick} />
        <div className="w-full">
          {selectedComponent ? (
            // แสดง component ที่ถูกเลือก
            selectedComponent
          ) : (
            // หรือแสดงเนื้อหาหรือคอมโพเนนต์อื่น ๆ ที่คุณต้องการ
            <button>Logout</button>
          )}
        </div>
      </div>
      {/* <div>
      <button onClick={() => signOut({ callbackUrl: "/auth" })}>Logout</button>
    </div> */}
    </section>
    </>
  );
};

export default HomeCloudPage;
