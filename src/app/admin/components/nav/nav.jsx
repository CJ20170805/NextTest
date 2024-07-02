
'use client'

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'
import { Badge, NavLink } from '@mantine/core';
import { IconHome2, IconGauge, IconChevronRight, IconActivity, IconCircleOff } from '@tabler/icons-react';

const Nav = () => {
    const [active, setActive] = useState(0);
    const pathname = usePathname();

    //base on the current  path to active which link should be actived
    useEffect(() => {
        if (pathname === '/admin/dashboard/home') {
            setActive(0);
        } else if (pathname === '/admin/dashboard/article') {
            setActive(1);
        } else {
            setActive(10);
        }
    }, [pathname])

    

    return (
        <>
            <NavLink
                href="/admin/dashboard/home"
                label="Home"
                active={0 === active}
                onClick={() => setActive(0)}
                leftSection={<IconHome2 size="1rem" stroke={1.5} />}
            />
            <NavLink
                href="/admin/dashboard/article"
                label="Article"
                active={1 === active}
                onClick={() => setActive(1)}
                leftSection={<IconActivity size="1rem" stroke={1.5} />}
            />
            <NavLink
                href="#required-for-focus"
                label="With right section"
                active={10 === active}
                onClick={() => setActive(1)}
                leftSection={<IconGauge size="1rem" stroke={1.5} />}
                rightSection={
                    <IconChevronRight size="0.8rem" stroke={1.5} className="mantine-rotate-rtl" />
                }
            >
                <NavLink label="First child link" href="#required-for-focus" />
                <NavLink label="Second child link" href="#required-for-focus" />
                <NavLink label="Third child link" href="#required-for-focus" />
            </NavLink>
    

        </>
    )
}

export default Nav;