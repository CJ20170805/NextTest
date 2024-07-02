'use client'
import { IconX, IconCheck } from '@tabler/icons-react';
import { Notification, rem } from '@mantine/core';
import './Notification.scss'
import { useState } from 'react';

export default function NotificationComponent({type }: { type: string }) {
    const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
    const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

    let [show, setShow] = useState(true);

    return (
        <>
            {show && <div className='notification-layer'>
                <Notification
                    icon={type == 'success' ? checkIcon : xIcon}
                    color={type == 'success' ? 'green' : 'red'}
                    title={type == 'success' ? 'Success' : 'Error'}
                    onClose={() => setShow(false)}
                    mt="md">
                    {type == 'success' ? 'Success!' : 'Error!'}
                </Notification>
            </div>}
        </>
    );
}