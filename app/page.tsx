"use client"
import { useRouter } from 'next/navigation'; 
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const customerCloud = async () => {
      router.push('/customerCloud', { scroll: false });
    };

   return () => { customerCloud();}
  }, []);

  return (
   <></>
  );
}
