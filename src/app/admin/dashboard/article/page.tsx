'use client'
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState, useCallback } from 'react';
import { Table, Checkbox, Modal, Button, Text, Flex, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import './article.scss';

interface RowData {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

let elements = [
];

function Article() {

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            content: '',
            published: false,
        },
    });

    const [opened, { open, close }] = useDisclosure(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    let [action, setAction] = useState<'edit' | 'delete'>('edit');
    let [id, setId] = useState('');
    let [rows, setRows] = useState<React.ReactNode[]>([]);

    async function postHandler(id: string, action: 'edit' | 'delete') {
        setId(id);
        setAction(action);
        open();
        if (action === 'edit') {
            fetch(`/api/post?id=${id}`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Edit', data);
                    form.setValues(data.post);
                })
                .catch(error => console.error(error));
        }
    }

    function confirmHandler() {
        console.log('Parameters', id, action);

        if (action === 'delete') {
            fetch(`/api/post?id=${id}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    getList();
                    close();
                })
                .catch(error => console.error(error));
        } else if (action === 'edit') {
            fetch(`/api/post`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form.getValues()),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    getList();
                    close();
                })
                .catch(error => console.error(error));
        }
    }


    async function getList() {
        let res = await fetch('/api/post');
        let data = await res.json();
        elements = data.posts;

        const rowsData = elements.map((element: any) => (
            <Table.Tr
                key={element.id}
                bg={selectedRows.includes(element.id) ? 'var(--mantine-color-blue-light)' : undefined}
            >
                <Table.Td>
                    <Checkbox
                        aria-label="Select row"
                        checked={selectedRows.includes(element.id)}
                        onChange={(event) =>
                            setSelectedRows(
                                event.currentTarget.checked
                                    ? [...selectedRows, element.id]
                                    : selectedRows.filter((id) => id !== element.id)
                            )
                        }
                    />
                </Table.Td>
                <Table.Td>{element.id}</Table.Td>
                <Table.Td>{element.title}</Table.Td>
                <Table.Td>{element.content}</Table.Td>
                <Table.Td>{element.createdAt}</Table.Td>

                <Table.Td>
                    <Button variant="filled" size="xs" onClick={() => postHandler(element.id, 'edit')}>Edit</Button>
                    <Button variant="filled" classNames={{
                        root: 'my-root-class',
                    }} color="red" size="xs" onClick={() => postHandler(element.id, 'delete')}>Delete</Button>
                </Table.Td>

            </Table.Tr>
        ));

        setRows(rowsData);
        console.log('h222333', rowsData);

    }

    const memoizedGetList = useCallback(() => {
        getList();
      }, []);

    useEffect(() => {
        getList();
    }, [memoizedGetList])


    return (
        <>
            {/* Modal content */}
            <Modal
                opened={opened}
                onClose={close}
                title=""
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                centered
            >
                {action === 'delete' && <Text>Are you sure you want to delete this item?</Text>}
                {action === 'edit' && <Text>Edit</Text>}
                <div className="edit-form">
                    <form onSubmit={form.onSubmit((values) => console.log(values))}>
                        <TextInput
                            withAsterisk
                            label="Title"
                            placeholder="title"
                            key={form.key('title')}
                            {...form.getInputProps('title')}
                        />
                        <Textarea
                            placeholder="Content"
                            label="Content"
                            autosize
                            minRows={2}
                            key={form.key('content')}
                            {...form.getInputProps('content')}
                        />
                        <Checkbox
                            mt="md"
                            label="publish?"
                            key={form.key('published')}
                            {...form.getInputProps('published', { type: 'checkbox' })}
                        />
                    </form>

                </div>
                <Flex
                    mih={50}
                    gap="md"
                    justify="flex-end"
                    align="center"
                    direction="row"
                    wrap="wrap"
                >
                    <Button variant="filled" size="xs" onClick={confirmHandler}>Confirm</Button>
                </Flex>
            </Modal>

            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th />
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Title</Table.Th>
                        <Table.Th>Content</Table.Th>
                        <Table.Th>Date</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </>
    );
}

export default Article;