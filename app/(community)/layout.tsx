import MobileNav from '@/components/mobileNavigation';
import FeedbackSheet from '@/components/ui/feedback';
import Nav from '@/components/ui/nav';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Nav />
        <main className='min-h-screen mx-4 flex flex-col flex-1 gap-4  md:gap-8 md:p-8'>
          {children}
          <FeedbackSheet />
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
