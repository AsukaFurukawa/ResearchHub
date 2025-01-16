// // src/components/layout/Layout.jsx
// import React from 'react';
// import Sidebar from './Sidebar';
// import TopNav from './TopNav';

// export default function Layout({ children }) {
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main content (includes top nav + whatever the page content is) */}
//       <div className="flex flex-col flex-1">
//         <TopNav />
//         <main className="p-4">{children}</main>
//       </div>
//     </div>
//   );
// }
// src/components/layout/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gh text-[var(--gh-text)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content (includes top nav + page content) */}
      <div className="flex flex-col flex-1">
        <TopNav />
        <main className="p-4 bg-gh text-[var(--gh-text)]">
          {children}
        </main>
      </div>
    </div>
  );
}

