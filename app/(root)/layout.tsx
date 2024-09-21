import StreamVideoProvider from '@/providers/StreamClientProvider'
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "ConfersApp",
  description: "Virtual Conferencing App",
  icons: {
    icon: '/icons/confers-logo-icon.png'
  }
};

const RootLayout = ({ children }: { children : ReactNode }) => {
  return (
    <main>
      <StreamVideoProvider>
        
        {children}

      </StreamVideoProvider>

    </main>
  )
}

export default RootLayout