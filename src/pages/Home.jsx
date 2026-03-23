import Navbar from '@/components/Home/Navbar';
import NewDocuments from '@/components/Home/NewDocuments';
import RecentDocuments from '@/components/Home/RecentDocuments';
import AllDocuments from '@/components/Home/AllDocuments';
import { useAuth } from '@/hooks/useAuth'; // adjust to however you expose the user

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        <NewDocuments user={user} />
        <RecentDocuments user={user} />
        <AllDocuments user={user} />
      </main>
    </div>
  );
}
