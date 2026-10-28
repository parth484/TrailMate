import React, { useEffect, useState } from 'react';
import { useTrips } from '../context/TripContext';
import TripCard from '../components/trips/TripCard';
import TripFormModal from '../components/trips/TripFormModal';
import TripFilter from '../components/trips/TripFilter';
import { Plus, Compass } from 'lucide-react';

const Trips = () => {
  const { trips, fetchTrips, createTrip, updateTrip, deleteTrip } = useTrips();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleOpenCreate = () => {
    setEditingTrip(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trip) => {
    setEditingTrip(trip);
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (formData) => {
    if (editingTrip) {
      await updateTrip(editingTrip._id, formData);
    } else {
      await createTrip(formData);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      await deleteTrip(id);
    }
  };

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.country && t.country.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Compass className="w-6 h-6 text-sky-500" />
            My Trip Collection
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your upcoming, active, and completed travel plans
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm shadow-md shadow-sky-500/20 flex items-center gap-2 transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Create New Trip
        </button>
      </div>

      {/* Filter and Search */}
      <TripFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Trip List Grid */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800">
          <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Trips Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your search criteria or create a new trip itinerary.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-sky-500 text-white rounded-xl shadow"
          >
            + Create New Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <TripFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitForm}
        initialData={editingTrip}
      />
    </div>
  );
};

export default Trips;
