import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  Image as ImageIcon,
  Settings,
  LogOut,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  Edit,
  DollarSign,
  Plus,
  RefreshCw,
  X,
  Phone,
  Mail,
  MapPin,
  Users,
  MessageSquare,
  Sparkles,
  Lock,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  bookingsApi,
  servicesApi,
  galleryApi,
  settingsApi,
  authApi,
} from '../services/api';
import {
  Booking,
  DashboardStats,
  Service,
  GalleryItem,
  SiteSettings,
  BookingStatus,
} from '../types';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'services' | 'gallery' | 'settings'>('overview');

  // Stats state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Status & Quotation edit state
  const [editStatus, setEditStatus] = useState<BookingStatus>('Pending');
  const [editQuotation, setEditQuotation] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [updatingBooking, setUpdatingBooking] = useState<boolean>(false);

  // Services state
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);

  // Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState<boolean>(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState<boolean>(false);
  const [newGalleryItem, setNewGalleryItem] = useState<{
    title: string;
    category: GalleryItem['category'];
    description: string;
    imageUrl: string;
    eventDate: string;
  }>({
    title: '',
    category: 'Weddings',
    description: '',
    imageUrl: '',
    eventDate: '',
  });

  // Settings state
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState<boolean>(false);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [changingPassword, setChangingPassword] = useState<boolean>(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadBookings();
    }
  }, [isAuthenticated]);

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const data = await bookingsApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadBookings = async () => {
    setBookingsLoading(true);
    try {
      const data = await bookingsApi.getAll({
        search: searchQuery,
        status: statusFilter,
      });
      setBookings(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch bookings.', 'error');
    } finally {
      setBookingsLoading(false);
    }
  };

  const loadServices = async () => {
    setServicesLoading(true);
    try {
      const data = await servicesApi.getAll(true);
      setServices(data);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setServicesLoading(false);
    }
  };

  const loadGallery = async () => {
    setGalleryLoading(true);
    try {
      const data = await galleryApi.getAll('All', true);
      setGalleryItems(data);
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setGalleryLoading(false);
    }
  };

  const loadSettings = async () => {
    setSettingsLoading(true);
    try {
      const data = await settingsApi.get();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === 'services') loadServices();
    if (tab === 'gallery') loadGallery();
    if (tab === 'settings') loadSettings();
    if (tab === 'bookings') loadBookings();
    if (tab === 'overview') {
      loadStats();
      loadBookings();
    }
  };

  const openBookingDetails = (b: Booking) => {
    setSelectedBooking(b);
    setEditStatus(b.status);
    setEditQuotation(b.quotationAmount ? String(b.quotationAmount) : '');
    setEditNotes(b.adminNotes || '');
    setIsDetailModalOpen(true);
  };

  const handleSaveQuotationAndStatus = async () => {
    if (!selectedBooking) return;
    setUpdatingBooking(true);
    try {
      const parsedQuotation = editQuotation.trim() ? Number(editQuotation) : null;
      const updated = await bookingsApi.updateQuotation(
        selectedBooking.id,
        parsedQuotation,
        editNotes,
        editStatus
      );

      setSelectedBooking(updated);
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      loadStats();
      showToast('Booking status and quotation successfully updated!', 'success');
      setIsDetailModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to update booking.', 'error');
    } finally {
      setUpdatingBooking(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await bookingsApi.delete(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setDeleteConfirmId(null);
      if (selectedBooking?.id === id) {
        setIsDetailModalOpen(false);
      }
      loadStats();
      showToast('Booking enquiry record deleted.', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete booking.', 'error');
    }
  };

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.title || !newGalleryItem.imageUrl) {
      showToast('Title and image URL are required.', 'error');
      return;
    }

    try {
      const added = await galleryApi.create({
        ...newGalleryItem,
        isPublished: true,
      });
      setGalleryItems([added, ...galleryItems]);
      setIsGalleryModalOpen(false);
      setNewGalleryItem({
        title: '',
        category: 'Weddings',
        description: '',
        imageUrl: '',
        eventDate: '',
      });
      showToast('Photo added to gallery!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to add gallery item.', 'error');
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      await galleryApi.delete(id);
      setGalleryItems((prev) => prev.filter((i) => i.id !== id));
      showToast('Gallery item removed.', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete item.', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    try {
      await settingsApi.update(settings);
      showToast('Business details updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings.', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.trim().length < 8) {
      showToast('New password must be at least 8 characters long.', 'error');
      return;
    }
    setChangingPassword(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      showToast('Password updated and secured successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update password.', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">Pending</span>;
      case 'Contacted':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">Contacted</span>;
      case 'Quotation Sent':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">Quotation Sent</span>;
      case 'Confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">Confirmed</span>;
      case 'Completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-300">Completed</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">Cancelled</span>;
      default:
        return <span>{status}</span>;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-maroon-950 flex items-center justify-center text-gold-300">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      {/* Admin Top Navigation */}
      <header className="bg-maroon-950 text-white border-b border-gold-500/20 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gold-500 text-maroon-950 flex items-center justify-center font-cinzel font-bold text-sm">
              T
            </div>
            <span className="font-cinzel text-lg font-bold tracking-wider text-white hidden sm:block">
              TANYA EVENT'S
            </span>
          </Link>
          <span className="text-xs font-semibold text-gold-400 bg-maroon-900 px-2 py-0.5 rounded border border-gold-500/30">
            Admin Dashboard
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/"
            target="_blank"
            className="text-xs text-gold-300 hover:text-white transition hidden sm:inline"
          >
            Preview Live Site ↗
          </Link>

          <div className="flex items-center space-x-2 text-xs text-gray-300 border-l border-maroon-800 pl-4">
            <span className="font-medium text-white">{user?.fullName || 'Administrator'}</span>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-maroon-900 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-maroon-950/95 text-ivory-100 border-r border-gold-500/20 p-4 space-y-1 shrink-0">
          <button
            onClick={() => handleTabChange('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-maroon-900 text-gold-300 border border-gold-500/40'
                : 'text-gray-300 hover:bg-maroon-900/50 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => handleTabChange('bookings')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'bookings'
                ? 'bg-maroon-900 text-gold-300 border border-gold-500/40'
                : 'text-gray-300 hover:bg-maroon-900/50 hover:text-white'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Booking Enquiries</span>
            {stats && stats.pendingEnquiries > 0 && (
              <span className="ml-auto bg-gold-500 text-maroon-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {stats.pendingEnquiries}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('services')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'services'
                ? 'bg-maroon-900 text-gold-300 border border-gold-500/40'
                : 'text-gray-300 hover:bg-maroon-900/50 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Services & Packages</span>
          </button>

          <button
            onClick={() => handleTabChange('gallery')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'gallery'
                ? 'bg-maroon-900 text-gold-300 border border-gold-500/40'
                : 'text-gray-300 hover:bg-maroon-900/50 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery Management</span>
          </button>

          <button
            onClick={() => handleTabChange('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'settings'
                ? 'bg-maroon-900 text-gold-300 border border-gold-500/40'
                : 'text-gray-300 hover:bg-maroon-900/50 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Business Contact Settings</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">
                    Operations Overview
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Real-time metrics computed directly from database records.
                  </p>
                </div>
                <button
                  onClick={() => {
                    loadStats();
                    loadBookings();
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-maroon-900 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Data</span>
                </button>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gold-500/20 shadow-sm">
                  <span className="text-[11px] font-semibold uppercase text-gray-500 block">Total Enquiries</span>
                  <span className="text-3xl font-bold text-maroon-950 mt-1 block">
                    {stats?.totalEnquiries ?? 0}
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-sm bg-amber-50/30">
                  <span className="text-[11px] font-semibold uppercase text-amber-700 block">Pending Review</span>
                  <span className="text-3xl font-bold text-amber-900 mt-1 block">
                    {stats?.pendingEnquiries ?? 0}
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-green-300 shadow-sm bg-green-50/30">
                  <span className="text-[11px] font-semibold uppercase text-green-700 block">Confirmed Events</span>
                  <span className="text-3xl font-bold text-green-900 mt-1 block">
                    {stats?.confirmedBookings ?? 0}
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gold-500/20 shadow-sm">
                  <span className="text-[11px] font-semibold uppercase text-gray-500 block">Upcoming Events</span>
                  <span className="text-3xl font-bold text-maroon-900 mt-1 block">
                    {stats?.upcomingEvents ?? 0}
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-purple-300 shadow-sm">
                  <span className="text-[11px] font-semibold uppercase text-purple-700 block">Quotations Issued</span>
                  <span className="text-2xl font-bold text-purple-900 mt-1 block">
                    {stats?.quotationSent ?? 0}
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-[11px] font-semibold uppercase text-gray-500 block">Completed</span>
                  <span className="text-2xl font-bold text-gray-800 mt-1 block">
                    {stats?.completedEvents ?? 0}
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-sm">
                  <span className="text-[11px] font-semibold uppercase text-red-600 block">Cancelled</span>
                  <span className="text-2xl font-bold text-red-800 mt-1 block">
                    {stats?.cancelledBookings ?? 0}
                  </span>
                </div>

                <div className="bg-maroon-950 text-white p-5 rounded-2xl border border-gold-500/30 shadow-md">
                  <span className="text-[11px] font-semibold uppercase text-gold-300 block">Quotation Pipeline</span>
                  <span className="text-2xl font-bold text-ivory-50 mt-1 block">
                    ₹{(stats?.totalQuotationValue ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Recent Bookings Quick Table */}
              <div className="bg-white rounded-2xl border border-gold-500/20 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-maroon-950">
                    Recent Booking Enquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-semibold text-gold-700 hover:text-maroon-900"
                  >
                    View All Bookings →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                      <tr>
                        <th className="p-3.5">Reference</th>
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Event Type</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Guests</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50/80 transition">
                          <td className="p-3.5 font-mono font-bold text-maroon-900">
                            {b.bookingReference}
                          </td>
                          <td className="p-3.5 font-medium text-gray-800">
                            {b.customerName}
                            <span className="block text-[10px] text-gray-400 font-normal">{b.phone}</span>
                          </td>
                          <td className="p-3.5">{b.eventType}</td>
                          <td className="p-3.5 font-medium">{b.eventDate}</td>
                          <td className="p-3.5">{b.guestCount}</td>
                          <td className="p-3.5">{getStatusBadge(b.status)}</td>
                          <td className="p-3.5">
                            <button
                              onClick={() => openBookingDetails(b)}
                              className="px-2.5 py-1 rounded bg-ivory-100 text-maroon-900 hover:bg-gold-100 border border-gold-500/30 text-[11px] font-semibold"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS MANAGEMENT */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">
                    Booking Management
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage client enquiries, update quotation amounts, and assign internal operational notes.
                  </p>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by customer name, reference, phone, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadBookings()}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-xs focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setTimeout(() => loadBookings(), 50);
                    }}
                    className="px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Quotation Sent">Quotation Sent</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={loadBookings}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-maroon-950 bg-gold-btn shadow-sm"
                  >
                    Filter
                  </button>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-white rounded-2xl border border-gold-500/20 shadow-sm overflow-hidden">
                {bookingsLoading ? (
                  <div className="p-12 text-center text-xs text-gray-500">
                    Loading bookings...
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="p-12 text-center text-xs text-gray-500 space-y-2">
                    <p className="font-semibold text-gray-700">No bookings match your current criteria.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                        <tr>
                          <th className="p-3.5">Ref #</th>
                          <th className="p-3.5">Customer & Phone</th>
                          <th className="p-3.5">Event Type & Date</th>
                          <th className="p-3.5">Venue & City</th>
                          <th className="p-3.5">Guests</th>
                          <th className="p-3.5">Services</th>
                          <th className="p-3.5">Quotation</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-gray-50/80 transition">
                            <td className="p-3.5 font-mono font-bold text-maroon-900">
                              {b.bookingReference}
                            </td>
                            <td className="p-3.5">
                              <span className="font-semibold text-gray-900 block">{b.customerName}</span>
                              <span className="text-gray-500 text-[11px]">{b.phone}</span>
                            </td>
                            <td className="p-3.5">
                              <span className="font-medium text-gray-800 block">{b.eventType}</span>
                              <span className="text-gray-500 text-[11px]">{b.eventDate}</span>
                            </td>
                            <td className="p-3.5">
                              <span className="text-gray-700 block truncate max-w-[140px]">{b.venue}</span>
                              <span className="text-gray-400 text-[10px]">{b.city}</span>
                            </td>
                            <td className="p-3.5 font-medium">{b.guestCount}</td>
                            <td className="p-3.5">
                              <span className="bg-ivory-100 text-maroon-900 px-2 py-0.5 rounded text-[10px] font-semibold border border-gold-300">
                                {b.services.length} services
                              </span>
                            </td>
                            <td className="p-3.5 font-semibold text-maroon-900">
                              {b.quotationAmount ? `₹${b.quotationAmount.toLocaleString('en-IN')}` : '—'}
                            </td>
                            <td className="p-3.5">{getStatusBadge(b.status)}</td>
                            <td className="p-3.5">
                              <button
                                onClick={() => openBookingDetails(b)}
                                className="px-3 py-1.5 rounded-lg bg-maroon-950 text-gold-300 hover:text-white text-xs font-semibold shadow-sm transition"
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">
                    Service Pillars & Packages
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage service descriptions, starting estimates, and package tiers.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl p-6 border border-gold-500/30 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-maroon-950">
                          {service.name}
                        </h3>
                        <p className="text-xs text-gold-700 font-mono mt-0.5">/{service.slug}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {service.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {service.shortDescription}
                    </p>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-700">
                        Starting from: ₹{service.startingPrice ? service.startingPrice.toLocaleString('en-IN') : 'Custom'}
                      </span>
                      <span className="text-gray-500">
                        {service.packages?.length || 0} packages configured
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">
                    Event Portfolio Gallery
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Curate photographs displayed on the public gallery and homepage.
                  </p>
                </div>
                <button
                  onClick={() => setIsGalleryModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-maroon-950 bg-gold-btn shadow-gold-glow flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col justify-between"
                  >
                    <div className="h-44 bg-gray-100 relative overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-maroon-950/80 text-gold-300 text-[10px] font-bold px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-serif font-bold text-maroon-950 text-sm">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                      )}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">
                          {item.eventDate || 'Portfolio item'}
                        </span>
                        <button
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">
                  Business Contact & Social Settings
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Updates reflect instantly on public contact cards, footers, and WhatsApp inquiry buttons.
                </p>
              </div>

              {settings && (
                <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-500/30 shadow-sm space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Brand Name</label>
                      <input
                        type="text"
                        value={settings.brandName}
                        onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Tagline</label>
                      <input
                        type="text"
                        value={settings.tagline}
                        onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={settings.whatsapp}
                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Office Address</label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Business / Consultation Hours</label>
                      <input
                        type="text"
                        value={settings.businessHours}
                        onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold text-maroon-950 bg-gold-btn shadow-gold-glow hover:scale-[1.01] transition"
                    >
                      {savingSettings ? 'Saving...' : 'Save Configuration Changes'}
                    </button>
                  </div>
                </form>
              )}

            {/* Administrator Security & Password Change */}
            <div className="bg-white rounded-2xl border border-gold-500/20 shadow-sm p-6 space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                <Shield className="w-5 h-5 text-gold-600" />
                <div>
                  <h3 className="font-serif text-base font-bold text-maroon-950">
                    Security & Administrator Password
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Update your secret admin password. Passwords are cryptographically salted and hashed using Bcrypt.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      New Password * (Min 8 chars)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-maroon-950 bg-gold-btn shadow-gold-glow hover:scale-[1.01] transition disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{changingPassword ? 'Securing Password...' : 'Update & Secure Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </main>
      </div>

      {/* Booking Review & Quotation Modal */}
      {isDetailModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-gold-500/40 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-maroon-900 bg-ivory-100 px-2 py-0.5 rounded border border-gold-300">
                  {selectedBooking.bookingReference}
                </span>
                {getStatusBadge(selectedBooking.status)}
              </div>
              <h2 className="font-serif text-2xl font-bold text-maroon-950 mt-2">
                {selectedBooking.customerName}
              </h2>
              <p className="text-xs text-gray-500">
                Submitted on {new Date(selectedBooking.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Quick Contact & WhatsApp Action */}
            <div className="p-3.5 rounded-xl bg-ivory-50 border border-gold-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-gray-500 block">Contact Phone:</span>
                <span className="font-bold text-gray-800">{selectedBooking.phone}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Email:</span>
                <span className="font-medium text-gray-800">{selectedBooking.email || 'None'}</span>
              </div>
              <a
                href={`https://wa.me/${selectedBooking.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${selectedBooking.customerName}, this is Tanya Events regarding your booking enquiry (${selectedBooking.bookingReference}).`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-green-600 text-white font-semibold flex items-center space-x-1"
              >
                <span>WhatsApp Client</span>
              </a>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-400 block font-semibold uppercase text-[10px]">Event Type & Slot</span>
                <span className="font-bold text-gray-800">{selectedBooking.eventType} ({selectedBooking.eventTime || 'Full Day'})</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-400 block font-semibold uppercase text-[10px]">Event Date</span>
                <span className="font-bold text-maroon-900">{selectedBooking.eventDate}</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-400 block font-semibold uppercase text-[10px]">Venue & City</span>
                <span className="font-bold text-gray-800">{selectedBooking.venue}, {selectedBooking.city}</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-400 block font-semibold uppercase text-[10px]">Guest Count & Budget</span>
                <span className="font-bold text-gray-800">{selectedBooking.guestCount} guests • {selectedBooking.budget}</span>
              </div>
            </div>

            {/* Selected Services */}
            <div>
              <span className="text-xs uppercase font-semibold text-gray-500 block mb-1.5">Selected Services</span>
              <div className="flex flex-wrap gap-2">
                {selectedBooking.services.map((s) => (
                  <span
                    key={s.id}
                    className="px-3 py-1 rounded-lg bg-maroon-900 text-gold-200 text-xs font-medium"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            {selectedBooking.customerMessage && (
              <div>
                <span className="text-xs uppercase font-semibold text-gray-500 block mb-1">Customer Message / Vision</span>
                <p className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 italic">
                  "{selectedBooking.customerMessage}"
                </p>
              </div>
            )}

            {/* Status & Quotation Management Box */}
            <div className="p-5 rounded-2xl bg-ivory-100 border border-gold-500/30 space-y-4">
              <h4 className="font-serif text-sm font-bold text-maroon-950">
                Update Status & Quotation
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 uppercase mb-1">
                    Booking Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as BookingStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white font-medium focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Quotation Sent">Quotation Sent</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 uppercase mb-1">
                    Quotation Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 350000"
                    value={editQuotation}
                    onChange={(e) => setEditQuotation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase mb-1">
                  Internal Admin Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Private coordinator notes (e.g. Client requested tasting on Sunday, advance received 50k)..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(selectedBooking.id)}
                  className="text-xs text-red-600 hover:text-red-800 font-semibold"
                >
                  Delete Enquiry
                </button>

                <button
                  type="button"
                  onClick={handleSaveQuotationAndStatus}
                  disabled={updatingBooking}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-maroon-950 bg-gold-btn shadow-gold-glow hover:scale-105 transition"
                >
                  {updatingBooking ? 'Saving Updates...' : 'Save Updates'}
                </button>
              </div>
            </div>

            {/* Delete Confirmation Alert */}
            {deleteConfirmId && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-300 space-y-2">
                <p className="text-xs font-bold text-red-900">
                  Are you sure you want to permanently delete this booking record?
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteBooking(deleteConfirmId)}
                    className="px-3 py-1 rounded bg-red-600 text-white text-xs font-bold"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Gallery Item Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gold-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-maroon-950">
                Add Event Photo to Gallery
              </h3>
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGalleryItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Rajputana Mandap"
                  value={newGalleryItem.title}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">Category *</label>
                <select
                  value={newGalleryItem.category}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value as GalleryItem['category'] })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none"
                >
                  <option value="Weddings">Weddings</option>
                  <option value="Pandal">Pandal</option>
                  <option value="Catering">Catering</option>
                  <option value="Decoration">Decoration</option>
                  <option value="DJ & Sound">DJ & Sound</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /images/hero_mandap.jpg or https://images.unsplash.com/..."
                  value={newGalleryItem.imageUrl}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  placeholder="Short note describing setup..."
                  value={newGalleryItem.description}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">Event Date</label>
                <input
                  type="date"
                  value={newGalleryItem.eventDate}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, eventDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-maroon-950 bg-gold-btn shadow-gold-glow"
                >
                  Save Photo to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
