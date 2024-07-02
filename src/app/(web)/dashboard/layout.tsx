'use client'
import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import NavBar from '../components/nav/nav';
import './layout.scss';
export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {

  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <div className="app-header">
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />
          <div className='logo'>Logo</div>
          </div>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <NavBar />
        </AppShell.Navbar>

        <AppShell.Main>
          <div className='childrenCOMP'>{children}</div>
        </AppShell.Main>
      </AppShell>
    </>
  )
}