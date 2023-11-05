"use client"
import { signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Home() {
  const [username, setUsername] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456789");
  const [date, setDate] = useState(new Date());
  const { data: session, update } = useSession();

  async function updateSession() {


    await update({
      ...session,
      user: {
        ...session?.user,
        name: "john",
      },
    });
  }

  const handleSubmit = async () => {
    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <button onClick={handleSubmit}>login</button>
        <button onClick={() => signOut({callbackUrl:"/"})}>logout</button>
      </div>
      {session&&(
      <div>
        {session.user?.name}
        <br/>
        {session.expires}
        <br/>
        <p className='w-[200px]'>{session.user.accessToken}</p>
      </div>
    )}
      <div className="flex flex-wrap gap-5">
      <button
        className="border bg-violet-600 text-white rounded px-4 py-2"
        onClick={updateSession}
      >
        Update Session
      </button>
      <button
        className="border bg-violet-600 text-white rounded px-4 py-2"
        onClick={() => console.log({ session })}
      >
        Log Session
      </button>
    </div>
    
    </main>
  );
}
