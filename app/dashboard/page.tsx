'use client';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-white">
      <h1 className="text-4xl font-bold mb-6">
        Creator Dashboard
      </h1>

      <p className="text-gray-300 text-lg max-w-xl text-center mb-10">
        Welcome to your Bumper Karma dashboard — your space to manage products,
        track sales, and keep your empire without apology.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 w-full max-w-md">

        <button className="bg-gray-800 p-4 rounded-lg border border-white/20 hover:bg-gray-700"
onClick={() => router.push('/dashboard/upload')}>
  Upload New Product
</button>



        <button className="bg-gray-800 p-4 rounded-lg border border-white/20 hover:bg-gray-700"
onClick={() => router.push('/dashboard/listings')}>
  Your Listings
</button>


        <button className="bg-gray-800 p-4 rounded-lg border border-white/20 hover:bg-gray-700"
onClick={() => router.push('/dashboard/sales')}>
  Your Sales
</button>


       <button className="bg-gray-800 p-4 rounded-lg border border-white/20 hover:bg-gray-700"
onClick={() => router.push('/dashboard/account')}>
  Account Settings
</button>


      </div>
    </main>
  );
}
