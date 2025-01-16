import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Modal from '@/components/common/Modal';

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        location: '',
        start_date: '',
        end_date: '',
    });

    // Fetch events from the API
    const fetchEvents = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/events', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const data = await res.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Handle event creation
    const createEvent = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newEvent),
            });

            if (res.ok) {
                alert('Event created successfully!');
                setModalOpen(false);
                fetchEvents();
            } else {
                alert('Failed to create event.');
            }
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--gh-text)]">Upcoming Events</h2>
                <button
                    onClick={() => setModalOpen(true)}
                    className="btn-accent px-4 py-2 rounded"
                >
                    Add Event
                </button>
            </div>
            <div className="space-y-4">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div
                            key={event.id}
                            className="
                                bg-gh-subtle
                                border border-gh
                                rounded
                                p-4
                                shadow-sm
                                hover:shadow-md
                                transition-shadow
                                duration-300
                            "
                        >
                            <h3 className="text-lg font-semibold text-[var(--gh-text)]">
                                {event.title}
                            </h3>
                            <p className="text-muted">
                                <strong>Location:</strong> {event.location}
                            </p>
                            <p className="text-muted">
                                <strong>Date:</strong> {event.start_date} to {event.end_date}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No upcoming events.</p>
                )}
            </div>
            {isModalOpen && (
                <Modal
                    title="Create New Event"
                    onClose={() => setModalOpen(false)}
                    onSave={createEvent}
                >
                    <input
                        type="text"
                        placeholder="Event Title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="date"
                        placeholder="Start Date"
                        value={newEvent.start_date}
                        onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="date"
                        placeholder="End Date"
                        value={newEvent.end_date}
                        onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                        className="w-full mb-2 p-2 border rounded"
                    />
                </Modal>
            )}
        </Layout>
    );
}
